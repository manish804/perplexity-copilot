'use client';

import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
    fps: number;
    shouldReduceDensity: boolean;
    shouldDisableAnimations: boolean;
    shouldDisableBackground: boolean;
}

export function usePerformanceMonitor(enabled: boolean = true): PerformanceMetrics {
    const [fps, setFps] = useState(60);

    useEffect(() => {
        if (!enabled) return;

        let frameCount = 0;
        let lastTime = performance.now();
        let rafId: number;

        const measureFps = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime >= lastTime + 1000) {
                setFps(frameCount);
                frameCount = 0;
                lastTime = currentTime;
            }

            rafId = requestAnimationFrame(measureFps);
        };

        rafId = requestAnimationFrame(measureFps);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [enabled]);

    return {
        fps,
        shouldReduceDensity: fps < 30,
        shouldDisableAnimations: fps < 20,
        shouldDisableBackground: fps < 15,
    };
}
