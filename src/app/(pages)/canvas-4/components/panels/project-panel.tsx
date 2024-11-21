'use client';

import { ScrollArea } from "@/components/scroll-area";
import { Folder, ChevronRight, File, FolderOpen, FolderTree } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: ProjectItem[];
}

interface ProjectPanelProps {
  title?: string;
  icon?: React.ReactNode;
}

const sampleData: ProjectItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          { id: '3', name: 'Button.tsx', type: 'file' },
          { id: '4', name: 'Input.tsx', type: 'file' },
        ],
      },
      { id: '5', name: 'App.tsx', type: 'file' },
      { id: '6', name: 'index.tsx', type: 'file' },
    ],
  },
  {
    id: '7',
    name: 'public',
    type: 'folder',
    children: [
      { id: '8', name: 'favicon.ico', type: 'file' },
      { id: '9', name: 'logo.svg', type: 'file' },
    ],
  },
];

function ProjectItem({ item, depth = 0 }: { item: ProjectItem; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.type === 'folder' && item.children?.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center w-full px-2 py-1 text-sm hover:bg-accent/50 rounded-sm",
          "transition-colors"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <span className="mr-1.5">
          {hasChildren ? (
            <span className="flex items-center">
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "transform rotate-90"
                )}
              />
              {isOpen ? (
                <FolderOpen className="h-4 w-4 text-yellow-400" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-400" />
              )}
            </span>
          ) : (
            <File className="h-4 w-4 ml-5 text-muted-foreground" />
          )}
        </span>
        {item.name}
      </button>
      {hasChildren && isOpen && (
        <div>
          {item.children?.map((child) => (
            <ProjectItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectPanel({ 
  title = "Project",
  icon = <FolderTree className="h-4 w-4" />
}: ProjectPanelProps) {
  return (
    <div className="h-full flex flex-col" title={title}>
      <div className="flex-none p-2 border-b">
        <h3 className="font-medium text-sm flex items-center">
          {icon}
          {title}
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sampleData.map((item) => (
            <ProjectItem key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
