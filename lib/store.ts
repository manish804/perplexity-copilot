import { create } from 'zustand';
import { QueryMode, Vibe, Citation, SearchStep } from '@/types';

interface AppState {
    // UI State
    selectedMode: QueryMode;
    selectedVibe: Vibe;
    isRabbitHoleMode: boolean;

    // Active Query
    currentQuery: string;
    isStreaming: boolean;
    streamedContent: string;

    // Results
    citations: Citation[];
    searchSteps: SearchStep[];
    relatedQueries: string[];

    // UI Controls
    isSidebarOpen: boolean;
    activeSourcePreview: string | null;
    highlightedCitation: number | null;

    // Actions
    setMode: (mode: QueryMode) => void;
    setVibe: (vibe: Vibe) => void;
    toggleRabbitHoleMode: () => void;
    setCurrentQuery: (query: string) => void;
    setIsStreaming: (isStreaming: boolean) => void;
    setStreamedContent: (content: string) => void;
    appendStreamedContent: (content: string) => void;
    setCitations: (citations: Citation[]) => void;
    setSearchSteps: (steps: SearchStep[]) => void;
    setRelatedQueries: (queries: string[]) => void;
    toggleSidebar: () => void;
    openSourcePreview: (url: string) => void;
    closeSourcePreview: () => void;
    highlightCitation: (id: number | null) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initial state
    selectedMode: 'quick',
    selectedVibe: 'friendly',
    isRabbitHoleMode: false,
    currentQuery: '',
    isStreaming: false,
    streamedContent: '',
    citations: [],
    searchSteps: [],
    relatedQueries: [],
    isSidebarOpen: true,
    activeSourcePreview: null,
    highlightedCitation: null,

    // Actions
    setMode: (mode) => set({ selectedMode: mode }),
    setVibe: (vibe) => set({ selectedVibe: vibe }),
    toggleRabbitHoleMode: () => set((state) => ({ isRabbitHoleMode: !state.isRabbitHoleMode })),
    setCurrentQuery: (query) => set({ currentQuery: query }),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    setStreamedContent: (content) => set({ streamedContent: content }),
    appendStreamedContent: (content) =>
        set((state) => ({ streamedContent: state.streamedContent + content })),
    setCitations: (citations) => set({ citations }),
    setSearchSteps: (steps) => set({ searchSteps: steps }),
    setRelatedQueries: (queries) => set({ relatedQueries: queries }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openSourcePreview: (url) => set({ activeSourcePreview: url }),
    closeSourcePreview: () => set({ activeSourcePreview: null }),
    highlightCitation: (id) => set({ highlightedCitation: id }),
    reset: () =>
        set({
            currentQuery: '',
            isStreaming: false,
            streamedContent: '',
            citations: [],
            searchSteps: [],
            relatedQueries: [],
            activeSourcePreview: null,
            highlightedCitation: null,
        }),
}));
