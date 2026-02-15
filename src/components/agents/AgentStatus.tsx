import React from 'react';
import type { Agent } from '@/types';
import { AGENT_STATUS_COLORS } from '@/lib/constants';
import { calculateTokenPercentage } from '@/lib/utils';

interface AgentStatusProps {
  agent: Agent;
  compact?: boolean;
}

export function AgentStatus({ agent, compact = false }: AgentStatusProps) {
  const statusColor = AGENT_STATUS_COLORS[agent.status];
  const tokenPercentage = calculateTokenPercentage(
    agent.tokensUsed,
    agent.tokensTotal
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2 group cursor-pointer py-1">
        <div
          className={`w-1.5 h-1.5 rounded-full ${statusColor} ${
            agent.status === 'busy' ? 'animate-pulse-slow' : 'shadow-[0_0_8px_currentColor]'
          }`}
          style={{ color: `var(--color-${agent.status === 'offline' ? 'zinc-500' : agent.status})` }}
        />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{agent.name}</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 transition-all group shadow-xl">
      {/* Name + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            <div
            className={`w-1.5 h-1.5 rounded-full ${statusColor} ${
                agent.status === 'busy' ? 'animate-pulse-slow' : 'shadow-[0_0_8px_currentColor]'
            }`}
            style={{ color: `var(--color-${agent.status === 'offline' ? 'zinc-500' : agent.status})` }}
            />
            <span className="text-xs font-black uppercase tracking-widest text-white">{agent.name}</span>
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{agent.status}</span>
      </div>

      {/* Model */}
      <div className="text-[10px] font-bold text-primary mb-3 uppercase tracking-tight">{agent.model}</div>

      {/* Token Usage */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
          <span>Neural Load</span>
          <span className="text-zinc-400">
            {tokenPercentage}%
          </span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              tokenPercentage > 80 ? 'bg-error' : tokenPercentage > 50 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${tokenPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Task */}
      {agent.currentTask && (
        <div className="pt-3 border-t border-white/5">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Pipeline</p>
            <p className="text-[10px] font-bold text-zinc-300 truncate tracking-tight">{agent.currentTask}</p>
        </div>
      )}
    </div>
  );
}
