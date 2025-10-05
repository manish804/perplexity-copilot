'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
    key: string;
    modifiers?: ('ctrl' | 'cmd' | 'shift' | 'alt')[];
    action: () => void;
    description: string;
}

interface KeyboardShortcutHandlerProps {
    shortcuts: KeyboardShortcut[];
    children?: React.ReactNode;
}

export function KeyboardShortcutHandler({ shortcuts, children }: KeyboardShortcutHandlerProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const modifiers = shortcut.modifiers || [];
                const ctrlOrCmd = modifiers.includes('ctrl') || modifiers.includes('cmd');
                const shift = modifiers.includes('shift');
                const alt = modifiers.includes('alt');

                const ctrlOrCmdPressed = e.ctrlKey || e.metaKey;
                const shiftPressed = e.shiftKey;
                const altPressed = e.altKey;

                const modifiersMatch =
                    (!ctrlOrCmd || ctrlOrCmdPressed) &&
                    (!shift || shiftPressed) &&
                    (!alt || altPressed) &&
                    (ctrlOrCmd ? ctrlOrCmdPressed : !e.ctrlKey && !e.metaKey) &&
                    (shift ? shiftPressed : !e.shiftKey) &&
                    (alt ? altPressed : !e.altKey);

                if (modifiersMatch && e.key.toLowerCase() === shortcut.key.toLowerCase()) {
                    e.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);

    return <>{children}</>;
}

// Hook for using keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const modifiers = shortcut.modifiers || [];
                const ctrlOrCmd = modifiers.includes('ctrl') || modifiers.includes('cmd');
                const shift = modifiers.includes('shift');
                const alt = modifiers.includes('alt');

                const ctrlOrCmdPressed = e.ctrlKey || e.metaKey;
                const shiftPressed = e.shiftKey;
                const altPressed = e.altKey;

                const modifiersMatch =
                    (!ctrlOrCmd || ctrlOrCmdPressed) &&
                    (!shift || shiftPressed) &&
                    (!alt || altPressed) &&
                    (ctrlOrCmd ? ctrlOrCmdPressed : !e.ctrlKey && !e.metaKey) &&
                    (shift ? shiftPressed : !e.shiftKey) &&
                    (alt ? altPressed : !e.altKey);

                if (modifiersMatch && e.key.toLowerCase() === shortcut.key.toLowerCase()) {
                    e.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}
