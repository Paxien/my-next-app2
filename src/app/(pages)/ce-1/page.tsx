'use client';

import { useState, useRef } from 'react';
import { CodeEditor } from './components/code-editor';
import { AIChat } from './components/ai-chat';
import { CodePreview } from './components/code-preview';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialCode = `function Welcome() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Live Preview</h1>
      <p className="mb-4">Count: {count}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setCount(c => c + 1)}
      >
        Increment
      </button>
    </div>
  );
}`;

export default function CE1Page() {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('typescript');
  const editorRef = useRef<any>(null);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode) setCode(newCode);
  };

  const handleAIMessage = async (message: string) => {
    return {
      currentCode: code,
      language,
      editorInstance: editorRef.current
    };
  };

  const handleCodeUpdate = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="flex-none h-12 border-b bg-background flex items-center px-4">
        <h1 className="text-lg font-semibold">Code Editor</h1>
      </div>

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40}>
            <CodeEditor
              ref={editorRef}
              initialValue={code}
              language={language}
              onChange={handleCodeChange}
              className="h-full"
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={35}>
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <div className="flex-none px-4 pt-2">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="chat">AI Chat</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="flex-1 p-4">
                <CodePreview code={code} className="h-full" />
              </TabsContent>
              
              <TabsContent value="chat" className="flex-1">
                <AIChat
                  className="h-full"
                  onSendMessage={handleAIMessage}
                  onCodeUpdate={handleCodeUpdate}
                  currentCode={code}
                  language={language}
                />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}