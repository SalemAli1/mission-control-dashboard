export type AgentStatus = 'online' | 'offline' | 'busy' | 'error';
export type AgentType = 'main' | 'telegram' | 'web' | 'worker';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;

  // Connection info
  endpoint: string; // e.g., "ws://127.0.0.1:18789"
  lastPing: Date;
  uptime: number; // seconds

  // Model info
  model: string; // e.g., "claude-sonnet-4-5-thinking"
  provider: string; // e.g., "google-antigravity"

  // Usage
  tokensUsed: number;
  tokensTotal: number;
  requestsToday: number;

  // Current activity
  currentTask: string | null;
  currentVenture: string | null; // venture ID

  // Metadata
  createdAt: Date;
  version: string; // e.g., "2026.2.9"
}

export interface AgentMetrics {
  agentId: string;
  tokenUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    averageResponseTime: number; // ms
    successRate: number; // 0-100
    errorsToday: number;
  };
  activity: {
    tasksCompleted: number;
    tasksActive: number;
    lastActivity: Date;
  };
}
