'use client';

import { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from "@/components/ui/button";
import { Eye, Settings2 } from "lucide-react";
import dynamic from 'next/dynamic';
import { LayoutSettings } from './components/layout-settings';
import type { LayoutSettings as LayoutSettingsType } from './components/layout-settings';

// Dynamic imports to prevent SSR
const AIChat = dynamic(() => 
  import('./components/ai-chat').then((mod) => mod.AIChat), 
  { ssr: false }
);

const CodeEditor = dynamic(() => 
  import('./components/code-editor').then((mod) => mod.CodeEditor), 
  { ssr: false }
);

const CodePreview = dynamic(() => 
  import('./components/code-preview').then((mod) => mod.CodePreview), 
  { ssr: false }
);

export default function CodeEditorPage() {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<LayoutSettingsType>({
    editorSize: 50,
    theme: 'system',
    fontSize: 14,
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleCodeUpdate = (newCode: string) => {
    setCode(newCode);
  };

  const handleSettingsChange = (newSettings: LayoutSettingsType) => {
    setSettings(newSettings);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={settings.editorSize}>
          <div className="h-full relative">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings2 className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
            <div className="h-full">
              <CodeEditor
                initialValue={code}
                language={language}
                onChange={handleCodeChange}
                className="h-full"
                options={{
                  fontSize: settings.fontSize,
                  wordWrap: settings.wordWrap ? 'on' : 'off',
                  minimap: { enabled: settings.minimap },
                  lineNumbers: settings.lineNumbers ? 'on' : 'off',
                }}
              />
            </div>
            {showPreview && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
                <CodePreview code={code} className="h-full" />
              </div>
            )}
            {showSettings && (
              <div className="absolute top-12 right-2 z-20">
                <LayoutSettings
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                  onClose={() => setShowSettings(false)}
                />
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={100 - settings.editorSize}>
          <div className="h-full">
            <AIChat
              onCodeUpdate={handleCodeUpdate}
              className="h-full"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}