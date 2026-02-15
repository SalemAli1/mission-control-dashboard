import { OpenClawStatus, OpenClawAgent } from '@/types/api';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

// Mock data for development
const mockStatus: OpenClawStatus = {
  version: '2026.2.9',
  gateway: {
    status: 'online',
    uptime: 3600,
    port: 18789
  },
  agents: {
    total: 1,
    active: 1,
    bootstrapping: 0
  },
  channels: {
    telegram: {
      enabled: true,
      status: 'OK'
    }
  },
  memory: {
    enabled: true,
    available: true
  }
};

const mockAgents: OpenClawAgent[] = [
  {
    id: 'agent-main',
    name: 'Main Agent',
    status: 'active',
    model: 'claude-sonnet-4-5-thinking',
    session: {
      tokens: 45000,
      maxTokens: 200000
    }
  }
];

export async function fetchOpenClawStatus(): Promise<OpenClawStatus | null> {
  try {
    const response = await fetch(`${GATEWAY_URL}/status`, {
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch OpenClaw status:', error);
    // Fallback to mock data on error
    return mockStatus;
  }
}

export async function fetchAgents(): Promise<OpenClawAgent[]> {
  try {
    const response = await fetch(`${GATEWAY_URL}/agents`, {
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    // Fallback to mock data on error
    return mockAgents;
  }
}
