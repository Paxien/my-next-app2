'use client';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  className?: string;
}

export function CodePreview({ code, className }: CodePreviewProps) {
  const [showError, setShowError] = useState(true);

  // Transform the code to make it work with react-live
  const transformCode = (code: string) => {
    // Remove imports as they're not supported in react-live
    code = code.replace(/import\s+.*?;?\n/g, '');
    
    // If the code exports something, wrap it in a render function
    if (code.includes('export')) {
      code = code.replace(/export\s+default\s+/, '');
      code = `render(${code})`;
    }
    
    return code;
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <LiveProvider code={transformCode(code)} noInline>
        <div className="flex-1 p-4 bg-white rounded-md shadow overflow-auto">
          <LivePreview />
        </div>
        
        {showError && (
          <LiveError 
            className="text-sm text-red-500 p-2 mt-2 bg-red-50 rounded-md"
            onClick={() => setShowError(false)}
          />
        )}
      </LiveProvider>
    </div>
  );
}
