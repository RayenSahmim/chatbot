"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/sections/Sidebar";
import { Message, ChatSession } from "@/types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/sections/Header";
import { EmptyState } from "@/components/EmptyState";

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  const fetchMessagesBySession = async (sessionId: string | undefined) => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    try {
      const res = await fetch(`/api/messages/${sessionId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
    fetchMessagesBySession(activeSessionId);
  }, [activeSessionId]);

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

      const res = await fetch("/api/stream-ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          responseText += chunk;

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
        content: "I apologize, but I encountered an error while processing your request.",
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
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transform md:translate-x-0 transition-transform duration-200 ease-in-out fixed md:relative z-30 w-[300px] md:min-w-[300px] md:w-1/5 h-full bg-white border-r`}
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
        <div className="border-b bg-white px-4 py-2 shadow-sm">
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </div>
        
        <div className="flex-1 overflow-x-hidden">
          {activeSessionId ? (
            <div className="h-fit min-h-full bg-white shadow-sm">
              <ChatHistory messages={messages} />
            </div>
          ) : (
            <EmptyState onCreateSession={createSession} />
          )}
        </div>

        <div className="border-t bg-white p-4 w-full">
          {activeSessionId && (
            <ChatInput onSendMessage={handleSubmit} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;