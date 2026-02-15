# Development Documentation

## Overview

Complete development documentation for the Mission Control Dashboard.

---

## 📚 Documentation Index

### [Component Documentation](./COMPONENT_DOCS.md)
**Purpose:** Templates and examples for documenting components

**Contents:**
- Component documentation template
- Layout components (Header, Sidebar, MainLayout)
- Kanban components (KanbanBoard, KanbanColumn, TaskCard)
- Venture components (VentureCard, VentureList)
- Agent components (AgentStatus, AgentList)
- Best practices and patterns
- Testing guidelines

**Use when:**
- Creating new components
- Understanding existing components
- Writing tests
- Following code conventions

---

### [API Integration Guide](./API_INTEGRATION.md)
**Purpose:** How to integrate with external APIs

**Contents:**
- OpenClaw Gateway integration
- Semantic Search Engine integration
- Environment configuration
- Error handling strategies
- Polling vs WebSocket
- Data transformation
- Performance optimization
- Testing APIs

**Use when:**
- Connecting to OpenClaw gateway
- Implementing semantic search
- Debugging API issues
- Optimizing API calls
- Writing API tests

---

### [Data Flow Architecture](./DATA_FLOW.md)
**Purpose:** How data moves through the application

**Contents:**
- Architecture diagram
- Data flow patterns (load, polling, user actions, filtering)
- State management (React hooks, Context, Zustand)
- Data transformation (API → App types)
- Derived state calculations
- Error handling
- Performance optimization
- Testing data flow

**Use when:**
- Understanding the app architecture
- Adding new features
- Debugging state issues
- Optimizing performance
- Planning refactoring

---

### [Troubleshooting Guide](./TROUBLESHOOTING.md)
**Purpose:** Diagnose and fix common issues

**Contents:**
- Development environment issues
- TypeScript errors
- UI/Styling problems
- Drag & drop issues
- API integration problems
- Performance issues
- Build & deployment
- Browser compatibility
- Getting help

**Use when:**
- Something isn't working
- Errors in console
- Build failures
- Performance problems
- Before asking for help

---

## 🚀 Quick Start

### New to the project?

1. Read [Project Structure](../PROJECT_STRUCTURE.md) for overview
2. Review [Data Models](../DATA_MODELS.md) for types
3. Check [Components](../COMPONENTS.md) for UI specs
4. Follow [Tasks](../TASKS.md) for implementation order

### Working on a specific area?

| Area | Start Here |
|------|-----------|
| UI Components | [COMPONENT_DOCS.md](./COMPONENT_DOCS.md) |
| API Integration | [API_INTEGRATION.md](./API_INTEGRATION.md) |
| State Management | [DATA_FLOW.md](./DATA_FLOW.md) |
| Debugging | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

### Having issues?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) first
2. Search error message in browser/server logs
3. Check if similar issue in GitHub issues
4. Create minimal reproduction
5. Ask for help with context

---

## 📖 Documentation Standards

### Writing Good Documentation

**Do:**
- ✅ Use clear, concise language
- ✅ Include code examples
- ✅ Show expected output
- ✅ Explain *why*, not just *what*
- ✅ Keep it up to date

**Don't:**
- ❌ Assume prior knowledge
- ❌ Skip error cases
- ❌ Use jargon without explanation
- ❌ Write documentation that repeats code
- ❌ Let it get stale

### Code Examples

**Good Example:**
```typescript
/**
 * Transforms API agent data to internal Agent type.
 * Adds default values for fields not provided by API.
 *
 * @example
 * const agent = transformAgent({
 *   id: 'agent-1',
 *   name: 'Main Agent',
 *   status: 'active',
 *   model: 'claude-sonnet-4-5'
 * });
 * // Returns: Agent with all required fields populated
 */
function transformAgent(apiAgent: OpenClawAgent): Agent {
  // Implementation
}
```

**Bad Example:**
```typescript
// Transform agent
function transform(a) {
  return { ...a };
}
```

---

## 🔄 Keeping Docs Updated

### When to Update Docs

Update documentation when you:
- Add new components
- Change APIs
- Fix bugs (add to troubleshooting)
- Refactor architecture
- Add new features
- Change data models

### Review Schedule

- **Weekly:** Check for outdated info
- **Per PR:** Update relevant docs
- **Per release:** Full documentation review

---

## 🤝 Contributing to Docs

### Format

- Use Markdown (.md files)
- Follow existing structure
- Include code examples
- Add links to related docs

### Location

```
docs/
├── development/          # Developer documentation
│   ├── README.md        # This file
│   ├── COMPONENT_DOCS.md
│   ├── API_INTEGRATION.md
│   ├── DATA_FLOW.md
│   └── TROUBLESHOOTING.md
├── PROJECT_STRUCTURE.md # Project overview
├── DATA_MODELS.md       # Type definitions
├── COMPONENTS.md        # Component specs
└── TASKS.md            # Implementation tasks
```

---

## 📚 Additional Resources

### Project Documentation
- [Project Structure](../PROJECT_STRUCTURE.md) - Overall architecture
- [Data Models](../DATA_MODELS.md) - TypeScript types
- [Components Specs](../COMPONENTS.md) - UI component specs
- [Tasks Checklist](../TASKS.md) - Implementation tasks

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [dnd-kit](https://docs.dndkit.com/)

### Community
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discussions](https://github.com/your-repo/discussions)
- [Discord/Slack](#) (if applicable)

---

## 💡 Tips

### For New Developers

1. **Read the docs in order:**
   - PROJECT_STRUCTURE.md
   - DATA_MODELS.md
   - COMPONENT_DOCS.md
   - DATA_FLOW.md

2. **Start small:**
   - Pick one component to understand
   - Trace data flow through that component
   - Make a small change
   - Test your understanding

3. **Use the tools:**
   - React DevTools
   - TypeScript compiler
   - ESLint
   - Browser DevTools

### For Experienced Developers

1. **Architecture first:**
   - Read DATA_FLOW.md
   - Understand state management
   - Review API integration patterns

2. **Follow patterns:**
   - Match existing code style
   - Use established patterns
   - Don't reinvent the wheel

3. **Document as you go:**
   - Update docs with changes
   - Add examples for new patterns
   - Help the next developer

---

## 🆘 Getting Stuck?

1. **Check Troubleshooting Guide** first
2. **Search existing issues** on GitHub
3. **Ask in team chat** with context
4. **Create minimal reproduction**
5. **File an issue** with details

**Include:**
- What you're trying to do
- What's happening instead
- Relevant code snippets
- Error messages
- Steps to reproduce
- Environment info

---

## ✅ Documentation Checklist

When you complete a task, ensure:

- [ ] Code is documented (JSDoc comments)
- [ ] Component added to COMPONENT_DOCS.md
- [ ] New patterns added to guides
- [ ] Troubleshooting updated (if found issues)
- [ ] Examples are working
- [ ] Links are not broken
- [ ] Spelling/grammar checked

---

**Happy coding! 🚀**

If you improve these docs, others will thank you. If you find errors, please fix them or report them.
