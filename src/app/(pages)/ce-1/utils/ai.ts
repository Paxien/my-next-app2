interface CodeContext {
  currentCode: string;
  language: string;
  cursor?: {
    lineNumber: number;
    column: number;
  };
}

const SYSTEM_PROMPT = `You are an AI coding assistant. You can help with:
1. Analyzing code
2. Suggesting improvements
3. Fixing bugs
4. Adding new features
5. Explaining code

When modifying code:
1. Return the complete updated code between \`\`\`CODE_START and \`\`\`CODE_END markers
2. Provide a clear explanation of your changes after the code block
3. Maintain the existing code style and formatting
4. Consider best practices, performance, and type safety
5. Preserve any necessary imports and dependencies

When analyzing code:
1. Consider the cursor position for context-aware suggestions
2. Look for potential bugs, type issues, and performance problems
3. Suggest improvements while respecting the existing architecture
4. Provide clear explanations with examples when needed

Format your responses like this:
For code modifications:
\`\`\`CODE_START
[the complete updated code]
\`\`\`CODE_END
[detailed explanation of changes]

For analysis:
[detailed analysis with specific line references]
[suggestions for improvements]
[examples if relevant]`;

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
    body: JSON.stringify({ 
      messages: [systemMessage, ...messages], 
      model,
      temperature: 0.7,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  return response.json();
}

export function extractCodeFromResponse(response: string): { code: string | null; explanation: string } {
  const codeStartMarker = '```CODE_START';
  const codeEndMarker = '```CODE_END';
  
  const codeStartIndex = response.indexOf(codeStartMarker);
  const codeEndIndex = response.indexOf(codeEndMarker);
  
  if (codeStartIndex === -1 || codeEndIndex === -1) {
    // No code block found, treat the entire response as explanation
    return {
      code: null,
      explanation: response.trim()
    };
  }
  
  const code = response
    .substring(codeStartIndex + codeStartMarker.length, codeEndIndex)
    .trim();
    
  const explanation = response
    .substring(codeEndIndex + codeEndMarker.length)
    .trim();
  
  return { code, explanation };
}
