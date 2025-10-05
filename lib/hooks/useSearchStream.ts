'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { QueryMode, Vibe, Citation } from '@/types';
import { parseSSEStream } from '@/lib/stream-parser';

interface UseSearchStreamOptions {
    onComplete?: (data: { citations: Citation[]; related: string[] }) => void;
    onError?: (error: Error) => void;
}

export function useSearchStream(options: UseSearchStreamOptions = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const {
        setIsStreaming,
        setStreamedContent,
        appendStreamedContent,
        setCitations,
        setRelatedQueries,
    } = useAppStore();

    const search = useCallback(
        async (query: string, mode: QueryMode, vibe: Vibe) => {
            setIsLoading(true);
            setError(null);
            setIsStreaming(true);
            setStreamedContent('');

            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, mode, vibe }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Search failed');
                }

                if (!response.body) {
                    throw new Error('No response body');
                }

                const reader = response.body.getReader();

                // Process the stream
                for await (const chunk of parseSSEStream(reader)) {
                    if (chunk.type === 'token' && chunk.content) {
                        appendStreamedContent(chunk.content);
                    } else if (chunk.type === 'complete' && chunk.data) {
                        // Extract and format citations
                        const citations = (chunk.data.citations || [])
                            .filter((c: { url?: string }) => c.url && c.url.trim() !== '') // Filter out citations without valid URLs
                            .map((c: { url: string; title?: string; snippet?: string }, index: number): Citation | null => {
                                try {
                                    const url = new URL(c.url);
                                    return {
                                        id: index + 1,
                                        title: c.title || 'Untitled',
                                        url: c.url,
                                        domain: url.hostname,
                                        snippet: c.snippet,
                                        favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`,
                                    };
                                } catch {
                                    console.error('Invalid citation URL:', c.url);
                                    return null;
                                }
                            })
                            .filter((c): c is Citation => c !== null);

                        setCitations(citations);

                        const relatedQueries = Array.isArray(chunk.data.related)
                            ? chunk.data.related as string[]
                            : [];
                        setRelatedQueries(relatedQueries);

                        options.onComplete?.({
                            citations,
                            related: relatedQueries,
                        });
                    } else if (chunk.type === 'error') {
                        throw new Error(chunk.content || 'Stream error');
                    }
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Unknown error');
                setError(error);
                options.onError?.(error);
            } finally {
                setIsLoading(false);
                setIsStreaming(false);
            }
        },
        [
            setIsStreaming,
            setStreamedContent,
            appendStreamedContent,
            setCitations,
            setRelatedQueries,
            options,
        ]
    );

    return {
        search,
        isLoading,
        error,
    };
}
