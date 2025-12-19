export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export type PlanType = 'free' | 'pro';
export type ViewMode = 'chat' | 'create';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  tokens: number;
  dailyNoteGenerations: number; // Track daily note usage
  lastReset: string; // ISO Date string
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 encoded data
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}