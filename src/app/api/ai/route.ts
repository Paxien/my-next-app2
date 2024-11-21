import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not found' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      content: data.choices[0].message.content,
      model: data.model
    });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
