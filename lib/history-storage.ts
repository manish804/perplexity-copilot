import { HistoryItem } from '@/types';

const HISTORY_KEY = 'pplx-copilot-history';
const MAX_HISTORY_ITEMS = 20;

// Simple UUID generator for browser compatibility
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    try {
        const history = getHistory();
        const newItem: HistoryItem = {
            ...item,
            id: generateId(),
            timestamp: Date.now(),
        };

        // Add to beginning of array
        history.unshift(newItem);

        // Keep only the last MAX_HISTORY_ITEMS
        const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error('Failed to save to history:', error);
    }
}

export function getHistory(): HistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to load history:', error);
        return [];
    }
}

export function deleteHistoryItem(id: string): void {
    if (typeof window === 'undefined') return;

    try {
        const history = getHistory();
        const filtered = history.filter((item) => item.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete history item:', error);
    }
}

export function clearHistory(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}
