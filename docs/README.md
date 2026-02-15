# Mission Control Dashboard - Planning Documentation

**Complete planning package for building your AI agent management dashboard**

---

## 📋 Document Overview

| Document | Purpose | Use When |
|----------|---------|----------|
| **PROJECT_STRUCTURE.md** | Overall architecture, file tree, tech stack | Starting project, understanding layout |
| **DATA_MODELS.md** | TypeScript interfaces, types, data structures | Creating types, understanding data flow |
| **COMPONENTS.md** | Component specs, props, layouts, styling | Building UI components |
| **TASKS.md** | Sequential checklist for OpenClaw | **START HERE - Execute with OpenClaw** |

---

## 🚀 Quick Start Guide

### Step 1: Read This README (you are here)
Get oriented with the planning docs.

### Step 2: Review Project Structure
```bash
cat docs/PROJECT_STRUCTURE.md
```
Understand the tech stack and folder layout.

### Step 3: Scan Data Models
```bash
cat docs/DATA_MODELS.md
```
Review the types you'll be working with.

### Step 4: Start Executing Tasks
```bash
cat docs/TASKS.md
```
**Send tasks to OpenClaw one by one via Telegram.**

---

## 📊 Project Stats

**Timeline:** 40 tasks
**Estimated Time:** 8-12 hours (with OpenClaw)
**Files to Create:** ~35 files
**Lines of Code:** ~3,000-4,000 LOC
**Dependencies:** ~15 npm packages

---

## 🔄 Development Workflow

### Using OpenClaw (Most Work)

**For each task in TASKS.md:**
1. Copy the command from the task
2. Send to OpenClaw via Telegram
3. Wait for completion
4. Verify the output
5. Move to next task

**Example:**
```
You → OpenClaw (via Telegram):
"Task 1: Create a new Next.js 14 project at /home/salem/hq/apps/mission-control-dashboard with TypeScript, Tailwind CSS, and App Router..."

OpenClaw → Creates project

You → Verify it worked:
ls /home/salem/hq/apps/mission-control-dashboard
```

### Using Claude Code (Review/Debug)

**When to ping me:**
- ❌ OpenClaw produces buggy code
- ❌ Unsure about architecture decision
- ❌ Need design guidance
- ✅ Major milestone review (Task 15, 28, 34, 40)

**How to ask:**
```
Short messages:
"Review KanbanBoard.tsx for issues"
"The drag & drop isn't working, what's wrong?"
"Should I use useState or useReducer here?"
```

---

## 📁 File Reference Quick Links

### Core Config Files
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind + theme
- `next.config.js` - Next.js config
- `.env.local` - Environment variables

### Type Definitions
- `src/types/venture.ts` - Venture types
- `src/types/agent.ts` - Agent types
- `src/types/task.ts` - Task types
- `src/types/activity.ts` - Activity types
- `src/types/dashboard.ts` - Dashboard state

### Key Components
- `src/app/page.tsx` - Main dashboard page
- `src/components/layout/MainLayout.tsx` - Root layout
- `src/components/kanban/KanbanBoard.tsx` - Kanban board
- `src/components/activity/ActivityFeed.tsx` - Activity log

### Utilities
- `src/lib/utils.ts` - Helper functions
- `src/lib/constants.ts` - App constants
- `src/lib/api/openclaw.ts` - OpenClaw API client

---

## 🎯 Milestone Checkpoints

### Milestone 1: Project Setup (Tasks 1-10)
**Goal:** Get the project initialized with types and data
**Verify:**
```bash
cd /home/salem/hq/apps/mission-control-dashboard
npm run dev
```
Should start without errors (blank page is OK)

### Milestone 2: Layout Complete (Tasks 11-15)
**Goal:** Basic layout with sidebar and header
**Verify:** Visit http://localhost:3000, see header and sidebar

### Milestone 3: Kanban Working (Tasks 16-20)
**Goal:** Drag & drop kanban board functional
**Verify:** Can drag tasks between columns

### Milestone 4: Full UI (Tasks 21-31)
**Goal:** All components rendered with mock data
**Verify:** Complete dashboard with ventures, agents, kanban, activity feed

### Milestone 5: Real Data (Tasks 32-34)
**Goal:** Connected to OpenClaw gateway
**Verify:** Dashboard shows your actual OpenClaw agents and status

### Milestone 6: Complete (Tasks 35-40)
**Goal:** Polished, responsive, production-ready
**Verify:** Full verification checklist in TASKS.md

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found"
**Solution:** Run `npm install` in project directory

### Issue: "Port 3000 already in use"
**Solution:** Kill existing process or change port:
```bash
kill -9 $(lsof -ti:3000)
# or
PORT=3001 npm run dev
```

### Issue: Drag & drop not working
**Solution:** Check that @dnd-kit packages are installed:
```bash
npm list @dnd-kit/core @dnd-kit/sortable
```

### Issue: OpenClaw API returning 401
**Solution:** Check your gateway token in .env.local matches:
```bash
cat ~/.openclaw/openclaw.json | grep token
```

### Issue: Styles not applying
**Solution:** Restart dev server after Tailwind config changes:
```bash
# Ctrl+C then
npm run dev
```

---

## 📐 Architecture Decisions

### Why Next.js 14?
- App Router for better file organization
- Built-in TypeScript support
- Server components for better performance
- Easy deployment to Vercel

### Why shadcn/ui?
- Beautiful, accessible components
- Fully customizable with Tailwind
- Copy-paste, not dependency bloat
- Consistent design system

### Why @dnd-kit?
- Best drag & drop for React
- Accessible and performant
- TypeScript support
- Easy to customize

### Why Not State Management Library?
- React hooks sufficient for this size
- No complex global state needs
- Simpler to understand and debug
- Can add Zustand/Redux later if needed

---

## 🎨 Design System

### Colors
```
Dark: bg-zinc-950, text-white
Success: text-green-500 (active, completed)
Warning: text-yellow-500 (pending, warnings)
Error: text-red-500 (errors, blocked)
Info: text-blue-500 (info messages)
Agent: text-purple-500 (AI actions)
```

### Spacing
```
Tight: gap-2 (8px)
Normal: gap-4 (16px)
Loose: gap-6 (24px)
Section: gap-8 (32px)
```

### Typography
```
Heading: text-2xl font-bold
Subheading: text-lg font-semibold
Body: text-sm font-normal
Caption: text-xs text-muted-foreground
```

### Border Radius
```
Small: rounded-md (6px)
Normal: rounded-lg (8px)
Large: rounded-xl (12px)
```

---

## 🚢 Deployment Guide

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /home/salem/hq/apps/mission-control-dashboard
vercel

# Follow prompts, done!
```

### Option 2: Docker
```bash
# Build
docker build -t mission-control .

# Run
docker run -p 3000:3000 mission-control
```

### Option 3: Local Server
```bash
# Build for production
npm run build

# Start
npm start
```

---

## 📊 Success Metrics

Track these to measure your dashboard's value:
- ⏱️ **Time saved** per day managing agents
- 📈 **Tasks completed** per week
- 💰 **Capital efficiency** (ROI on agent spend)
- 🎯 **Task success rate** (completed vs failed)
- 🔄 **Agent utilization** (busy time %)

---

## 🔮 Future Enhancements

### Phase 2 Features
- Real-time WebSocket updates (no polling)
- Keyboard shortcuts (vim-style navigation)
- Task templates and automation
- Analytics dashboard with charts
- Notifications system (browser + Telegram)

### Phase 3 Features
- Multi-user support with auth
- Team collaboration features
- API for external integrations
- Mobile app (React Native)
- Voice commands via Telegram

---

## 📝 Notes for Salem

**Your Specific Setup:**
- OpenClaw gateway: ws://127.0.0.1:18789
- Semantic engine: /home/salem/hq/apps/semantic-engine
- Current capital: $200 ($160 available)
- Active ventures: E-Commerce Automation, Allbirds Automation
- Agents: Main (Sonnet 4.5), Telegram bot (@MiniSalbot)

**Integration Points:**
- Dashboard reads from OpenClaw gateway (real-time status)
- Can trigger semantic search queries
- Shows capital allocation across ventures
- Displays Telegram bot status
- Tracks task progress and costs

**Token Conservation:**
- Use OpenClaw for ALL code generation (40 tasks)
- Use Claude Code for reviews/debugging only
- Estimated token usage: 10k-15k (vs 100k if I did everything)

---

## 📞 Support

**Questions?** Ask Claude Code:
- Quick reviews: "Review [component] for bugs"
- Architecture: "Should I use X or Y here?"
- Debugging: "This isn't working: [error]"

**Issues?** Check:
1. TASKS.md for task details
2. COMPONENTS.md for component specs
3. DATA_MODELS.md for type definitions
4. This README for common issues

---

## ✅ Final Checklist

Before considering the project complete:
- [ ] All 40 tasks in TASKS.md completed
- [ ] `npm run dev` works without errors
- [ ] Dashboard displays at localhost:3000
- [ ] Real OpenClaw data loads
- [ ] Can create, update, delete tasks
- [ ] Drag & drop works smoothly
- [ ] Responsive on mobile (test in DevTools)
- [ ] No console errors or warnings
- [ ] README.md in project root
- [ ] Deployed to Vercel (optional)

---

## 🎉 You're Ready!

**Everything you need is in these 4 documents.**

Start with Task 1 in TASKS.md and work through them with OpenClaw.

Ping me (Claude Code) only when you need reviews or hit blockers.

Good luck building your Mission Control dashboard! 🚀

---

**Created:** 2026-02-09
**Token Investment:** ~5k tokens
**Expected Savings:** 85k+ tokens
**Your Next Step:** Open TASKS.md and start Task 1
