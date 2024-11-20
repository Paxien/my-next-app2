'use client';

import { ScrollArea } from "@/components/scroll-area";
import { ChevronRight, Plus, Trash2, Layers } from "lucide-react";
import { useState } from "react";

interface Node {
  id: string;
  data: { label: string };
}

interface HierarchyPanelProps {
  nodes: Node[];
  onNodeClick?: (nodeId: string) => void;
  onNodeAdd?: () => void;
  onNodeDelete?: (nodeId: string) => void;
}

export function HierarchyPanel({ nodes, onNodeClick, onNodeAdd, onNodeDelete }: HierarchyPanelProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onNodeClick?.(nodeId);
  };

  return (
    <div className="flex flex-col h-full" title="Hierarchy" icon={<Layers className="h-5 w-5" />}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Scene Hierarchy</h3>
        <button
          onClick={onNodeAdd}
          className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Add node"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-4">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md group ${
                selectedNodeId === node.id
                  ? 'bg-accent'
                  : 'hover:bg-accent/50'
              }`}
            >
              <button
                className="flex items-center gap-2 flex-1 text-left"
                onClick={() => handleNodeClick(node.id)}
              >
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{node.data.label}</span>
              </button>
              {onNodeDelete && (
                <button
                  onClick={() => onNodeDelete(node.id)}
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Delete ${node.data.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
