import { ProviderConfig } from '@/types/chat';

export const providers: ProviderConfig[] = [
  {
    name: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    description: 'GPT-3.5 and GPT-4 models',
    defaultModel: 'gpt-3.5-turbo',
    models: [
      {
        name: 'GPT-3.5 Turbo',
        id: 'gpt-3.5-turbo',
        description: 'Most capable GPT-3.5 model, optimized for chat',
        maxTokens: 4096
      },
      {
        name: 'GPT-4 Turbo',
        id: 'gpt-4-turbo-preview',
        description: 'Most capable GPT-4 model, optimized for chat',
        maxTokens: 128000
      }
    ]
  },
  {
    name: 'Anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    description: 'Claude and Claude 2 models',
    defaultModel: 'claude-3-opus-20240229',
    models: [
      {
        name: 'Claude 3 Opus',
        id: 'claude-3-opus-20240229',
        description: 'Most capable Claude model',
        maxTokens: 200000
      },
      {
        name: 'Claude 3 Sonnet',
        id: 'claude-3-sonnet-20240229',
        description: 'Balanced performance and speed',
        maxTokens: 200000
      }
    ]
  },
  {
    name: 'Open Router',
    envKey: 'OPENROUTER_API_KEY',
    description: 'Access to multiple AI models',
    defaultModel: 'meta-llama/llama-3.2-90b-vision-instruct:free',
    models: [
      {
        name: 'Llama 3.2 90B Vision',
        id: 'meta-llama/llama-3.2-90b-vision-instruct:free',
        description: 'Free tier of Meta\'s Llama 3.2 90B Vision model',
        maxTokens: 4096
      }
    ]
  },
  {
    name: 'Google AI',
    envKey: 'GOOGLE_AI_API_KEY',
    description: 'Gemini models',
    defaultModel: 'gemini-pro',
    models: [
      {
        name: 'Gemini Pro',
        id: 'gemini-pro',
        description: 'Best performance for text-only tasks',
        maxTokens: 32768
      },
      {
        name: 'Gemini Pro Vision',
        id: 'gemini-pro-vision',
        description: 'Best performance for text and vision tasks',
        maxTokens: 32768
      }
    ]
  },
  {
    name: 'Mistral',
    envKey: 'MISTRAL_API_KEY',
    description: 'Mistral models',
    defaultModel: 'mistral-large-latest',
    models: [
      {
        name: 'Mistral Large',
        id: 'mistral-large-latest',
        description: 'Most capable Mistral model',
        maxTokens: 32768
      },
      {
        name: 'Mistral Medium',
        id: 'mistral-medium-latest',
        description: 'Balanced performance and speed',
        maxTokens: 32768
      },
      {
        name: 'Mistral Small',
        id: 'mistral-small-latest',
        description: 'Fast and efficient',
        maxTokens: 32768
      }
    ]
  },
  {
    name: 'Cohere',
    envKey: 'COHERE_API_KEY',
    description: 'Command and Generate models',
    defaultModel: 'command',
    models: [
      {
        name: 'Command',
        id: 'command',
        description: 'Best for instruction following and chat',
        maxTokens: 4096
      },
      {
        name: 'Generate',
        id: 'generate',
        description: 'Best for creative text generation',
        maxTokens: 4096
      }
    ]
  }
];
