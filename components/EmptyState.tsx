"use client";

import { PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  onCreateSession: () => void;
}

export function EmptyState({ onCreateSession }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full  px-4 w-full">
      <div className="flex flex-col items-center justify-center max-w-md text-center space-y-6">
        <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-4">
          <MessageSquare className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-purple-500 dark:text-purple-400 tracking-tight">Welcome to Your Chat Assistant</h2>
          <p className="text-muted-foreground dark:text-gray-400">
            Start a new conversation to get help with your questions, tasks, or just to chat.
          </p>
        </div>
        <Button onClick={onCreateSession} size="lg" className="gap-2 bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700">
          <PlusCircle className="w-4 h-4" />
          Start New Chat
        </Button>
      </div>
    </div>
  );
}