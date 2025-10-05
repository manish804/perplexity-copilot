import { envSchema } from './schemas';

/**
 * Validates and returns server-side environment variables
 * This should only be called on the server side
 */
export function getServerEnv() {
    if (typeof window !== 'undefined') {
        throw new Error('getServerEnv can only be called on the server side');
    }

    const env = {
        PPLX_API_KEY: process.env.PPLX_API_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
        RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    };

    const result = envSchema.safeParse(env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables. Check your .env.local file.');
    }

    return {
        PPLX_API_KEY: result.data.PPLX_API_KEY,
        NEXT_PUBLIC_APP_URL: result.data.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        RATE_LIMIT_MAX_REQUESTS: parseInt(result.data.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        RATE_LIMIT_WINDOW_MS: parseInt(result.data.RATE_LIMIT_WINDOW_MS || '60000', 10),
    };
}

/**
 * Type-safe access to public environment variables
 * Can be called on both client and server
 */
export function getPublicEnv() {
    return {
        APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    };
}
