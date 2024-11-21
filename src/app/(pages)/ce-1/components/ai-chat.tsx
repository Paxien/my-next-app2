'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIResponse, extractCodeFromResponse, type AIResponse } from '../utils/ai';
import { ModelSelector } from './model-selector';
import { defaultModels, type AIModel, fetchAvailableModels } from '../utils/models';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>(defaultModels[0]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>(defaultModels);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAvailableModels().then(models => {
      setAvailableModels(models);
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
    if (!currentMessage.trim() || isLoading) return;

    const messageText = currentMessage.trim();
    setCurrentMessage('');
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

  const MessageContent = ({ content }: { content: string }) => (
    <ReactMarkdown
      className="prose prose-sm dark:prose-invert max-w-none"
      components={{
        pre: ({ node, ...props }) => (
          <div className="relative group">
            <pre {...props} className="bg-muted rounded-md p-4 overflow-x-auto" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => navigator.clipboard.writeText(node?.children[0]?.children[0]?.value || '')}
            >
              Copy
            </Button>
          </div>
        ),
        code: ({ node, ...props }) => (
          <code {...props} className="bg-muted px-1 py-0.5 rounded-sm" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <ModelSelector
          selectedModel={currentModel}
          models={availableModels}
          onModelSelect={setCurrentModel}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4 min-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2 max-w-[80%]',
                message.role === 'user' ? 'ml-auto' : 'mr-auto'
              )}
            >
              {message.role === 'assistant' && (
                <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
              )}
              {message.role === 'user' && (
                <User className="h-5 w-5 mt-1 flex-shrink-0" />
              )}
              {message.role === 'error' && (
                <XCircle className="h-5 w-5 mt-1 flex-shrink-0 text-destructive" />
              )}
              
              <div
                className={cn(
                  'rounded-lg p-4',
                  message.role === 'user' && 'bg-primary text-primary-foreground',
                  message.role === 'assistant' && 'bg-muted',
                  message.role === 'error' && 'bg-destructive/10 text-destructive'
                )}
              >
                <MessageContent content={message.content} />
                {message.model && (
                  <div className="text-xs opacity-50 mt-2">
                    Model: {message.model}
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

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your code or request changes..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
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
