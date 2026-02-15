# Data Flow Architecture

## Overview

This document explains how data flows through the Mission Control Dashboard, from external APIs to UI components.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      External APIs                          │
├──────────────────────────┬──────────────────────────────────┤
│  OpenClaw Gateway        │  Semantic Search Engine          │
│  (port 18789)           │  (Python script)                 │
└──────────────┬───────────┴──────────┬───────────────────────┘
               │                      │
               │ HTTP/WebSocket       │ child_process
               ▼                      ▼
┌──────────────────────────────────────────────────────────────┐
│                    API Layer (src/lib/api/)                  │
├──────────────────────────┬───────────────────────────────────┤
│  openclaw.ts             │  semantic-search.ts               │
│  - fetchOpenClawStatus() │  - searchKnowledge()              │
│  - fetchAgents()         │  - isSemanticSearchAvailable()    │
└──────────────┬───────────┴──────────┬────────────────────────┘
               │                      │
               │ Transform            │
               ▼                      ▼
┌──────────────────────────────────────────────────────────────┐
│              App State (src/app/page.tsx)                    │
├──────────────────────────────────────────────────────────────┤
│  useState Hooks:                                             │
│  - ventures: Venture[]                                       │
│  - agents: Agent[]                                           │
│  - tasks: Task[]                                             │
│  - activities: Activity[]                                    │
│  - selectedVenture: string | null                            │
│  - lastSync: Date                                            │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ Props
               ▼
┌──────────────────────────────────────────────────────────────┐
│                    MainLayout                                │
├──────────────────────────────────────────────────────────────┤
│  Distributes data to:                                        │
│  - Header (capital, agent status)                            │
│  - Sidebar (ventures, agents, tasks)                         │
│  - Main content (children)                                   │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ Props
               ▼
┌──────────────────────────────────────────────────────────────┐
│                  UI Components                               │
├──────────────────────────────────────────────────────────────┤
│  - KanbanBoard → KanbanColumn → TaskCard                    │
│  - VentureList → VentureCard                                │
│  - AgentList → AgentStatus                                   │
│  - ActivityFeed → ActivityItem                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow Patterns

### 1. Initial Data Load

**Sequence:**
```
User opens app
    ↓
page.tsx useEffect() runs
    ↓
Calls loadDashboardData()
    ↓
Fetches data from APIs in parallel:
    - fetchOpenClawStatus()
    - fetchAgents()
    - Load seed data (tasks, ventures)
    ↓
Transform API data to app types
    ↓
Update state with useState setters
    ↓
Components re-render with new data
```

**Code Example:**
```typescript
// src/app/page.tsx
useEffect(() => {
  async function loadDashboardData() {
    // Parallel fetch
    const [apiStatus, apiAgents] = await Promise.all([
      fetchOpenClawStatus(),
      fetchAgents()
    ]);

    // Transform data
    const transformedAgents = apiAgents.map(transformAgent);

    // Update state
    setAgents(transformedAgents);
    setVentures(mockVentures); // From seed data
    setTasks(mockTasks);
    setLastSync(new Date());
  }

  loadDashboardData();
}, []); // Empty deps = run once on mount
```

---

### 2. Real-Time Updates (Polling)

**Sequence:**
```
Initial load complete
    ↓
Start interval timer (5s)
    ↓
Every 5 seconds:
    - Fetch latest status
    - Fetch latest agents
    - Compare with current state
    - Update if changed
    - Update lastSync timestamp
    ↓
Components auto re-render on state change
```

**Code Example:**
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const [status, agents] = await Promise.all([
      fetchOpenClawStatus(),
      fetchAgents()
    ]);

    if (status) {
      // Update capital if changed
      const totalSpent = calculateTotalSpent(tasks);
      setCapitalUsed(totalSpent);
    }

    if (agents) {
      setAgents(agents.map(transformAgent));
    }

    setLastSync(new Date());
  }, 5000); // 5 seconds

  return () => clearInterval(interval); // Cleanup
}, [tasks]); // Re-create interval if tasks change
```

---

### 3. User Actions (Task Movement)

**Sequence:**
```
User drags task to new column
    ↓
KanbanBoard onDragEnd() handler
    ↓
Calls onTaskMove(taskId, newStatus)
    ↓
page.tsx handleTaskMove() updates tasks state
    ↓
Generate activity log entry
    ↓
Update activities state
    ↓
Components re-render:
    - Task moves to new column
    - Activity appears in feed
```

**Code Example:**
```typescript
// page.tsx
const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
  setTasks(prevTasks => {
    const updatedTasks = prevTasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    );
    return updatedTasks;
  });

  // Add activity log
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    const activity = taskMoved(task, newStatus);
    setActivities(prev => [activity, ...prev]);
  }
};
```

---

### 4. Filtering (Venture Selection)

**Sequence:**
```
User clicks venture in sidebar
    ↓
VentureList calls onSelect(ventureId)
    ↓
page.tsx updates selectedVenture state
    ↓
MainLayout passes selectedVenture to Sidebar & KanbanBoard
    ↓
KanbanBoard filters tasks:
    tasks.filter(t => t.ventureId === selectedVenture)
    ↓
Only matching tasks displayed
```

**Code Example:**
```typescript
// KanbanBoard.tsx
const filteredTasks = selectedVenture
  ? tasks.filter(task => task.ventureId === selectedVenture)
  : tasks; // null = show all

// Then map filteredTasks to columns
```

---

## State Management

### Current Architecture: React Hooks

**Advantages:**
- ✅ Simple, no external dependencies
- ✅ Easy to understand
- ✅ Good for small-medium apps
- ✅ Built-in to React

**State Location:** `src/app/page.tsx`

```typescript
// All state in one place
const [ventures, setVentures] = useState<Venture[]>([]);
const [agents, setAgents] = useState<Agent[]>([]);
const [tasks, setTasks] = useState<Task[]>([]);
const [activities, setActivities] = useState<Activity[]>([]);
const [selectedVenture, setSelectedVenture] = useState<string | null>(null);
const [lastSync, setLastSync] = useState<Date>(new Date());
```

**Props Drilling:**
```
page.tsx
  ↓ ventures, agents, tasks
MainLayout
  ↓ ventures, agents, tasks
Sidebar
  ↓ ventures
VentureList
  ↓ venture
VentureCard
```

---

### Future: Context API (Optional)

For larger scale, consider React Context:

```typescript
// src/context/DashboardContext.tsx
const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: Props) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

// Usage in components
const { state, dispatch } = useDashboard();
```

**Benefits:**
- No props drilling
- Cleaner component interfaces
- Centralized state updates

---

### Future: Zustand (Recommended)

For even simpler global state:

```typescript
// src/store/dashboard.ts
import { create } from 'zustand';

interface DashboardStore {
  ventures: Venture[];
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
}

export const useDashboard = create<DashboardStore>((set) => ({
  ventures: [],
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    )
  })),
}));

// Usage in components
const { tasks, moveTask } = useDashboard();
```

---

## Data Transformation

### API → App Types

**Why Transform?**
- API types may not match our internal structure
- Need to add computed fields
- Handle missing/optional data
- Normalize naming conventions

**Example:**
```typescript
function transformAgent(apiAgent: OpenClawAgent): Agent {
  return {
    id: apiAgent.id,
    name: apiAgent.name,
    type: inferAgentType(apiAgent.name), // Add logic
    status: mapApiStatus(apiAgent.status), // Transform
    endpoint: GATEWAY_URL,
    lastPing: new Date(), // Default
    uptime: 0, // Not in API
    model: apiAgent.model,
    provider: 'anthropic',
    tokensUsed: apiAgent.session.tokens,
    tokensTotal: apiAgent.session.maxTokens,
    requestsToday: 0,
    currentTask: null,
    currentVenture: null,
    createdAt: new Date(),
    version: '2026.2.9'
  };
}
```

---

## Derived State

### Computed Values

Some values are calculated from existing state:

```typescript
// Capital calculation
const capitalUsed = ventures.reduce((sum, v) =>
  sum + v.capitalAllocated, 0
);
const capitalAvailable = INITIAL_CAPITAL - capitalUsed;

// Agent status (for header)
const agentStatus = agents.length > 0
  ? agents[0].status === 'online' ? 'online'
  : agents[0].status === 'busy' ? 'busy'
  : 'offline'
  : 'offline';

// Task counts per venture
const getVentureTaskCount = (ventureId: string) =>
  tasks.filter(t => t.ventureId === ventureId).length;
```

**Optimization with useMemo:**
```typescript
const capitalUsed = useMemo(() =>
  ventures.reduce((sum, v) => sum + v.capitalAllocated, 0),
  [ventures] // Only recalculate when ventures change
);
```

---

## Error Handling

### Strategy: Graceful Degradation

```typescript
const [data, setData] = useState<Data | null>(null);
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);

async function loadData() {
  try {
    setIsLoading(true);
    const result = await fetchData();

    if (result) {
      setData(result);
      setError(null);
    } else {
      // API returned null (handled error)
      setError('Failed to load data');
      setData(mockData); // Fallback
    }
  } catch (err) {
    // Unexpected error
    console.error('Load error:', err);
    setError('Unexpected error occurred');
    setData(mockData);
  } finally {
    setIsLoading(false);
  }
}
```

---

## Performance Optimization

### 1. Memoization

**Expensive Calculations:**
```typescript
const sortedTasks = useMemo(() =>
  tasks.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ),
  [tasks]
);
```

**Callback Functions:**
```typescript
const handleTaskClick = useCallback((task: Task) => {
  setSelectedTask(task);
  setModalOpen(true);
}, []); // No dependencies = stable reference
```

### 2. Lazy Loading

**Code Splitting:**
```typescript
const TaskDetailModal = lazy(() => import('./modals/TaskDetailModal'));

// In component
<Suspense fallback={<LoadingSpinner />}>
  {modalOpen && <TaskDetailModal task={selectedTask} />}
</Suspense>
```

### 3. Virtualization

For large lists (>100 items):
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={tasks.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <TaskCard task={tasks[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## Data Persistence

### Local Storage

**Save State:**
```typescript
useEffect(() => {
  localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
}, [tasks]);
```

**Load State:**
```typescript
useEffect(() => {
  const saved = localStorage.getItem('dashboard-tasks');
  if (saved) {
    setTasks(JSON.parse(saved));
  }
}, []);
```

**Caution:**
- Limited to 5-10MB
- Synchronous (blocks main thread)
- Consider IndexedDB for large data

---

## WebSocket Integration (Future)

**Current:** Polling every 5 seconds
**Future:** Real-time updates via WebSocket

```typescript
useEffect(() => {
  const ws = new WebSocket('ws://127.0.0.1:18789/ws');

  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);

    switch (update.type) {
      case 'agent_status':
        updateAgent(update.data);
        break;
      case 'task_complete':
        updateTask(update.data);
        break;
    }
  };

  return () => ws.close();
}, []);
```

---

## Testing Data Flow

### Unit Tests

```typescript
describe('Task Movement', () => {
  it('updates task status', () => {
    const initialTasks = [{ id: '1', status: 'queue', ... }];
    const updatedTasks = handleTaskMove(initialTasks, '1', 'active');

    expect(updatedTasks[0].status).toBe('active');
  });
});
```

### Integration Tests

```typescript
describe('Dashboard Data Flow', () => {
  it('loads data and renders components', async () => {
    render(<Dashboard />);

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText('E-Commerce Automation')).toBeInTheDocument();
    });

    // Verify all components received data
    expect(screen.getByRole('header')).toHaveTextContent('$160/$200');
  });
});
```

---

## Debugging Tips

### 1. React DevTools

Install React DevTools browser extension to:
- Inspect component props
- View current state
- Track re-renders
- Profile performance

### 2. Console Logging

```typescript
// Log all state updates
useEffect(() => {
  console.log('Tasks updated:', tasks);
}, [tasks]);

// Log API calls
console.log('[API] Fetching status...');
const status = await fetchOpenClawStatus();
console.log('[API] Status received:', status);
```

### 3. Redux DevTools

Even without Redux, can use for time-travel debugging:
```typescript
import { devtools } from 'zustand/middleware';

export const useDashboard = create(
  devtools((set) => ({ ... }))
);
```

---

## Summary

**Key Principles:**
1. **Single source of truth** - State in page.tsx
2. **Unidirectional data flow** - Props down, events up
3. **Transform at boundaries** - API layer handles conversions
4. **Graceful degradation** - Fallback to mock data on errors
5. **Performance** - Memoize expensive calculations
6. **Testability** - Pure functions for transformations

**Data Flow Path:**
```
API → Transform → State → Props → Components → User → Events → State → API
```
