'use client';

import { useState, useCallback } from 'react';
import { GraphNode } from '@/types';

interface RabbitHoleData {
    summary: string;
    tangents: string[];
}

export function useRabbitHole() {
    const [nodes, setNodes] = useState<Map<string, GraphNode>>(new Map());
    const [edges, setEdges] = useState<Array<{ from: string; to: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNodeData = useCallback(async (query: string): Promise<RabbitHoleData> => {
        // Mock implementation - in real app, this would call Perplexity API
        // with a special prompt to get summary + tangents
        setIsLoading(true);

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `Provide a brief summary of "${query}" and suggest 3-4 related tangent topics to explore.`,
                    mode: 'quick',
                    vibe: 'friendly',
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch');

            // For now, return mock data
            // In production, parse the response to extract summary and tangents
            return {
                summary: `Summary about ${query}...`,
                tangents: [
                    `Related concept 1 to ${query}`,
                    `Related concept 2 to ${query}`,
                    `Related concept 3 to ${query}`,
                ],
            };
        } catch (error) {
            console.error('Error fetching node data:', error);
            return {
                summary: 'Failed to load summary',
                tangents: [],
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createNode = useCallback(
        async (query: string, parentId?: string): Promise<GraphNode> => {
            const nodeId = `node-${Date.now()}-${Math.random()}`;
            const data = await fetchNodeData(query);

            // Calculate position based on parent
            let position = { x: 400, y: 300 };
            if (parentId) {
                const parent = nodes.get(parentId);
                if (parent) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 200;
                    position = {
                        x: parent.position.x + Math.cos(angle) * distance,
                        y: parent.position.y + Math.sin(angle) * distance,
                    };
                }
            }

            const newNode: GraphNode = {
                id: nodeId,
                label: query,
                summary: data.summary,
                tangents: data.tangents,
                position,
                isActive: false,
            };

            setNodes((prev) => new Map(prev).set(nodeId, newNode));

            if (parentId) {
                setEdges((prev) => [...prev, { from: parentId, to: nodeId }]);
            }

            return newNode;
        },
        [nodes, fetchNodeData]
    );

    const expandNode = useCallback(
        async (nodeId: string) => {
            const node = nodes.get(nodeId);
            if (!node) return;

            // Create child nodes for each tangent
            for (const tangent of node.tangents) {
                await createNode(tangent, nodeId);
            }
        },
        [nodes, createNode]
    );

    return {
        nodes: Array.from(nodes.values()),
        edges,
        isLoading,
        createNode,
        expandNode,
    };
}
