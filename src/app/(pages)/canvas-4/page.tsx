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
import { 
  Layers, 
  MessageSquare, 
  Settings, 
  Cpu, 
  FolderTree, 
  Terminal, 
  Bug, 
  History,
  GitBranch,
  Search,
  Database
} from 'lucide-react';

import { Sidebar } from './components/sidebar';
import { InspectorPanel } from './components/panels/inspector-panel';
import { HierarchyPanel } from './components/panels/hierarchy-panel';
import { AIPanel } from './components/panels/ai-panel';
import { ProjectPanel } from './components/panels/project-panel';
import { ConsolePanel } from './components/panels/console-panel';
import { cn } from '@/lib/utils';

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

export default function Canvas4Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [leftBottomHeight, setLeftBottomHeight] = useState(300);
  const [rightBottomHeight, setRightBottomHeight] = useState(300);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftTopSectionHeight, setLeftTopSectionHeight] = useState<number | null>(null);
  const [rightTopSectionHeight, setRightTopSectionHeight] = useState<number | null>(null);
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
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Header Navigation */}
      <div className="h-12 border-b border-muted flex items-center px-4 gap-4">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-md">
            <FolderTree className="h-4 w-4" />
          </button>
          <div className="h-4 w-[1px] bg-muted mx-1" />
          <button className="p-2 hover:bg-accent rounded-md">
            <GitBranch className="h-4 w-4" />
          </button>
        </div>

        {/* Center section */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <button className="px-3 py-1.5 hover:bg-accent rounded-md text-sm font-medium">Flow</button>
          <button className="px-3 py-1.5 hover:bg-accent rounded-md text-sm font-medium">Preview</button>
          <button className="px-3 py-1.5 hover:bg-accent rounded-md text-sm font-medium">Settings</button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-md">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded-md">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar */}
        <div className={cn(
          'flex flex-col h-full',
          leftSidebarCollapsed && 'w-[40px]',
          'transition-all duration-200 ease-in-out'
        )}>
          <div className="flex-1 min-h-0" style={{ minHeight: '150px' }}>
            <Sidebar 
              side="left" 
              defaultPanel={0}
              onCollapse={setLeftSidebarCollapsed}
              isCollapsed={leftSidebarCollapsed}
              onResize={(width, height) => {
                if (height) setLeftTopSectionHeight(height);
              }}
            >
              <HierarchyPanel
                title="Hierarchy"
                icon={<Layers className="h-5 w-5" />}
                nodes={nodes}
                selectedNodeId={selectedNode?.id}
                onNodeClick={(nodeId) => {
                  const node = nodes.find((n) => n.id === nodeId);
                  if (node) setSelectedNode(node);
                }}
                onNodeAdd={handleNodeAdd}
                onNodeDelete={handleNodeDelete}
              />
              <AIPanel title="AI Chat" icon={<MessageSquare className="h-5 w-5" />} />
            </Sidebar>
          </div>
          <Sidebar 
            side="left" 
            defaultPanel={0}
            defaultHeight={leftBottomHeight}
            minHeight={150}
            maxHeight={Math.max(600, window.innerHeight - (leftTopSectionHeight || 0) - 48)}
            onResize={(_, height) => height && setLeftBottomHeight(height)}
            isBottomPanel
            isCollapsed={leftSidebarCollapsed}
          >
            <ConsolePanel title="Console" icon={<Terminal className="h-4 w-4" />} />
            <div title="Debug" icon={<Bug className="h-4 w-4" />}>Debug Panel Content</div>
            <div title="History" icon={<History className="h-4 w-4" />}>History Panel Content</div>
          </Sidebar>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 relative" tabIndex={0} onKeyDown={handleKeyDown}>
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

        {/* Right sidebar */}
        <div className={cn(
          'flex flex-col h-full',
          rightSidebarCollapsed && 'w-[40px]',
          'transition-all duration-200 ease-in-out'
        )}>
          <div className="flex-1 min-h-0" style={{ minHeight: '150px' }}>
            <Sidebar 
              side="right" 
              defaultPanel={0}
              onCollapse={setRightSidebarCollapsed}
              isCollapsed={rightSidebarCollapsed}
              onResize={(width, height) => {
                if (height) setRightTopSectionHeight(height);
              }}
            >
              <InspectorPanel title="Inspector" icon={<Settings className="h-5 w-5" />} />
            </Sidebar>
          </div>
          <Sidebar 
            side="right" 
            defaultPanel={0}
            defaultHeight={rightBottomHeight}
            minHeight={150}
            maxHeight={Math.max(600, window.innerHeight - (rightTopSectionHeight || 0) - 48)}
            onResize={(_, height) => height && setRightBottomHeight(height)}
            isBottomPanel
            isCollapsed={rightSidebarCollapsed}
          >
            <ProjectPanel title="Project" icon={<FolderTree className="h-4 w-4" />} />
            <div title="Git" icon={<GitBranch className="h-4 w-4" />}>Git Panel Content</div>
            <div title="Search" icon={<Search className="h-4 w-4" />}>Search Panel Content</div>
            <div title="Database" icon={<Database className="h-4 w-4" />}>Database Panel Content</div>
          </Sidebar>
        </div>
      </div>
    </div>
  );
}