"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Send, Bot, User, Loader2, Settings, Trash, Copy, RotateCcw } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp?: Date;
}

interface Provider {
  id: string;
  name: string;
  envKey: string;
  description?: string;
  defaultModel?: string;
}

const providers: Provider[] = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    envKey: 'OPENAI_API_KEY',
    description: 'GPT-3.5 and GPT-4 models'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    envKey: 'ANTHROPIC_API_KEY',
    description: 'Claude and Claude 2 models'
  },
  { 
    id: 'openrouter', 
    name: 'Open Router', 
    envKey: 'OPENROUTER_API_KEY',
    description: 'Access to multiple AI models',
    defaultModel: 'meta-llama/llama-3.2-90b-vision-instruct:free'
  },
  { 
    id: 'google', 
    name: 'Google AI', 
    envKey: 'GOOGLE_AI_API_KEY',
    description: 'PaLM and Gemini models'
  },
  { 
    id: 'mistral', 
    name: 'Mistral', 
    envKey: 'MISTRAL_API_KEY',
    description: 'Mistral-7B and derived models'
  },
  { 
    id: 'cohere', 
    name: 'Cohere', 
    envKey: 'COHERE_API_KEY',
    description: 'Command and Generate models'
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check available providers on mount
  useEffect(() => {
    const checkProviders = async () => {
      try {
        const response = await fetch('/api/settings/get-api-keys');
        if (response.ok) {
          const data = await response.json();
          const configured = providers
            .filter(p => !!data[p.envKey])
            .map(p => p.id);
          setAvailableProviders(configured);
          
          // Set default provider if available
          if (configured.length > 0 && !selectedProvider) {
            setSelectedProvider(configured[0]);
          }
        }
      } catch (error) {
        console.error('Error checking providers:', error);
      }
    };
    checkProviders();
  }, [selectedProvider]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount and after sending message
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedProvider || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const selectedProviderConfig = providers.find(p => p.id === selectedProvider);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          provider: selectedProvider,
          history: messages,
          model: selectedProviderConfig?.defaultModel
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
      // Restore the input if there was an error
      setInput(userMessage.content);
      // Remove the user message from the chat
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "All messages have been removed",
    });
  };

  const copyToClipboard = async () => {
    const chatText = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(chatText);
      toast({
        title: "Copied to Clipboard",
        description: "Chat history has been copied",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy chat history",
        variant: "destructive",
      });
    }
  };

  const regenerateResponse = async () => {
    if (messages.length < 2 || isLoading) return;
    
    // Remove the last assistant message
    const lastUserMessage = messages[messages.length - 2];
    setMessages(prev => prev.slice(0, -1));
    
    // Regenerate the response
    setInput(lastUserMessage.content);
    await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto px-4 py-2 gap-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Label htmlFor="provider" className="text-sm font-medium mb-1 block">AI Provider</Label>
          <Select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full"
          >
            <SelectItem value="" disabled>Choose a provider</SelectItem>
            {providers.map((provider) => (
              <SelectItem 
                key={provider.id} 
                value={provider.id}
                disabled={!availableProviders.includes(provider.id)}
              >
                {provider.name}
                {provider.description && (
                  <span className="text-gray-500 text-sm ml-2">
                    - {provider.description}
                  </span>
                )}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            title="Copy chat"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={regenerateResponse}
            disabled={messages.length < 2 || isLoading}
            title="Regenerate last response"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.href = '/settings/api-keys'}
            title="Configure API keys"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0 space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="h-12 w-12 mb-4" />
            <p className="text-lg mb-2">No messages yet</p>
            <p className="text-sm text-center max-w-md">
              Select an AI provider and start chatting. Your messages will appear here.
              {availableProviders.length === 0 && (
                <span className="block mt-2 text-yellow-600">
                  ⚠️ No API keys configured. Click the settings icon to add your keys.
                </span>
              )}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Card 
              key={index} 
              className={`p-4 ${
                message.role === 'assistant' 
                  ? 'bg-secondary' 
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className="text-xs opacity-50">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2 sticky bottom-0 bg-background pt-2 border-t">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            availableProviders.length === 0
              ? "Please configure API keys in settings first"
              : "Type your message..."
          }
          disabled={isLoading || availableProviders.length === 0}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !selectedProvider || !input.trim() || availableProviders.length === 0}
          className="px-6"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}