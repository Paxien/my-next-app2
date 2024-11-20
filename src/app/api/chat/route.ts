import { NextResponse } from 'next/server';
import { Message, Provider, APIResponse } from '@/types/chat';
import { headers } from 'next/headers';

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

export async function POST(req: Request) {
  try {
    const { message, provider, history, model } = await req.json();
    const headersList = headers();
    
    // Basic input validation
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const sanitizedMessage = sanitizeInput(message);
    let response: string;
    
    const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
    if (!apiKey) {
      return NextResponse.json(
        { error: `${provider} API key not configured` },
        { status: 400 }
      );
    }

    try {
      switch (provider as Provider) {
        case 'openai': {
          const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model || 'gpt-3.5-turbo',
              messages: [
                ...history.map((msg: Message) => ({
                  role: msg.role,
                  content: msg.content
                })),
                { role: 'user', content: sanitizedMessage }
              ]
            })
          });

          if (!res.ok) {
            throw new Error(`OpenAI API error: ${res.status}`);
          }

          const data = await res.json();
          response = data.choices[0]?.message?.content || '';
          break;
        }

        case 'anthropic': {
          const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model || 'claude-3-opus-20240229',
              max_tokens: 1024,
              messages: [
                ...history.map((msg: Message) => ({
                  role: msg.role === 'assistant' ? 'assistant' : 'user',
                  content: msg.content
                })),
                { role: 'user', content: sanitizedMessage }
              ]
            })
          });

          if (!res.ok) {
            throw new Error(`Anthropic API error: ${res.status}`);
          }

          const data = await res.json();
          response = data.content[0]?.text || '';
          break;
        }

        case 'openrouter': {
          const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': headersList.get('referer') || 'http://localhost:3000',
              'X-Title': 'Next.js Chat App'
            },
            body: JSON.stringify({
              model: model || 'meta-llama/llama-3.2-90b-vision-instruct:free',
              messages: [
                ...history.map((msg: Message) => ({
                  role: msg.role,
                  content: msg.content
                })),
                { role: 'user', content: sanitizedMessage }
              ]
            })
          });

          if (!res.ok) {
            throw new Error(`OpenRouter API error: ${res.status}`);
          }

          const data = await res.json();
          response = data.choices[0]?.message?.content || '';
          break;
        }

        case 'google': {
          const res = await fetchWithTimeout(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: [...history.map((msg: Message) => msg.content), sanitizedMessage].join('\n')
                      }
                    ]
                  }
                ]
              })
            }
          );

          if (!res.ok) {
            throw new Error(`Google API error: ${res.status}`);
          }

          const data = await res.json();
          response = data.candidates[0]?.content?.parts[0]?.text || '';
          break;
        }

        case 'mistral': {
          const res = await fetchWithTimeout('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model || 'mistral-tiny',
              messages: [
                ...history.map((msg: Message) => ({
                  role: msg.role,
                  content: msg.content
                })),
                { role: 'user', content: sanitizedMessage }
              ]
            })
          });

          if (!res.ok) {
            throw new Error(`Mistral API error: ${res.status}`);
          }

          const data = await res.json();
          response = data.choices[0]?.message?.content || '';
          break;
        }

        case 'cohere': {
          const res = await fetchWithTimeout('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: [...history.map((msg: Message) => msg.content), sanitizedMessage].join('\n'),
              model: model || 'command',
              max_tokens: 500
            })
          });

          if (!res.ok) {
            throw new Error(`Cohere API error: ${res.status}`);
          }

          const data = await res.json();
          response = data.generations[0]?.text || '';
          break;
        }

        default:
          return NextResponse.json(
            { error: 'Invalid provider' },
            { status: 400 }
          );
      }

      return NextResponse.json({ message: response });
    } catch (error: any) {
      const errorResponse = handleError(error, provider);
      return NextResponse.json(
        { error: errorResponse.error },
        { status: errorResponse.status }
      );
    }
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
