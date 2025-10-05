import { z } from 'zod';

// Zod schemas for request validation

/**
 * Schema for validating search requests
 */
export const searchRequestSchema = z.object({
    query: z.string()
        .min(3, 'Query must be at least 3 characters')
        .max(1000, 'Query must be less than 1000 characters'),
    mode: z.enum(['quick', 'deep', 'debate', 'explain']),
    vibe: z.enum(['academic', 'hacker', 'friendly', 'meme', 'hinglish']),
});

export type SearchRequestInput = z.infer<typeof searchRequestSchema>;

/**
 * Schema for validating citation objects
 */
export const citationSchema = z.object({
    id: z.number(),
    title: z.string(),
    url: z.string().url(),
    domain: z.string(),
    snippet: z.string().optional(),
    favicon: z.string().url().optional(),
});

/**
 * Schema for validating search step objects
 */
export const searchStepSchema = z.object({
    query: z.string(),
    topSources: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        domain: z.string(),
    })),
    facts: z.array(z.string()).optional(),
});

/**
 * Schema for validating complete search responses
 */
export const searchResponseSchema = z.object({
    citations: z.array(citationSchema),
    steps: z.array(searchStepSchema).optional(),
    related: z.array(z.string()).optional(),
});

/**
 * Schema for validating environment variables
 */
export const envSchema = z.object({
    PPLX_API_KEY: z.string().min(1, 'PPLX_API_KEY is required'),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    RATE_LIMIT_MAX_REQUESTS: z.string().optional(),
    RATE_LIMIT_WINDOW_MS: z.string().optional(),
});
