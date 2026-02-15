export type VentureStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Venture {
  id: string;
  name: string;
  description?: string | null;
  status: string; // VentureStatus
  icon: string; // Emoji or icon name (e.g., "🛒")
  priority: string; // 'low' | 'medium' | 'high'

  // Capital tracking
  capitalSpent: number;
  capitalBudget: number;

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;

  // Computed fields (from API includes)
  tasks?: any[];
  _count?: { tasks: number };

  // Legacy fields (for backward compatibility)
  color?: string;
  totalTasks?: number;
  activeTasks?: number;
  completedTasks?: number;
  capitalAllocated?: number; // Alias for capitalSpent
  tags?: string[];
}

export interface VentureMetrics {
  ventureId: string;
  tasksCompleted: number;
  tasksActive: number;
  totalSpend: number;
  successRate: number; // 0-100
  lastActivity: Date;
}
