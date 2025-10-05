// Utility functions for parsing streaming responses from Perplexity API

export interface StreamChunk {
    type: 'token' | 'complete' | 'error';
    content?: string;
    data?: {
        citations?: Array<{ url: string; title?: string }>;
        relatedQueries?: string[];
        [key: string]: unknown;
    };
}

export async function* parseSSEStream(
    reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<StreamChunk> {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');

            // Keep the last incomplete line in the buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();

                if (!trimmed || trimmed.startsWith(':')) {
                    continue; // Skip empty lines and comments
                }

                if (trimmed.startsWith('data: ')) {
                    const data = trimmed.slice(6);

                    if (data === '[DONE]') {
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(data);

                        // Extract token from Perplexity response format
                        if (parsed.choices && parsed.choices[0]?.delta?.content) {
                            yield {
                                type: 'token',
                                content: parsed.choices[0].delta.content,
                            };
                        }

                        // Check if stream is complete
                        if (parsed.choices && parsed.choices[0]?.finish_reason === 'stop') {
                            // Log the full response to debug citations
                            console.log('Final chunk received:', JSON.stringify(parsed, null, 2));

                            // Perplexity returns citations at the top level of the response
                            const citations = parsed.citations || [];

                            console.log('Citations found:', citations);

                            // Format citations properly
                            const finalCitations = citations.map((citation: {
                                title?: string;
                                name?: string;
                                url?: string;
                                snippet?: string;
                                text?: string;
                            }) => ({
                                title: citation.title || citation.name || 'Untitled',
                                url: citation.url,
                                snippet: citation.snippet || citation.text || '',
                            }));

                            yield {
                                type: 'complete',
                                data: {
                                    citations: finalCitations,
                                    related: [],
                                },
                            };
                        }
                    } catch (e) {
                        console.error('Failed to parse SSE data:', e);
                    }
                }
            }
        }
    } catch (error) {
        yield {
            type: 'error',
            content: error instanceof Error ? error.message : 'Stream error',
        };
    } finally {
        reader.releaseLock();
    }
}

export function extractCitations(text: string): Array<{ id: number; text: string }> {
    const citationRegex = /\[(\d+)\]/g;
    const citations: Array<{ id: number; text: string }> = [];
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
        const id = parseInt(match[1], 10);
        if (!citations.find((c) => c.id === id)) {
            citations.push({ id, text: match[0] });
        }
    }

    return citations;
}
