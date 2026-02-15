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
