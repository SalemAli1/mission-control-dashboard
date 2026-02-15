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
    <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 md:px-8 z-50 shadow-2xl">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink pl-12 md:pl-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg glow-primary">
            <span className="text-white font-black text-xs">MC</span>
        </div>
        <h1 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-tighter truncate">
          Mission Control
        </h1>
      </div>

      {/* Center: Capital Display */}
      <div className="hidden sm:flex flex-col items-center gap-1.5 min-w-[180px] md:min-w-[300px]">
        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400">
          Available Capital: <span className="text-primary">${capitalAvailable}</span>
          <span className="text-zinc-600 ml-1">/ ${capital}</span>
        </div>
        <Progress
          value={capitalPercentage}
          className="h-1.5 w-full bg-white/5 overflow-hidden rounded-full"
        />
      </div>

      {/* Right: Agent Status + Last Sync */}
      <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-shrink">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <div className={`w-2 h-2 rounded-full ${statusColors[agentStatus]} ${agentStatus === 'busy' ? 'animate-pulse-slow' : 'shadow-[0_0_8px_currentColor]'}`} style={{ color: `var(--color-${agentStatus === 'offline' ? 'zinc-500' : agentStatus})` }} />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white hidden sm:inline">{statusLabels[agentStatus]}</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500 hidden md:block">
          Sync: <span className="text-zinc-400">{formatRelativeTime(lastSync)}</span>
        </div>
      </div>
    </header>
  );
}
