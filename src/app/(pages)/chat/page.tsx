"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Send, Bot, User, Loader2, Settings, Trash, Copy, RotateCcw } from 'lucide-react';
import { LeftSidebar } from '@/components/chat/left-sidebar';
import { RightSidebar } from '@/components/chat/right-sidebar';
import { useChatStore } from '@/lib/store/chat-store';
import { providers } from '@/config/providers';
import { Message } from '@/types/chat';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [availableProvidersList, setAvailableProvidersList] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    currentSession,
    createSession,
    addMessage,
    updateMessage,
    deleteMessage,
    setLoading,
    setError,
    clearError,
    loading,
    error
  } = useChatStore();

  // Create initial session if none exists
  useEffect(() => {
    if (!currentSession) {
      createSession();
    }
  }, [currentSession, createSession]);

  // Check available providers on mount
  useEffect(() => {
    const checkProviders = async () => {
      const available = providers.map(p => p.name);
      setAvailableProvidersList(available);
      if (available.length > 0 && !selectedProvider) {
        setSelectedProvider(available[0]);
      }
    };

    checkProviders();
  }, [selectedProvider]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Focus input on mount and after sending message
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentSession) return;

    let tempId: string | undefined;

    try {
      setLoading(true);
      clearError();

      // Add user message immediately
      addMessage(currentSession.id, {
        role: 'user',
        content: content,
        timestamp: new Date()
      });

      // Create temporary assistant message for streaming
      tempId = crypto.randomUUID();
      addMessage(currentSession.id, {
        id: tempId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          provider: selectedProvider,
          model: providers.find(p => p.name === selectedProvider)?.defaultModel ?? '',
          history: currentSession.messages,
          stream: true
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to send message';
        
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = `Server error: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      let streamedContent = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content;
              if (content) {
                streamedContent += content;
                if (tempId) {
                  updateMessage(currentSession.id, tempId, streamedContent);
                }
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      // Remove the temporary message on error
      if (tempId) {
        deleteMessage(currentSession.id, tempId);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedProvider || loading) return;
    
    const content = input.trim();
    setInput('');
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    if (currentSession) {
      // Clear all messages in the current session
      currentSession.messages = [];
      toast({
        title: "Chat Cleared",
        description: "All messages have been removed",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!currentSession) return;
    
    const chatText = currentSession.messages
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
    if (!currentSession || currentSession.messages.length < 2 || loading) return;
    
    // Get the last user message
    const messages = currentSession.messages;
    const lastUserMessageIndex = messages.length - 2;
    const lastUserMessage = messages[lastUserMessageIndex];
    
    // Remove the last assistant message
    if (messages[messages.length - 1].id) {
      deleteMessage(currentSession.id, messages[messages.length - 1].id);
    }
    
    // Regenerate the response
    await sendMessage(lastUserMessage.content);
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <LeftSidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <div className="border-b p-4 flex items-center justify-between gap-4">
          <select
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="">Select Provider</option>
            {providers.map((provider) => (
              <option key={provider.name} value={provider.name}>
                {provider.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              disabled={currentSession.messages.length === 0 || loading}
              title="Clear chat"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={currentSession.messages.length === 0}
              title="Copy chat"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={regenerateResponse}
              disabled={currentSession.messages.length < 2 || loading}
              title="Regenerate last response"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0 px-4 py-2 space-y-2">
          {currentSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bot className="h-12 w-12 mb-4" />
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm text-center max-w-md">
                Select an AI provider and start chatting. Your messages will appear here.
                {error && (
                  <span className="text-red-500 block mt-2">
                    Error: {error}
                  </span>
                )}
              </p>
            </div>
          ) : (
            currentSession.messages.map((message) => (
              <Card 
                key={message.id} 
                className={`p-4 ${
                  message.role === 'assistant' 
                    ? 'bg-secondary' 
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5 mt-1" />
                  ) : (
                    <User className="h-5 w-5 mt-1" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {message.role === 'assistant' ? 'AI' : 'You'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 flex gap-4">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              availableProvidersList.length === 0
                ? "Please configure API keys in settings first"
                : "Type your message..."
            }
            disabled={loading || availableProvidersList.length === 0}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={loading || !selectedProvider || !input.trim() || availableProvidersList.length === 0}
            className="px-6"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </main>

      <RightSidebar />
    </div>
  );
}