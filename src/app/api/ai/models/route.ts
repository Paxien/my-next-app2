import { NextResponse } from 'next/server';
import { defaultModels, type AIModel } from '@/app/(pages)/ce-1/utils/models';

interface OpenRouterModel {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export async function GET() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch models from OpenRouter');
      return NextResponse.json({ models: defaultModels });
    }

    const data = await response.json();
    const openRouterModels: OpenRouterModel[] = data.data;

    // Convert OpenRouter models to our format and merge with default models
    const convertedModels: AIModel[] = openRouterModels.map(model => ({
      id: model.id,
      name: model.name || model.id.split('/').pop() || model.id,
      description: model.description || 'No description available',
      isFree: parseFloat(model.pricing.prompt) === 0 && parseFloat(model.pricing.completion) === 0,
      maxTokens: model.context_length || 4096,
      contextWindow: model.context_length,
      pricing: {
        prompt: parseFloat(model.pricing.prompt),
        completion: parseFloat(model.pricing.completion)
      }
    }));

    // Filter out any duplicate models (prefer our default descriptions)
    const defaultModelIds = new Set(defaultModels.map(m => m.id));
    const uniqueModels = convertedModels.filter(m => !defaultModelIds.has(m.id));

    // Combine default models with unique OpenRouter models
    const allModels = [...defaultModels, ...uniqueModels];

    // Sort models: free models first, then by name
    allModels.sort((a, b) => {
      if (a.isFree !== b.isFree) {
        return a.isFree ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ models: allModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ models: defaultModels });
  }
}
