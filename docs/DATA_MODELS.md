# Data Models - TypeScript Interfaces

## Core Types

### Venture (`src/types/venture.ts`)

```typescript
export type VentureStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Venture {
  id: string;
  name: string;
  description: string;
  status: VentureStatus;
  color: string; // Hex color for UI (e.g., "#3B82F6")
  icon: string; // Emoji or icon name (e.g., "🛒")

  // Metrics
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  capitalAllocated: number; // Amount spent on this venture

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  priority: number; // 1-5 (5 is highest)
  tags: string[]; // e.g., ["automation", "e-commerce"]
}

export interface VentureMetrics {
  ventureId: string;
  tasksCompleted: number;
  tasksActive: number;
  totalSpend: number;
  successRate: number; // 0-100
  lastActivity: Date;
}
```

### Agent (`src/types/agent.ts`)

```typescript
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
```

### Task (`src/types/task.ts`)

```typescript
export type TaskStatus = 'queue' | 'active' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;

  // Assignment
  ventureId: string;
  assignedAgent: string | null; // agent ID

  // Details
  estimatedCost: number; // Estimated $ cost
  actualCost: number; // Actual $ spent
  estimatedTokens: number;
  actualTokens: number;

  // Dependencies
  blockedBy: string[]; // task IDs that must complete first
  blocks: string[]; // task IDs that depend on this one

  // Metadata
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  createdBy: string; // 'user' | 'agent' | 'telegram'

  // Results
  output: string | null; // Task output/results
  error: string | null; // Error message if failed

  tags: string[];
}

export interface TaskProgress {
  taskId: string;
  percentage: number; // 0-100
  currentStep: string;
  totalSteps: number;
  estimatedTimeRemaining: number; // seconds
}
```

### Activity (`src/types/activity.ts`)

```typescript
export type ActivityType =
  | 'task_created'
  | 'task_started'
  | 'task_completed'
  | 'task_failed'
  | 'agent_online'
  | 'agent_offline'
  | 'capital_spent'
  | 'venture_updated'
  | 'error'
  | 'info';

export type ActivityLevel = 'info' | 'warning' | 'error' | 'success';

export interface Activity {
  id: string;
  type: ActivityType;
  level: ActivityLevel;

  // Content
  title: string;
  description: string;
  metadata: Record<string, any>; // Flexible metadata

  // Relations
  agentId: string | null;
  ventureId: string | null;
  taskId: string | null;

  // Timestamp
  timestamp: Date;

  // UI
  icon: string; // Emoji or icon name
  color: string; // For visual distinction
}
```

### Dashboard State (`src/types/dashboard.ts`)

```typescript
export interface DashboardState {
  // Data
  ventures: Venture[];
  agents: Agent[];
  tasks: Task[];
  activities: Activity[];

  // UI State
  selectedVenture: string | null; // Filter by venture
  selectedAgent: string | null; // Filter by agent
  viewMode: 'kanban' | 'list' | 'calendar';
  sidebarCollapsed: boolean;

  // Metrics
  totalCapital: number;
  availableCapital: number;
  totalTasksCompleted: number;
  totalTokensUsed: number;

  // Status
  isConnected: boolean; // Connected to OpenClaw gateway
  lastSync: Date;
  errors: string[];
}

export interface DashboardFilters {
  venture: string | null;
  agent: string | null;
  status: TaskStatus[];
  priority: TaskPriority[];
  dateRange: {
    start: Date;
    end: Date;
  } | null;
  searchQuery: string;
}
```

### API Response Types (`src/types/api.ts`)

```typescript
// OpenClaw Gateway Responses
export interface OpenClawStatus {
  version: string;
  gateway: {
    status: 'online' | 'offline';
    uptime: number;
    port: number;
  };
  agents: {
    total: number;
    active: number;
    bootstrapping: number;
  };
  channels: {
    telegram: {
      enabled: boolean;
      status: 'OK' | 'ERROR';
    };
  };
  memory: {
    enabled: boolean;
    available: boolean;
  };
}

export interface OpenClawAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  model: string;
  session: {
    tokens: number;
    maxTokens: number;
  };
}

// Semantic Search Response
export interface SearchResult {
  content: string;
  metadata: {
    path: string;
  };
  distance: number; // Lower is more relevant
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  timestamp: Date;
}
```

## Seed Data Example

```typescript
// src/data/seed.ts
import { Venture, Agent, Task } from '@/types';

export const mockVentures: Venture[] = [
  {
    id: 'venture-1',
    name: 'E-Commerce Automation',
    description: 'AI-driven DTC/E-commerce automation platform',
    status: 'active',
    color: '#3B82F6',
    icon: '🛒',
    totalTasks: 12,
    activeTasks: 3,
    completedTasks: 9,
    capitalAllocated: 85.50,
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date(),
    priority: 5,
    tags: ['automation', 'e-commerce', 'ai']
  },
  {
    id: 'venture-2',
    name: 'Allbirds Automation',
    description: 'Automated monitoring and analytics for Allbirds',
    status: 'active',
    color: '#10B981',
    icon: '👟',
    totalTasks: 8,
    activeTasks: 2,
    completedTasks: 6,
    capitalAllocated: 42.25,
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date(),
    priority: 4,
    tags: ['monitoring', 'analytics']
  }
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-main',
    name: 'Main Agent',
    type: 'main',
    status: 'online',
    endpoint: 'ws://127.0.0.1:18789',
    lastPing: new Date(),
    uptime: 3600,
    model: 'claude-sonnet-4-5-thinking',
    provider: 'google-antigravity',
    tokensUsed: 45000,
    tokensTotal: 200000,
    requestsToday: 12,
    currentTask: 'task-3',
    currentVenture: 'venture-1',
    createdAt: new Date('2026-02-09'),
    version: '2026.2.9'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Research Allbirds product catalog',
    description: 'Scrape and analyze current product offerings',
    status: 'queue',
    priority: 'high',
    ventureId: 'venture-2',
    assignedAgent: null,
    estimatedCost: 5.00,
    actualCost: 0,
    estimatedTokens: 50000,
    actualTokens: 0,
    blockedBy: [],
    blocks: ['task-2'],
    createdAt: new Date(),
    startedAt: null,
    completedAt: null,
    createdBy: 'user',
    output: null,
    error: null,
    tags: ['research', 'scraping']
  }
];
```

## Constants (`src/lib/constants.ts`)

```typescript
export const TASK_STATUS_LABELS = {
  queue: 'Queue',
  active: 'Active',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
} as const;

export const TASK_STATUS_COLORS = {
  queue: 'bg-gray-500',
  active: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-gray-400'
} as const;

export const PRIORITY_COLORS = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
} as const;

export const AGENT_STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-yellow-500',
  error: 'bg-red-500'
} as const;

export const INITIAL_CAPITAL = 200.00;
export const RESERVE_FUND = 40.00;
export const AVAILABLE_CAPITAL = INITIAL_CAPITAL - RESERVE_FUND;
```

## Usage Examples

```typescript
// Creating a new task
const newTask: Task = {
  id: crypto.randomUUID(),
  title: 'Implement payment gateway',
  description: 'Integrate Stripe for e-commerce platform',
  status: 'queue',
  priority: 'high',
  ventureId: 'venture-1',
  assignedAgent: null,
  estimatedCost: 15.00,
  actualCost: 0,
  estimatedTokens: 150000,
  actualTokens: 0,
  blockedBy: [],
  blocks: [],
  createdAt: new Date(),
  startedAt: null,
  completedAt: null,
  createdBy: 'user',
  output: null,
  error: null,
  tags: ['integration', 'payment']
};

// Filtering tasks by venture
const ventureTasks = tasks.filter(t => t.ventureId === selectedVentureId);

// Calculating capital used
const capitalUsed = ventures.reduce((sum, v) => sum + v.capitalAllocated, 0);
const capitalRemaining = AVAILABLE_CAPITAL - capitalUsed;
```
