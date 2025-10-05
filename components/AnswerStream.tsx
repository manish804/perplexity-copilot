'use client';

import { Citation } from '@/types';
import { Copy, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import 'highlight.js/styles/github-dark.css';

interface AnswerStreamProps {
    content: string;
    isStreaming: boolean;
    citations?: Citation[];
    onCitationClick?: (id: number) => void;
}

export function AnswerStream({
    content,
    isStreaming,
    citations = [],
    onCitationClick,
}: AnswerStreamProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const contentEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when content updates during streaming
    useEffect(() => {
        if (isStreaming && contentEndRef.current) {
            contentEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [content, isStreaming]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            toast.success('Copied to clipboard!');
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleCodeCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            toast.success('Code copied!');
            setTimeout(() => setCopiedCode(null), 2000);
        } catch {
            toast.error('Failed to copy code');
        }
    };

    const handleExport = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Exported to markdown!');
    };

    if (!content && !isStreaming) {
        return null;
    }

    return (
        <motion.div
            className="rounded-lg border border-border bg-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header with actions */}
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-lg font-semibold">Answer</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!content}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleExport} disabled={!content}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                        a: ({ children, ...props }) => {
                            const href = props.href || '';
                            // Check if it's a citation link [1], [2], etc.
                            const citationMatch = href.match(/^#citation-(\d+)$/);
                            if (citationMatch) {
                                const citationId = parseInt(citationMatch[1], 10);
                                return (
                                    <button
                                        onClick={() => onCitationClick?.(citationId)}
                                        className="cursor-pointer text-primary hover:underline"
                                    >
                                        {children}
                                    </button>
                                );
                            }
                            return (
                                <a {...props} target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            );
                        },
                        code: ({ className, children, ...props }: { node?: unknown; className?: string; children?: React.ReactNode; inline?: boolean }) => {
                            const isInline = (props as { inline?: boolean }).inline;
                            return isInline ? (
                                <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm" {...props}>
                                    {children}
                                </code>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        pre: ({ children, ...props }) => {
                            // Extract text content from code block
                            let textContent = '';
                            const extractText = (child: unknown): string => {
                                if (typeof child === 'string') return child;
                                if (Array.isArray(child)) return child.map(extractText).join('');
                                if (child && typeof child === 'object' && 'props' in child && child.props && typeof child.props === 'object' && 'children' in child.props) {
                                    return extractText(child.props.children);
                                }
                                return '';
                            };
                            textContent = extractText(children);

                            const isCopied = copiedCode === textContent;

                            return (
                                <div className="group relative">
                                    <pre {...props}>{children}</pre>
                                    <button
                                        onClick={() => handleCodeCopy(textContent)}
                                        className="absolute right-2 top-2 rounded bg-slate-800 p-2 opacity-0 transition-opacity hover:bg-slate-700 group-hover:opacity-100"
                                        title="Copy code"
                                    >
                                        {isCopied ? (
                                            <Check className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                            );
                        },
                    }}
                >
                    {content}
                </ReactMarkdown>

                {isStreaming && (
                    <span className="inline-flex items-center gap-1 text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                )}

                {/* Invisible element at the end for auto-scroll */}
                <div ref={contentEndRef} />
            </div>

            {/* Citations preview */}
            {citations.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        {citations.length} {citations.length === 1 ? 'Source' : 'Sources'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {citations.map((citation) => (
                            <button
                                key={citation.id}
                                onClick={() => onCitationClick?.(citation.id)}
                                className="rounded-full border border-border bg-muted px-3 py-1 text-xs hover:border-primary hover:bg-primary/10"
                            >
                                [{citation.id}] {citation.domain}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
