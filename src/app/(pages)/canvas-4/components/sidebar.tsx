'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, GripHorizontal, GripVertical, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanelProps {
  title: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  children: React.ReactElement<PanelProps> | React.ReactElement<PanelProps>[];
  side: 'left' | 'right';
  defaultPanel?: number;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  onResize?: (width: number, height?: number) => void;
}

const COLLAPSED_WIDTH = 40;

export function Sidebar({
  children,
  side = 'left',
  defaultPanel = 0,
  defaultWidth = 240,
  minWidth = 240,
  maxWidth = 480,
  defaultHeight,
  minHeight,
  maxHeight,
  onResize,
}: SidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight || 300);
  const [isResizing, setIsResizing] = useState(false);
  const [isVerticalResizing, setIsVerticalResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState(defaultPanel);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastWidthRef = useRef(defaultWidth);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initialMousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    initialMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const startVerticalResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsVerticalResizing(true);
    initialMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    setIsVerticalResizing(false);
    initialMousePosRef.current = null;
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!initialMousePosRef.current) return;

      if (isResizing && sidebarRef.current) {
        const mouseDelta = e.clientX - initialMousePosRef.current.x;
        let newWidth: number;

        if (side === 'left') {
          newWidth = width + mouseDelta;
        } else {
          newWidth = width - mouseDelta;
        }

        // Handle collapsing
        if ((side === 'left' && newWidth < minWidth / 2) || 
            (side === 'right' && newWidth < minWidth / 2)) {
          setIsCollapsed(true);
          return;
        }

        // Handle expanding
        if (isCollapsed) {
          setIsCollapsed(false);
          newWidth = lastWidthRef.current;
        } else {
          newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
          lastWidthRef.current = newWidth;
        }

        setWidth(newWidth);
        onResize?.(newWidth);
        initialMousePosRef.current = { x: e.clientX, y: e.clientY };
      } else if (isVerticalResizing && sidebarRef.current && defaultHeight !== undefined) {
        const mouseDelta = e.clientY - initialMousePosRef.current.y;
        let newHeight = height - mouseDelta;
        
        newHeight = Math.min(Math.max(newHeight, minHeight || 150), maxHeight || 600);
        setHeight(newHeight);
        onResize?.(width, newHeight);
        initialMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isResizing, isVerticalResizing, side, width, height, minWidth, maxWidth, minHeight, maxHeight, defaultHeight, onResize, isCollapsed]
  );

  useEffect(() => {
    if (isResizing || isVerticalResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, isVerticalResizing, resize, stopResizing]);

  const toggleCollapse = useCallback(() => {
    if (!isCollapsed) {
      lastWidthRef.current = width;
    }
    setIsCollapsed(!isCollapsed);
    onResize?.(isCollapsed ? lastWidthRef.current : COLLAPSED_WIDTH);
  }, [isCollapsed, width, onResize]);

  const childrenArray = Array.isArray(children) ? children : [children];
  const currentPanel = childrenArray[activePanel];
  const currentPanelProps = React.isValidElement<PanelProps>(currentPanel) ? currentPanel.props : null;

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'flex flex-col bg-background border-muted relative',
        side === 'left' ? 'border-r' : 'border-l',
        defaultHeight !== undefined && 'border-t',
        (isResizing || isVerticalResizing) && 'select-none'
      )}
      style={{
        width: isCollapsed ? `${COLLAPSED_WIDTH}px` : width,
        height: defaultHeight !== undefined ? height : '100%',
        transition: isResizing || isVerticalResizing ? 'none' : 'width 0.2s ease-out',
      }}
    >
      {/* Header with dropdown */}
      <div className="flex items-center h-10 min-h-[2.5rem] border-b border-muted px-2">
        {!isCollapsed && (
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md w-full",
                "hover:bg-accent/50 transition-colors"
              )}
            >
              {currentPanelProps?.icon}
              <span className="flex-1 text-left">{currentPanelProps?.title}</span>
              {childrenArray.length > 1 && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isDropdownOpen && "transform rotate-180"
                  )}
                />
              )}
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && childrenArray.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-background border rounded-md shadow-lg z-50">
                {childrenArray.map((child, index) => {
                  if (!React.isValidElement<PanelProps>(child)) return null;
                  const { title, icon } = child.props;
                  return (
                    <button
                      key={index}
                      className={cn(
                        'flex items-center gap-2 w-full px-3 py-1.5 text-sm',
                        'hover:bg-accent/50 transition-colors',
                        activePanel === index && 'bg-accent text-accent-foreground'
                      )}
                      onClick={() => {
                        setActivePanel(index);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {icon}
                      {title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Collapse button */}
        <button
          className={cn(
            'ml-auto p-1 rounded-md hover:bg-accent',
            isCollapsed && 'ml-0 w-full flex justify-center'
          )}
          onClick={toggleCollapse}
        >
          {side === 'left' ? (
            isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )
          ) : isCollapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className={cn(
        'flex-1 min-h-0 overflow-auto',
        !isCollapsed && 'relative'
      )}>
        {!isCollapsed && childrenArray[activePanel]}
      </div>

      {/* Horizontal resize handle */}
      {!isCollapsed && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center z-50',
            side === 'left' ? '-right-2' : '-left-2'
          )}
          onMouseDown={startResizing}
        >
          <div className={cn(
            'w-2 h-full flex items-center justify-center',
            'bg-muted/20 hover:bg-accent/50 transition-colors',
            isResizing && 'bg-accent/50'
          )}>
            <GripVertical 
              className={cn(
                'h-3 w-3 text-muted-foreground/50',
                'hover:text-muted-foreground transition-colors',
                isResizing && 'text-muted-foreground'
              )} 
            />
          </div>
        </div>
      )}

      {/* Vertical resize handle */}
      {!isCollapsed && defaultHeight !== undefined && (
        <div
          className={cn(
            'absolute left-0 right-0 h-2 -top-1 cursor-ns-resize flex items-center justify-center',
            'bg-muted/20 hover:bg-accent/50 transition-colors',
            isVerticalResizing && 'bg-accent/50'
          )}
          onMouseDown={startVerticalResizing}
        >
          <GripHorizontal 
            className={cn(
              'h-3 w-3 text-muted-foreground/50',
              'hover:text-muted-foreground transition-colors',
              isVerticalResizing && 'text-muted-foreground'
            )} 
          />
        </div>
      )}
    </div>
  );
}
