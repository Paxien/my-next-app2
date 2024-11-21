'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, XCircle, ChevronsUpDown, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIResponse, extractCodeFromResponse, type AIResponse } from '../utils/ai';
import { defaultModels, type AIModel, fetchAvailableModels } from '../utils/models';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { ModelSelector } from './model-selector';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  model?: string;
  timestamp: number;
}

interface AIChatProps {
  onSendMessage: (message: string) => Promise<{
    success: boolean;
    data?: {
      currentCode: string;
      language: string;
      message: string;
      cursor?: { lineNumber: number; column: number };
    };
    error?: string;
  }>;
  onCodeUpdate: (code: string) => void;
  className?: string;
}

export function AIChat({ onSendMessage, onCodeUpdate, className }: AIChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>(defaultModels[0]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>(defaultModels);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAvailableModels().then(models => {
      setAvailableModels(models);
      // Set the default model to Llama 3 8B
      const defaultModel = models.find(m => m.id === 'meta-llama/llama-3-8b-instruct:free') || models[0];
      setCurrentModel(defaultModel);
    });
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateMessageId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: generateMessageId(),
      timestamp: Date.now()
    }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setError(null);
    setIsLoading(true);

    // Add user message
    addMessage({
      role: 'user',
      content: messageText
    });

    try {
      // Get current editor context
      const context = await onSendMessage(messageText);
      
      if (!context.success) {
        throw new Error(context.error || 'Failed to get editor context');
      }

      // Prepare message with code context
      const messageWithContext = {
        role: 'user',
        content: `Current code:\n\`\`\`${context.data.language}\n${context.data.currentCode}\n\`\`\`\n\nCursor position: Line ${context.data.cursor?.lineNumber}, Column ${context.data.cursor?.column}\n\nUser request: ${messageText}`
      };

      // Get AI response
      const aiResponse = await getAIResponse(
        messages.concat(messageWithContext as Message),
        currentModel.id
      );

      // Process response
      const { code, explanation } = extractCodeFromResponse(aiResponse.content);
      
      // Update code if provided
      if (code) {
        onCodeUpdate(code);
      }

      // Add AI response
      addMessage({
        role: 'assistant',
        content: aiResponse.content,
        model: aiResponse.model
      });

    } catch (error) {
      console.error('Error in AI chat:', error);
      addMessage({
        role: 'error',
        content: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
      // Focus input after processing
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const MessageContent = ({ content }: { content: string }) => {
    // Clean up the content by removing extra newlines and normalizing spacing
    const cleanContent = content
      .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
      .trim();

    return (
      <div className="break-words">
        <ReactMarkdown
          className="prose prose-sm dark:prose-invert max-w-none"
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            pre: ({ node, ...props }) => (
              <div className="relative group my-4 first:mt-0 last:mb-0">
                <pre {...props} className="bg-muted rounded-md p-4 overflow-x-auto" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const code = node?.children[0]?.children[0]?.value || '';
                    navigator.clipboard.writeText(code);
                  }}
                >
                  Copy
                </Button>
              </div>
            ),
            code: ({ node, inline, ...props }) => (
              inline ? 
                <code {...props} className="bg-muted px-1.5 py-0.5 rounded-sm text-sm" /> :
                <code {...props} className="bg-muted px-1.5 py-0.5 rounded-sm text-sm" />
            ),
          }}
        >
          {cleanContent}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <ModelSelector
              selectedModel={currentModel}
              models={availableModels}
              onModelSelect={setCurrentModel}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setMessages([])}>
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'group flex gap-3 max-w-[85%] text-sm',
                message.role === 'user' ? 'ml-auto' : 'mr-auto'
              )}
            >
              {message.role === 'assistant' && (
                <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
              )}
              {message.role === 'user' && (
                <User className="h-5 w-5 mt-1 flex-shrink-0 order-last" />
              )}
              {message.role === 'error' && (
                <XCircle className="h-5 w-5 mt-1 flex-shrink-0 text-destructive" />
              )}
              
              <div
                className={cn(
                  'rounded-lg px-4 py-3 min-w-[100px]',
                  message.role === 'user' && 'bg-primary text-primary-foreground',
                  message.role === 'assistant' && 'bg-muted',
                  message.role === 'error' && 'bg-destructive/10 text-destructive'
                )}
              >
                <MessageContent content={message.content} />
                {message.model && (
                  <div className="text-xs opacity-50 mt-2 pt-2 border-t">
                    {message.model}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 z-10 p-4 bg-background border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your code or request changes..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
