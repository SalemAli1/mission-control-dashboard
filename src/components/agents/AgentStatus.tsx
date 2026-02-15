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
      <div className="flex items-center gap-2 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${statusColor} ${
            agent.status === 'busy' ? 'animate-pulse-slow' : ''
          }`}
        />
        <span className="text-white">{agent.name}</span>
        <span className="text-zinc-500">-</span>
        <span className="text-zinc-400 capitalize">{agent.status}</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
      {/* Name + Status */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${statusColor} ${
            agent.status === 'busy' ? 'animate-pulse-slow' : ''
          }`}
        />
        <span className="text-sm font-semibold text-white">{agent.name}</span>
      </div>

      {/* Model */}
      <div className="text-xs text-zinc-400 mb-2">{agent.model}</div>

      {/* Token Usage */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Tokens</span>
          <span>
            {(agent.tokensUsed / 1000).toFixed(0)}k/{(agent.tokensTotal / 1000).toFixed(0)}k ({tokenPercentage}%)
          </span>
        </div>
        <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              tokenPercentage > 80 ? 'bg-error' : tokenPercentage > 50 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${tokenPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Task */}
      {agent.currentTask && (
        <div className="mt-2 text-xs text-zinc-400">
          Working on:{' '}
          <span className="text-white font-medium">{agent.currentTask}</span>
        </div>
      )}
    </div>
  );
}
