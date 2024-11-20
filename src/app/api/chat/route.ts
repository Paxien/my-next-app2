import { NextResponse } from 'next/server';
import { Message, Provider, APIResponse } from '@/types/chat';
import { headers } from 'next/headers';
import { providers } from '@/config/providers';

const TIMEOUT = 30000; // 30 seconds

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function handleError(error: any, provider: string): APIResponse {
  console.error(`${provider} API error:`, error);
  
  if (error.name === 'AbortError') {
    return {
      error: 'Request timed out. Please try again.',
      status: 408
    };
  }
  
  if (error.response?.status === 429) {
    return {
      error: 'Rate limit exceeded. Please try again later.',
      status: 429
    };
  }
  
  return {
    error: 'Failed to get response from AI provider',
    status: 500
  };
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 4000); // Reasonable limit
}

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message, provider, history, model } = await req.json();

    // Get provider config
    const providerConfig = providers.find(p => p.name === provider);
    if (!providerConfig) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env[providerConfig.envKey];
    if (!apiKey) {
      return NextResponse.json(
        { error: `${provider} API key not configured` },
        { status: 400 }
      );
    }

    const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Next.js Chat App'
      },
      body: JSON.stringify({
        model: model || 'meta-llama/llama-2-70b-chat',
        messages: [
          ...history.map((m: Message) => ({
            role: m.role,
            content: m.content,
          })),
          {
            role: 'user',
            content: sanitizeInput(message),
          },
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response from Open Router');
    }

    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
