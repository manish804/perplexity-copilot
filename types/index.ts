// Core type definitions for the Perplexity Research Copilot

/**
 * Query modes determine the depth and format of search results
 */
export type QueryMode = 'quick' | 'deep' | 'debate' | 'explain';

/**
 * Vibes control the tone and style of the response
 */
export type Vibe = 'academic' | 'hacker' | 'friendly' | 'meme' | 'hinglish';

/**
 * Citation represents a source reference in the search results
 */
export interface Citation {
    id: number;
    title: string;
    url: string;
    domain: string;
    snippet?: string;
    favicon?: string;
}

/**
 * SearchStep represents one step in a chain-of-search (for deep/debate modes)
 */
export interface SearchStep {
    query: string;
    topSources: Array<{
        title: string;
        url: string;
        domain: string;
    }>;
    facts?: string[];
}

/**
 * SearchRequest is the payload sent to the API
 */
export interface SearchRequest {
    query: string;
    mode: QueryMode;
    vibe: Vibe;
}

/**
 * SearchResponse is the complete response from the API
 */
export interface SearchResponse {
    citations: Citation[];
    steps?: SearchStep[];
    related?: string[];
}

/**
 * HistoryItem represents a saved search in local storage
 */
export interface HistoryItem {
    id: string;
    query: string;
    mode: QueryMode;
    vibe: Vibe;
    timestamp: number;
    preview?: string;
}

/**
 * GraphNode represents a concept node in the Rabbit Hole visualization
 */
export interface GraphNode {
    id: string;
    label: string;
    summary: string;
    tangents: string[];
    position: { x: number; y: number };
    isActive: boolean;
}

/**
 * GraphState manages the state of the Rabbit Hole graph
 */
export interface GraphState {
    nodes: Map<string, GraphNode>;
    edges: Array<{ from: string; to: string }>;
    activeNodeId: string | null;
    viewport: {
        x: number;
        y: number;
        zoom: number;
    };
}

/**
 * Streaming event types for Server-Sent Events
 */
export type StreamEvent =
    | { type: 'token'; data: { token: string } }
    | { type: 'complete'; data: SearchResponse }
    | { type: 'error'; data: { error: string } };

/**
 * Rate limit result from the rate limiter
 */
export interface RateLimitResult {
    allowed: boolean;
    remaining?: number;
    resetAt?: number;
}
