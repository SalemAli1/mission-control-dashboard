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
