'use client';

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReactElement } from "react";

interface PanelProps {
  title: string;
  icon: ReactElement;
}

interface SidebarProps {
  children: ReactElement<PanelProps>[];
  side: 'left' | 'right';
  defaultPanel?: number;
}

const MIN_WIDTH = 48;
const ICON_THRESHOLD = 100;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 320;

export function Sidebar({ children, side, defaultPanel = 0 }: SidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [activePanel, setActivePanel] = useState(defaultPanel);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const lastWidthRef = useRef<number>(DEFAULT_WIDTH);
  const resizingTypeRef = useRef<'handle' | 'toggle' | null>(null);

  const isIconMode = width <= ICON_THRESHOLD;

  const startResizing = useCallback((e: React.MouseEvent, type: 'handle' | 'toggle') => {
    e.preventDefault();
    e.stopPropagation(); // Prevent toggle when starting resize from toggle button
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = isCollapsed ? MIN_WIDTH : width;
    resizingTypeRef.current = type;
    if (isCollapsed) {
      setIsCollapsed(false);
      setWidth(MIN_WIDTH);
    }
  }, [width, isCollapsed]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    resizingTypeRef.current = null;
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    let delta: number;
    if (resizingTypeRef.current === 'toggle') {
      // When resizing from toggle button, reverse the direction for more intuitive dragging
      delta = side === 'left'
        ? startXRef.current - e.clientX
        : e.clientX - startXRef.current;
    } else {
      delta = side === 'left'
        ? e.clientX - startXRef.current
        : startXRef.current - e.clientX;
    }

    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + delta));
    setWidth(newWidth);
    
    if (newWidth > MIN_WIDTH) {
      lastWidthRef.current = newWidth;
    }
  }, [isResizing, side]);

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    // Only toggle if we're not resizing
    if (!isResizing) {
      if (isCollapsed) {
        setIsCollapsed(false);
        setWidth(lastWidthRef.current);
      } else {
        lastWidthRef.current = width;
        setIsCollapsed(true);
        setWidth(MIN_WIDTH);
      }
    }
  }, [isResizing, isCollapsed, width]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const panels = Array.isArray(children) ? children : [children];
  const activeChild = panels[activePanel];

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "h-full bg-background flex flex-col relative",
        !isResizing && "transition-[width] duration-200 ease-in-out",
        side === 'left' ? 'border-r' : 'border-l'
      )}
      style={{ width }}
    >
      {/* Panel Selection Header */}
      {!isIconMode && (
        <div className="h-10 min-h-[40px] flex items-center px-2 border-b relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full px-2 py-1 text-sm hover:bg-accent rounded-sm"
          >
            <span className="font-medium">{activeChild.props.title}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-background border rounded-sm shadow-md z-50 py-1 mt-1">
              {panels.map((panel, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex items-center w-full px-3 py-1.5 text-sm",
                    "hover:bg-accent/50",
                    activePanel === index && "bg-accent"
                  )}
                  onClick={() => {
                    setActivePanel(index);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="w-5 h-5 mr-2 flex items-center justify-center">
                    {panel.props.icon}
                  </span>
                  {panel.props.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Panel Content */}
      <div className={cn(
        "flex-1 overflow-auto relative",
        isIconMode && "px-2 py-2"
      )}>
        {isIconMode ? (
          <div className="flex flex-col items-center space-y-4">
            {panels.map((panel, index) => (
              <button
                key={index}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  "hover:bg-accent/50 transition-colors",
                  activePanel === index && "bg-accent"
                )}
                onClick={() => setActivePanel(index)}
                title={panel.props.title}
              >
                {panel.props.icon}
              </button>
            ))}
          </div>
        ) : (
          activeChild
        )}
      </div>

      {/* Resize handle */}
      <div
        className={cn(
          "absolute top-0 bottom-0 group",
          "select-none touch-none",
          side === 'left' ? '-right-2' : '-left-2',
          "w-4 cursor-col-resize flex items-center justify-center",
          isResizing && resizingTypeRef.current === 'handle' && "cursor-grabbing",
          "hover:z-50",
          {
            'opacity-0 hover:opacity-100 transition-opacity': isCollapsed,
          }
        )}
        onMouseDown={(e) => startResizing(e, 'handle')}
      >
        <div className={cn(
          "absolute top-0 bottom-0 w-1 -z-10",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "bg-accent/50",
          side === 'left' ? 'right-2' : 'left-2'
        )} />
        <div className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "text-muted-foreground/50 bg-background rounded-md p-0.5",
          "shadow-sm border"
        )}>
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Toggle button */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          "z-10",
          side === 'left' ? (
            isCollapsed ? '-right-10' : '-right-3'
          ) : (
            isCollapsed ? '-left-10' : '-left-3'
          )
        )}
      >
        <button
          onClick={toggleExpand}
          onMouseDown={(e) => startResizing(e, 'toggle')}
          className={cn(
            "p-1.5 rounded-sm",
            "bg-background border hover:bg-accent",
            "transition-colors duration-150",
            "shadow-sm",
            isResizing && resizingTypeRef.current === 'toggle' && "cursor-grabbing",
            !isResizing && "cursor-col-resize"
          )}
        >
          {side === 'left' ? (
            isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          ) : (
            isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
