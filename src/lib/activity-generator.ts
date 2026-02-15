import type { Activity, Task, Agent } from '@/types';

let activityCounter = 0;

function generateId(): string {
  return `activity-${Date.now()}-${activityCounter++}`;
}

export function createActivity(
  type: string,
  data: Record<string, any>
): Activity {
  const baseActivity = {
    timestamp: new Date(),
    metadata: data,
    agentId: data.agent?.id || null,
    ventureId: data.task?.ventureId || data.venture?.id || null,
    taskId: data.task?.id || null,
    color: '#3b82f6', // default blue
  };

  const details = getActivityDetails(type, data);

  return {
    id: generateId(),
    type: 'info', // default
    ...baseActivity,
    ...details,
  } as Activity;
}

function getActivityDetails(type: string, data: any): Pick<Activity, 'icon' | 'title' | 'description' | 'level'> {
  switch (type) {
    case 'taskCompleted':
      return {
        icon: '✅',
        title: 'Task Completed',
        description: `"${data.task.title}" has been completed`,
        level: 'success',
      };

    case 'taskStarted':
      return {
        icon: '▶️',
        title: 'Task Started',
        description: `"${data.task.title}" is now active`,
        level: 'info',
      };

    case 'agentStatusChanged':
      return {
        icon: '🤖',
        title: 'Agent Status Changed',
        description: `${data.agent.name} is now ${data.newStatus}`,
        level: data.newStatus === 'error' ? 'error' : 'info',
      };

    case 'capitalSpent':
      return {
        icon: '💰',
        title: 'Capital Spent',
        description: `$${data.amount.toFixed(2)} - ${data.description}`,
        level: 'warning',
      };

    case 'errorOccurred':
      return {
        icon: '❌',
        title: 'Error',
        description: data.message,
        level: 'error',
      };

    case 'taskCreated':
      return {
        icon: '➕',
        title: 'Task Created',
        description: `"${data.task.title}" added to queue`,
        level: 'info',
      };

    case 'taskMoved':
      return {
        icon: '🔄',
        title: 'Task Moved',
        description: `"${data.task.title}" moved to ${data.newStatus}`,
        level: 'info',
      };

    case 'ventureCreated':
      return {
        icon: '🚀',
        title: 'Venture Created',
        description: `New venture "${data.venture.name}" has been established`,
        level: 'success',
      };

    default:
      return {
        icon: 'ℹ️',
        title: 'Activity',
        description: JSON.stringify(data),
        level: 'info',
      };
  }
}

// Helper functions for common activity types
export function taskCompleted(task: Task): Activity {
  return createActivity('taskCompleted', { task });
}

export function taskStarted(task: Task): Activity {
  return createActivity('taskStarted', { task });
}

export function taskCreated(task: Task): Activity {
  return createActivity('taskCreated', { task });
}

export function taskMoved(task: Task, newStatus: string): Activity {
  return createActivity('taskMoved', { task, newStatus });
}

export function agentStatusChanged(
  agent: Agent,
  oldStatus: string,
  newStatus: string
): Activity {
  return createActivity('agentStatusChanged', { agent, oldStatus, newStatus });
}

export function capitalSpent(amount: number, description: string): Activity {
  return createActivity('capitalSpent', { amount, description });
}

export function errorOccurred(message: string): Activity {
  return createActivity('errorOccurred', { message });
}
