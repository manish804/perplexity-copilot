import { NextRequest, NextResponse } from 'next/server';
import { searchRequestSchema } from '@/lib/schemas';
import { buildSystemPrompt } from '@/lib/prompt-builder';
import { rateLimiter } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

        // Check rate limit
        const rateLimitResult = await rateLimiter.check(ip);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please try again later.',
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await req.json();
        console.log('Received request body:', body);
        const validationResult = searchRequestSchema.safeParse(body);

        if (!validationResult.success) {
            console.error('Validation failed:', JSON.stringify(validationResult.error, null, 2));
            return NextResponse.json(
                {
                    error: 'Invalid request',
                    details: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const { query, mode, vibe } = validationResult.data;

        // Build system prompt based on mode and vibe
        const systemPrompt = buildSystemPrompt({ mode, vibe });

        // Check if API key is configured
        const apiKey = process.env.PPLX_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            return NextResponse.json(
                {
                    error: 'API key not configured. Please set PPLX_API_KEY in your environment variables.',
                },
                { status: 500 }
            );
        }

        // Call Perplexity API
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: query },
                ],
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perplexity API error:', errorText);
            return NextResponse.json(
                {
                    error: 'Failed to fetch from Perplexity API',
                    details: response.statusText,
                },
                { status: response.status }
            );
        }

        // Stream the response back to client
        if (!response.body) {
            return NextResponse.json(
                { error: 'No response body from API' },
                { status: 502 }
            );
        }

        // Return streaming response
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
