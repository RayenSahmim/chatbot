import { Message } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Content } from "@google/generative-ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHistory(messages: Message[]): Content[] {
  return messages.map((message) => ({
    role: message.sender === 'user' ? 'user' : 'model',
    parts: [{ text: message.content }]
  }));
}