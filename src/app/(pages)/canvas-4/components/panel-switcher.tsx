'use client';

import { useState } from "react";

export type PanelType = 'inspector' | 'hierarchy' | 'ai-chat';

interface Panel {
  type: PanelType;
  label: string;
  content: React.ReactNode;
}

interface PanelSwitcherProps {
  panels: Panel[];
  defaultPanel?: PanelType;
}

export function PanelSwitcher({ panels, defaultPanel }: PanelSwitcherProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(defaultPanel || panels[0]?.type || 'inspector');
  const [isOpen, setIsOpen] = useState(false);

  const currentPanel = panels.find(panel => panel.type === activePanel);

  if (!panels.length) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex justify-between items-center"
        >
          <span>{currentPanel?.label || 'Select panel'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%-1rem)] mt-1 bg-white dark:bg-gray-900 border rounded-md shadow-lg z-10">
            {panels.map((panel) => (
              <button
                key={panel.type}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setActivePanel(panel.type);
                  setIsOpen(false);
                }}
              >
                {panel.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {currentPanel?.content}
      </div>
    </div>
  );
}
