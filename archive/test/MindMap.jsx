import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
} from 'reactflow';

import 'reactflow/dist/base.css';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const nodeDefaults2 = {
  sourcePosition: Position.Left,
  targetPosition: Position.Right,
};

const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 150 },
    data: { label: 'base style 1' },
    ...nodeDefaults,
    // ...nodeDefaults2
  },
  { id: '2', position: { x: 250, y: 0 }, data: { label: 'base style 2' }, ...nodeDefaults },
  { id: '3', position: { x: 250, y: 150 }, data: { label: 'base style 3' }, ...nodeDefaults },
  { id: '4', position: { x: 250, y: 300 }, data: { label: 'base style 4' }, ...nodeDefaults },
  { id: '5', position: { x: 100, y: 450 }, data: { label: 'base style 5' }, ...nodeDefaults2 },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
  },{
    id: 'e1-5',
    source: '1',
    target: '5',
    // sourcePosition: 'left',
  },
];

const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background className='bg-gray-200' />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

export default MindMap;
