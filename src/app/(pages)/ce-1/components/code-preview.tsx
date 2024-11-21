'use client';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, AlertCircle } from 'lucide-react';
import { ErrorBoundary, ErrorFallback } from '@/components/ui/error-boundary';

interface CodePreviewProps {
  code: string;
  className?: string;
  language?: string;
}

export function CodePreview({
  code,
  language = 'tsx',
  className,
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const scope = {
    ...React,
    ...ReactDOM,
    ...LucideIcons,
    Button,
    Input,
    Label,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  };

  const handleError = (err: Error) => {
    console.error('Preview Error:', err);
    setError(err.message);
    setShowError(true);
  };

  const extractCode = (fullCode: string): string => {
    try {
      if (!fullCode.trim()) return '';

      // For TSX/JSX, try to extract the component or element
      if (language === 'tsx' || language === 'jsx') {
        // If it's a complete component definition
        if (fullCode.includes('export') && fullCode.includes('function')) {
          const match = fullCode.match(/return\s*\(\s*(<[\s\S]*?>[\s\S]*?<\/[\s\S]*?>|\S+)\s*\)/);
          return match ? match[1] : fullCode;
        }
        
        // If it's just JSX/TSX markup
        if (fullCode.trim().startsWith('<')) {
          return fullCode;
        }
      }

      return fullCode;
    } catch (err) {
      handleError(err as Error);
      return '';
    }
  };

  const previewContent = useMemo(() => {
    try {
      if (!code) return null;

      const extractedCode = extractCode(code);
      if (!extractedCode) return null;

      if (language === 'tsx' || language === 'jsx') {
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <LiveProvider
              code={extractedCode}
              scope={scope}
              noInline={extractedCode.includes('render(')}
            >
              <div className="preview-content p-4">
                <LivePreview />
                {showError && error && (
                  <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
                    <p className="text-sm font-medium">Error: {error}</p>
                  </div>
                )}
              </div>
            </LiveProvider>
          </ErrorBoundary>
        );
      }

      if (language === 'html') {
        return (
          <div
            className="preview-content p-4"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        );
      }

      if (language === 'css') {
        return (
          <div className="preview-content p-4">
            <style>{code}</style>
            <div className="styled-content">
              {/* Add sample content for CSS preview */}
              <h1>Sample Content</h1>
              <p>This content is styled by your CSS</p>
            </div>
          </div>
        );
      }

      return (
        <div className="preview-content p-4">
          <pre className="whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      );
    } catch (err) {
      handleError(err as Error);
      return null;
    }
  }, [code, language, error, showError]);

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      <div className="h-12 border-b flex items-center justify-between px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}
          className="w-full"
        >
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
        {error && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowError(!showError)}
            className={cn(
              "h-8 px-2",
              showError && "text-destructive"
            )}
          >
            {showError ? <X className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'preview' ? (
          <div className="h-full">
            {previewContent}
          </div>
        ) : (
          <div className="p-4">
            <pre className="whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodePreview;
