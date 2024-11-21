'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
}

interface FileViewerProps {
  onFileSelect: (path: string) => void;
  className?: string;
}

export function FileViewer({ onFileSelect, className }: FileViewerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    // In a real implementation, this would fetch the file structure from your backend
    const mockFiles: FileItem[] = [
      {
        name: 'src',
        path: '/src',
        type: 'directory',
        children: [
          {
            name: 'app',
            path: '/src/app',
            type: 'directory',
            children: [
              {
                name: 'page.tsx',
                path: '/src/app/page.tsx',
                type: 'file'
              },
              {
                name: 'layout.tsx',
                path: '/src/app/layout.tsx',
                type: 'file'
              }
            ]
          },
          {
            name: 'components',
            path: '/src/components',
            type: 'directory',
            children: [
              {
                name: 'ui',
                path: '/src/components/ui',
                type: 'directory',
                children: [
                  {
                    name: 'button.tsx',
                    path: '/src/components/ui/button.tsx',
                    type: 'file'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    setFiles(mockFiles);
  }, []);

  const toggleDir = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const FileTreeItem = ({ item, depth = 0 }: { item: FileItem; depth?: number }) => {
    const isExpanded = expandedDirs.has(item.path);
    const isDirectory = item.type === 'directory';

    return (
      <div>
        <div
          className={cn(
            "flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm",
            "transition-colors"
          )}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => isDirectory ? toggleDir(item.path) : onFileSelect(item.path)}
        >
          {isDirectory ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <Folder className="h-4 w-4 shrink-0 text-blue-500" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <FileText className="h-4 w-4 shrink-0 text-gray-500" />
            </>
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {isDirectory && isExpanded && item.children?.map((child, index) => (
          <FileTreeItem key={child.path + index} item={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="p-2 border-b bg-muted/50">
        <h3 className="font-semibold">Project Files</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-2">
          {files.map((file, index) => (
            <FileTreeItem key={file.path + index} item={file} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
