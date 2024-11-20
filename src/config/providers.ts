import { ProviderConfig } from '@/types/chat';

export const providers: ProviderConfig[] = [
  {
    name: 'openrouter',
    models: [
      {
        id: 'meta-llama/llama-3.2-90b-vision-instruct:free',
        name: 'Llama 3.2 90B',
        description: 'Meta\'s most capable open-source model',
        maxTokens: 128000
      },
      {
        id: 'mistral-8x7b-instruct',
        name: 'Mixtral 8x7B',
        description: 'High-performance mixture of experts model',
        maxTokens: 32000
      }
    ],
    defaultModel: 'meta-llama/llama-3.2-90b-vision-instruct:free'
  },
  {
    name: 'anthropic',
    models: [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable model, ideal for complex tasks',
        maxTokens: 200000
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Balanced speed and capabilities',
        maxTokens: 200000
      }
    ],
    defaultModel: 'claude-3-opus-20240229'
  },
  {
    name: 'openai',
    models: [
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        description: 'Most capable OpenAI model',
        maxTokens: 128000
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient model',
        maxTokens: 16000
      }
    ],
    defaultModel: 'gpt-3.5-turbo'
  },
  {
    name: 'google',
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Google\'s most capable model',
        maxTokens: 32000
      }
    ],
    defaultModel: 'gemini-pro'
  },
  {
    name: 'mistral',
    models: [
      {
        id: 'mistral-large',
        name: 'Mistral Large',
        description: 'Most capable Mistral model',
        maxTokens: 32000
      },
      {
        id: 'mistral-medium',
        name: 'Mistral Medium',
        description: 'Balanced performance and capabilities',
        maxTokens: 32000
      },
      {
        id: 'mistral-small',
        name: 'Mistral Small',
        description: 'Fast and efficient model',
        maxTokens: 32000
      }
    ],
    defaultModel: 'mistral-small'
  },
  {
    name: 'cohere',
    models: [
      {
        id: 'command',
        name: 'Command',
        description: 'Most capable Cohere model',
        maxTokens: 4000
      },
      {
        id: 'command-light',
        name: 'Command Light',
        description: 'Faster, more efficient model',
        maxTokens: 4000
      }
    ],
    defaultModel: 'command'
  }
];
