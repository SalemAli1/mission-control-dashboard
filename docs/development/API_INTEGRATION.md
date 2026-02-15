# API Integration Guide

## Overview

Mission Control Dashboard integrates with two main APIs:
1. **OpenClaw Gateway** - Agent management and task execution
2. **Semantic Search Engine** - Knowledge base queries

---

## OpenClaw Gateway Integration

### Configuration

**Environment Variables** (`.env.local`):
```bash
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=5cff9f8966d1126023ec5dd52fb71c8ce183f5cf521a3830
```

**Location:** `src/lib/api/openclaw.ts`

---

### Available Endpoints

#### 1. Get Gateway Status

```typescript
import { fetchOpenClawStatus } from '@/lib/api/openclaw';

const status = await fetchOpenClawStatus();
// Returns: OpenClawStatus | null
```

**Response Type:**
```typescript
interface OpenClawStatus {
  version: string;
  gateway: {
    status: 'online' | 'offline';
    uptime: number;  // seconds
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
```

**Use Case:** Display system health in header/dashboard

---

#### 2. Get Agents List

```typescript
import { fetchAgents } from '@/lib/api/openclaw';

const agents = await fetchAgents();
// Returns: OpenClawAgent[]
```

**Response Type:**
```typescript
interface OpenClawAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  model: string;
  session: {
    tokens: number;
    maxTokens: number;
  };
}
```

**Use Case:** Display agent status in sidebar, track token usage

---

### Implementation Details

**Current State:** Returns mock data (Phase 2 implementation)

**Real Implementation** (Phase 8 - Task 32):
```typescript
export async function fetchOpenClawStatus(): Promise<OpenClawStatus | null> {
  try {
    const response = await fetch(`${GATEWAY_URL}/status`, {
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch OpenClaw status:', error);
    return null;
  }
}
```

---

### Error Handling

**Strategy:** Graceful degradation with fallbacks

```typescript
// In your component
const [status, setStatus] = useState<OpenClawStatus | null>(null);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadStatus() {
    const data = await fetchOpenClawStatus();
    if (data) {
      setStatus(data);
      setError(null);
    } else {
      setError('Failed to connect to OpenClaw gateway');
      // Use fallback/mock data
      setStatus(mockStatus);
    }
  }
  loadStatus();
}, []);
```

**User Experience:**
- Show connection status in header
- Display error banner if gateway is offline
- Continue showing cached data during outages
- Retry automatically with exponential backoff

---

### Polling Strategy

**Recommended:** Poll every 5 seconds for real-time updates

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetchOpenClawStatus();
    if (data) {
      setStatus(data);
      setLastSync(new Date());
    }
  }, 5000); // 5 seconds

  return () => clearInterval(interval);
}, []);
```

**Optimization:**
- Only poll when tab is visible (use `document.visibilityState`)
- Increase interval when gateway is offline
- Use WebSocket for true real-time (future enhancement)

---

## Semantic Search Integration

### Configuration

**Environment Variables:**
```bash
SEMANTIC_SEARCH_PATH=/home/salem/hq/apps/semantic-engine
```

**Location:** `src/lib/api/semantic-search.ts`

---

### Available Functions

#### 1. Search Knowledge Base

```typescript
import { searchKnowledge } from '@/lib/api/semantic-search';

const results = await searchKnowledge('how to implement drag and drop', {
  maxResults: 5,
  threshold: 0.7  // 0-1, higher = more relevant only
});
```

**Response Type:**
```typescript
interface SearchResponse {
  query: string;
  results: SearchResult[];
  timestamp: Date;
}

interface SearchResult {
  content: string;        // Matched text
  metadata: {
    path: string;         // File path
  };
  distance: number;       // 0-1, lower = more relevant
}
```

**Use Case:**
- Search button in sidebar → open modal with results
- Auto-suggest similar tasks when creating new task
- Find relevant documentation for error messages

---

#### 2. Check Availability

```typescript
import { isSemanticSearchAvailable, getSemanticSearchStatus } from '@/lib/api/semantic-search';

const available = isSemanticSearchAvailable();
// Returns: boolean

const status = getSemanticSearchStatus();
// Returns: { available: boolean, path: string, error?: string }
```

**Use Case:** Disable search button if service unavailable

---

### Implementation Details

**How It Works:**
1. Executes Python script via `child_process.execSync()`
2. Passes query as command-line argument
3. Parses JSON output from script
4. Returns formatted results

**Error Scenarios:**
- Script not found → Returns null
- Script timeout (30s) → Returns null
- Invalid JSON output → Attempts text parsing fallback
- Python not installed → Returns null

---

### Example Usage

```typescript
// In a search modal component
const [query, setQuery] = useState('');
const [results, setResults] = useState<SearchResult[]>([]);
const [loading, setLoading] = useState(false);

const handleSearch = async () => {
  if (!query.trim()) return;

  setLoading(true);
  const response = await searchKnowledge(query, { maxResults: 10 });

  if (response) {
    setResults(response.results);
  } else {
    // Show error toast
    toast.error('Search failed. Please try again.');
  }

  setLoading(false);
};
```

---

### Performance Considerations

**Caching:**
```typescript
const searchCache = new Map<string, SearchResponse>();

async function cachedSearch(query: string) {
  const cached = searchCache.get(query);
  if (cached) return cached;

  const results = await searchKnowledge(query);
  if (results) {
    searchCache.set(query, results);
  }
  return results;
}
```

**Debouncing:**
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query: string) => {
  const results = await searchKnowledge(query);
  setResults(results?.results || []);
}, 500); // Wait 500ms after user stops typing
```

---

## Data Transformation

### Converting API Data to App Types

**OpenClaw Agent → Dashboard Agent:**
```typescript
function transformAgent(apiAgent: OpenClawAgent): Agent {
  return {
    id: apiAgent.id,
    name: apiAgent.name,
    type: 'main', // Infer from name or add to API
    status: apiAgent.status === 'active' ? 'online' : 'offline',
    endpoint: process.env.OPENCLAW_GATEWAY_URL!,
    lastPing: new Date(),
    uptime: 0, // Not provided by API
    model: apiAgent.model,
    provider: 'anthropic', // Default
    tokensUsed: apiAgent.session.tokens,
    tokensTotal: apiAgent.session.maxTokens,
    requestsToday: 0, // Not provided by API
    currentTask: null,
    currentVenture: null,
    createdAt: new Date(),
    version: '2026.2.9'
  };
}
```

**Usage in Component:**
```typescript
const [agents, setAgents] = useState<Agent[]>([]);

useEffect(() => {
  async function loadAgents() {
    const apiAgents = await fetchAgents();
    const transformed = apiAgents.map(transformAgent);
    setAgents(transformed);
  }
  loadAgents();
}, []);
```

---

## Future API Endpoints

### Planned for Phase 8+

#### Create Task
```typescript
POST /tasks
Body: { title, description, ventureId, priority }
Response: Task
```

#### Update Task
```typescript
PATCH /tasks/:id
Body: Partial<Task>
Response: Task
```

#### Delete Task
```typescript
DELETE /tasks/:id
Response: { success: boolean }
```

#### Execute Task
```typescript
POST /tasks/:id/execute
Body: { agentId?: string }
Response: { status: 'queued' | 'executing' }
```

---

## Testing APIs

### Mock Data for Development

```typescript
// src/lib/api/__mocks__/openclaw.ts
export const mockStatus: OpenClawStatus = {
  version: '2026.2.9',
  gateway: { status: 'online', uptime: 3600, port: 18789 },
  agents: { total: 1, active: 1, bootstrapping: 0 },
  channels: { telegram: { enabled: true, status: 'OK' } },
  memory: { enabled: true, available: true }
};
```

### Integration Tests

```typescript
describe('OpenClaw API', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  it('fetches status successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatus
    });

    const status = await fetchOpenClawStatus();
    expect(status).toEqual(mockStatus);
  });

  it('handles errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const status = await fetchOpenClawStatus();
    expect(status).toBeNull();
  });
});
```

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
```
Access to fetch at 'http://127.0.0.1:18789' from origin 'http://localhost:3000' has been blocked by CORS
```

**Solution:** Configure OpenClaw gateway to allow localhost:3000
```python
# In OpenClaw gateway config
ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
```

**2. Connection Refused**
```
Failed to fetch: connect ECONNREFUSED 127.0.0.1:18789
```

**Solution:** Ensure OpenClaw gateway is running
```bash
# Check if gateway is running
lsof -i:18789

# Start gateway if needed
cd /path/to/openclaw
python gateway.py
```

**3. Authentication Failed**
```
401 Unauthorized
```

**Solution:** Verify token in `.env.local` matches gateway config
```bash
# Get token from OpenClaw config
cat ~/.openclaw/openclaw.json | grep token
```

**4. Semantic Search Not Found**
```
Error: Script not found at /home/salem/hq/apps/semantic-engine/query_knowledge.py
```

**Solution:** Verify path in environment variable
```bash
ls $SEMANTIC_SEARCH_PATH/query_knowledge.py
```

---

## Security Best Practices

1. **Never commit tokens** - Use `.env.local` (gitignored)
2. **Validate all responses** - Check types and structure
3. **Rate limiting** - Don't poll too frequently
4. **Timeout requests** - Set reasonable timeouts (5-30s)
5. **Sanitize inputs** - Escape special characters in queries
6. **Use HTTPS** in production (gateway should support TLS)

---

## Resources

- [OpenClaw Documentation](link-to-openclaw-docs)
- [Fetch API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Node.js child_process](https://nodejs.org/api/child_process.html)
