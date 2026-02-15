import React from 'react';
import { VentureCard } from './VentureCard';
import type { Venture, Task } from '@/types';

interface VentureListProps {
  ventures: Venture[];
  tasks: Task[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function VentureList({ ventures, tasks, selectedId, onSelect }: VentureListProps) {
  const priorityMap: Record<string, number> = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };

  // Sort ventures by priority (descending) then name
  const sortedVentures = [...ventures].sort((a, b) => {
    const pA = priorityMap[a.priority as string] || 0;
    const pB = priorityMap[b.priority as string] || 0;
    const priorityDiff = pB - pA;
    if (priorityDiff !== 0) return priorityDiff;
    return a.name.localeCompare(b.name);
  });

  // Calculate task counts for each venture
  const getVentureStats = (ventureId: string) => {
    const ventureTasks = tasks.filter(t => t.ventureId === ventureId);
    return {
      active: ventureTasks.filter(t => t.status === 'active').length,
      completed: ventureTasks.filter(t => t.status === 'completed').length,
      total: ventureTasks.length,
    };
  };

  return (
    <div className="space-y-4">
      {/* "All Ventures" option */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all border ${
          selectedId === null
            ? 'bg-primary/20 text-white border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.1)]'
            : 'text-zinc-500 border-transparent hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
            <div className={`w-1 h-1 rounded-full ${selectedId === null ? 'bg-primary' : 'bg-zinc-700'}`} />
            Global Overview
        </div>
      </button>

      {/* Venture cards */}
      <div className="space-y-3">
        {sortedVentures.map((venture) => {
            const stats = getVentureStats(venture.id);
            return (
            <VentureCard
                key={venture.id}
                venture={venture}
                selected={selectedId === venture.id}
                onClick={() => onSelect(venture.id)}
                activeTasks={stats.active}
                completedTasks={stats.completed}
                totalTasks={stats.total}
            />
            );
        })}
      </div>
    </div>
  );
}
