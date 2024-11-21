'use client';

import { Button } from "@/components/ui/button";
import { ArrowDown, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  code: string;
  language?: string;
  onInsert: (code: string) => void;
}

export function CodeSnippet({ code, language = 'typescript', onInsert }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsert(code);
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={handleInsert}
          title="Insert at cursor"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      <pre className={cn(
        `language-${language}`,
        "rounded-md bg-muted p-4 overflow-x-auto"
      )}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
