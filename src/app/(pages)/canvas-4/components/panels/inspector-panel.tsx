'use client';

import { ScrollArea } from "@/components/scroll-area";
import { Settings } from "lucide-react";

interface NodeChanges {
  position?: { x: number; y: number };
  style?: { background?: string; borderWidth?: number };
}

interface InspectorPanelProps {
  node?: {
    id: string;
    position: { x: number; y: number };
    style?: { background?: string; borderWidth?: number };
  } | null;
  onChange?: (changes: NodeChanges) => void;
}

export function InspectorPanel({ node, onChange }: InspectorPanelProps) {
  if (!node) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a node to inspect its properties
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && onChange) {
      onChange({
        position: {
          ...node.position,
          [axis]: numValue
        }
      });
    }
  };

  const handleStyleChange = (property: 'background' | 'borderWidth', value: string) => {
    if (onChange) {
      onChange({
        style: {
          ...node.style,
          [property]: property === 'borderWidth' ? parseInt(value) : value
        }
      });
    }
  };

  return (
    <div className="h-full flex flex-col" title="Inspector" icon={<Settings className="h-5 w-5" />}>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-sm font-medium mb-4">Node Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Position X</label>
                <input
                  type="number"
                  value={node.position.x}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Position Y</label>
                <input
                  type="number"
                  value={node.position.y}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Style</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={node.style?.background || '#ffffff'}
                    onChange={(e) => handleStyleChange('background', e.target.value)}
                    className="w-12 h-10 px-1 py-1 bg-background border rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={node.style?.background || '#ffffff'}
                    onChange={(e) => handleStyleChange('background', e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Border Width</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={node.style?.borderWidth || 1}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                  className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
