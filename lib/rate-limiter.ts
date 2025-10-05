// Simple in-memory rate limiter using IP-based tracking

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RequestRecord {
    count: number;
    resetTime: number;
}

export class RateLimiter {
    private requests: Map<string, RequestRecord>;
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.requests = new Map();
        this.config = config;

        // Cleanup expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    async check(ip: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
        const now = Date.now();
        const record = this.requests.get(ip);

        // No record or expired window - allow and create new record
        if (!record || now >= record.resetTime) {
            const resetTime = now + this.config.windowMs;
            this.requests.set(ip, { count: 1, resetTime });
            return {
                allowed: true,
                remaining: this.config.maxRequests - 1,
                resetTime,
            };
        }

        // Within window - check if limit exceeded
        if (record.count >= this.config.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: record.resetTime,
            };
        }

        // Increment count and allow
        record.count++;
        this.requests.set(ip, record);
        return {
            allowed: true,
            remaining: this.config.maxRequests - record.count,
            resetTime: record.resetTime,
        };
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [ip, record] of this.requests.entries()) {
            if (now >= record.resetTime) {
                this.requests.delete(ip);
            }
        }
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter({
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
});
