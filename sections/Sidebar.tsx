import React, { useState } from "react";
import { Plus, Loader2, LogOut, User, Menu } from "lucide-react";
import { ChatThread } from "@/components/ChatThread";
import { ChatSession } from "@/types";
import { format } from "date-fns";
import { signOut } from "next-auth/react";
import { SearchInput } from "@/components/SearchInput";
import { Session } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen : React.Dispatch<React.SetStateAction<boolean>>;
  
  setActiveSessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  sessionLoading: boolean;
  sessions: ChatSession[];
  authsession: Session;
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  activeSessionId: string | undefined;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  sessionLoading,
  sessions,
  setActiveSessionId,
  authsession,
  setSessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
}: SidebarProps) {
  // Group sessions by formatted date
  const [searchTerm, setSearchTerm] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toast } = useToast()
  if(sessionLoading){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const filteredSessions = sessions.filter((session) => {
    const sessionName = session.name.toLowerCase(); // Adjust this to whatever property you want to search by
    return sessionName.includes(searchTerm.toLowerCase());
  });

  const filteredSessionsByDate = filteredSessions.reduce((acc, session) => {
    const date = format(session.timestamp, "MM/dd/yyyy");
    if (!acc[date]) acc[date] = [];
    acc[date].unshift(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);
  return (
    <div className="flex flex-col border-r dark:border-gray-700 bg-white dark:bg-gray-800 h-screen">
      {/* Top Section */}
      
      <div className="p-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="z-50 md:hidden dark:hover:bg-gray-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6 dark:text-gray-200" />
        </Button>
        <SearchInput 
          placeholder="Search" 
          className="flex-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 text-sm focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400" 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 rounded-lg bg-purple-500 dark:bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-600 dark:hover:bg-purple-700"
        >
          <Plus size={20} />
        </Button>
      </div>

      {/* Scrollable ChatThread Section */}
      <div className="flex-1 overflow-y-auto px-2 hide-scrollbar">
        {sessionLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader2 className="custom-spin h-6 w-6 mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          Object.entries(filteredSessionsByDate)
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([date, groupedSessions]) => (
            <div key={date} className="mb-4">
              <p className="mb-2 px-3 text-gray-500 dark:text-gray-400 text-sm font-semibold">
                {date}
              </p>
              {groupedSessions.map((session) => (
                <ChatThread
                  setActiveSessionId={setActiveSessionId}
                  activeSessionId={activeSessionId}
                  key={session._id}
                  session={session}
                  isActive={session._id === activeSessionId}
                  onClick={() => onSessionSelect(session._id)}
                  setSessions={setSessions}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Bottom Section */}
      <div className="bg-purple-500 dark:bg-purple-600 p-4 flex rounded-md justify-between items-center px-10">
        <div className="flex items-center gap-2 justify-start max-w-lg">
          {authsession.user?.image ? (
            <Image
              src={authsession.user?.image || ""}
              width={40}
              height={40}
              className="rounded-full"
              alt="User Avatar"
            />
          ) : (
            <div className="flex items-center justify-start w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-200 text-blue-500">
              <User size={20} className="rounded-full"/>
            </div>
          )}
          <p className="text-white">{authsession.user?.name}</p>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => signOut()}
            className="flex w-full gap-2 rounded-lg bg-red-500 dark:bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-600 dark:hover:bg-red-700"
          >
            <LogOut />
            Log Out
          </button>
        </div>
      </div>
    </div>
);
}