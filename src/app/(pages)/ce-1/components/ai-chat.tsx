'use client';

import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Send, Loader2, Bot, User, XCircle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIResponse, extractCodeFromResponse } from '../utils/ai';
import { defaultModels, type AIModel, fetchAvailableModels } from '../utils/models';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { ModelSelector } from './model-selector';
import { CodeSnippet } from './code-snippet';
import { 
  AI_COMMANDS, 
  COMMAND_HANDLERS, 
  type FileContext,
  formatCommandInstructions 
} from '../utils/ai-commands';
import { parseCommand, parseArgs } from '../utils/command-handlers';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
  model?: string;
  timestamp: number;
}

interface AIChatProps {
  onCodeUpdate: (code: string) => void;
  className?: string;
}

export function AIChat({ onCodeUpdate, className }: AIChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>(defaultModels[0]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>(defaultModels);
  const [error, setError] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialized) return;
    
    fetchAvailableModels().then(models => {
      setAvailableModels(models);
    });

    // Add welcome message with command instructions
    const welcomeMessage = 
      "# 👋 Welcome to the AI Code Editor!\n\n" +
      "I'm here to help you write, modify, and understand code. Here are the available commands:";

    setMessages([{
      id: generateMessageId(),
      role: 'system',
      content: welcomeMessage + "\n\n" + formatCommandInstructions(),
      timestamp: Date.now()
    }]);

    setInitialized(true);
  }, [initialized]);

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

  const handleCommand = async (input: string) => {
    const { command, args } = parseCommand(input);
    const handler = COMMAND_HANDLERS[command];

    if (!handler) {
      addMessage({
        role: 'error',
        content: `Unknown command: ${command}. Type /help for available commands.`,
      });
      return;
    }

    try {
      const context: FileContext = {
        path: '',
        content: '',
        language: 'typescript',
        cursor: {
          line: 0,
          column: 0
        }
      };

      const result = await handler.handler(args, context);
      
      // Combine message and code into a single message if both exist
      if (result.code) {
        addMessage({
          role: 'system',
          content: `${result.message}\n\n\`\`\`typescript\n${result.code}\n\`\`\``
        });
      } else {
        addMessage({
          role: 'system',
          content: result.message
        });
      }

      // Update editor content if files are provided
      if (result.files?.[0]?.content) {
        onCodeUpdate(result.files[0].content);
      }

    } catch (error) {
      addMessage({
        role: 'error',
        content: error instanceof Error ? error.message : 'Command execution failed'
      });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Check if it's a command
    if (messageContent.startsWith('/')) {
      await handleCommand(messageContent);
      setIsLoading(false);
      return;
    }

    const messageWithContext: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    };

    // Add user message immediately
    addMessage(messageWithContext);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(
        messages.concat(messageWithContext),
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
        model: aiResponse.model,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error in AI chat:', error);
      addMessage({
        role: 'error',
        content: error instanceof Error ? error.message : 'An unexpected error occurred',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsertCode = (code: string) => {
    onCodeUpdate(code);
  };

  const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    return (
      <div className="not-prose my-4 first:mt-0 last:mb-0">
        <CodeSnippet
          code={code}
          language={language}
          onInsert={handleInsertCode}
        />
      </div>
    );
  };

  // Custom renderer for markdown code blocks
  const renderers = {
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded-sm text-sm" {...props}>
            {children}
          </code>
        );
      }

      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'typescript';
      const code = String(children).replace(/\n$/, '');

      // Return the code block outside of any paragraph context
      return <CodeBlock code={code} language={language} />;
    },
    // Remove the paragraph override since we're handling code blocks differently
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-2 last:mb-0">{children}</p>
    )
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-2 p-2 border-b">
        <ModelSelector
          models={availableModels}
          currentModel={currentModel}
          onModelChange={setCurrentModel}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCommandMode(!commandMode)}
          className={cn(
            "h-8 w-8",
            commandMode && "bg-secondary"
          )}
        >
          <Terminal className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 rounded-lg p-4",
                message.role === 'user' && "bg-secondary",
                message.role === 'assistant' && "bg-muted",
                message.role === 'error' && "bg-destructive/10 text-destructive",
                message.role === 'system' && "bg-primary/10"
              )}
            >
              {message.role === 'user' && <User className="h-5 w-5 mt-1" />}
              {message.role === 'assistant' && <Bot className="h-5 w-5 mt-1" />}
              {message.role === 'error' && <XCircle className="h-5 w-5 mt-1" />}
              
              <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={renderers}
                >
                  {message.content}
                </ReactMarkdown>
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={commandMode ? "Type a command (e.g., /help)" : "Type a message..."}
            className="flex-1"
            disabled={isLoading}
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

export default AIChat;
