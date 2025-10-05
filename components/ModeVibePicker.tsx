'use client';

import { QueryMode, Vibe } from '@/types';
import { useAppStore } from '@/lib/store';
import { Zap, Search, Scale, GraduationCap, Code, Heart, Smile, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const MODE_OPTIONS: Array<{
    value: QueryMode;
    label: string;
    icon: React.ReactNode;
    description: string;
}> = [
        {
            value: 'quick',
            label: 'Quick Answer',
            icon: <Zap className="h-5 w-5" />,
            description: '1-2 paragraph summary',
        },
        {
            value: 'deep',
            label: 'Deep Research',
            icon: <Search className="h-5 w-5" />,
            description: 'Multi-step analysis',
        },
        {
            value: 'debate',
            label: 'Debate Mode',
            icon: <Scale className="h-5 w-5" />,
            description: 'Pro vs con arguments',
        },
        {
            value: 'explain',
            label: 'Explainer',
            icon: <GraduationCap className="h-5 w-5" />,
            description: 'ELI5 & ELI15',
        },
    ];

const VIBE_OPTIONS: Array<{
    value: Vibe;
    label: string;
    icon: React.ReactNode;
    emoji: string;
}> = [
        { value: 'academic', label: 'Academic', icon: <GraduationCap className="h-4 w-4" />, emoji: '🎓' },
        { value: 'hacker', label: 'Hacker', icon: <Code className="h-4 w-4" />, emoji: '💻' },
        { value: 'friendly', label: 'Friendly', icon: <Heart className="h-4 w-4" />, emoji: '😊' },
        { value: 'meme', label: 'Meme', icon: <Smile className="h-4 w-4" />, emoji: '😂' },
        { value: 'hinglish', label: 'Hinglish', icon: <Languages className="h-4 w-4" />, emoji: '🇮🇳' },
    ];

export function ModeVibePicker() {
    const { selectedMode, selectedVibe, setMode, setVibe } = useAppStore();

    return (
        <div className="space-y-6">
            {/* Query Mode Selector */}
            <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Query Mode</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {MODE_OPTIONS.map((mode) => (
                        <motion.button
                            key={mode.value}
                            onClick={() => setMode(mode.value)}
                            className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${selectedMode === mode.value
                                    ? 'border-primary bg-primary/10 glow'
                                    : 'border-border bg-card hover:border-primary/50'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div
                                className={`${selectedMode === mode.value ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                {mode.icon}
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-medium">{mode.label}</div>
                                <div className="text-xs text-muted-foreground">{mode.description}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Vibe Selector */}
            <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Personality Vibe</h3>
                <div className="flex flex-wrap gap-2">
                    {VIBE_OPTIONS.map((vibe) => (
                        <motion.button
                            key={vibe.value}
                            onClick={() => setVibe(vibe.value)}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${selectedVibe === vibe.value
                                    ? 'border-primary bg-primary/10 text-primary glow'
                                    : 'border-border bg-card hover:border-primary/50'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{vibe.emoji}</span>
                            <span>{vibe.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
