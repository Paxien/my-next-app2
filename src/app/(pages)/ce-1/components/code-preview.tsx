'use client';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  className?: string;
}

export function CodePreview({ code, className }: CodePreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [transformedCode, setTransformedCode] = useState(code);

  // Transform the code when it changes
  useEffect(() => {
    try {
      // Remove imports as they're not supported in react-live
      let newCode = code.replace(/import\s+.*?;?\n/g, '');
      
      // If the code exports something, wrap it in a render function
      if (newCode.includes('export')) {
        newCode = newCode.replace(/export\s+default\s+/, '');
        newCode = `render(${newCode})`;
      }
      
      setTransformedCode(newCode);
      setError(null);
    } catch (err) {
      setError('Error transforming code');
      setTransformedCode(code);
    }
  }, [code]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <LiveProvider code={transformedCode} noInline>
        <div className="flex-1 p-4 bg-white rounded-md shadow overflow-auto">
          <LivePreview />
        </div>
        
        {error && (
          <div className="text-sm text-red-500 p-2 mt-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <LiveError 
          className="text-sm text-red-500 p-2 mt-2 bg-red-50 rounded-md"
        />
      </LiveProvider>
    </div>
  );
}
