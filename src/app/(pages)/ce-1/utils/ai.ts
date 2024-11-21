interface CodeContext {
  currentCode: string;
  language: string;
}

const SYSTEM_PROMPT = `You are an AI coding assistant. You can help with:
1. Analyzing code
2. Suggesting improvements
3. Fixing bugs
4. Adding new features
5. Explaining code

When modifying code:
1. Return the complete updated code
2. Explain your changes clearly
3. Maintain the existing code style
4. Consider best practices and performance

Format your responses like this when modifying code:
\`\`\`CODE_START
[the complete updated code]
\`\`\`
[explanation of changes]`;

export interface AIResponse {
  content: string;
  model: string;
}

export async function getAIResponse(
  messages: { role: string; content: string }[],
  model: string = 'mistralai/mistral-7b-instruct'
): Promise<AIResponse> {
  const systemMessage = {
    role: 'system',
    content: SYSTEM_PROMPT
  };

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: [systemMessage, ...messages], model }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  const data = await response.json();
  return { content: data.content, model: data.model };
}

export function extractCodeFromResponse(response: string): { code: string | null; explanation: string } {
  const codeMatch = response.match(/```CODE_START\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : null;
  const explanation = response.replace(/```CODE_START\n[\s\S]*?```/, '').trim();
  
  return { code, explanation };
}
