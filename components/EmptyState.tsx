"use client";

import { PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  onCreateSession: () => void;
}

export function EmptyState({ onCreateSession }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="flex flex-col items-center justify-center max-w-md text-center space-y-6">
        <div className="rounded-full bg-purple-100 p-4">
          <MessageSquare className="w-12 h-12  text-indigo-600 " />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-purple-500 tracking-tight">Welcome to Your Chat Assistant</h2>
          <p className="text-muted-foreground ">
            Start a new conversation to get help with your questions, tasks, or just to chat.
          </p>
        </div>
        <Button onClick={onCreateSession} size="lg" className="gap-2 bg-purple-500">
          <PlusCircle className="w-4 h-4" />
          Start New Chat
        </Button>
      </div>
    </div>
  )
}