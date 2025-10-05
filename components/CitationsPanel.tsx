'use client';

import { Citation } from '@/types';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface CitationsPanelProps {
    citations: Citation[];
    onCitationClick: (citation: Citation) => void;
    highlightedId?: number;
}

export function CitationsPanel({ citations, onCitationClick, highlightedId }: CitationsPanelProps) {
    if (citations.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold">Sources</h3>
            <div className="space-y-2">
                {citations.map((citation, index) => (
                    <motion.div
                        key={citation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card
                            className={`cursor-pointer p-4 transition-all hover:border-primary ${highlightedId === citation.id ? 'border-primary bg-primary/10 glow' : ''
                                }`}
                            onClick={() => {
                                onCitationClick(citation);
                                window.open(citation.url, '_blank', 'noopener,noreferrer');
                            }}
                        >
                            <div className="flex items-start gap-3">
                                {/* Citation number */}
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                                    {citation.id}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-medium leading-tight">{citation.title}</h4>
                                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        {citation.favicon && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={citation.favicon}
                                                alt=""
                                                className="h-4 w-4 rounded"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <span>{citation.domain}</span>
                                    </div>

                                    {citation.snippet && (
                                        <p className="line-clamp-2 text-xs text-muted-foreground">{citation.snippet}</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
