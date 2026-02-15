import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatRelativeTime } from '@/lib/utils';

interface HeaderProps {
  capital: number;
  capitalUsed: number;
  agentStatus: 'online' | 'offline' | 'busy';
  lastSync: Date;
}

export function Header({ capital, capitalUsed, agentStatus, lastSync }: HeaderProps) {
  const capitalAvailable = capital - capitalUsed;
  const capitalPercentage = ((capital - capitalUsed) / capital) * 100;

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-zinc-500',
    busy: 'bg-warning',
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    busy: 'Busy',
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-3 sm:px-4 md:px-6 z-50 shadow-lg">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink pl-12 md:pl-0">
        <h1 className="text-sm sm:text-base md:text-xl font-bold text-white truncate">
          Mission Control
        </h1>
      </div>

      {/* Center: Capital Display */}
      <div className="hidden sm:flex flex-col items-center gap-1 min-w-[160px] md:min-w-[240px]">
        <div className="text-xs md:text-sm text-zinc-400">
          Capital: <span className="font-semibold text-white">${capitalAvailable}</span>
          <span className="text-zinc-500">/${capital}</span>
        </div>
        <Progress
          value={capitalPercentage}
          className="h-2 w-full bg-zinc-800"
        />
      </div>

      {/* Right: Agent Status + Last Sync */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[agentStatus]} ${agentStatus === 'busy' ? 'animate-pulse-slow' : ''}`} />
          <span className="text-xs md:text-sm font-medium text-white hidden sm:inline">{statusLabels[agentStatus]}</span>
        </div>
        <div className="text-xs text-zinc-500 hidden md:block">
          Last sync: {formatRelativeTime(lastSync)}
        </div>
      </div>
    </header>
  );
}
