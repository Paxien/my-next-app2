import { NextResponse } from 'next/server';
import { getNavigationItems } from '@/app/actions/navigation';

export async function GET() {
  try {
    const items = await getNavigationItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to get navigation items:', error);
    return NextResponse.json(
      { error: 'Failed to get navigation items' },
      { status: 500 }
    );
  }
}
