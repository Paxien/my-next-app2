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
import { CommandBar, type CommandMode } from './command-bar';

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

const MessageContent = React.memo(({ content, onInsertCode }: { 
  content: string; 
  onInsertCode: (code: string) => void;
}) => {
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <CodeSnippet
            code={code}
            language={match[1]}
            onInsert={onInsertCode}
          />
        );
      }
      return <code className={className} {...props}>{children}</code>;
    }
  };

  return (
    <ReactMarkdown
      components={components}
      className="prose prose-sm dark:prose-invert max-w-none"
    >
      {content}
    </ReactMarkdown>
  );
});

MessageContent.displayName = 'MessageContent';

export function AIChat({ onCodeUpdate, className }: AIChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [mode, setMode] = useState<CommandMode>('assistant');
  const [currentModel, setCurrentModel] = useState<AIModel>(defaultModels[0]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize models and welcome message
  useEffect(() => {
    if (!initialized) {
      // Fetch available models
      fetchAvailableModels().then(models => {
        setAvailableModels(models);
        // Set current model to the first non-favorite model
        const defaultModel = models.find(m => !m.isFavorite) || models[0];
        setCurrentModel(defaultModel);
      });

      // Add welcome message
      const welcomeMessage = getModeWelcomeMessage(mode);
      setMessages([
        {
          id: '0',
          role: 'system',
          content: welcomeMessage,
          timestamp: Date.now()
        }
      ]);
      setInitialized(true);
    }
  }, [initialized, mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getModeWelcomeMessage = (mode: CommandMode): string => {
    const messages = {
      assistant: "👋 Hi! I'm your AI assistant. I can help you analyze code, explain concepts, and provide suggestions. How can I help you today?",
      webapp: "🌐 Web App Mode activated! I'll help you generate components, create routes, and build features. What would you like to create?",
      database: "🗄️ Database Mode ready! Let's design schemas, models, and APIs. What's your database need?",
      refactor: "♻️ Refactor Mode enabled! I'll help improve your code quality and structure. What code should we enhance?",
      docs: "📚 Documentation Mode active! Let's create clear and helpful documentation. What needs documenting?",
      debug: "🔧 Debug Mode initialized! I'll help you find and fix issues. What's the problem you're facing?"
    };
    return messages[mode];
  };

  const handleModeChange = (newMode: CommandMode) => {
    setMode(newMode);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'system',
        content: `Switching to ${newMode} mode...\n\n${getModeWelcomeMessage(newMode)}`
      }
    ]);
  };

  const handleModelChange = (model: AIModel) => {
    setCurrentModel(model);
    // Add model change notification
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'system',
        content: `Switched to ${model.name}. ${model.description}`,
        timestamp: Date.now(),
        model: model.id
      }
    ]);
  };

  const handleCommandClick = (command: string) => {
    setInputValue(command);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add user's message to history
      conversationHistory.push({
        role: 'user',
        content: inputValue
      });

      // Get AI response with current model and mode context
      const response = await getAIResponse(
        conversationHistory,
        currentModel.id
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        model: response.model,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle code updates
      if (mode === 'webapp') {
        const { code } = extractCodeFromResponse(response.content);
        if (code) {
          onCodeUpdate(code);
        }
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unexpected error occurred while processing your request.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(errorMessage.content);
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

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Sticky header section */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2 p-2">
          <ModelSelector
            models={availableModels}
            currentModel={currentModel}
            onModelChange={handleModelChange}
          />
        </div>
        <div className="p-2 border-t">
          <CommandBar
            mode={mode}
            onModeChange={handleModeChange}
            onCommandClick={handleCommandClick}
          />
        </div>
      </div>

      {/* Messages section */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 rounded-lg p-4",
                message.role === 'user' && "bg-muted",
                message.role === 'assistant' && "bg-accent",
                message.role === 'error' && "bg-destructive/10 text-destructive",
                message.role === 'system' && "text-muted-foreground italic"
              )}
            >
              {message.role === 'user' && <User className="h-5 w-5 mt-1" />}
              {message.role === 'assistant' && <Bot className="h-5 w-5 mt-1" />}
              {message.role === 'error' && <XCircle className="h-5 w-5 mt-1" />}
              {message.role === 'system' && <Terminal className="h-5 w-5 mt-1" />}
              
              <div className="flex-1 space-y-2">
                <MessageContent 
                  content={message.content} 
                  onInsertCode={handleInsertCode}
                />
                {message.model && (
                  <div className="text-xs text-muted-foreground">
                    Using model: {message.model}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input section */}
      <div className="sticky bottom-0 z-10 bg-background border-t p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message or command..."
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {error && (
          <div className="mt-2 text-sm text-destructive">{error}</div>
        )}
      </div>
    </div>
  );
}

export default AIChat;
