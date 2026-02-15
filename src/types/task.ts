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
