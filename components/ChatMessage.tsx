import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

interface CodeProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const isBot = message.sender === 'bot';

  const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!inline && match) {
      const code = String(children).replace(/\n$/, '');
      return (
        <div className="relative group">
          <button
            onClick={() => copyToClipboard(code)}
            className="absolute right-2 top-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

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
              ? 'prose dark:prose-invert prose-sm max-w-none text-gray-900 dark:text-gray-100'
              : 'bg-indigo-600 dark:bg-indigo-700 text-white'
          }`}
        >
          {isBot ? (
            <ReactMarkdown
              className="chat-message-content text-sm"
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock
              }}
            >
              {message.content}
            </ReactMarkdown>
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