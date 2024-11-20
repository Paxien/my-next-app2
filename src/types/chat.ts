export type Provider = 'openai' | 'anthropic' | 'openrouter' | 'google' | 'mistral' | 'cohere';

export interface Message {
  id?: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface APIResponse {
  message?: string;
  error?: string;
  status: number;
}

export interface ProviderConfig {
  name: string;
  envKey: string;
  description: string;
  defaultModel?: string;
  models?: {
    name: string;
    id: string;
    description?: string;
    maxTokens?: number;
  }[];
}
