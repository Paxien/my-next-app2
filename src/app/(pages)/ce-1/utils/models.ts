export interface AIModel {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  maxTokens: number;
  contextWindow?: number;
  isFavorite?: boolean;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

export const defaultModels: AIModel[] = [
  {
    id: 'google/gemini-1114-experimental',
    name: 'Gemini Experimental 1114',
    description: 'Gemini 11-14 (2024) experimental model features "quality" improvements.',
    isFree: true,
    maxTokens: 310000,
    contextWindow: 1000000
  },
  {
    id: 'liquid/lfm-40b-moe',
    name: 'Liquid: LFM 40B MoE',
    description: 'Liquid\'s 40.3B Mixture of Experts (MoE) model. Specialized in programming and technology.',
    isFree: true,
    maxTokens: 55800000,
    contextWindow: 8192
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct',
    name: 'Llama 3.2 3B Instruct',
    description: '3B parameter multilingual model optimized for dialogue, reasoning, and summarization. Supports 8 languages.',
    isFree: true,
    maxTokens: 37200000,
    contextWindow: 4096
  },
  {
    id: 'meta-llama/llama-3.2-1b-instruct',
    name: 'Llama 3.2 1B Instruct',
    description: '1B parameter efficient model for summarization and multilingual text analysis.',
    isFree: true,
    maxTokens: 113000,
    contextWindow: 4096
  },
  {
    id: 'meta-llama/llama-3.2-90b-vision',
    name: 'Llama 3.2 90B Vision',
    description: '90B parameter multimodal model for visual reasoning and image-text tasks.',
    isFree: true,
    maxTokens: 39000,
    contextWindow: 4096
  },
  {
    id: 'meta-llama/llama-3.2-11b-vision',
    name: 'Llama 3.2 11B Vision',
    description: '11B parameter multimodal model for image captioning and visual question answering.',
    isFree: true,
    maxTokens: 53700,
    contextWindow: 8192
  },
  {
    id: 'google/gemini-flash-8b-1.5-experimental',
    name: 'Gemini Flash 8B 1.5',
    description: 'Experimental 8B parameter version of Gemini 1.5 Flash model.',
    isFree: true,
    maxTokens: 347000,
    contextWindow: 1000000
  },
  {
    id: 'google/gemini-flash-1.5-experimental',
    name: 'Gemini Flash 1.5',
    description: 'Experimental version of Gemini 1.5 Flash, specialized in technology and web.',
    isFree: true,
    maxTokens: 955000,
    contextWindow: 1000000
  },
  {
    id: 'nous/hermes-3-405b-instruct',
    name: 'Hermes 3 405B Instruct',
    description: 'Frontier-level model with advanced agentic capabilities, roleplaying, and code generation.',
    isFree: true,
    maxTokens: 1200000,
    contextWindow: 8192
  },
  {
    id: 'google/gemini-pro-1.5-experimental',
    name: 'Gemini Pro 1.5',
    description: 'Bleeding-edge version of Gemini 1.5 Pro with multimodal capabilities.',
    isFree: true,
    maxTokens: 837000,
    contextWindow: 1000000
  }
];

const FAVORITES_KEY = 'favorite-ai-models';

export function saveFavoriteModels(favoriteIds: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }
}

export function loadFavoriteModels(): string[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}

export function toggleFavoriteModel(model: AIModel, models: AIModel[]): AIModel[] {
  const favoriteIds = loadFavoriteModels();
  const isCurrentlyFavorite = favoriteIds.includes(model.id);
  
  const updatedFavoriteIds = isCurrentlyFavorite
    ? favoriteIds.filter(id => id !== model.id)
    : [...favoriteIds, model.id];
  
  saveFavoriteModels(updatedFavoriteIds);
  
  return models.map(m => ({
    ...m,
    isFavorite: updatedFavoriteIds.includes(m.id)
  }));
}

export async function fetchAvailableModels(): Promise<AIModel[]> {
  const favoriteIds = loadFavoriteModels();
  return defaultModels.map(model => ({
    ...model,
    isFavorite: favoriteIds.includes(model.id)
  }));
}
