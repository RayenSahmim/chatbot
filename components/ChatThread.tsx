import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatSession } from '@/types';
import  { format } from 'date-fns';

interface ChatThreadProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
}

export function ChatThread({  isActive, onClick,session }: ChatThreadProps) {
  
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100
        ${isActive ? 'bg-gray-100' : ''}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
        <MessageSquare className="h-5 w-5 text-purple-500" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-medium text-gray-900">{session.name}</p>
        <p>{format(session.timestamp, 'MM/dd/yyyy')}</p>

      </div>
    </button>
  );
}