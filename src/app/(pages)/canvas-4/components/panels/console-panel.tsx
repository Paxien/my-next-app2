'use client';

import { ScrollArea } from "@/components/scroll-area";
import { Terminal, XCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ConsoleMessage {
  id: string;
  type: 'error' | 'warning' | 'info' | 'log';
  message: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  title: string;
  icon: React.ReactElement;
}

const sampleMessages: ConsoleMessage[] = [
  {
    id: '1',
    type: 'error',
    message: 'Failed to load resource: net::ERR_CONNECTION_REFUSED',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'warning',
    message: 'React does not recognize the `someProps` prop on a DOM element.',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'info',
    message: 'Application started in development mode.',
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'log',
    message: 'Component rendered successfully.',
    timestamp: new Date(),
  },
];

function MessageIcon({ type }: { type: ConsoleMessage['type'] }) {
  switch (type) {
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <Terminal className="h-4 w-4 text-muted-foreground" />;
  }
}

export function ConsolePanel({ title, icon }: ConsolePanelProps) {
  const [messages] = useState<ConsoleMessage[]>(sampleMessages);

  return (
    <div className="h-full flex flex-col" title={title} icon={icon}>
      <div className="flex-none p-2 border-b">
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-2 text-sm p-2 rounded-sm",
                message.type === 'error' && "bg-red-500/10",
                message.type === 'warning' && "bg-yellow-500/10",
                message.type === 'info' && "bg-blue-500/10"
              )}
            >
              <MessageIcon type={message.type} />
              <div className="flex-1 space-y-1">
                <p className="font-mono">{message.message}</p>
                <p className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
