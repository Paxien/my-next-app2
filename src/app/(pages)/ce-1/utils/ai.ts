export async function getAIResponse(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get AI response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
