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
  try {
    // For now, simulate API response with different behaviors based on model
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lastMessage = messages[messages.length - 1];
    let response = '';

    // Simulate different model behaviors
    if (model.includes('gemini')) {
      response = `[Gemini] ${generateResponse(lastMessage.content)}`;
    } else if (model.includes('llama')) {
      response = `[Llama] ${generateResponse(lastMessage.content)}`;
    } else if (model.includes('liquid')) {
      response = `[Liquid] ${generateResponse(lastMessage.content)}`;
    } else {
      response = generateResponse(lastMessage.content);
    }

    return {
      content: response,
      model: model
    };
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

function generateResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  } 
  
  if (lowercaseInput.includes('help')) {
    return "I can help you with:\n\n" +
      "1. Code Analysis\n" +
      "2. Bug Fixing\n" +
      "3. Feature Implementation\n" +
      "4. Code Explanation\n" +
      "5. Best Practices\n\n" +
      "Just describe what you need!";
  } 
  
  if (lowercaseInput.includes('code') || lowercaseInput.includes('example')) {
    return "Here's a sample code example:\n\n" +
      "```typescript\n" +
      "function greet(name: string): string {\n" +
      "  return `Hello, ${name}! Welcome to our AI-powered editor.`;\n" +
      "}\n" +
      "```\n\n" +
      "Would you like me to explain this code or help you with something specific?";
  }
  
  return "I understand your request. Let me help you with that. " +
    "Here's a response based on your input:\n\n" +
    "```typescript\n" +
    "// Example code related to your request\n" +
    "function processRequest(input: string): void {\n" +
    "  console.log('Processing:', input);\n" +
    "}\n" +
    "```\n\n" +
    "Would you like me to explain this further or help you with something specific?";
}

export function extractCodeFromResponse(response: string): { code: string | null; explanation: string } {
  const codeStartMarker = '```CODE_START';
  const codeEndMarker = '```CODE_END';
  
  const codeBlockRegex = /```(?:typescript|javascript|jsx|tsx)?\n([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);

  if (match) {
    return {
      code: match[1].trim(),
      explanation: response.replace(match[0], '').trim()
    };
  }

  // Check for CODE_START/CODE_END markers
  const startIndex = response.indexOf(codeStartMarker);
  const endIndex = response.indexOf(codeEndMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    const code = response
      .substring(startIndex + codeStartMarker.length, endIndex)
      .trim();
    const explanation = response
      .substring(endIndex + codeEndMarker.length)
      .trim();
    return { code, explanation };
  }

  return {
    code: null,
    explanation: response
  };
}
