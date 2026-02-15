import { Venture } from './venture';
import { Agent } from './agent';
import { Task, TaskStatus, TaskPriority } from './task';
import { Activity } from './activity';

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
