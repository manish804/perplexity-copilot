'use client';

import { useCallback, useEffect } from 'react';
import ReactFlow, {
    Node,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GraphNode } from '@/types';
import { motion } from 'framer-motion';

interface RabbitHoleGraphProps {
    initialQuery?: string;
    onNodeClick: (node: GraphNode) => void;
}

export function RabbitHoleGraph({ initialQuery, onNodeClick }: RabbitHoleGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            const graphNode: GraphNode = {
                id: node.id,
                label: node.data.label,
                summary: node.data.summary || '',
                tangents: node.data.tangents || [],
                position: node.position,
                isActive: true,
            };
            onNodeClick(graphNode);
        },
        [onNodeClick]
    );

    // Initialize with a central node if query provided
    useEffect(() => {
        if (initialQuery && nodes.length === 0) {
            const initialNode: Node = {
                id: '1',
                type: 'default',
                position: { x: 400, y: 300 },
                data: {
                    label: initialQuery,
                    summary: 'Loading...',
                    tangents: [],
                },
                style: {
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '2px solid rgba(59, 130, 246, 0.8)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                },
            };
            setNodes([initialNode]);
        }
    }, [initialQuery, nodes.length, setNodes]);

    return (
        <div className="h-full w-full rounded-lg border border-border bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                fitView
                className="bg-background"
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#3b82f6" />
                <Controls className="bg-card border-border" />
            </ReactFlow>
        </div>
    );
}

// Custom node component for better styling
export function CustomNode({ data }: { data: { label: string; summary?: string } }) {
    return (
        <motion.div
            className="rounded-lg border-2 border-primary bg-card p-4 shadow-lg glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="font-semibold text-foreground">{data.label}</div>
            {data.summary && (
                <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{data.summary}</div>
            )}
        </motion.div>
    );
}
