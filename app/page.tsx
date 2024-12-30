"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { Bot  , LogOut} from 'lucide-react';
import { ChatHistory } from '@/components/ChatHistory';
import { ChatInput } from '@/components/ChatInput';
import { Sidebar } from '@/components/Sidebar';
import { Message, ChatSession } from '@/types';
import { signOut , useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoading , setSessionLoading ] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activeSession = sessions.find((s) => s._id === activeSessionId)!;
  const { data: session ,status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/Login');
    },
  })
  


  const fetchsessions = async () => {
    try {
      setSessionLoading(true);
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data);
      console.log('sessions', data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
    finally{
      setSessionLoading(false);
    }
  
  }
  useEffect(() => {
    fetchsessions();
  }, []);
  const createSession = async () =>{
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `Chat ${sessions.length + 1}` }),
      });
      const data = await res.json();
      
      setSessions(prevSessions => [...prevSessions, data]);
      setActiveSessionId(data.id);


    } catch (error) {
      console.error("Error creating session:", error);
    }
  }

  const saveMessage = async (message: Message) => {
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
  }
  const fetchMessagesBySession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/messages/${sessionId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const editMessage = async(message: Message) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: message._id,
          content: message.content
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
  }

  useEffect(() => {
    fetchMessagesBySession(activeSessionId);
  }, [activeSessionId]);


  const handleSubmit = async (prompt: string) => {
  

    // Create new user message
    const newUserMessage: Message = {
      _id: uuidv4(),
      content: prompt,
      sender: 'user',
      timestamp: new Date(),
      sessionId: activeSessionId,
    };
  
    // Save the user message to the backend and update the frontend state
    const savedUserMessage = await saveMessage(newUserMessage);
    setMessages((prevMessages) => [...prevMessages, savedUserMessage]);
  
    setIsLoading(true);
  
    try {
      // Create an initial bot message in the backend to get its _id
      // create new message id
      const Id = uuidv4();
      const initialBotMessage: Message = {
        _id: Id,
        content: '',
        sender: 'bot',
        timestamp: new Date(),
        sessionId: activeSessionId,
      };
       setMessages((prevMessages) => [...prevMessages, initialBotMessage]);
  
      const res = await fetch('/api/stream-ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
  
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = '';
  
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const chunk = decoder.decode(value);
          responseText += chunk;
  
          // Update the bot message content in the frontend state
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
      console.error('Error streaming AI response:', error);
  
      // Handle error by displaying an error message
      const errorMessage: Message = {
        content: 'I apologize, but I encountered an error while processing your request.',
        sender: 'bot',
        timestamp: new Date(),
        sessionId: activeSessionId,
      };
  
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  console.log('session', session);

  
  
  if(!activeSessionId){
    return <div>Loading...</div>;
  }


  return (
    <div className="flex h-screen bg-gray-50 relative">
      <Sidebar
        sessionLoading={sessionLoading}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onNewChat={createSession}
      />

      <div className="flex flex-1 flex-col relative">
        <header className="bg-white px-6 py-4 shadow-sm absolute top-0 left-0 right-0 z-10">
          <div className=" flex max-w-4xl items-center gap-2">
            <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">ChatBot</h1>
            </div>
            <button className='ml-auto ' onClick={() => signOut()}>
              <LogOut  />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden py-16">
          <div className="h-fit min-h-full bg-white shadow-sm ">
            <ChatHistory messages={messages} />
          </div>
        </div>

        <div className="border-t bg-white p-4 absolute bottom-0 w-full ">
          <ChatInput onSendMessage={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;