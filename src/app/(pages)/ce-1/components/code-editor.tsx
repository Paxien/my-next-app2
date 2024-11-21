'use client';

import { forwardRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
}

export const CodeEditor = forwardRef<unknown, CodeEditorProps>(({
  initialValue = '',
  language = 'typescript',
  onChange,
  className
}, ref) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue || '');
    onChange?.(newValue);
  };

  return (
    <div className={cn('w-full h-full min-h-[300px] border rounded-md', className)}>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={value}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
        onMount={(editor) => {
          if (ref && typeof ref === 'object') {
            ref.current = editor;
          }
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
