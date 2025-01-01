import React from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '../types';

interface ChatHistoryProps {
  messages: Message[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}
    </div>
  );
}