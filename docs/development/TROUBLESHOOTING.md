# Troubleshooting Guide

## Overview

This guide helps you diagnose and fix common issues in the Mission Control Dashboard.

---

## Development Environment Issues

### 1. Dev Server Won't Start

**Error:**
```
Error: Cannot find module 'next'
```

**Solution:**
```bash
# Install dependencies
npm install

# If that fails, clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Error:**
```
Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill the process using port 3000
kill -9 $(lsof -ti:3000)

# Option 2: Use a different port
PORT=3001 npm run dev

# Option 3: Find and stop the process manually
lsof -i:3000
# Then kill the PID shown
```

---

**Error:**
```
Module build failed: Error: Cannot find module '@/types'
```

**Solution:**
```bash
# Ensure src/types/index.ts exists
ls src/types/index.ts

# If missing, create it:
cat > src/types/index.ts << 'EOF'
export * from './venture';
export * from './agent';
export * from './task';
export * from './activity';
export * from './dashboard';
export * from './api';
EOF

# Restart dev server
npm run dev
```

---

### 2. TypeScript Errors

**Error:**
```
Property 'tokensTotal' does not exist on type 'Agent'
```

**Solution:**
1. Check type definition matches usage:
```typescript
// src/types/agent.ts should have:
export interface Agent {
  tokensTotal: number;  // Not tokenLimit
  // ...
}
```

2. If you renamed a field, update all components using it:
```bash
# Find all usages
grep -r "tokenLimit" src/components/
```

---

**Error:**
```
Element implicitly has an 'any' type
```

**Solution:**
Add proper type annotations:
```typescript
// Before (error)
const items = [];
items.push(something);

// After (fixed)
const items: Item[] = [];
items.push(something);
```

---

### 3. Import Path Issues

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solution:**
1. Verify tsconfig.json has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Ensure you're using the correct alias:
```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';

// ❌ Wrong
import { Button } from '../../../components/ui/button';
```

---

## UI/Styling Issues

### 1. Tailwind Classes Not Working

**Problem:** Classes like `bg-success` or custom colors not applying

**Solution:**
1. Check globals.css has theme variables:
```css
@theme inline {
  --color-success: var(--success);
  --color-warning: var(--warning);
  /* ... */
}
```

2. Ensure color is defined:
```css
:root {
  --success: #10B981;
}
```

3. Restart dev server after CSS changes:
```bash
# Ctrl+C to stop, then
npm run dev
```

---

**Problem:** Custom animations not working

**Solution:**
1. Check if animation is defined in globals.css:
```css
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

2. If using Tailwind v4, add to theme:
```css
@theme {
  --animate-pulse-slow: pulse-slow 2s ease-in-out infinite;
}
```

---

### 2. Dark Mode Issues

**Problem:** Dark mode not applying

**Solution:**
1. Ensure `<html>` has `dark` class:
```typescript
// src/app/layout.tsx
<html lang="en" className="dark">
```

2. Check CSS variables are defined for dark mode:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

---

### 3. Component Not Rendering

**Problem:** Component appears blank or doesn't show up

**Debugging Steps:**

1. **Check for errors in console:**
```bash
# Open browser DevTools (F12)
# Look at Console tab for errors
```

2. **Verify component is receiving props:**
```typescript
// Add console.log at top of component
export function MyComponent({ data }: Props) {
  console.log('MyComponent props:', data);
  // ...
}
```

3. **Check for conditional rendering:**
```typescript
// This won't render if data is empty
{data.length > 0 && (
  <MyComponent data={data} />
)}

// Add fallback to debug
{data.length > 0 ? (
  <MyComponent data={data} />
) : (
  <div>No data (length: {data.length})</div>
)}
```

4. **Verify parent component is rendering:**
```typescript
// Add visible marker
<div className="border-2 border-red-500">
  <MyComponent {...props} />
</div>
```

---

## Drag & Drop Issues

### 1. Drag Not Working

**Problem:** Can't drag TaskCard

**Solution:**
1. Verify @dnd-kit is installed:
```bash
npm list @dnd-kit/core @dnd-kit/sortable
```

2. Check TaskCard has useDraggable:
```typescript
const { attributes, listeners, setNodeRef } = useDraggable({
  id: task.id,
});

return (
  <div ref={setNodeRef} {...listeners} {...attributes}>
    {/* content */}
  </div>
);
```

3. Ensure KanbanBoard has DndContext:
```typescript
<DndContext onDragEnd={handleDragEnd}>
  {/* columns */}
</DndContext>
```

---

### 2. Drop Not Working

**Problem:** Can drop task but nothing happens

**Solution:**
1. Check KanbanColumn has useDroppable:
```typescript
const { setNodeRef, isOver } = useDroppable({
  id: status, // Must match TaskStatus value
});
```

2. Verify handleDragEnd is implemented:
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    onTaskMove(active.id as string, over.id as TaskStatus);
  }
};
```

3. Check onTaskMove is updating state:
```typescript
const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
  console.log('Moving task:', taskId, 'to', newStatus);

  setTasks(prevTasks =>
    prevTasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    )
  );
};
```

---

## API Integration Issues

### 1. OpenClaw Gateway Connection Failed

**Error:**
```
Failed to fetch: connect ECONNREFUSED 127.0.0.1:18789
```

**Debugging:**

1. **Check if gateway is running:**
```bash
# Check if port is in use
lsof -i:18789

# If not running, start it
cd /path/to/openclaw
python gateway.py
```

2. **Verify URL in environment:**
```bash
# Check .env.local
cat .env.local | grep OPENCLAW

# Should output:
# OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
```

3. **Test gateway directly:**
```bash
curl http://127.0.0.1:18789/status
```

4. **Check for CORS issues:**
If seeing CORS errors in browser console, gateway needs to allow localhost:3000

---

**Error:**
```
401 Unauthorized
```

**Solution:**
1. Verify token matches:
```bash
# Get token from OpenClaw config
cat ~/.openclaw/openclaw.json | grep token

# Compare with .env.local
cat .env.local | grep TOKEN
```

2. Update .env.local if needed:
```bash
echo "OPENCLAW_GATEWAY_TOKEN=your-token-here" >> .env.local
```

3. Restart dev server after env changes

---

### 2. Semantic Search Not Working

**Error:**
```
Failed to search knowledge base
```

**Debugging:**

1. **Check if script exists:**
```bash
ls -la /home/salem/hq/apps/semantic-engine/query_knowledge.py
```

2. **Test script manually:**
```bash
cd /home/salem/hq/apps/semantic-engine
python query_knowledge.py "test query"
```

3. **Check Python dependencies:**
```bash
cd /home/salem/hq/apps/semantic-engine
pip list | grep -E "numpy|faiss|sentence-transformers"
```

4. **Verify path in environment:**
```bash
echo $SEMANTIC_SEARCH_PATH
# Should output: /home/salem/hq/apps/semantic-engine
```

---

### 3. Mock Data Not Loading

**Problem:** Dashboard shows empty, no ventures/agents/tasks

**Solution:**
1. Verify seed data file exists:
```bash
ls src/data/seed.ts
```

2. Check seed data is imported:
```typescript
// src/app/page.tsx
import { mockVentures, mockAgents, mockTasks } from '@/data/seed';
```

3. Verify data is set in state:
```typescript
useEffect(() => {
  setVentures(mockVentures);
  setAgents(mockAgents);
  setTasks(mockTasks);
}, []);
```

4. Add debug log:
```typescript
console.log('Loaded ventures:', mockVentures.length);
console.log('Loaded agents:', mockAgents.length);
console.log('Loaded tasks:', mockTasks.length);
```

---

## Performance Issues

### 1. Slow Rendering / Lag

**Problem:** UI feels sluggish, especially when dragging

**Solutions:**

1. **Use React DevTools Profiler:**
   - Open React DevTools
   - Go to Profiler tab
   - Start recording
   - Perform slow action
   - Stop and analyze

2. **Memoize expensive calculations:**
```typescript
// Before
const filteredTasks = tasks.filter(t => t.ventureId === selectedVenture);

// After
const filteredTasks = useMemo(
  () => tasks.filter(t => t.ventureId === selectedVenture),
  [tasks, selectedVenture]
);
```

3. **Memoize callbacks:**
```typescript
// Before
<TaskCard onClick={() => handleClick(task)} />

// After
const handleClick = useCallback((task: Task) => {
  // logic
}, []);

<TaskCard onClick={handleClick} />
```

4. **Reduce re-renders:**
```typescript
// Use React.memo for expensive components
export const TaskCard = React.memo(({ task }: Props) => {
  // ...
});
```

---

### 2. Memory Leaks

**Problem:** Browser tab using increasing memory over time

**Common Causes:**

1. **Interval not cleaned up:**
```typescript
// ❌ Wrong
useEffect(() => {
  setInterval(() => fetchData(), 5000);
}, []);

// ✅ Correct
useEffect(() => {
  const interval = setInterval(() => fetchData(), 5000);
  return () => clearInterval(interval); // Cleanup!
}, []);
```

2. **Event listeners not removed:**
```typescript
// ✅ Correct
useEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);

  return () => window.removeEventListener('resize', handler);
}, []);
```

3. **WebSocket not closed:**
```typescript
useEffect(() => {
  const ws = new WebSocket('ws://...');

  return () => ws.close(); // Cleanup!
}, []);
```

---

## Build & Deployment Issues

### 1. Build Fails

**Error:**
```
Type error: Property 'X' does not exist
```

**Solution:**
1. Build checks types more strictly than dev mode
2. Fix all TypeScript errors:
```bash
npx tsc --noEmit
```

3. Common fixes:
   - Add missing type annotations
   - Fix incorrect imports
   - Update interface definitions

---

**Error:**
```
Module not found in production
```

**Solution:**
1. Check imports use correct case (case-sensitive in production):
```typescript
// ❌ Wrong (if file is Button.tsx)
import { button } from '@/components/ui/button';

// ✅ Correct
import { Button } from '@/components/ui/button';
```

2. Verify all imports use `@/` alias, not relative paths

---

### 2. Production Build Too Large

**Problem:** Build size > 1MB, slow to load

**Solutions:**

1. **Analyze bundle:**
```bash
npm run build -- --analyze
```

2. **Lazy load heavy components:**
```typescript
const TaskDetailModal = lazy(() => import('./modals/TaskDetailModal'));
```

3. **Remove unused dependencies:**
```bash
# Find large packages
npm list --depth=0

# Remove unused
npm uninstall package-name
```

4. **Optimize images:**
   - Use WebP format
   - Compress images
   - Use Next.js Image component

---

## Testing Issues

### 1. Tests Failing

**Error:**
```
Cannot find module '@testing-library/react'
```

**Solution:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

---

**Error:**
```
window is not defined
```

**Solution:**
Add test environment config:
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
};
```

---

## Browser Compatibility Issues

### 1. Doesn't Work in Safari

**Common Issues:**

1. **CSS Grid issues:**
```css
/* Add fallback */
.grid {
  display: -ms-grid; /* IE/Edge */
  display: grid;
}
```

2. **Flexbox gap not supported:**
```css
/* Use margin instead */
.flex-container > * {
  margin-right: 1rem;
}
.flex-container > *:last-child {
  margin-right: 0;
}
```

3. **Check compatibility:**
Visit [Can I Use](https://caniuse.com/) for CSS/JS features

---

## Getting Help

### 1. Check Logs

**Browser Console:**
- F12 → Console tab
- Look for red errors
- Check network tab for failed requests

**Server Logs:**
```bash
# Dev server output shows errors
npm run dev
```

**OpenClaw Logs:**
```bash
# Check gateway logs
tail -f ~/.openclaw/logs/gateway.log
```

---

### 2. Debug Tools

**React DevTools:**
- Install browser extension
- Inspect component props/state
- Profile performance

**Redux DevTools:**
- Even without Redux, useful for time-travel debugging
- Works with Zustand devtools middleware

**Network Tab:**
- See all API requests
- Check request/response data
- Verify status codes

---

### 3. Reproduce Minimal Example

Create minimal reproduction:
```typescript
// Isolate the problem
export default function MinimalRepro() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

Test if issue still occurs. If not, gradually add complexity until you find the cause.

---

### 4. Search for Similar Issues

**Resources:**
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [React GitHub Issues](https://github.com/facebook/react/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)
- [OpenClaw Documentation](#)

**Search Tips:**
- Include error message in quotes
- Add framework name (Next.js, React, etc.)
- Include version numbers

---

### 5. Ask for Help

**Before asking:**
- [ ] Checked this guide
- [ ] Read error message carefully
- [ ] Googled the error
- [ ] Created minimal reproduction
- [ ] Checked if it works in a fresh project

**When asking:**
1. Describe what you're trying to do
2. Show relevant code (minimal!)
3. Include error messages
4. List what you've tried
5. Specify environment (OS, Node version, browser)

---

## Prevention Tips

### 1. Use TypeScript Strictly

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. Add ESLint Rules

```json
// eslint.config.mjs
export default [
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'react-hooks/exhaustive-deps': 'error'
    }
  }
];
```

### 3. Write Tests

```typescript
// Catch bugs before production
describe('TaskCard', () => {
  it('renders correctly', () => {
    // test code
  });
});
```

### 4. Use Git

```bash
# Commit often
git add .
git commit -m "Working state before changes"

# Easy to revert if something breaks
git revert HEAD
```

---

## Emergency Recovery

### Nuclear Option: Fresh Install

If everything is broken:

```bash
# 1. Backup your code
cp -r src/ ~/backup/

# 2. Delete everything
rm -rf node_modules .next package-lock.json

# 3. Reinstall
npm install

# 4. Rebuild
npm run dev
```

### Last Resort: Start Fresh

```bash
# Create new Next.js app
npx create-next-app@latest mission-control-fresh

# Copy your src/ folder
cp -r ../mission-control-dashboard/src/ ./

# Copy package.json dependencies
# Then npm install
```

---

## Checklist: "It's Not Working"

When something doesn't work, go through this checklist:

- [ ] Check browser console for errors
- [ ] Check dev server output for errors
- [ ] Restart dev server
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Check file saved (Ctrl+S)
- [ ] Check correct file open in editor
- [ ] Verify correct component imported
- [ ] Check props being passed correctly
- [ ] Add console.log to debug
- [ ] Check TypeScript errors (npx tsc --noEmit)
- [ ] Verify environment variables loaded
- [ ] Check API is running (for API issues)
- [ ] Try in incognito/private window
- [ ] Check if it works in production build

---

**Still stuck? Create a minimal reproduction and ask for help!**
