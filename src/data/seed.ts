import { Venture } from '@/types/venture';
import { Agent } from '@/types/agent';
import { Task } from '@/types/task';
import { Activity } from '@/types/activity';

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
    capitalSpent: 85.50,
    capitalBudget: 200,
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date(),
    priority: 'high',
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
    capitalSpent: 42.25,
    capitalBudget: 100,
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date(),
    priority: 'medium',
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
  },
  {
    id: 'task-2',
    title: 'Build pricing comparison tool',
    description: 'Create tool to compare Allbirds pricing across retailers',
    status: 'queue',
    priority: 'medium',
    ventureId: 'venture-2',
    assignedAgent: null,
    estimatedCost: 8.50,
    actualCost: 0,
    estimatedTokens: 85000,
    actualTokens: 0,
    blockedBy: ['task-1'],
    blocks: [],
    createdAt: new Date(),
    startedAt: null,
    completedAt: null,
    createdBy: 'user',
    output: null,
    error: null,
    tags: ['development', 'tools']
  },
  {
    id: 'task-3',
    title: 'Implement payment gateway',
    description: 'Integrate Stripe for e-commerce platform',
    status: 'active',
    priority: 'high',
    ventureId: 'venture-1',
    assignedAgent: 'agent-main',
    estimatedCost: 15.00,
    actualCost: 8.25,
    estimatedTokens: 150000,
    actualTokens: 82500,
    blockedBy: [],
    blocks: [],
    createdAt: new Date('2026-02-09T20:00:00'),
    startedAt: new Date('2026-02-09T20:30:00'),
    completedAt: null,
    createdBy: 'user',
    output: null,
    error: null,
    tags: ['integration', 'payment']
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    type: 'task_started',
    level: 'info',
    title: 'Task Started',
    description: 'Main Agent started working on "Implement payment gateway"',
    metadata: { taskId: 'task-3' },
    agentId: 'agent-main',
    ventureId: 'venture-1',
    taskId: 'task-3',
    timestamp: new Date('2026-02-09T20:30:00'),
    icon: '▶️',
    color: '#3B82F6'
  },
  {
    id: 'activity-2',
    type: 'agent_online',
    level: 'success',
    title: 'Agent Online',
    description: 'Main Agent connected and ready',
    metadata: {},
    agentId: 'agent-main',
    ventureId: null,
    taskId: null,
    timestamp: new Date('2026-02-09T20:00:00'),
    icon: '🟢',
    color: '#10B981'
  }
];
