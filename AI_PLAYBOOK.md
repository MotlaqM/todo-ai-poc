# AI Playbook - To-Do PoC

**Purpose**: Minimal proof-of-concept to validate AI-assisted development. NOT production-ready.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Dev server → http://localhost:5173
npm run test:run     # Run all tests
npm run build        # Production build
```

## Project Structure

- `src/App.tsx` - Main component with ALL todo logic
- `src/storage.ts` - localStorage utility (load/save)
- `src/App.test.tsx` - Tests + acceptance criteria

**Rule**: Single component. No additional files unless absolutely necessary.

## DO NOT Add

❌ Backend/API/Database (localStorage only)
❌ Authentication or multi-user features
❌ State management libraries
❌ UI frameworks or component libraries
❌ Features beyond TODO-1 scope
❌ Routing or multiple pages
❌ Complex abstractions

## Acceptance Criteria (TODO-1)

1. User can type a todo and submit it → appears in list
2. Page reload preserves the list (localStorage)

## PR Checklist

- [ ] `npm run test:run` passes (17/17 tests)
- [ ] `npm run build` succeeds
- [ ] `npm run lint` clean
- [ ] Acceptance criteria met
- [ ] No new dependencies (unless justified)
- [ ] localStorage remains sole persistence

## Workflow

1. Read `App.tsx` and `storage.ts` first
2. Run tests to understand behavior
3. Make minimal, focused changes
4. Add tests for new behavior
5. Verify all checks pass

**Remember**: This is a PoC. Simplicity > extensibility.
