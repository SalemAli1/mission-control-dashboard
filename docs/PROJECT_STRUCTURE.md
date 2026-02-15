# Mission Control Dashboard - Project Structure

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **State:** React hooks (useState, useEffect)
- **API:** OpenClaw Gateway (ws://127.0.0.1:18789)

## Directory Structure

```
mission-control-dashboard/
├── docs/                           # Planning documents (this folder)
│   ├── PROJECT_STRUCTURE.md        # This file
│   ├── COMPONENTS.md               # Component specifications
│   ├── DATA_MODELS.md              # TypeScript interfaces
│   └── TASKS.md                    # OpenClaw task checklist
│
├── public/                         # Static assets
│   └── images/
│       └── logo.png
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main dashboard page
│   │   └── globals.css            # Global styles + Tailwind
│   │
│   ├── components/                 # React components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Left sidebar with ventures/agents
│   │   │   ├── Header.tsx         # Top header with status bar
│   │   │   └── MainLayout.tsx     # Overall layout wrapper
│   │   │
│   │   ├── ventures/
│   │   │   ├── VentureCard.tsx    # Individual venture card
│   │   │   └── VentureList.tsx    # List of all ventures
│   │   │
│   │   ├── agents/
│   │   │   ├── AgentStatus.tsx    # Agent status indicator
│   │   │   └── AgentList.tsx      # List of all agents
│   │   │
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx    # Main kanban board
│   │   │   ├── KanbanColumn.tsx   # Single column (Queue/Active/Done)
│   │   │   └── TaskCard.tsx       # Individual task card
│   │   │
│   │   ├── activity/
│   │   │   ├── ActivityFeed.tsx   # Real-time activity log
│   │   │   └── ActivityItem.tsx   # Single activity entry
│   │   │
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       └── dialog.tsx
│   │
│   ├── lib/                        # Utility functions
│   │   ├── api/
│   │   │   ├── openclaw.ts        # OpenClaw API client
│   │   │   └── semantic-search.ts # Semantic search integration
│   │   │
│   │   ├── utils.ts               # Helper functions
│   │   └── constants.ts           # App constants
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── venture.ts             # Venture types
│   │   ├── agent.ts               # Agent types
│   │   ├── task.ts                # Task types
│   │   └── activity.ts            # Activity types
│   │
│   └── data/                       # Mock/seed data
│       └── seed.ts                # Initial data for development
│
├── .eslintrc.json                  # ESLint config
├── .gitignore                      # Git ignore
├── next.config.js                  # Next.js config
├── package.json                    # Dependencies
├── postcss.config.js               # PostCSS config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── README.md                       # Project README
```

## File Count Estimate
- Components: ~15 files
- Config files: ~8 files
- Type definitions: ~5 files
- Utilities: ~5 files
- **Total: ~35 files**

## Development Flow

### Phase 1: Setup (Tasks 1-5)
Initialize project, install dependencies, configure Tailwind + shadcn/ui

### Phase 2: Types & Data (Tasks 6-10)
Create TypeScript interfaces, mock data, constants

### Phase 3: Layout (Tasks 11-15)
Build layout components (Sidebar, Header, MainLayout)

### Phase 4: Kanban Board (Tasks 16-20)
Build kanban board with drag-drop functionality

### Phase 5: Venture/Agent Components (Tasks 21-25)
Create venture cards and agent status displays

### Phase 6: Activity Feed (Tasks 26-28)
Build real-time activity logging

### Phase 7: API Integration (Tasks 29-32)
Connect to OpenClaw gateway and semantic search

### Phase 8: Polish (Tasks 33-35)
Animations, responsive design, error handling

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

## API Endpoints

### OpenClaw Gateway
- **Base URL:** `http://127.0.0.1:18789`
- **Status:** `GET /status`
- **Agents:** `GET /agents`
- **Sessions:** `GET /sessions`

### Semantic Search
- **Script:** `/home/salem/hq/apps/semantic-engine/query_knowledge.py`
- **Usage:** Execute via child process or create HTTP wrapper

## Environment Variables

```bash
# .env.local
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=5cff9f8966d1126023ec5dd52fb71c8ce183f5cf521a3830
SEMANTIC_SEARCH_PATH=/home/salem/hq/apps/semantic-engine
```

## Styling Guidelines

### Color Palette
```css
/* Dark mode base */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;

/* Status colors */
--success: 142 76% 36%;    /* Green - Active/Completed */
--warning: 48 96% 53%;     /* Yellow - Pending */
--error: 0 84% 60%;        /* Red - Error */
--info: 221 83% 53%;       /* Blue - Info */
--agent: 271 81% 56%;      /* Purple - AI actions */
```

### Typography
- **Headings:** font-bold
- **Body:** font-normal
- **Monospace:** font-mono (for code/terminal output)

## Design Principles
1. **Dark mode first** - Matches terminal aesthetic
2. **Minimal and clean** - Focus on information density
3. **Real-time updates** - Show live agent activity
4. **Keyboard shortcuts** - Power user features
5. **Responsive** - Works on desktop and tablet
