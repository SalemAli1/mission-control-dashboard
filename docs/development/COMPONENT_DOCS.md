# Component Documentation Guide

## Overview

This guide provides templates and examples for documenting components in the Mission Control Dashboard.

---

## Component Documentation Template

Use this template for all new components:

```typescript
/**
 * ComponentName
 *
 * Brief description of what this component does and its purpose.
 *
 * @example
 * <ComponentName
 *   prop1="value"
 *   prop2={data}
 *   onAction={handleAction}
 * />
 */
```

---

## Layout Components

### Header

**Location:** `src/components/layout/Header.tsx`

**Purpose:** Top status bar displaying system-wide metrics and agent status.

**Props:**
```typescript
interface HeaderProps {
  capital: number;           // Total available capital ($)
  capitalUsed: number;       // Amount of capital spent ($)
  agentStatus: 'online' | 'offline' | 'busy'; // Current agent state
  lastSync: Date;           // Last data refresh timestamp
}
```

**Features:**
- Displays capital remaining with progress bar
- Shows agent status with animated pulse for "busy" state
- Relative timestamp for last sync ("2m ago")
- Fixed positioning at top of viewport (z-50)

**Example:**
```tsx
<Header
  capital={200}
  capitalUsed={85.5}
  agentStatus="online"
  lastSync={new Date()}
/>
```

**Styling:**
- Height: 64px (h-16)
- Background: zinc-900
- Border: bottom border zinc-800
- Status dot: Animates when busy

---

### Sidebar

**Location:** `src/components/layout/Sidebar.tsx`

**Purpose:** Left navigation panel with ventures, agents, and tools.

**Props:**
```typescript
interface SidebarProps {
  ventures: Venture[];              // List of all ventures
  agents: Agent[];                  // List of all agents
  tasks: Task[];                    // All tasks (for counting)
  selectedVenture: string | null;   // Currently selected venture ID
  onSelectVenture: (id: string | null) => void; // Selection handler
}
```

**Features:**
- Three sections: Ventures, Agents, Tools
- Filters tasks by selected venture
- Shows active task counts per venture
- Responsive: hidden on mobile, toggle with button

**Example:**
```tsx
<Sidebar
  ventures={ventures}
  agents={agents}
  tasks={tasks}
  selectedVenture={selectedVenture}
  onSelectVenture={setSelectedVenture}
/>
```

**Styling:**
- Width: 280px fixed
- Background: zinc-900
- Position: Fixed left, below header

---

### MainLayout

**Location:** `src/components/layout/MainLayout.tsx`

**Purpose:** Root layout wrapper combining header, sidebar, and main content.

**Props:**
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  capital: number;
  capitalUsed: number;
  agentStatus: 'online' | 'offline' | 'busy';
  lastSync: Date;
  ventures: Venture[];
  agents: Agent[];
  tasks: Task[];
  selectedVenture: string | null;
  onSelectVenture: (id: string | null) => void;
}
```

**Features:**
- Combines Header + Sidebar + content area
- Responsive layout (sidebar hides on mobile)
- Mobile hamburger toggle for sidebar
- Proper spacing for fixed elements

**Example:**
```tsx
<MainLayout {...layoutProps}>
  <KanbanBoard {...kanbanProps} />
</MainLayout>
```

**Responsive Behavior:**
- Desktop: Full layout with sidebar
- Mobile (< 768px): Collapsible sidebar with toggle button

---

## Kanban Components

### KanbanBoard

**Location:** `src/components/kanban/KanbanBoard.tsx`

**Purpose:** Main kanban board with drag & drop functionality.

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

**Features:**
- Three columns: Queue, Active, Completed
- Drag & drop tasks between columns
- Filters by selected venture
- DragOverlay with visual feedback

**Example:**
```tsx
<KanbanBoard
  tasks={tasks}
  ventures={ventures}
  selectedVenture={selectedVenture}
  onTaskMove={handleTaskMove}
  onTaskClick={handleTaskClick}
/>
```

**Drag & Drop:**
- Uses @dnd-kit/core
- Columns are droppable targets
- Tasks are draggable items
- Overlay shows dragging task with rotation

---

### KanbanColumn

**Location:** `src/components/kanban/KanbanColumn.tsx`

**Purpose:** Single column in kanban board (droppable area).

**Props:**
```typescript
interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  ventures: Venture[];
  onTaskClick: (task: Task) => void;
}
```

**Features:**
- Droppable area using @dnd-kit
- Header with task count
- Empty state for no tasks
- Visual feedback on drag-over

**Styling:**
- Min height: 400px
- Border: dashed blue when drag-over
- Sticky header for scrolling

---

### TaskCard

**Location:** `src/components/kanban/TaskCard.tsx`

**Purpose:** Individual task card (draggable).

**Props:**
```typescript
interface TaskCardProps {
  task: Task;
  venture?: Venture;
  onClick: () => void;
}
```

**Features:**
- Draggable with @dnd-kit
- Shows title, venture, priority
- Cost and token estimates
- Dependency indicators
- Tag display (max 3)

**States:**
- Default: white background
- Dragging: 50% opacity, 2deg rotation
- Hover: scale 1.02

---

## Venture Components

### VentureCard

**Location:** `src/components/ventures/VentureCard.tsx`

**Purpose:** Display single venture with metrics.

**Props:**
```typescript
interface VentureCardProps {
  venture: Venture;
  selected: boolean;
  onClick: () => void;
  activeTasks: number;
  completedTasks: number;
  totalTasks: number;
}
```

**Features:**
- Icon + name display
- Status badge with colors
- Progress bar (completed/total)
- Capital spent
- Selected state with border

**Status Colors:**
- active: green (success)
- paused: yellow (warning)
- completed: gray
- archived: dark gray

---

### VentureList

**Location:** `src/components/ventures/VentureList.tsx`

**Purpose:** List all ventures with filtering.

**Props:**
```typescript
interface VentureListProps {
  ventures: Venture[];
  tasks: Task[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}
```

**Features:**
- "All Ventures" option (null selection)
- Sorts by priority (5=highest, 1=lowest) then name
- Calculates task stats per venture
- Click to filter tasks

---

## Agent Components

### AgentStatus

**Location:** `src/components/agents/AgentStatus.tsx`

**Purpose:** Display agent status and metrics.

**Props:**
```typescript
interface AgentStatusProps {
  agent: Agent;
  compact?: boolean;
}
```

**Modes:**
- **Compact:** Status dot + name + status label
- **Full:** Includes model, token usage bar, current task

**Features:**
- Status dot with pulse animation (busy)
- Token usage percentage with color coding
- Color thresholds: >80% red, >50% yellow, else green

---

### AgentList

**Location:** `src/components/agents/AgentList.tsx`

**Purpose:** List all agents with expand/collapse.

**Props:**
```typescript
interface AgentListProps {
  agents: Agent[];
  compact?: boolean;
}
```

**Features:**
- Sorts: online → busy → offline → error
- Click to expand/collapse details
- Compact mode shows all agents inline

---

## Best Practices

### Component Structure

1. **Imports first** (React, types, components, utils)
2. **Interface definitions** (props, local types)
3. **Component function** with destructured props
4. **Hooks at top** (useState, useEffect, etc.)
5. **Helper functions** (inside component or extracted)
6. **Return JSX** with proper formatting

### Naming Conventions

- **Components:** PascalCase (e.g., `TaskCard.tsx`)
- **Interfaces:** PascalCase + Props suffix (e.g., `TaskCardProps`)
- **Functions:** camelCase (e.g., `handleTaskClick`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `TASK_STATUS_COLORS`)

### TypeScript

- Always define prop interfaces
- Use `type` for unions, `interface` for objects
- Avoid `any` - use `unknown` or proper types
- Import types with `import type { ... }`

### Styling

- Use Tailwind utility classes
- Dark theme colors: zinc-* palette
- Consistent spacing: gap-2, gap-4, gap-6
- Transitions for interactive elements

### Accessibility

- Use semantic HTML (button, nav, main)
- Include aria-labels for icon buttons
- Keyboard navigation support
- Color contrast for text (zinc-400 minimum)

---

## Testing Components

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = { id: '1', title: 'Test Task', ... };
    render(<TaskCard task={task} onClick={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test component interactions:
- Drag & drop functionality
- Click handlers
- State updates
- Prop changes

---

## Common Patterns

### Conditional Rendering

```tsx
{isLoading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} />
) : (
  <Content data={data} />
)}
```

### Mapping Arrays

```tsx
{items.map((item) => (
  <ItemCard
    key={item.id}
    item={item}
    onClick={() => handleClick(item)}
  />
))}
```

### Event Handlers

```tsx
const handleClick = (item: Item) => {
  // Logic here
  onItemClick?.(item); // Optional chaining
};
```

---

## Performance Tips

1. **Memoization:** Use `useMemo` for expensive calculations
2. **Callbacks:** Use `useCallback` for event handlers passed to children
3. **Virtualization:** For long lists (>100 items), use react-window
4. **Code splitting:** Lazy load heavy components

---

## Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
