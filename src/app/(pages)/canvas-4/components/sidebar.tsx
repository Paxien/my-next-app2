'use client';

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SidebarProps {
  children: React.ReactNode;
  side: 'left' | 'right';
}

const MIN_WIDTH = 48;
const ICON_THRESHOLD = 100;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 320;

export function Sidebar({ children, side }: SidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const isIconMode = width <= ICON_THRESHOLD;

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  }, [width]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    // Snap to icon mode if close enough
    if (width < ICON_THRESHOLD + 20) {
      setWidth(MIN_WIDTH);
    }
  }, [width]);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const delta = side === 'left' 
      ? e.clientX - startXRef.current
      : startXRef.current - e.clientX;

    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + delta));
    setWidth(newWidth);
  }, [isResizing, side]);

  const toggleExpand = () => {
    setWidth(width === MIN_WIDTH ? DEFAULT_WIDTH : MIN_WIDTH);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "h-full bg-background flex flex-col relative",
        "transition-[width] duration-300 ease-in-out",
        !isResizing && "transition-[width]",
        side === 'left' ? 'border-r' : 'border-l'
      )}
      style={{ width }}
    >
      <div className={cn(
        "flex-1 overflow-auto relative",
        isIconMode && "px-2 py-2"
      )}>
        {isIconMode ? (
          <div className="flex flex-col items-center space-y-4">
            {Array.isArray(children) ? children.map((child, index) => (
              <div key={index} className="w-8 h-8 rounded-md hover:bg-accent flex items-center justify-center">
                {child?.props?.icon || child?.props?.title?.charAt(0)}
              </div>
            )) : (
              <div className="w-8 h-8 rounded-md hover:bg-accent flex items-center justify-center">
                {children?.props?.icon || children?.props?.title?.charAt(0)}
              </div>
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {/* Resize handle */}
      {!isIconMode && (
        <div
          className={cn(
            "absolute top-0 bottom-0 group",
            "select-none touch-none",
            side === 'left' ? '-right-2' : '-left-2',
            "w-4 cursor-col-resize flex items-center justify-center",
            isResizing && "cursor-grabbing",
            // Show highlight area on hover
            "before:absolute before:top-0 before:bottom-0 before:w-1",
            "before:opacity-0 hover:before:opacity-100 before:transition-opacity",
            "before:bg-accent/50",
            side === 'left' ? 'before:right-2' : 'before:left-2',
          )}
          onMouseDown={startResizing}
        >
          {/* Visual grip indicator */}
          <div className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "text-muted-foreground/50"
          )}>
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggleExpand}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-sm",
          "bg-background border hover:bg-accent",
          "transition-colors duration-150",
          "z-10", // Ensure it's above the resize handle
          side === 'left' ? (
            "right-0 translate-x-1/2 border-r-0"
          ) : (
            "left-0 -translate-x-1/2 border-l-0"
          )
        )}
        aria-label={isIconMode ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {side === 'left' ? (
          isIconMode ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )
        ) : (
          isIconMode ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )
        )}
      </button>
    </aside>
  );
}
