'use client';

import { SearchStep } from '@/types';
import { ChevronDown, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface StepTimelineProps {
    steps: SearchStep[];
    onSourceClick: (url: string) => void;
}

export function StepTimeline({ steps, onSourceClick }: StepTimelineProps) {
    const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

    const toggleStep = (index: number) => {
        setExpandedSteps((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    if (steps.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold">Research Steps</h3>

            <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-primary/20" />

                {steps.map((step, index) => {
                    const isExpanded = expandedSteps.has(index);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <Card className="ml-10 p-4">
                                {/* Step header */}
                                <button
                                    onClick={() => toggleStep(index)}
                                    className="flex w-full items-start gap-3 text-left"
                                >
                                    {/* Step number */}
                                    <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground glow">
                                        {index + 1}
                                    </div>

                                    {/* Expand icon */}
                                    <div className="flex-shrink-0 pt-1">
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>

                                    {/* Query */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Search className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{step.query}</span>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {step.topSources.length} sources consulted
                                        </p>
                                    </div>
                                </button>

                                {/* Expanded content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-7 mt-4 space-y-4 border-t border-border pt-4">
                                                {/* Sources */}
                                                <div>
                                                    <h4 className="mb-2 text-sm font-medium">Top Sources</h4>
                                                    <div className="space-y-2">
                                                        {step.topSources.map((source, sourceIndex) => (
                                                            <button
                                                                key={sourceIndex}
                                                                onClick={() => onSourceClick(source.url)}
                                                                className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/50 p-2 text-left text-sm transition-colors hover:border-primary hover:bg-primary/10"
                                                            >
                                                                <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                                                <div className="flex-1 truncate">
                                                                    <div className="truncate font-medium">{source.title}</div>
                                                                    <div className="truncate text-xs text-muted-foreground">
                                                                        {source.domain}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Facts */}
                                                {step.facts && step.facts.length > 0 && (
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-medium">Key Facts</h4>
                                                        <ul className="space-y-1 text-sm">
                                                            {step.facts.map((fact, factIndex) => (
                                                                <li key={factIndex} className="flex gap-2">
                                                                    <span className="text-primary">•</span>
                                                                    <span className="text-muted-foreground">{fact}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
