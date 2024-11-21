'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, GripVertical, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

type PanelProps = {
  title: string;
  icon: React.ReactNode;
} & Record<string, any>;

interface SidebarProps {
  children: React.ReactElement | React.ReactElement[];
  side: 'left' | 'right';
  defaultPanel?: number;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  onResize?: (width: number, height?: number) => void;
  isBottomPanel?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
}

const COLLAPSED_WIDTH = 40;
const ICON_MODE_WIDTH = 80;
const COMPACT_MODE_WIDTH = 160;
const DEFAULT_WIDTH = 240;

export function Sidebar({
  children,
  side = 'left',
  defaultPanel = 0,
  defaultWidth = DEFAULT_WIDTH,
  minWidth = ICON_MODE_WIDTH,
  maxWidth = 480,
  defaultHeight,
  minHeight,
  maxHeight,
  onResize,
  isBottomPanel = false,
  onCollapse,
  isCollapsed = false,
}: SidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight || 300);
  const [isResizing, setIsResizing] = useState(false);
  const [isVerticalResizing, setIsVerticalResizing] = useState(false);
  const [activePanel, setActivePanel] = useState(defaultPanel);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'full' | 'compact' | 'icon'>(
    width >= COMPACT_MODE_WIDTH ? 'full' : width >= ICON_MODE_WIDTH ? 'compact' : 'icon'
  );
  const lastWidthRef = useRef(defaultWidth);
  const lastHeightRef = useRef(defaultHeight || 300);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initialMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const parentHeight = useRef<number>(0);

  // Track parent height for bottom panel
  useEffect(() => {
    if (sidebarRef.current && isBottomPanel) {
      const updateParentHeight = () => {
        parentHeight.current = sidebarRef.current?.parentElement?.clientHeight || 0;
      };
      updateParentHeight();
      
      const resizeObserver = new ResizeObserver(updateParentHeight);
      if (sidebarRef.current.parentElement) {
        resizeObserver.observe(sidebarRef.current.parentElement);
      }
      
      return () => resizeObserver.disconnect();
    }
  }, [isBottomPanel]);

  // Handle collapsed state dimensions
  useEffect(() => {
    if (isCollapsed) {
      lastWidthRef.current = width;
      lastHeightRef.current = height;
    } else {
      requestAnimationFrame(() => {
        setWidth(lastWidthRef.current);
        if (isBottomPanel) {
          setHeight(lastHeightRef.current);
        }
      });
    }
  }, [isCollapsed, width, height, isBottomPanel]);

  // Update display mode based on width
  useEffect(() => {
    if (!isCollapsed) {
      if (width >= COMPACT_MODE_WIDTH) {
        setDisplayMode('full');
      } else if (width >= ICON_MODE_WIDTH) {
        setDisplayMode('compact');
      } else {
        setDisplayMode('icon');
      }
    }
  }, [width, isCollapsed]);

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

        // Snap to predefined widths when close
        const snapThreshold = 10; // Reduced from 20 for more precise control
        if (Math.abs(newWidth - ICON_MODE_WIDTH) < snapThreshold) {
          newWidth = ICON_MODE_WIDTH;
        } else if (Math.abs(newWidth - COMPACT_MODE_WIDTH) < snapThreshold) {
          newWidth = COMPACT_MODE_WIDTH;
        } else if (Math.abs(newWidth - DEFAULT_WIDTH) < snapThreshold) {
          newWidth = DEFAULT_WIDTH;
        }

        newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
        lastWidthRef.current = newWidth;
        setWidth(newWidth);
        onResize?.(newWidth);
        initialMousePosRef.current = { x: e.clientX, y: e.clientY };
      } else if (isVerticalResizing && sidebarRef.current && defaultHeight !== undefined) {
        const mouseDelta = e.clientY - initialMousePosRef.current.y;
        let newHeight = height - mouseDelta;
        
        // Calculate available space considering minimum top section height
        const maxAvailableHeight = parentHeight.current - 150; // 150px min for top section
        
        // Apply constraints with smooth boundaries
        newHeight = Math.min(
          Math.max(newHeight, minHeight || 150),
          Math.min(maxHeight || 600, maxAvailableHeight)
        );
        
        setHeight(newHeight);
        onResize?.(width, newHeight);
        initialMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isResizing, isVerticalResizing, side, width, height, minWidth, maxWidth, minHeight, maxHeight, defaultHeight, onResize]
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
    if (onCollapse) {
      if (!isCollapsed) {
        lastWidthRef.current = width;
      }
      onCollapse(!isCollapsed);
    }
  }, [isCollapsed, width, onCollapse]);

  const childrenArray = Array.isArray(children) ? children : [children];
  const currentPanel = childrenArray[activePanel];
  const currentPanelProps = React.isValidElement(currentPanel) ? currentPanel.props : null;

  const renderContent = () => {
    if (isCollapsed) {
      return (
        <div className="flex flex-col gap-1 p-1">
          {childrenArray.map((child, index) => {
            if (!React.isValidElement(child)) return null;
            return (
              <button
                key={index}
                className={cn(
                  'p-2 rounded-md hover:bg-accent/50 transition-colors',
                  activePanel === index && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setActivePanel(index)}
              >
                {child.props.icon}
              </button>
            );
          })}
        </div>
      );
    }

    if (displayMode === 'icon') {
      return (
        <div className="flex flex-col gap-1 p-1">
          {childrenArray.map((child, index) => {
            if (!React.isValidElement(child)) return null;
            return (
              <button
                key={index}
                className={cn(
                  'p-2 rounded-md hover:bg-accent/50 transition-colors',
                  activePanel === index && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setActivePanel(index)}
              >
                {child.props.icon}
              </button>
            );
          })}
        </div>
      );
    }

    if (displayMode === 'compact') {
      return (
        <div className="flex flex-col gap-1 p-1">
          {childrenArray.map((child, index) => {
            if (!React.isValidElement(child)) return null;
            return (
              <button
                key={index}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors w-full',
                  activePanel === index && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setActivePanel(index)}
              >
                {child.props.icon}
                <span className="text-xs truncate">{child.props.title}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return childrenArray[activePanel];
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'flex flex-col bg-background border-muted relative',
        'transition-all duration-200 ease-in-out',
        side === 'left' ? 'border-r' : 'border-l',
        defaultHeight !== undefined && 'border-t',
        (isResizing || isVerticalResizing) && 'select-none'
      )}
      style={{
        width: isCollapsed ? `${COLLAPSED_WIDTH}px` : width,
        height: defaultHeight !== undefined ? height : '100%',
        transition: isResizing || isVerticalResizing ? 'none' : 'all 0.2s ease-out',
      }}
    >
      {/* Header */}
      <div className="flex items-center h-10 min-h-[2.5rem] border-b border-muted px-2">
        {!isCollapsed && displayMode !== 'icon' && (
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md w-full",
                "hover:bg-accent/50 transition-colors"
              )}
            >
              {currentPanelProps?.icon}
              <span className={cn(
                "flex-1 text-left transition-opacity",
                displayMode === 'compact' && "text-xs"
              )}>
                {displayMode === 'compact' 
                  ? currentPanelProps?.title.slice(0, 3) 
                  : currentPanelProps?.title}
              </span>
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
              <div className={cn(
                "absolute top-full mt-1 py-1 bg-background border rounded-md shadow-lg z-50",
                side === 'left' ? "left-0" : "right-0",
                "w-full"
              )}>
                {childrenArray.map((child, index) => {
                  if (!React.isValidElement(child)) return null;
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
                      {child.props.icon}
                      <span className="flex-1 text-left">{child.props.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Collapse button - only show in top panel */}
        {!isBottomPanel && (
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
        )}
      </div>

      {/* Content */}
      <div className={cn(
        'flex-1 min-h-0 overflow-auto',
        !isCollapsed && 'relative'
      )}>
        {renderContent()}
      </div>

      {/* Horizontal resize handle */}
      {!isCollapsed && !isBottomPanel && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center z-50',
            'transition-opacity duration-200',
            side === 'left' ? '-right-2' : '-left-2',
            isCollapsed && 'opacity-0 pointer-events-none'
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
