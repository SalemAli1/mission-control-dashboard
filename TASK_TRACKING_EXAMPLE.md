# Task Tracking Layer - Implementation Guide

## Option 2: Next.js API Routes + File Storage

### Step 1: Create Data Directory
```bash
mkdir -p /home/salem/.openclaw/dashboard-data
```

### Step 2: Create API Routes

**File: src/app/api/tasks/route.ts**
```typescript
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = '/home/salem/.openclaw/dashboard-data';
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'queue' | 'active' | 'completed';
  venture: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
}

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);
    return NextResponse.json(tasks);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return NextResponse.json([]);
  }
}

// POST /api/tasks - Create new task
export async function POST(request: Request) {
  try {
    const newTask: Task = await request.json();

    // Load existing tasks
    let tasks: Task[] = [];
    try {
      const data = await fs.readFile(TASKS_FILE, 'utf-8');
      tasks = JSON.parse(data);
    } catch {
      // File doesn't exist, start fresh
    }

    // Add new task
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(task);

    // Save
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(request: Request) {
  try {
    const { id, updates } = await request.json();

    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    let tasks: Task[] = JSON.parse(data);

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));

    return NextResponse.json(tasks[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    let tasks: Task[] = JSON.parse(data);

    tasks = tasks.filter(t => t.id !== id);

    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
```

**File: src/app/api/ventures/route.ts**
```typescript
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = '/home/salem/.openclaw/dashboard-data';
const VENTURES_FILE = path.join(DATA_DIR, 'ventures.json');

interface Venture {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'paused' | 'completed';
  priority: 'low' | 'medium' | 'high';
  capitalSpent: number;
  capitalBudget: number;
  description?: string;
  createdAt: string;
}

export async function GET() {
  try {
    const data = await fs.readFile(VENTURES_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newVenture = await request.json();

    let ventures = [];
    try {
      const data = await fs.readFile(VENTURES_FILE, 'utf-8');
      ventures = JSON.parse(data);
    } catch {}

    const venture: Venture = {
      ...newVenture,
      id: `venture-${Date.now()}`,
      capitalSpent: 0,
      createdAt: new Date().toISOString(),
    };

    ventures.push(venture);

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(VENTURES_FILE, JSON.stringify(ventures, null, 2));

    return NextResponse.json(venture);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create venture' }, { status: 500 });
  }
}
```

### Step 3: Update Dashboard to Use API

**File: src/lib/api/tasks.ts** (new file)
```typescript
import type { Task, Venture } from '@/types';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks', { cache: 'no-store' });
  if (!response.ok) return [];
  return response.json();
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return response.json();
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates }),
  });
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
}

export async function fetchVentures(): Promise<Venture[]> {
  const response = await fetch('/api/ventures', { cache: 'no-store' });
  if (!response.ok) return [];
  return response.json();
}
```

### Step 4: Initialize with Sample Data

**File: scripts/init-data.ts**
```typescript
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = '/home/salem/.openclaw/dashboard-data';

const initialVentures = [
  {
    id: 'venture-1',
    name: 'E-Commerce Automation',
    icon: '🛍️',
    status: 'active',
    priority: 'high',
    capitalSpent: 0,
    capitalBudget: 80,
    description: 'Automated product research and listing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'venture-2',
    name: 'Allbirds Automation',
    icon: '👟',
    status: 'active',
    priority: 'medium',
    capitalSpent: 0,
    capitalBudget: 40,
    description: 'Allbirds product tracking and analysis',
    createdAt: new Date().toISOString(),
  },
];

const initialTasks = [
  {
    id: 'task-1',
    title: 'Set up web scraper for Allbirds',
    description: 'Create Python scraper to monitor Allbirds product availability',
    status: 'queue',
    venture: 'venture-2',
    priority: 'high',
    estimatedCost: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function init() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, 'ventures.json'),
    JSON.stringify(initialVentures, null, 2)
  );
  await fs.writeFile(
    path.join(DATA_DIR, 'tasks.json'),
    JSON.stringify(initialTasks, null, 2)
  );
  console.log('✅ Data initialized at', DATA_DIR);
}

init();
```

Run with: `npx tsx scripts/init-data.ts`

### Step 5: OpenClaw Integration

OpenClaw can read/write tasks via the file system:

**In OpenClaw session:**
```bash
# Read current tasks
cat /home/salem/.openclaw/dashboard-data/tasks.json

# Add a task (OpenClaw can do this)
echo '{...}' >> /home/salem/.openclaw/dashboard-data/tasks.json

# Or use the API from OpenClaw
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task from OpenClaw", "venture": "venture-1", "status": "queue"}'
```

---

## Usage Flow

1. **Dashboard** - View/create/manage tasks via UI
2. **File System** - JSON files are source of truth
3. **OpenClaw** - Can read tasks, update status when completing work
4. **API** - Ensures data consistency

Would you like me to create these files for your project?
