'use client';

import { useState, useEffect } from 'react';

export interface MousePosition {
    x: number;
    y: number;
}

export function useThrottledMousePosition(throttleMs: number = 16): MousePosition | null {
    const [position, setPosition] = useState<MousePosition | null>(null);

    useEffect(() => {
        let rafId: number;
        let lastUpdate = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const now = performance.now();

            if (now - lastUpdate >= throttleMs) {
                rafId = requestAnimationFrame(() => {
                    setPosition({ x: e.clientX, y: e.clientY });
                    lastUpdate = now;
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [throttleMs]);

    return position;
}
