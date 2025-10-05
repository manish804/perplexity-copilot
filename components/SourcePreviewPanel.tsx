'use client';

import { X, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SourcePreviewPanelProps {
    url: string;
    onClose: () => void;
}

export function SourcePreviewPanel({ url, onClose }: SourcePreviewPanelProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleOpenInNewTab = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed right-0 top-0 z-50 h-full w-full border-l border-border bg-background shadow-2xl md:w-1/2 lg:w-2/5"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex-1 truncate">
                        <h3 className="truncate text-sm font-medium">Source Preview</h3>
                        <p className="truncate text-xs text-muted-foreground">{url}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleOpenInNewTab}>
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="relative h-[calc(100%-4rem)]">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {hasError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                            <p className="text-muted-foreground">Unable to preview this source</p>
                            <Button onClick={handleOpenInNewTab}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open in New Tab
                            </Button>
                        </div>
                    ) : (
                        <iframe
                            src={url}
                            className="h-full w-full"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                setHasError(true);
                            }}
                            sandbox="allow-scripts allow-same-origin"
                            title="Source Preview"
                        />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
