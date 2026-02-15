# Component Specifications

All components use TypeScript + Tailwind CSS + shadcn/ui

---

## Layout Components

### `MainLayout.tsx`
**Location:** `src/components/layout/MainLayout.tsx`

**Purpose:** Root layout wrapper with sidebar and main content area

**Props:**
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}
```

**Layout:**
```
┌─────────────────────────────────────┐
│ Header (fixed top)                  │
├───────────┬─────────────────────────┤
│  Sidebar  │  Main Content           │
│  (fixed)  │  {children}             │
│           │                         │
└───────────┴─────────────────────────┘
```

**Features:**
- Fixed sidebar (280px wide)
- Collapsible sidebar with toggle button
- Responsive: sidebar becomes drawer on mobile
- Dark mode background

**Example:**
```tsx
<MainLayout>
  <KanbanBoard />
</MainLayout>
```

---

### `Header.tsx`
**Location:** `src/components/layout/Header.tsx`

**Purpose:** Top status bar showing system metrics

**Props:**
```typescript
interface HeaderProps {
  capital: number;
  capitalUsed: number;
  agentStatus: 'online' | 'offline' | 'busy';
  lastSync: Date;
}
```

**Display:**
```
┌─────────────────────────────────────────────────────────┐
│  🦅 HQ Mission Control    Capital: $160/$200  ● Online  │
│                           Last sync: 2m ago              │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- Logo + title (left)
- Capital meter with progress bar (center)
- Agent status dot + text (right)
- Last sync timestamp (right)

**Styling:**
- Fixed to top, z-50
- Border-b with subtle shadow
- Height: 64px

---

### `Sidebar.tsx`
**Location:** `src/components/layout/Sidebar.tsx`

**Purpose:** Left navigation with ventures and agents

**Props:**
```typescript
interface SidebarProps {
  ventures: Venture[];
  agents: Agent[];
  selectedVenture: string | null;
  onSelectVenture: (id: string | null) => void;
  collapsed: boolean;
}
```

**Sections:**
1. **Ventures** - VentureList component
2. **Agents** - AgentList component
3. **Tools** - Quick action buttons

**Layout:**
```
┌────────────────┐
│ Ventures       │
│ ○ E-Com (3)    │ <- Active tasks count
│ ○ Allbirds (2) │
│                │
│ Agents         │
│ ● Main         │ <- Status dot
│ ● Telegram     │
│                │
│ Tools          │
│ [Search]       │
│ [Memory]       │
└────────────────┘
```

**Features:**
- Sticky sections (ventures always visible)
- Highlight selected venture
- Show task counts as badges
- Collapse/expand sections

---

## Venture Components

### `VentureCard.tsx`
**Location:** `src/components/ventures/VentureCard.tsx`

**Purpose:** Display single venture with metrics

**Props:**
```typescript
interface VentureCardProps {
  venture: Venture;
  selected: boolean;
  onClick: () => void;
}
```

**Display:**
```
┌─────────────────────────┐
│ 🛒 E-Commerce Automation│
│ Active • 3 tasks        │
│ ────────────────────────│
│ Completed: 9/12         │
│ Spent: $85.50           │
└─────────────────────────┘
```

**Elements:**
- Icon + name (header)
- Status badge + task count
- Progress bar (completed/total)
- Capital spent

**States:**
- Default (hover effect)
- Selected (border accent)
- Active status (pulsing dot)

**Styling:**
- Card with rounded borders
- Accent color from venture.color
- Hover: scale up slightly
- Selected: border-2 + shadow-lg

---

### `VentureList.tsx`
**Location:** `src/components/ventures/VentureList.tsx`

**Purpose:** List all ventures with filtering

**Props:**
```typescript
interface VentureListProps {
  ventures: Venture[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}
```

**Features:**
- Map over ventures array
- Render VentureCard for each
- "All Ventures" option at top (null selection)
- Sort by priority then name

**Example:**
```tsx
<VentureList
  ventures={ventures}
  selectedId={selectedVenture}
  onSelect={setSelectedVenture}
/>
```

---

## Agent Components

### `AgentStatus.tsx`
**Location:** `src/components/agents/AgentStatus.tsx`

**Purpose:** Single agent status indicator

**Props:**
```typescript
interface AgentStatusProps {
  agent: Agent;
  compact?: boolean;
}
```

**Display (full):**
```
┌────────────────────────┐
│ ● Main Agent           │
│ claude-sonnet-4-5      │
│ 45k/200k tokens (22%)  │
│ Working on: Task #3    │
└────────────────────────┘
```

**Display (compact):**
```
● Main Agent - Online
```

**Status Colors:**
- Online: green-500
- Offline: gray-500
- Busy: yellow-500
- Error: red-500

**Animations:**
- Pulsing dot for 'busy' state
- Fade in when status changes

---

### `AgentList.tsx`
**Location:** `src/components/agents/AgentList.tsx`

**Purpose:** List all agents

**Props:**
```typescript
interface AgentListProps {
  agents: Agent[];
  compact?: boolean;
}
```

**Features:**
- Map over agents
- Render AgentStatus for each
- Show offline agents last
- Click to expand/collapse details

---

## Kanban Components

### `KanbanBoard.tsx`
**Location:** `src/components/kanban/KanbanBoard.tsx`

**Purpose:** Main kanban board with 3 columns

**Props:**
```typescript
interface KanbanBoardProps {
  tasks: Task[];
  ventures: Venture[];
  selectedVenture: string | null;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}
```

**Layout:**
```
┌──────────┬──────────┬──────────┐
│  QUEUE   │  ACTIVE  │   DONE   │
│   (5)    │   (2)    │   (12)   │
├──────────┼──────────┼──────────┤
│ [Task 1] │ [Task 3] │ [Task 5] │
│ [Task 2] │ [Task 4] │ [Task 6] │
│          │          │ [Task 7] │
└──────────┴──────────┴──────────┘
```

**Features:**
- Filter tasks by selectedVenture
- Drag & drop between columns (use @dnd-kit/core)
- Count shown in column header
- Empty state if no tasks
- Auto-scroll when dragging near edge

**Drag & Drop:**
```typescript
import { DndContext, DragEndEvent } from '@dnd-kit/core';

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (over) {
    onTaskMove(active.id, over.id as TaskStatus);
  }
}
```

---

### `KanbanColumn.tsx`
**Location:** `src/components/kanban/KanbanColumn.tsx`

**Purpose:** Single column in kanban board

**Props:**
```typescript
interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}
```

**Elements:**
- Header with title + count
- Droppable area
- List of TaskCard components
- Empty state message

**Styling:**
- Min-height: 400px
- Background: subtle border
- Droppable: border-dashed when dragging over
- Header: sticky on scroll

---

### `TaskCard.tsx`
**Location:** `src/components/kanban/TaskCard.tsx`

**Purpose:** Individual task card (draggable)

**Props:**
```typescript
interface TaskCardProps {
  task: Task;
  onClick: () => void;
}
```

**Display:**
```
┌─────────────────────────┐
│ Research Allbirds       │ <- Title
│ 👟 Allbirds • HIGH      │ <- Venture icon + priority
│ ───────────────────────│
│ Est: $5 • 50k tokens    │ <- Estimates
│ Blocks: Task #2         │ <- Dependencies
└─────────────────────────┘
```

**Elements:**
- Title (truncate after 2 lines)
- Venture badge + priority badge
- Cost/token estimates
- Dependency indicators
- Tags (if any)

**States:**
- Default (hover: shadow)
- Dragging (opacity-50, rotate-2)
- Blocked (grayscale + lock icon)
- Overdue (border-red)

**Click:** Opens task detail modal

---

## Activity Components

### `ActivityFeed.tsx`
**Location:** `src/components/activity/ActivityFeed.tsx`

**Purpose:** Real-time activity log

**Props:**
```typescript
interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number; // Default: 20
  autoScroll?: boolean; // Default: true
}
```

**Layout:**
```
┌─────────────────────────┐
│ Recent Activity         │
├─────────────────────────┤
│ ✓ Task completed        │ 2m ago
│ ⚡ Agent started task   │ 5m ago
│ 💰 Capital spent $15    │ 10m ago
│ ⚠️  Error: API timeout  │ 15m ago
└─────────────────────────┘
```

**Features:**
- Newest items at top
- Auto-scroll to new items
- Fade in animation for new items
- Filter by level (info/warning/error)
- Limit to maxItems
- Relative timestamps ("2m ago")

**Styling:**
- Max-height: 600px
- Overflow-y: auto
- Custom scrollbar (thin, subtle)

---

### `ActivityItem.tsx`
**Location:** `src/components/activity/ActivityItem.tsx`

**Purpose:** Single activity entry

**Props:**
```typescript
interface ActivityItemProps {
  activity: Activity;
}
```

**Elements:**
- Icon (emoji or Lucide icon)
- Title + description
- Timestamp (relative)
- Level indicator (color border-left)

**Colors by level:**
- Info: blue-500
- Success: green-500
- Warning: yellow-500
- Error: red-500

---

## UI Components (shadcn/ui)

Install via shadcn/ui CLI:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add skeleton
```

**Usage:**
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

<Card>
  <Badge variant="success">Active</Badge>
  <Button onClick={handleClick}>Start Task</Button>
</Card>
```

---

## Utility Components

### `EmptyState.tsx`
**Purpose:** Show when no data available

```tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Example:**
```tsx
<EmptyState
  icon="📭"
  title="No tasks yet"
  description="Create your first task to get started"
  action={{
    label: "Create Task",
    onClick: () => setShowModal(true)
  }}
/>
```

---

### `LoadingSpinner.tsx`
**Purpose:** Loading state

```tsx
<div className="flex items-center justify-center p-8">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
</div>
```

---

### `ErrorBoundary.tsx`
**Purpose:** Catch React errors

```tsx
class ErrorBoundary extends React.Component {
  // Standard error boundary implementation
  // Show friendly error message
}
```

---

## Modal Components

### `TaskDetailModal.tsx`
**Purpose:** Show full task details + edit

**Features:**
- Full task info
- Edit title/description
- Change status/priority
- Assign to agent
- View output/errors
- Delete task

**Actions:**
- Save changes
- Start task (if in queue)
- Cancel task (if active)
- Delete task

---

### `CreateTaskModal.tsx`
**Purpose:** Create new task

**Form fields:**
- Title (required)
- Description
- Venture (select)
- Priority (select)
- Estimated cost
- Tags

**Actions:**
- Create & add to queue
- Cancel

---

## Page Components

### `page.tsx` (Main Dashboard)
**Location:** `src/app/page.tsx`

**Structure:**
```tsx
export default function DashboardPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedVenture, setSelectedVenture] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="flex gap-4 p-6">
        <div className="flex-1">
          <KanbanBoard
            tasks={tasks}
            ventures={ventures}
            selectedVenture={selectedVenture}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
          />
        </div>
        <div className="w-80">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </MainLayout>
  );
}
```

---

## Responsive Design

### Breakpoints
- **Mobile:** < 768px (sidebar becomes drawer)
- **Tablet:** 768px - 1024px (compact layout)
- **Desktop:** > 1024px (full layout)

### Mobile adjustments:
- Sidebar: hidden by default, toggle with hamburger
- Kanban: vertical stack instead of 3 columns
- Activity feed: hidden, accessible via button
- Header: compact (hide labels, show icons only)

---

## Animation Guidelines

**Page transitions:** None (instant)
**Component mounting:** fadeIn (200ms)
**Drag & drop:** Scale + rotate during drag
**Status changes:** Color transition (300ms)
**Loading states:** Pulse skeleton
**Hover effects:** Scale(1.02) + shadow (150ms)

Use Framer Motion for complex animations:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>
```
