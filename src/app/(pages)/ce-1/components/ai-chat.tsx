'use client';

import { useState, FormEvent } from 'react';
import { ScrollArea } from '@/components/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAIResponse } from '../utils/ai';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface AIChatProps {
  className?: string;
  onSendMessage?: (message: string) => void;
}

export function AIChat({ className, onSendMessage }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI coding assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    onSendMessage?.(input);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await getAIResponse([...messages, userMessage]);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
      console.error('AI Response Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full border rounded-md', className)}>
      <div className="flex-none p-4 border-b">
        <h2 className="text-sm font-semibold">AI Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 text-sm',
                message.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              <div className={cn(
                'flex-none rounded-full p-2',
                message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
              )}>
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className={cn(
                'rounded-lg px-3 py-2 max-w-[75%]',
                message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
              )}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-500 p-2 rounded bg-red-50">
              Error: {error}
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex-none p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={cn(
              "px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
