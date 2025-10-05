import { QueryMode, Vibe } from '@/types';

interface PromptParams {
    mode: QueryMode;
    vibe: Vibe;
}

const VIBE_INSTRUCTIONS: Record<Vibe, string> = {
    academic:
        'Tone: neutral, precise, structured. Use formal language and comprehensive citations.',
    hacker:
        'Tone: concise, code-first. Include commands, snippets, and technical tips. Prefer bullets.',
    friendly:
        'Tone: approachable, simple analogies, plain language. Make complex topics accessible.',
    meme: 'Tone: brief, playful, tasteful emojis. Keep rigor intact while being entertaining.',
    hinglish:
        'Tone: casual Hinglish (mixed Hindi-English). Do not alter factual rigor; only adjust tone.',
};

const MODE_INSTRUCTIONS: Record<QueryMode, string> = {
    quick: 'Provide a focused 1-2 paragraph answer with 3-5 citations.',
    deep: `Perform 3-5 search steps. For each step:
1. State the search query
2. List top 3-5 sources consulted
3. Extract key facts
Then synthesize all findings into a comprehensive answer.`,
    debate: `Present both sides:
1. Pro arguments with citations
2. Con arguments with citations
3. Balanced conclusion considering both perspectives`,
    explain: `Provide two explanations:
1. ELI5 (Explain Like I'm 5): Simple, concrete examples
2. ELI15: More nuanced with technical details
Include citations for both levels.`,
};

export function buildSystemPrompt(params: PromptParams): string {
    const basePrompt = `You are a web-grounded research copilot. Always:
- Cite sources inline with bracketed numbers like [1][2] mapped to a sources list.
- If uncertain or data is sparse, say so and suggest specific follow-up searches.
- Never fabricate quotes, numbers, or citations.
- Keep the chosen vibe strictly as a writing style layer.`;

    const vibeInstruction = VIBE_INSTRUCTIONS[params.vibe];
    const modeInstruction = MODE_INSTRUCTIONS[params.mode];

    const outputFormat = `
Output format:
- Answer (with inline citations [1][2])
- Citations list at end
${params.mode === 'deep' || params.mode === 'debate' ? '- Search Steps (if applicable)' : ''}
- Related queries (2-3 suggestions)`;

    return `${basePrompt}

${vibeInstruction}

${modeInstruction}
${outputFormat}`.trim();
}
