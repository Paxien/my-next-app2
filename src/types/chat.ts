export type Provider = 'openai' | 'anthropic' | 'openrouter' | 'google' | 'mistral' | 'cohere';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  provider: Provider;
  model?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIResponse {
  message?: string;
  error?: string;
  status: number;
}

export interface ProviderConfig {
  name: Provider;
  models: {
    id: string;
    name: string;
    description?: string;
    maxTokens?: number;
    price?: string;
  }[];
  defaultModel: string;
}
