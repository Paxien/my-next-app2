'use client';

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  children: React.ReactNode;
  side: 'left' | 'right';
}

const widthMap = {
  collapsed: '48px',
  normal: '320px',
};

export function Sidebar({ children, side }: SidebarProps) {
  const [width, setWidth] = useState<keyof typeof widthMap>('normal');

  const toggleWidth = () => {
    setWidth((current) => current === 'collapsed' ? 'normal' : 'collapsed');
  };

  return (
    <aside
      className={cn(
        "h-full bg-background flex flex-col",
        "transition-[width] duration-300 ease-in-out",
        side === 'left' ? 'border-r' : 'border-l'
      )}
      style={{ width: widthMap[width] }}
    >
      <div className="flex h-12 items-center px-3 border-b">
        <button
          onClick={toggleWidth}
          className="p-1 hover:bg-accent rounded-md"
          aria-label={width === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {side === 'left' ? (
            width === 'collapsed' ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )
          ) : (
            width === 'collapsed' ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </button>
      </div>
      <div className={cn(
        "flex-1 overflow-auto",
        width === 'collapsed' && "hidden"
      )}>
        {children}
      </div>
    </aside>
  );
}
