import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { Venture, Agent, Task } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
  capital: number;
  capitalUsed: number;
  agentStatus: 'online' | 'offline' | 'busy';
  lastSync: Date;
  ventures: Venture[];
  agents: Agent[];
  tasks: Task[];
  selectedVenture: string | null;
  onSelectVenture: (id: string | null) => void;
  onSearchClick?: () => void;
  onMemoryClick?: () => void;
}

export function MainLayout({
  children,
  capital,
  capitalUsed,
  agentStatus,
  lastSync,
  ventures,
  agents,
  tasks,
  selectedVenture,
  onSelectVenture,
  onSearchClick,
  onMemoryClick,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <Header
        capital={capital}
        capitalUsed={capitalUsed}
        agentStatus={agentStatus}
        lastSync={lastSync}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Backdrop clicked!'); // Debug log
            setSidebarOpen(false);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            console.log('Backdrop touched!'); // Debug log
            setSidebarOpen(false);
          }}
        />
      )}

      {/* Sidebar - Overlay on mobile, static on desktop */}
      <div className={`
        fixed md:fixed top-0 left-0 h-full z-50 md:z-auto
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          ventures={ventures}
          agents={agents}
          tasks={tasks}
          selectedVenture={selectedVenture}
          onSelectVenture={onSelectVenture}
          onSearchClick={onSearchClick}
          onMemoryClick={onMemoryClick}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile menu button - only show when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[60] bg-zinc-800 text-white p-2.5 rounded-lg shadow-lg hover:bg-zinc-700 transition-all active:scale-95 border border-zinc-700"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main Content Area */}
      <main className="pt-16 md:pl-[280px] min-h-screen">
        <div className="p-3 sm:p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
