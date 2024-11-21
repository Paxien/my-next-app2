import { NextResponse } from 'next/server';
import { getFavorites, toggleFavorite } from '@/app/(pages)/ce-1/utils/favorites';

export async function GET() {
  try {
    const favorites = await getFavorites();
    return NextResponse.json({ favorites });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { modelId } = await request.json();
    const isFavorite = await toggleFavorite(modelId);
    return NextResponse.json({ isFavorite });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
