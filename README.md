# Mission Control Dashboard

A real-time AI agent management dashboard for coordinating multiple AI agents across different ventures and tasks.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- 🎨 **Kanban Board** - Drag-and-drop task management with real-time updates
- 🤖 **Multi-Agent Coordination** - Manage 6+ AI agents concurrently without conflicts
- 💰 **Capital Tracking** - Track spending and budgets per venture
- 📊 **Activity Feed** - Real-time event logging for all agent actions
- 🔒 **Atomic Task Claiming** - Transaction-based task allocation prevents race conditions
- 🌙 **Dark Mode** - Beautiful dark theme optimized for long sessions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
cd /home/salem/hq/apps/mission-control-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Initialize the database
npx prisma migrate dev
DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 📁 Project Structure

```
mission-control-dashboard/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── ventures/     # Venture CRUD
│   │   │   ├── tasks/        # Task CRUD + claim/complete
│   │   │   ├── agents/       # Agent management
│   │   │   └── activities/   # Activity logging
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main dashboard
│   ├── components/
│   │   ├── kanban/           # Kanban board components
│   │   ├── ventures/         # Venture management
│   │   ├── agents/           # Agent status displays
│   │   ├── activity/         # Activity feed
│   │   ├── modals/           # Task creation/editing modals
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── api/              # API client functions
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript type definitions
└── docs/                     # Documentation

```

## 🗄️ Database Schema

**Ventures** - Projects with budgets
- Tracks capital spent vs budget
- Links to tasks

**Tasks** - Work items with status tracking
- Status: queue → active → completed
- Priority: low | medium | high
- Token estimation and actual usage
- Atomic assignment to agents

**Agents** - AI workers
- Real-time status tracking
- Token usage monitoring
- Current task assignment

**Activities** - Audit log
- Every action logged
- Filterable by type, level, venture, task, agent

## 🔌 API Endpoints

### Ventures
- `GET /api/ventures` - List all ventures
- `POST /api/ventures` - Create venture
- `PATCH /api/ventures` - Update venture
- `DELETE /api/ventures` - Delete venture

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks` - Update task
- `DELETE /api/tasks` - Delete task
- `POST /api/tasks/claim` - **Atomic task claiming** (for agents)
- `POST /api/tasks/complete` - Complete task with results

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create/update agent (upsert)
- `PATCH /api/agents` - Update agent status
- `DELETE /api/agents` - Remove agent

### Activities
- `GET /api/activities?limit=50` - Get recent activities
- `POST /api/activities` - Log new activity

## 🤖 Agent Integration

Your AI agents can interact with the dashboard via the API:

### Claiming a Task

```bash
curl -X POST http://localhost:3000/api/tasks/claim \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-1",
    "agentName": "Worker Bot 1"
  }'
```

### Completing a Task

```bash
curl -X POST http://localhost:3000/api/tasks/complete \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "clxyz123",
    "agentId": "agent-1",
    "output": "Task completed successfully",
    "actualCost": 5.50,
    "actualTokens": 15000
  }'
```

The atomic claiming system ensures **zero race conditions** even with 6+ agents working simultaneously.

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Date Handling**: date-fns

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# OpenClaw Gateway (optional)
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=your-token-here

# Semantic Search (optional)
SEMANTIC_SEARCH_PATH=/path/to/semantic-engine
```

### Tailwind Configuration

Custom colors defined in `tailwind.config.ts`:
- `success` - #10B981 (green)
- `warning` - #F59E0B (yellow)
- `error` - #EF4444 (red)
- `agent` - #8B5CF6 (purple)

## 📊 Capital Tracking

Each venture has:
- `capitalBudget` - Total allocated budget
- `capitalSpent` - Amount spent so far

When tasks complete with `actualCost`, it's automatically added to the venture's `capitalSpent`.

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npx tsc --noEmit

# Database management
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create new migration
npx prisma db push         # Push schema changes
```

## 📝 Documentation

See the `docs/` folder for detailed documentation:
- `TASKS.md` - Development task checklist
- `COMPONENTS.md` - Component specifications
- `DATA_MODELS.md` - Type definitions and data structures
- `PROJECT_STRUCTURE.md` - Architecture overview
- `TASK_TRACKING_READY.md` - API integration guide

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

MIT License - feel free to use this for your own AI agent management needs.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Prisma](https://www.prisma.io/)

---

**Created**: February 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
