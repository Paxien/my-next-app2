'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
}

export const CodeEditor = forwardRef<any, CodeEditorProps>(({
  initialValue = '',
  language = 'typescript',
  onChange,
  className
}, ref) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<any>(null);

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue || '');
    onChange?.(newValue);
  };

  const insertAtCursor = (text: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      const selection = editor.getSelection();
      
      // If there's a selection, replace it
      if (!selection.isEmpty()) {
        editor.executeEdits('insert', [{
          range: selection,
          text: text,
          forceMoveMarkers: true
        }]);
      } else {
        // Otherwise insert at cursor
        editor.executeEdits('insert', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: text,
          forceMoveMarkers: true
        }]);
      }
      editor.focus();
    }
  };

  useEffect(() => {
    if (ref && typeof ref === 'object') {
      ref.current = {
        insertAtCursor,
        getValue: () => value,
        setValue: (newValue: string) => setValue(newValue)
      };
    }
  }, [ref, value]);

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
          editorRef.current = editor;
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
