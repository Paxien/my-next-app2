'use client';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  className?: string;
}

export function CodePreview({ code, className }: CodePreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn('w-full h-full', className)}>
      <LiveProvider code={code}>
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="overflow-auto">
            <LiveEditor className="min-h-[300px] p-4" />
            <LiveError />
          </div>
          <div className="border rounded-md p-4 bg-background">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
    </div>
  );
}

export default CodePreview;
