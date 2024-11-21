'use client';

import { useState } from 'react';
import { CodeEditor } from './components/code-editor';
import { AIChat } from './components/ai-chat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const initialCode = `// Welcome to the code editor!
function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;

export default function CE1Page() {
  const [code, setCode] = useState(initialCode);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode) setCode(newCode);
  };

  const handleAIMessage = (message: string) => {
    // Handle AI messages here
    console.log('AI message:', message);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Header */}
      <div className="flex-none h-12 border-b bg-background flex items-center px-4">
        <h1 className="text-lg font-semibold">Code Editor</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <CodeEditor
              initialValue={code}
              onChange={handleCodeChange}
              className="h-full"
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={30}>
            <AIChat
              className="h-full"
              onSendMessage={handleAIMessage}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}