import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'src/app/config/ai-settings.json');

async function getSettings() {
  try {
    const settings = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(settings);
  } catch (error) {
    console.error('Error reading AI settings:', error);
    throw new Error('Failed to read AI settings');
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const settings = await getSettings();

    if (!settings.openRouterApiKey) {
      return NextResponse.json(
        { error: 'Open Router API key not configured' },
        { status: 400 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'X-Title': 'Next.js Chat Interface',
      },
      body: JSON.stringify({
        model: settings.model || 'openai/gpt-3.5-turbo',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
