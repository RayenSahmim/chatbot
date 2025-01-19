"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from "react";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/sections/Sidebar";
import { Message, ChatSession } from "@/types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/sections/Header";
import { EmptyState } from "@/components/EmptyState";
import { sendAIResponse } from "./actions/Ai.action";
import { Loader2 } from "lucide-react";

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isfetchLoading, setIsfetchLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [offset, setOffset] = useState(0); // Track the offset
  const [hasMore, setHasMore] = useState(true); // Check if more messages are available
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

  const limit = 10; // Number of messages per fetch

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activeSession = activeSessionId
    
    ? sessions.find((s) => s._id === activeSessionId)
    : undefined;

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/Login");
    },
  });

  const fetchsessions = async () => {
    try {
      setSessionLoading(true);
      const res = await fetch(`api/sessions/${session?.user?.email}`);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    fetchsessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const createSession = async () => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Session",
          useremail: session?.user?.email,
        }),
      });
      const data = await res.json();

      setSessions((prevSessions) => [...prevSessions, data]);
      setActiveSessionId(data._id); // Make sure to use the correct ID field
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const saveMessage = async (message: Message) => {
    if (!activeSessionId) {
      console.error("No active session");
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessagesBySession = async (
    sessionId: string | undefined,
    newOffset: number
  ) => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    setIsfetchLoading(true);
  
    try {
      const res = await fetch(
        `/api/messages/${sessionId}?limit=${limit}&offset=${newOffset}`
      );
      const data = await res.json();
      
      if (data.length === 0) {
        setHasMore(false);
      }
      
      // For initial load (newOffset === 0)
      if (newOffset === 0) {
        setMessages(data);
      } else {
        // Prepend older messages at the top
        setMessages(prevMessages => [...data, ...prevMessages]);
      }
      
      setOffset(newOffset + data.length);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsfetchLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const editMessage = async (message: Message) => {
    if (!activeSessionId) {
      console.error("No active session");
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: message._id,
          content: message.content,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return await res.json();
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchMessagesBySession(activeSessionId, 0);
  }, [activeSessionId]);

  const handleScroll = () => {
    if (!containerRef.current || !hasMore || isfetchLoading) return;
  
    const { scrollTop } = containerRef.current;
    
    // Load more when user scrolls to top
    if (scrollTop === 0) {
      fetchMessagesBySession(activeSessionId, offset);
    }
  };

  const handleSubmit = async (prompt: string) => {
    if (!activeSessionId) {
      console.error("No active session");
      return;
    }

    const newUserMessage: Message = {
      _id: uuidv4(),
      content: prompt,
      sender: "user",
      timestamp: new Date(),
      sessionId: activeSessionId,
    };

    const savedUserMessage = await saveMessage(newUserMessage);
    setMessages((prevMessages) => [...prevMessages, savedUserMessage]);

    setIsLoading(true);

    try {
      const Id = uuidv4();
      const initialBotMessage: Message = {
        _id: Id,
        content: "",
        sender: "bot",
        timestamp: new Date(),
        sessionId: activeSessionId,
      };
      setMessages((prevMessages) => [...prevMessages, initialBotMessage]);

      const stream = await sendAIResponse(prompt, messages);
      const reader = stream.getReader();
      let responseText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          responseText += value;

          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message._id === initialBotMessage._id
                ? { ...message, content: responseText }
                : message
            )
          );
        }

        await saveMessage({
          ...initialBotMessage,
          content: responseText,
        });
      }
    } catch (error) {
      console.error("Error streaming AI response:", error);

      const errorMessage: Message = {
        _id: uuidv4(),
        content:
          "I apologize, but I encountered an error while processing your request.",
        sender: "bot",
        timestamp: new Date(),
        sessionId: activeSessionId,
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transform md:translate-x-0 transition-transform duration-200 ease-in-out fixed md:relative z-30 w-[300px] md:min-w-[300px] md:w-1/5 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700`}
      >
        <Sidebar
          setActiveSessionId={setActiveSessionId}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sessionLoading={sessionLoading}
          sessions={sessions}
          authsession={session}
          setSessions={setSessions}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={createSession}
        />
      </div>

      <div className="flex flex-col flex-1 w-full md:w-4/5">
        <div className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 shadow-sm">
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
        <div
        className="flex-1 overflow-x-hidden"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {isfetchLoading && (
          <div className="flex justify-center p-4 w-full">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {activeSessionId ? (
          <div className="h-fit min-h-full bg-white dark:bg-gray-900 shadow-sm">
            <ChatHistory messages={messages} />
          </div>
        ) : (
          <EmptyState onCreateSession={createSession} />
        )}
      </div>
        {activeSessionId && (
          <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 w-full ">
            <ChatInput onSendMessage={handleSubmit} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
