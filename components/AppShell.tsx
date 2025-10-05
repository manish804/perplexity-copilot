'use client';

import { useAppStore } from '@/lib/store';
import { Menu, X, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AppShellProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export function AppShell({ children, sidebar }: AppShellProps) {
    const { isSidebarOpen, toggleSidebar, isRabbitHoleMode, toggleRabbitHoleMode } = useAppStore();

    return (
        <div className="flex h-screen w-full overflow-hidden relative">
            {/* Animated gradient orbs */}
            <div className="gradient-orb gradient-orb-1" />
            <div className="gradient-orb gradient-orb-2" />
            <div className="gradient-orb gradient-orb-3" />
            <div className="gradient-orb gradient-orb-4" />

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed left-0 top-0 z-40 h-full w-80 border-r border-border bg-card/70 backdrop-blur-xl transition-transform duration-300`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-border p-4 h-[73px]">
                        <h2 className="text-lg font-semibold glow-text">History</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            title="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
                </div>
            </aside>

            {/* Main content */}
            <main className={`flex flex-1 flex-col overflow-hidden relative z-10 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
                <header className="flex items-center justify-between border-b border-border p-4 bg-card/40 backdrop-blur-xl h-[73px]">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                        >
                            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <h1 className="text-2xl font-bold glow-text">Perplexity Research Copilot</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant={isRabbitHoleMode ? 'default' : 'outline'}
                            size="sm"
                            onClick={toggleRabbitHoleMode}
                            className="gap-2"
                        >
                            <Network className="h-4 w-4" />
                            Rabbit Hole Mode
                        </Button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}
