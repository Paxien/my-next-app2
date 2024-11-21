import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIResponse, extractCodeFromResponse, type AIResponse } from '../utils/ai';
import { ModelSelector } from './model-selector';
import { defaultModels, type AIModel, fetchAvailableModels } from '../utils/models';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

interface AIChatProps {
  onCodeChange?: (code: string) => void;
}

export function AIChat({ onCodeChange }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel>(defaultModels[0]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>(defaultModels);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch available models when component mounts
    fetchAvailableModels().then(models => {
      setAvailableModels(models);
    });
  }, []);

  const handleSend = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(
        messages.concat(userMessage),
        currentModel.id
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse.content,
        model: aiResponse.model,
      };

      setMessages(prev => [...prev, assistantMessage]);

      const { code } = extractCodeFromResponse(aiResponse.content);
      if (code && onCodeChange) {
        onCodeChange(code);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <ModelSelector
          selectedModel={currentModel}
          models={availableModels}
          onModelSelect={setCurrentModel}
        />
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.model && (
                  <div className="text-xs opacity-50 mt-1">
                    Using model: {message.model}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse">Thinking...</div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex space-x-2"
        >
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Ask me anything about your code..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
