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
