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
    <div className="space-y-3">
      {/* "All Ventures" option */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
          selectedId === null
            ? 'bg-zinc-800 text-white font-medium'
            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
        }`}
      >
        All Ventures
      </button>

      {/* Venture cards */}
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
  );
}
