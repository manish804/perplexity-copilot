'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Detect system theme preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            const isDark = e.matches;
            document.documentElement.classList.toggle('dark', isDark);
        };

        // Set initial theme
        updateTheme(mediaQuery);

        // Listen for changes
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    // Prevent flash of unstyled content
    if (!mounted) {
        return null;
    }

    return <>{children}</>;
}
