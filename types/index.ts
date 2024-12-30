export interface Message {
  _id?: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatSession {
  _id: string;
  timestamp: Date;
  name: string;
}

export interface ChatHistory {
  sessions: ChatSession[];
}

