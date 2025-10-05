'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ComposerProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

export function Composer({ onSubmit, isLoading, placeholder }: ComposerProps) {
    const [query, setQuery] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [query]);

    const handleSubmit = () => {
        if (query.trim() && !isLoading) {
            onSubmit(query.trim());
            setQuery('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const charCount = query.length;
    const maxChars = 1000;

    return (
        <motion.div
            className="relative rounded-lg border border-border bg-card p-4 glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || 'What are you curious about?'}
                className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                rows={1}
                maxLength={maxChars}
                disabled={isLoading}
            />

            <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    {charCount}/{maxChars}
                    <span className="ml-3 text-muted-foreground/70">
                        Press Enter to send, Shift+Enter for new line
                    </span>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={!query.trim() || isLoading}
                    size="sm"
                    className="gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Search
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
