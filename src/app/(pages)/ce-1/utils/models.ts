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
    id: 'meta-llama/llama-3-8b-instruct:free',
    name: 'Llama 3 8B Instruct',
    description: 'Latest Llama model optimized for instruction following and code generation',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B Instruct',
    description: 'Fast and efficient model for code analysis and generation',
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
    id: 'meta-llama/llama-2-70b-chat',
    name: 'Llama 2 70B Chat',
    description: 'Meta\'s largest open-source chat model with exceptional coding capabilities',
    isFree: true,
    maxTokens: 4096,
    contextWindow: 4096
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
