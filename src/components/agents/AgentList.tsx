import React, { useState } from 'react';
import { AgentStatus } from './AgentStatus';
import type { Agent } from '@/types';

interface AgentListProps {
  agents: Agent[];
  compact?: boolean;
}

export function AgentList({ agents, compact = false }: AgentListProps) {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());

  // Sort agents: online first, then busy, then offline
  const sortedAgents = [...agents].sort((a, b) => {
    const statusOrder = { online: 0, busy: 1, offline: 2, error: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const toggleExpand = (agentId: string) => {
    const newExpanded = new Set(expandedAgents);
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId);
    } else {
      newExpanded.add(agentId);
    }
    setExpandedAgents(newExpanded);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {sortedAgents.map((agent) => (
          <AgentStatus key={agent.id} agent={agent} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedAgents.map((agent) => {
        const isExpanded = expandedAgents.has(agent.id);
        return (
          <div key={agent.id}>
            <button
              onClick={() => toggleExpand(agent.id)}
              className="w-full text-left"
            >
              <AgentStatus agent={agent} compact={!isExpanded} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
