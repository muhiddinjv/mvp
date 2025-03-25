import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/base.css';

const Flow = () => {
  const nodes = [
    {
      id: 'read',
      data: { label: 'READ' },
      position: { x: 0, y: 0 },
      style: { background: '#f9d342', color: '#333', borderRadius: '10%' }, // Custom styling for the central node
    },
   ...Array.from({ length: 6 }, (_, index) => ({
      id: `branch${index + 1}`,
      data: { label: `branch${index + 1}` },
      position: {
        x: Math.cos((2 * Math.PI / 6) * (index + 1)) * 150,
        y: Math.sin((2 * Math.PI / 6) * (index + 1)) * 150,
      },
    })),
  ];

  const edges = Array.from({ length: 6 }, (_, index) => ({
    id: `e${index + 1}`,
    animated: true,
    source: 'read',
    target: `branch${index + 1}`,
  }));

  return (
    <div className='h-screen bg-gray-300'>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;