export interface AIModel {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  maxTokens: number;
  contextWindow?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

export const defaultModels: AIModel[] = [
  {
    id: 'meta-llama/llama-2-70b-chat',
    name: 'Llama 2 70B Chat',
    description: 'Meta\'s largest open-source chat model with exceptional coding capabilities',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
  },
  {
    id: 'meta-llama/codellama-34b-instruct',
    name: 'CodeLlama 34B',
    description: 'Meta\'s specialized code model with strong programming abilities',
    isFree: true,
    maxTokens: 8192,
    contextWindow: 8192
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B Instruct',
    description: 'Efficient open-source model with great code understanding',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
  },
  {
    id: 'openchat/openchat-7b',
    name: 'OpenChat 7B',
    description: 'Open-source model optimized for dialogue and coding tasks',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
  },
  {
    id: 'google/palm-2-codechat-bison',
    name: 'PaLM 2 Codechat',
    description: 'Google\'s model specialized for code-related conversations',
    isFree: true,
    maxTokens: 8192,
    contextWindow: 8192
  },
  {
    id: 'phind/phind-codellama-34b',
    name: 'Phind CodeLlama 34B',
    description: 'Fine-tuned CodeLlama optimized for programming tasks',
    isFree: true,
    maxTokens: 8192,
    contextWindow: 8192
  },
  {
    id: 'meta-llama/llama-2-13b-chat',
    name: 'Llama 2 13B Chat',
    description: 'Efficient version of Llama 2 with good code understanding',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
  },
  {
    id: 'nousresearch/nous-hermes-llama2-13b',
    name: 'Nous Hermes 13B',
    description: 'Fine-tuned Llama 2 with enhanced coding capabilities',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
  }
];

export async function fetchAvailableModels(): Promise<AIModel[]> {
  try {
    const response = await fetch('/api/ai/models');
    if (!response.ok) {
      console.error('Failed to fetch models');
      return defaultModels;
    }
    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error('Error fetching models:', error);
    return defaultModels;
  }
}
