import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, provider, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let response;
    const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];

    if (!apiKey) {
      return NextResponse.json(
        { error: `${provider} API key not configured` },
        { status: 400 }
      );
    }

    switch (provider) {
      case 'openai':
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              ...history.map((msg: any) => ({
                role: msg.role,
                content: msg.content
              })),
              { role: 'user', content: message }
            ]
          })
        });
        const openaiData = await openaiResponse.json();
        response = openaiData.choices[0]?.message?.content || '';
        break;

      case 'anthropic':
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
              ...history.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
              })),
              { role: 'user', content: message }
            ]
          })
        });
        const anthropicData = await anthropicResponse.json();
        response = anthropicData.content[0]?.text || '';
        break;

      case 'openrouter':
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [
              ...history.map((msg: any) => ({
                role: msg.role,
                content: msg.content
              })),
              { role: 'user', content: message }
            ]
          })
        });
        const openRouterData = await openRouterResponse.json();
        response = openRouterData.choices[0]?.message?.content || '';
        break;

      case 'google':
        const googleResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: [...history.map((msg: any) => msg.content), message].join('\n')
                  }
                ]
              }
            ]
          }),
          params: {
            key: apiKey
          }
        });
        const googleData = await googleResponse.json();
        response = googleData.candidates[0]?.content?.parts[0]?.text || '';
        break;

      case 'mistral':
        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'mistral-tiny',
            messages: [
              ...history.map((msg: any) => ({
                role: msg.role,
                content: msg.content
              })),
              { role: 'user', content: message }
            ]
          })
        });
        const mistralData = await mistralResponse.json();
        response = mistralData.choices[0]?.message?.content || '';
        break;

      case 'cohere':
        const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: [...history.map((msg: any) => msg.content), message].join('\n'),
            model: 'command',
            max_tokens: 500
          })
        });
        const cohereData = await cohereResponse.json();
        response = cohereData.generations[0]?.text || '';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        );
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
