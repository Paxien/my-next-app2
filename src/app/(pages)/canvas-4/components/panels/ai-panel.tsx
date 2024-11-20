'use client';

import { ScrollArea } from "@/components/scroll-area";
import { Send, MessageSquare } from "lucide-react";
import { useState } from "react";

interface AIPanelProps {
  // No props defined
}

export function AIPanel(props: AIPanelProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    
    // Clear input
    setInput('');

    // Simulate AI response (placeholder)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'This is a placeholder response. AI chat functionality will be implemented soon.',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full" title="AI Chat" icon={<MessageSquare className="h-5 w-5" />}>
      <div className="flex-none p-4 border-b">
        <h3 className="font-medium">AI Assistant</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex-none p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
