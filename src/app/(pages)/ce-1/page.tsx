'use client';

import { useState, useEffect, useRef } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from "@/components/ui/button";
import { Eye, Settings2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from 'next/dynamic';
import { LayoutSettings } from './components/layout-settings';
import type { LayoutSettings as LayoutSettingsType } from './components/layout-settings';
import { FileViewer } from './components/file-viewer';
import { AIChat } from './components/ai-chat';
import cn from 'classnames';

// Dynamic imports to prevent SSR
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
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isFileViewerCollapsed, setIsFileViewerCollapsed] = useState(false);
  const [layout, setLayout] = useState<'default' | 'preview' | 'split'>('default');
  const editorRef = useRef<any>(null);

  // Track panel sizes independently
  const [leftPanelSize, setLeftPanelSize] = useState(20);
  const [rightPanelSize, setRightPanelSize] = useState(20);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleCodeUpdate = (newCode: string) => {
    if (editorRef.current) {
      editorRef.current.insertAtCursor(newCode);
    }
  };

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    // In a real implementation, this would load the file contents
    setCode(`// Contents of ${path}`);
  };

  const toggleLayout = () => {
    setLayout(current => {
      switch (current) {
        case 'default':
          return 'preview';
        case 'preview':
          return 'split';
        case 'split':
          return 'default';
        default:
          return 'default';
      }
    });
    setShowPreview(true);
  };

  if (!mounted) {
    return null;
  }

  const getLanguageFromCode = (code: string): string => {
    if (code.includes('import React') || code.includes('jsx') || code.includes('tsx')) {
      return 'tsx';
    }
    if (code.includes('<!DOCTYPE html>') || code.includes('<html>')) {
      return 'html';
    }
    if (code.includes('{') && code.includes('}') && code.includes(':')) {
      return 'css';
    }
    return 'typescript';
  };

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
      {/* Left Panel Group */}
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
        {/* File Viewer */}
        {!isFileViewerCollapsed && (
          <>
            <ResizablePanel
              defaultSize={leftPanelSize}
              minSize={15}
              maxSize={30}
              onResize={setLeftPanelSize}
              className="min-w-[200px]"
            >
              <div className="h-full border-r">
                <div className="h-12 border-b flex items-center justify-between px-4">
                  <h2 className="font-semibold text-sm">Files</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFileViewerCollapsed(true)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                <FileViewer
                  onFileSelect={handleFileSelect}
                  className="h-[calc(100%-3rem)]"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}

        {/* Center and Right Panel Group */}
        <ResizablePanel defaultSize={isFileViewerCollapsed ? 100 : 100 - leftPanelSize}>
          <ResizablePanelGroup direction="horizontal">
            {/* Main Editor Panel */}
            <ResizablePanel 
              defaultSize={100 - rightPanelSize} 
              className="h-full"
            >
              <div className="h-full flex flex-col">
                {/* Toolbar */}
                <div className="h-12 border-b flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    {isFileViewerCollapsed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFileViewerCollapsed(false)}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    <span className="text-sm font-medium">
                      {selectedFile || 'Untitled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLayout}
                      className={cn(
                        "h-8",
                        (layout === 'preview' || layout === 'split') && "bg-accent"
                      )}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {layout === 'default' ? 'Preview' : layout === 'preview' ? 'Split' : 'Editor'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="h-8"
                    >
                      <Settings2 className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Editor/Preview Area */}
                <div className="flex-1 min-h-0">
                  <ResizablePanelGroup direction={layout === 'split' ? 'horizontal' : 'vertical'}>
                    <ResizablePanel
                      defaultSize={layout === 'preview' ? 0 : layout === 'split' ? 50 : 100}
                      className={cn(layout === 'preview' && 'hidden')}
                    >
                      <CodeEditor
                        initialValue={code}
                        language={language}
                        onChange={handleCodeChange}
                        ref={editorRef}
                        className="h-full"
                        options={{
                          fontSize: 14,
                          wordWrap: 'on',
                          minimap: { enabled: true },
                          lineNumbers: 'on',
                        }}
                      />
                    </ResizablePanel>

                    {(layout === 'preview' || layout === 'split') && (
                      <>
                        {layout === 'split' && <ResizableHandle withHandle />}
                        <ResizablePanel
                          defaultSize={layout === 'preview' ? 100 : 50}
                        >
                          <CodePreview
                            code={code}
                            language={getLanguageFromCode(code)}
                            className="h-full border-l"
                          />
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
              </div>
            </ResizablePanel>

            {/* AI Chat Panel */}
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={rightPanelSize}
              minSize={15}
              maxSize={40}
              onResize={setRightPanelSize}
              className="min-w-[250px]"
            >
              <AIChat
                onCodeUpdate={handleCodeUpdate}
                className="h-full border-l"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-50">
          <LayoutSettings
            settings={{
              theme: 'system',
              fontSize: 14,
              wordWrap: true,
              minimap: true,
              lineNumbers: true,
            }}
            onSettingsChange={() => {}}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}
    </div>
  );
}