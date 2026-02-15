# OpenClaw Task Checklist

Complete these tasks in order. Each task is self-contained and can be sent to OpenClaw via Telegram.

---

## Phase 1: Project Setup (Tasks 1-5)

### Task 1: Initialize Next.js Project
**Command for OpenClaw:**
```
Create a new Next.js 14 project at /home/salem/hq/apps/mission-control-dashboard with TypeScript, Tailwind CSS, and App Router. Use these options: TypeScript=Yes, ESLint=Yes, Tailwind=Yes, src/ directory=Yes, App Router=Yes, import alias=@/*
```

**Expected result:**
- `package.json` with Next.js 14
- `tsconfig.json` configured
- `tailwind.config.ts` created
- `src/app` directory structure

---

### Task 2: Install Dependencies
**Command for OpenClaw:**
```
In /home/salem/hq/apps/mission-control-dashboard, install these npm packages:
- framer-motion
- @dnd-kit/core @dnd-kit/sortable
- clsx
- tailwind-merge
- class-variance-authority
- lucide-react
- date-fns
```

**Expected result:** All dependencies in `package.json`

---

### Task 3: Install shadcn/ui
**Command for OpenClaw:**
```
In /home/salem/hq/apps/mission-control-dashboard, initialize shadcn/ui with default config, then install these components: button, card, badge, dialog, dropdown-menu, select, progress, tooltip, skeleton
```

**Expected result:**
- `components.json` created
- `src/components/ui/` folder with shadcn components

---

### Task 4: Configure Tailwind (Dark Mode)
**Command for OpenClaw:**
```
Update tailwind.config.ts in /home/salem/hq/apps/mission-control-dashboard to:
1. Enable dark mode (class strategy)
2. Add these custom colors to extend.colors:
   - success: { DEFAULT: '#10B981' }
   - warning: { DEFAULT: '#F59E0B' }
   - error: { DEFAULT: '#EF4444' }
   - agent: { DEFAULT: '#8B5CF6' }
3. Add custom keyframes for pulse-slow animation (2s duration)
```

**Expected result:** Updated `tailwind.config.ts` with dark mode + custom colors

---

### Task 5: Setup Environment Variables
**Command for OpenClaw:**
```
Create .env.local in /home/salem/hq/apps/mission-control-dashboard with:
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=5cff9f8966d1126023ec5dd52fb71c8ce183f5cf521a3830
SEMANTIC_SEARCH_PATH=/home/salem/hq/apps/semantic-engine
```

**Expected result:** `.env.local` file created

---

## Phase 2: Types & Data (Tasks 6-10)

### Task 6: Create Type Definitions
**Command for OpenClaw:**
```
Create src/types/venture.ts, src/types/agent.ts, src/types/task.ts, src/types/activity.ts, and src/types/dashboard.ts based on the specifications in docs/DATA_MODELS.md. Copy the exact interfaces provided.
```

**Expected result:** 5 type files with all interfaces

---

### Task 7: Create Constants
**Command for OpenClaw:**
```
Create src/lib/constants.ts with TASK_STATUS_LABELS, TASK_STATUS_COLORS, PRIORITY_COLORS, AGENT_STATUS_COLORS, INITIAL_CAPITAL=200, RESERVE_FUND=40, AVAILABLE_CAPITAL=160 as defined in docs/DATA_MODELS.md
```

**Expected result:** `src/lib/constants.ts` with all constants

---

### Task 8: Create Utility Functions
**Command for OpenClaw:**
```
Create src/lib/utils.ts with:
1. cn() function for merging Tailwind classes (use clsx + tailwind-merge)
2. formatCurrency(amount: number) function - returns formatted USD string
3. formatRelativeTime(date: Date) function - returns "2m ago" style string using date-fns
4. calculateTokenPercentage(used: number, total: number) function - returns percentage
```

**Expected result:** `src/lib/utils.ts` with 4 utility functions

---

### Task 9: Create Seed Data
**Command for OpenClaw:**
```
Create src/data/seed.ts with mockVentures (2 ventures), mockAgents (1 agent), and mockTasks (3 tasks) arrays as shown in docs/DATA_MODELS.md seed data example. Use the exact data structure provided.
```

**Expected result:** `src/data/seed.ts` with mock data

---

### Task 10: Create API Client Stub
**Command for OpenClaw:**
```
Create src/lib/api/openclaw.ts with:
1. fetchOpenClawStatus() - returns Promise<OpenClawStatus>
2. fetchAgents() - returns Promise<OpenClawAgent[]>
3. Currently return mock data, we'll implement real API calls later
Add proper TypeScript types from src/types/api.ts (create this file first if needed)
```

**Expected result:** `src/lib/api/openclaw.ts` with stub functions

---

## Phase 3: Layout Components (Tasks 11-15)

### Task 11: Create Root Layout
**Command for OpenClaw:**
```
Update src/app/layout.tsx to:
1. Add dark mode class to html element
2. Import and apply globals.css
3. Use Inter font from next/font/google
4. Set background to dark (bg-zinc-950)
5. Add metadata: title="HQ Mission Control", description="AI Agent Management Dashboard"
```

**Expected result:** Updated `src/app/layout.tsx` with dark mode

---

### Task 12: Update Global Styles
**Command for OpenClaw:**
```
Update src/app/globals.css to:
1. Import Tailwind directives
2. Add CSS variables for shadcn/ui dark theme colors
3. Add custom scrollbar styles (thin, dark)
4. Set body styles: dark background, white text, antialiased
```

**Expected result:** Updated `src/app/globals.css`

---

### Task 13: Create Header Component
**Command for OpenClaw:**
```
Create src/components/layout/Header.tsx per the spec in docs/COMPONENTS.md. Include:
- Logo + title on left
- Capital display with progress bar in center
- Agent status indicator on right
- Last sync timestamp
Use shadcn/ui Progress component for capital bar
```

**Expected result:** `src/components/layout/Header.tsx`

---

### Task 14: Create Sidebar Component
**Command for OpenClaw:**
```
Create src/components/layout/Sidebar.tsx per the spec in docs/COMPONENTS.md. Include:
- Three sections: Ventures, Agents, Tools
- Accept ventures[], agents[], selectedVenture props
- Render VentureList and AgentList components (create placeholder versions for now)
- Fixed width 280px, dark background
```

**Expected result:** `src/components/layout/Sidebar.tsx`

---

### Task 15: Create MainLayout Component
**Command for OpenClaw:**
```
Create src/components/layout/MainLayout.tsx that combines Header and Sidebar with main content area. Layout: Header at top (fixed), Sidebar on left (fixed), main content area fills remaining space. Make responsive: sidebar hidden on mobile with toggle button.
```

**Expected result:** `src/components/layout/MainLayout.tsx`

---

## Phase 4: Kanban Board (Tasks 16-20)

### Task 16: Create TaskCard Component
**Command for OpenClaw:**
```
Create src/components/kanban/TaskCard.tsx per the spec in docs/COMPONENTS.md. Show:
- Task title (truncate after 2 lines)
- Venture icon + priority badge
- Cost/token estimates
- Make it draggable using @dnd-kit/core useDraggable hook
- Add hover effects and click handler
Use shadcn/ui Card and Badge components
```

**Expected result:** `src/components/kanban/TaskCard.tsx`

---

### Task 17: Create KanbanColumn Component
**Command for OpenClaw:**
```
Create src/components/kanban/KanbanColumn.tsx per the spec in docs/COMPONENTS.md. Include:
- Column header with title + task count
- Droppable area using @dnd-kit/core useDroppable hook
- Map over tasks and render TaskCard for each
- Empty state message if no tasks
- Min height 400px
```

**Expected result:** `src/components/kanban/KanbanColumn.tsx`

---

### Task 18: Create KanbanBoard Component
**Command for OpenClaw:**
```
Create src/components/kanban/KanbanBoard.tsx per the spec in docs/COMPONENTS.md. Include:
- DndContext wrapper from @dnd-kit/core
- Three KanbanColumn components (Queue, Active, Completed)
- Filter tasks by selectedVenture if provided
- Handle drag end event to move tasks between columns
- Grid layout with 3 equal columns
```

**Expected result:** `src/components/kanban/KanbanBoard.tsx`

---

### Task 19: Add Drag & Drop Functionality
**Command for OpenClaw:**
```
In KanbanBoard.tsx, implement proper drag and drop:
1. Use DndContext, DragOverlay from @dnd-kit/core
2. Implement handleDragEnd to update task status
3. Show dragging task in overlay with opacity
4. Add collision detection
5. Ensure state updates properly when task moves
```

**Expected result:** Working drag & drop in KanbanBoard

---

### Task 20: Style Kanban Board
**Command for OpenClaw:**
```
Add styling to KanbanBoard and KanbanColumn:
- Columns: gap-4, rounded borders, subtle background
- Drag over state: border-dashed border-blue-500
- TaskCard dragging: opacity-50, rotate-2, shadow-lg
- Smooth transitions on all state changes
- Proper spacing and padding throughout
```

**Expected result:** Polished kanban board styling

---

## Phase 5: Venture & Agent Components (Tasks 21-25)

### Task 21: Create VentureCard Component
**Command for OpenClaw:**
```
Create src/components/ventures/VentureCard.tsx per the spec in docs/COMPONENTS.md. Show:
- Venture icon + name
- Status badge + active task count
- Progress bar (completed/total tasks)
- Capital spent
- Selected state with border accent
- Hover effects
Use shadcn/ui Card, Badge, Progress components
```

**Expected result:** `src/components/ventures/VentureCard.tsx`

---

### Task 22: Create VentureList Component
**Command for OpenClaw:**
```
Create src/components/ventures/VentureList.tsx that:
- Maps over ventures array and renders VentureCard for each
- Shows "All Ventures" option at top (null selection)
- Sorts ventures by priority (high to low) then name
- Handles venture selection
```

**Expected result:** `src/components/ventures/VentureList.tsx`

---

### Task 23: Create AgentStatus Component
**Command for OpenClaw:**
```
Create src/components/agents/AgentStatus.tsx per the spec in docs/COMPONENTS.md. Show:
- Status dot (color based on agent.status) with pulse animation if busy
- Agent name
- Model name
- Token usage with percentage
- Current task (if any)
- Support compact mode (just name + status)
```

**Expected result:** `src/components/agents/AgentStatus.tsx`

---

### Task 24: Create AgentList Component
**Command for OpenClaw:**
```
Create src/components/agents/AgentList.tsx that:
- Maps over agents array and renders AgentStatus for each
- Shows online agents first, offline last
- Supports compact mode
- Add expand/collapse for details
```

**Expected result:** `src/components/agents/AgentList.tsx`

---

### Task 25: Update Sidebar with Real Components
**Command for OpenClaw:**
```
Update src/components/layout/Sidebar.tsx to use the real VentureList and AgentList components instead of placeholders. Pass proper props and wire up selection handlers.
```

**Expected result:** Sidebar with functional venture and agent lists

---

## Phase 6: Activity Feed (Tasks 26-28)

### Task 26: Create ActivityItem Component
**Command for OpenClaw:**
```
Create src/components/activity/ActivityItem.tsx per the spec in docs/COMPONENTS.md. Show:
- Icon (emoji or Lucide icon)
- Title + description
- Relative timestamp using formatRelativeTime()
- Color-coded left border based on activity level
- Fade in animation when mounted
```

**Expected result:** `src/components/activity/ActivityItem.tsx`

---

### Task 27: Create ActivityFeed Component
**Command for OpenClaw:**
```
Create src/components/activity/ActivityFeed.tsx per the spec in docs/COMPONENTS.md. Include:
- Section header "Recent Activity"
- Map over activities and render ActivityItem
- Limit to maxItems (default 20)
- Auto-scroll to top when new activity added
- Custom scrollbar styles
- Max height 600px with overflow scroll
```

**Expected result:** `src/components/activity/ActivityFeed.tsx`

---

### Task 28: Add Activity Generation
**Command for OpenClaw:**
```
Create src/lib/activity-generator.ts with function createActivity(type, data) that generates Activity objects. Include helpers for:
- taskCompleted(task)
- taskStarted(task)
- agentStatusChanged(agent, oldStatus, newStatus)
- capitalSpent(amount, description)
- errorOccurred(message)
Each returns a properly formatted Activity object with timestamp and metadata.
```

**Expected result:** `src/lib/activity-generator.ts`

---

## Phase 7: Main Page (Tasks 29-31)

### Task 29: Create Dashboard Page
**Command for OpenClaw:**
```
Create src/app/page.tsx per the spec in docs/COMPONENTS.md. Include:
- State management for ventures, agents, tasks, activities, selectedVenture
- Load seed data on mount
- Render MainLayout with KanbanBoard and ActivityFeed
- Handle task move (update task status)
- Handle task click (log for now, modal later)
```

**Expected result:** Working main dashboard page

---

### Task 30: Add Data Refresh
**Command for OpenClaw:**
```
In src/app/page.tsx, add:
1. useEffect with setInterval to refresh data every 5 seconds
2. Create refreshDashboardData() function that updates agents/tasks state
3. Update last sync timestamp
4. Cleanup interval on unmount
```

**Expected result:** Dashboard auto-refreshes every 5 seconds

---

### Task 31: Add Loading & Error States
**Command for OpenClaw:**
```
In src/app/page.tsx, add:
- Loading state (isLoading) shown on initial load
- Error state (error) shown if data fetch fails
- LoadingSpinner component (create in src/components/ui/)
- ErrorMessage component (create in src/components/ui/)
- Show appropriate UI based on state
```

**Expected result:** Proper loading and error handling

---

## Phase 8: API Integration (Tasks 32-34)

### Task 32: Implement OpenClaw API Client
**Command for OpenClaw:**
```
Update src/lib/api/openclaw.ts to make real HTTP requests to http://127.0.0.1:18789:
1. fetchOpenClawStatus() - GET /status
2. fetchAgents() - GET /agents
3. Add Authorization header with token from env
4. Handle errors gracefully (return null on failure)
5. Parse response JSON properly
Use fetch API with proper TypeScript types
```

**Expected result:** Real API integration with OpenClaw gateway

---

### Task 33: Implement Semantic Search Integration
**Command for OpenClaw:**
```
Create src/lib/api/semantic-search.ts with:
1. searchKnowledge(query: string) function
2. Execute Python script via child_process
3. Parse output and return SearchResult[]
4. Handle errors gracefully
Example: execSync(`cd ${SEMANTIC_SEARCH_PATH} && python query_knowledge.py "${query}"`)
```

**Expected result:** `src/lib/api/semantic-search.ts` working

---

### Task 34: Connect Real Data to Dashboard
**Command for OpenClaw:**
```
Update src/app/page.tsx to:
1. Call fetchOpenClawStatus() and fetchAgents() instead of using seed data
2. Transform API responses to match our types
3. Fallback to seed data if API fails
4. Update agents state with real data
5. Test that dashboard shows real OpenClaw status
```

**Expected result:** Dashboard displays real OpenClaw data

---

## Phase 9: Modals & Actions (Tasks 35-37)

### Task 35: Create Task Detail Modal
**Command for OpenClaw:**
```
Create src/components/modals/TaskDetailModal.tsx using shadcn/ui Dialog. Show:
- Full task details (all fields)
- Edit form (title, description, priority, venture)
- Action buttons (Save, Start, Cancel, Delete)
- Output/error display if available
- Close button
Wire up to task click handler in page.tsx
```

**Expected result:** Clickable tasks open detail modal

---

### Task 36: Create New Task Modal
**Command for OpenClaw:**
```
Create src/components/modals/CreateTaskModal.tsx using shadcn/ui Dialog. Include:
- Form with fields: title*, description, venture, priority, estimatedCost, tags
- Validation (title required)
- Create button that adds task to queue
- Cancel button
Add "+" button in KanbanBoard to open this modal
```

**Expected result:** Can create new tasks via modal

---

### Task 37: Add Task Actions
**Command for OpenClaw:**
```
In src/app/page.tsx, implement:
- handleTaskCreate(taskData) - adds new task to state
- handleTaskUpdate(taskId, updates) - updates existing task
- handleTaskDelete(taskId) - removes task from state
- handleTaskStart(taskId) - moves task from queue to active
Pass these handlers to modals and components
```

**Expected result:** Full CRUD operations on tasks

---

## Phase 10: Polish & Deploy (Tasks 38-40)

### Task 38: Add Animations
**Command for OpenClaw:**
```
Add Framer Motion animations:
1. Fade in on page load (src/app/page.tsx)
2. Slide in for sidebar sections (src/components/layout/Sidebar.tsx)
3. Scale on hover for cards (VentureCard, TaskCard)
4. Fade in for new activities (ActivityItem)
Keep animations subtle (200-300ms duration)
```

**Expected result:** Smooth, polished animations throughout

---

### Task 39: Make Responsive
**Command for OpenClaw:**
```
Add responsive design:
1. Sidebar: hidden on mobile (< 768px), shown via hamburger menu
2. KanbanBoard: stack columns vertically on mobile
3. Header: compact mode on mobile (hide labels)
4. ActivityFeed: hidden on mobile, accessible via button
Use Tailwind responsive classes (sm:, md:, lg:)
```

**Expected result:** Works well on mobile and desktop

---

### Task 40: Create README
**Command for OpenClaw:**
```
Create README.md in /home/salem/hq/apps/mission-control-dashboard with:
1. Project overview and purpose
2. Tech stack list
3. Installation instructions (npm install, env setup)
4. Development guide (npm run dev)
5. Project structure overview
6. Features list
7. Screenshots placeholder
8. License (MIT)
```

**Expected result:** Complete README.md

---

## Verification Checklist

After completing all tasks, verify:
- [ ] `npm run dev` starts without errors
- [ ] Dashboard loads at http://localhost:3000
- [ ] Sidebar shows ventures and agents
- [ ] Kanban board displays with 3 columns
- [ ] Can drag tasks between columns
- [ ] Tasks update status when moved
- [ ] Activity feed shows recent events
- [ ] Clicking task opens detail modal
- [ ] Can create new tasks
- [ ] Real data from OpenClaw gateway displays
- [ ] Responsive on mobile (test with DevTools)
- [ ] Dark mode theme applied throughout
- [ ] No console errors

---

## Optional Enhancements (Post-MVP)

- Search bar in header to filter tasks
- Keyboard shortcuts (j/k navigation, n for new task)
- Export tasks to CSV
- Task templates
- Bulk actions (move multiple tasks)
- Gantt chart view
- Calendar view
- Performance metrics dashboard
- Notifications system
- Webhook integration
- Real-time WebSocket updates (replace polling)

---

## How to Use This Checklist

**Send tasks to OpenClaw via Telegram one at a time:**
```
Task 1: Create a new Next.js 14 project at /home/salem/hq/apps/mission-control-dashboard with TypeScript, Tailwind CSS, and App Router...
```

**After each task:**
1. Check that files were created
2. Test that code runs (if applicable)
3. Fix any errors before moving to next task

**For quick review:**
Send me specific files to review:
```
"Review src/components/kanban/KanbanBoard.tsx for issues"
```

**At major milestones:**
- After Task 15: Check that layout renders
- After Task 20: Check that kanban works
- After Task 28: Check that full page renders
- After Task 34: Check that real data loads
- After Task 40: Full verification checklist
