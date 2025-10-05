'use client';

import { AppShell } from '@/components/AppShell';
import { ModeVibePicker } from '@/components/ModeVibePicker';
import { Composer } from '@/components/Composer';
import { AnswerStream } from '@/components/AnswerStream';
import { CitationsPanel } from '@/components/CitationsPanel';
import { StepTimeline } from '@/components/StepTimeline';
import { SourcePreviewPanel } from '@/components/SourcePreviewPanel';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { RabbitHoleGraph } from '@/components/RabbitHoleGraph';
import { useKeyboardShortcuts } from '@/components/KeyboardShortcutHandler';
import { useAppStore } from '@/lib/store';
import { useSearchStream } from '@/lib/hooks/useSearchStream';
import { saveToHistory } from '@/lib/history-storage';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { HistoryItem, GraphNode } from '@/types';
import { useRef } from 'react';

export default function HomePage() {
  const searchInputRef = useRef<HTMLDivElement>(null);

  const {
    selectedMode,
    selectedVibe,
    streamedContent,
    isStreaming,
    citations,
    searchSteps,
    activeSourcePreview,
    highlightedCitation,
    isRabbitHoleMode,
    currentQuery,
    openSourcePreview,
    closeSourcePreview,
    highlightCitation,
    setCurrentQuery,
    toggleSidebar,
  } = useAppStore();

  const { search, isLoading, error } = useSearchStream({
    onComplete: () => {
      toast.success('Search completed!');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);

    // Save to history
    saveToHistory({
      query,
      mode: selectedMode,
      vibe: selectedVibe,
      preview: query.slice(0, 100),
    });

    // Execute search
    await search(query, selectedMode, selectedVibe);
  };

  const handleCitationClick = (citationId: number) => {
    highlightCitation(citationId);
    const citation = citations.find((c) => c.id === citationId);
    if (citation) {
      openSourcePreview(citation.url);
    }
  };

  const handleSourceClick = (url: string) => {
    openSourcePreview(url);
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    handleSearch(item.query);
  };

  const handleHistoryItemRegenerate = (item: HistoryItem) => {
    // TODO: Show vibe selector modal
    handleSearch(item.query);
  };

  const handleGraphNodeClick = (node: GraphNode) => {
    // When a node is clicked in the graph, search for it
    handleSearch(node.label);
    toast.info(`Exploring: ${node.label}`);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      modifiers: ['cmd'],
      action: () => {
        searchInputRef.current?.querySelector('textarea')?.focus();
      },
      description: 'Focus search input',
    },
    {
      key: 'Escape',
      action: () => {
        if (activeSourcePreview) {
          closeSourcePreview();
        }
      },
      description: 'Close panels',
    },
    {
      key: 'b',
      modifiers: ['cmd'],
      action: () => {
        toggleSidebar();
      },
      description: 'Toggle sidebar',
    },
  ]);

  return (
    <>
      <AppShell
        sidebar={
          <HistoryDrawer
            onItemClick={handleHistoryItemClick}
            onItemRegenerate={handleHistoryItemRegenerate}
          />
        }
      >
        {isRabbitHoleMode ? (
          /* Rabbit Hole Mode - Full Screen Graph */
          <div className="h-full w-full p-6">
            <div className="h-full w-full rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <RabbitHoleGraph
                initialQuery={currentQuery}
                onNodeClick={handleGraphNodeClick}
              />
            </div>
          </div>
        ) : (
          /* Normal Mode - Standard Layout */
          <div className="container mx-auto max-w-7xl p-6 flex justify-center">
            <div className="w-full max-w-6xl">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main content area */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Mode and Vibe Picker */}
                  <ModeVibePicker />

                  {/* Search Input */}
                  <div ref={searchInputRef}>
                    <Composer onSubmit={handleSearch} isLoading={isLoading} />
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error.message}</p>
                    </div>
                  )}

                  {/* Answer Stream */}
                  {streamedContent && (
                    <AnswerStream
                      content={streamedContent}
                      isStreaming={isStreaming}
                      citations={citations}
                      onCitationClick={handleCitationClick}
                    />
                  )}

                  {/* Step Timeline (for deep/debate modes) */}
                  {(selectedMode === 'deep' || selectedMode === 'debate') && searchSteps.length > 0 && (
                    <StepTimeline steps={searchSteps} onSourceClick={handleSourceClick} />
                  )}
                </div>

                {/* Citations sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <CitationsPanel
                      citations={citations}
                      onCitationClick={(citation) => handleCitationClick(citation.id)}
                      highlightedId={highlightedCitation || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>

      {/* Source Preview Panel */}
      {activeSourcePreview && (
        <SourcePreviewPanel url={activeSourcePreview} onClose={closeSourcePreview} />
      )}

      {/* Toast notifications */}
      <Toaster />
    </>
  );
}
