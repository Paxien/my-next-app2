import { AIModel } from './models';
import fs from 'fs';
import path from 'path';

const FAVORITES_FILE = path.join(process.cwd(), 'model-favorites.json');

export interface FavoritesData {
  models: string[]; // Array of model IDs
}

export async function getFavorites(): Promise<string[]> {
  try {
    if (!fs.existsSync(FAVORITES_FILE)) {
      await saveFavorites({ models: [] });
      return [];
    }
    const data = await fs.promises.readFile(FAVORITES_FILE, 'utf8');
    const favorites: FavoritesData = JSON.parse(data);
    return favorites.models;
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

export async function saveFavorites(data: FavoritesData): Promise<void> {
  try {
    await fs.promises.writeFile(FAVORITES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
}

export async function toggleFavorite(modelId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    const isCurrentlyFavorite = favorites.includes(modelId);
    
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== modelId)
      : [...favorites, modelId];
    
    await saveFavorites({ models: newFavorites });
    return !isCurrentlyFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}
