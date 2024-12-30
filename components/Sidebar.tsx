import React from 'react';
import { Plus , LoaderPinwheelIcon } from 'lucide-react';
import { ChatThread } from './ChatThread';
import { ChatSession } from '@/types';

interface SidebarProps {
    sessionLoading: boolean;
  sessions: ChatSession[];
  activeSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function Sidebar({sessionLoading, sessions, activeSessionId, onSessionSelect, onNewChat }: SidebarProps) {
  return (
    <div className="flex h-full w-80 flex-col border-r bg-white">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {sessionLoading ? (
            <LoaderPinwheelIcon className="animate-spin h-6 w-6 mx-auto" />
        ) : (
            sessions.map((session) => (
                <ChatThread
                  key={session._id}
                  session={session}
                  isActive={session._id === activeSessionId}
                  onClick={() => onSessionSelect(session._id)}
                />
              ))
        )}

      </div>
    </div>
  );
}