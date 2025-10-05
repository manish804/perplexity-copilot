'use client';

import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types';
import { getHistory, deleteHistoryItem } from '@/lib/history-storage';
import { Clock, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HistoryDrawerProps {
    onItemClick: (item: HistoryItem) => void;
    onItemRegenerate: (item: HistoryItem) => void;
}

export function HistoryDrawer({ onItemClick, onItemRegenerate }: HistoryDrawerProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        // Load history on mount
        setHistory(getHistory());

        // Listen for storage changes
        const handleStorageChange = () => {
            setHistory(getHistory());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteHistoryItem(id);
        setHistory(getHistory());
    };

    const handleRegenerate = (item: HistoryItem, e: React.MouseEvent) => {
        e.stopPropagation();
        onItemRegenerate(item);
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getModeLabel = (mode: string) => {
        const labels: Record<string, string> = {
            quick: 'Quick',
            deep: 'Deep',
            debate: 'Debate',
            explain: 'Explain',
        };
        return labels[mode] || mode;
    };

    const getVibeEmoji = (vibe: string) => {
        const emojis: Record<string, string> = {
            academic: '🎓',
            hacker: '💻',
            friendly: '😊',
            meme: '😂',
            hinglish: '🇮🇳',
        };
        return emojis[vibe] || '🔍';
    };

    if (history.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <div>
                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No search history yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {history.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <div
                        onClick={() => onItemClick(item)}
                        className="group relative w-full cursor-pointer rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary hover:bg-primary/5"
                    >
                        {/* Query */}
                        <div className="mb-2 line-clamp-2 text-sm font-medium">{item.query}</div>

                        {/* Metadata */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded bg-muted px-2 py-0.5">{getModeLabel(item.mode)}</span>
                            <span>{getVibeEmoji(item.vibe)}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(item.timestamp)}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => handleRegenerate(item, e)}
                            >
                                <RotateCcw className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={(e) => handleDelete(item.id, e)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
