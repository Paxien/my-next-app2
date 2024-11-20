'use client';

import { ScrollArea } from "@/components/scroll-area";
import { ChevronRight, Plus, Trash2, Layers } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  data: { label: string };
}

interface HierarchyPanelProps {
  title: string;
  icon: React.ReactElement;
  nodes: Node[];
  selectedNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  onNodeAdd?: () => void;
  onNodeDelete?: (nodeId: string) => void;
}

export function HierarchyPanel({
  title,
  icon,
  nodes,
  selectedNodeId,
  onNodeClick,
  onNodeAdd,
  onNodeDelete
}: HierarchyPanelProps) {
  const [localSelectedNodeId, setLocalSelectedNodeId] = useState<string | null>(selectedNodeId);

  const handleNodeClick = (nodeId: string) => {
    setLocalSelectedNodeId(nodeId);
    onNodeClick?.(nodeId);
  };

  return (
    <div className="h-full flex flex-col" title={title} icon={icon}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={onNodeAdd}
          className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md cursor-pointer",
                localSelectedNodeId === node.id ? "bg-accent" : "hover:bg-accent/50"
              )}
              onClick={() => handleNodeClick(node.id)}
            >
              <ChevronRight className="h-4 w-4 flex-none" />
              <span className="flex-1">{node.data.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeDelete?.(node.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
