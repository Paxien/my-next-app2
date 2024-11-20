'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  NodeChange,
  NodeDragHandler,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
    style: { background: '#6366f1', color: 'white' },
  },
  {
    id: '2',
    data: { label: 'Process' },
    position: { x: 100, y: 125 },
    style: { border: '1px solid #6366f1' },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'End' },
    position: { x: 250, y: 250 },
    style: { background: '#6366f1', color: 'white' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function Canvas3Page() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [variant, setVariant] = useState<BackgroundVariant>('dots');
  const [isDragging, setIsDragging] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onNodeDragStop: NodeDragHandler = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const toggleBackground = () => {
    setVariant((prev) => (prev === 'dots' ? 'lines' : 'dots'));
  };

  const resetView = useCallback(() => {
    const flow = document.querySelector('.react-flow');
    if (flow) {
      const { clientWidth, clientHeight } = flow;
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          position: {
            x: clientWidth / 2,
            y: clientHeight / 2,
          },
        }))
      );
    }
  }, [setNodes]);

  return (
    <div className="fixed inset-0 w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        fitView
        className="bg-background"
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Controls />
        <MiniMap />
        <Background variant={variant} gap={12} size={1} />
        <Panel position="top-right" className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleBackground}
          >
            Toggle Background
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
          >
            Reset View
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}