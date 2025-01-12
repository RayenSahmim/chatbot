import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; // Max height of 150px
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full min-h-[50px] max-h-[150px] p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 
            focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 
            focus:outline-none resize-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            placeholder-gray-500 dark:placeholder-gray-400"
          rows={1}
        />
        <button
          type="submit"
          className="absolute right-3 bottom-3 p-2 bg-purple-500 dark:bg-purple-600 rounded-full text-white 
            transition-all hover:bg-purple-600 dark:hover:bg-purple-700 disabled:opacity-50 
            disabled:hover:bg-purple-500 dark:disabled:hover:bg-purple-600 focus:outline-none 
            focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900"
          disabled={!input.trim() || isLoading}
        >
          <ArrowUp size={20} className={`${isLoading ? 'animate-pulse' : ''}`} />
        </button>
      </form>
    </div>
  );
}