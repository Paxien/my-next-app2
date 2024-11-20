'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  NodeChange,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Sidebar } from './components/sidebar';
import { InspectorPanel } from './components/panels/inspector-panel';
import { HierarchyPanel } from './components/panels/hierarchy-panel';
import { AIPanel } from './components/panels/ai-panel';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 400, y: 200 },
  },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const { fitView } = useReactFlow();

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeChange = useCallback(
    (changes: NodeChange) => {
      if (selectedNode) {
        const updatedNodes = nodes.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              ...changes,
            };
          }
          return node;
        });
        setNodes(updatedNodes);
      }
    },
    [nodes, selectedNode, setNodes]
  );

  const handleNodeAdd = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    },
    [selectedNode, setNodes]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedNode) {
        handleNodeDelete(selectedNode.id);
      }
    },
    [handleNodeDelete, selectedNode]
  );

  return (
    <div className="h-[calc(100vh-var(--header-height))] flex">
      <Sidebar side="left">
        <HierarchyPanel
          nodes={nodes}
          onNodeClick={(nodeId) => {
            const node = nodes.find((n) => n.id === nodeId);
            if (node) setSelectedNode(node);
          }}
          onNodeAdd={handleNodeAdd}
          onNodeDelete={handleNodeDelete}
        />
      </Sidebar>

      <div className="flex-1 h-full" tabIndex={0} onKeyDown={handleKeyDown}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
        >
          {showGrid && <Background />}
          <Controls />
          <Panel position="top-right" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="px-2 py-1 text-sm rounded hover:bg-accent"
            >
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button
              onClick={() => fitView()}
              className="px-2 py-1 text-sm rounded hover:bg-accent ml-2"
            >
              Reset View
            </button>
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar side="right">
        <InspectorPanel
          node={selectedNode}
          onChange={handleNodeChange}
        />
        <AIPanel />
      </Sidebar>
    </div>
  );
}

export default function Canvas4Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}