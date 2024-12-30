import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
        isBot ? 'bg-purple-100 text-purple-500' : 'bg-blue-100 text-blue-500'
      }`}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className={`flex max-w-[80%] flex-col gap-1 ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}