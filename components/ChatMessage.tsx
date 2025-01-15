import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
          isBot
            ? 'bg-purple-100 dark:bg-purple-900/50 text-indigo-600 dark:text-indigo-400'
            : session?.user?.image
            ? ''
            : 'bg-blue-500 dark:bg-blue-600 text-white'
        }`}
      >
        {isBot ? (
          <Bot size={18} />
        ) : session?.user?.image ? (
          <Image
            src={session?.user?.image}
            alt="User Avatar"
            className="rounded-full"
            width={40}
            height={40}
          />
        ) : (
          <User size={18} />
        )}
      </div>
      <div
        className={`flex max-w-[80%] flex-col gap-1 ${
          isBot ? 'items-start' : 'items-end'
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isBot
              ? '  text-gray-900 dark:text-gray-100'
              : 'bg-indigo-600 dark:bg-indigo-700 text-white'
          }`}
        >
          {isBot ? (
            <div
              className="text-sm chat-message-content"
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
