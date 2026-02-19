# To-Do PoC

A minimal proof-of-concept To-Do web application built to validate an AI-assisted development workflow.

**Ticket**: TODO-1 - Add todo items

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Vitest + React Testing Library (testing)
- ESLint + Prettier (code quality)

## Features

✅ Add todo items via input field
✅ Submit by clicking "Add" button or pressing Enter
✅ Mark todos as completed
✅ Persist todos to localStorage (survives page refresh)

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |

## Manual Test Checklist

### Core Functionality

- [ ] **Open the app** - App loads without errors
- [ ] **Empty state** - Shows "No todos yet" message when list is empty
- [ ] **Add todo (button)** - Type "Buy groceries" and click "Add" → Item appears in list
- [ ] **Add todo (Enter key)** - Type "Write tests" and press Enter → Item appears in list
- [ ] **Empty input** - Click "Add" with empty input → Nothing happens
- [ ] **Whitespace input** - Type "   " and click "Add" → Nothing happens
- [ ] **Input clears** - After adding a todo, input field is cleared
- [ ] **Mark complete** - Click checkbox on a todo → Text gets strikethrough and gray color
- [ ] **Unmark complete** - Click checkbox again → Strikethrough removed
- [ ] **Multiple todos** - Add several todos → All appear in the list
- [ ] **Persistence** - Add 2-3 todos, refresh page → Todos still appear
- [ ] **Persistence (completed state)** - Mark a todo as complete, refresh page → Todo still marked as complete

### Edge Cases

- [ ] **Long text** - Add a todo with very long text → Displays correctly
- [ ] **Special characters** - Add todo with emojis/symbols → Displays correctly

## Architecture

### File Structure

```
src/
├── App.tsx           # Main component (todo list logic)
├── storage.ts        # localStorage utility (load/save todos)
├── App.test.tsx      # Component tests
└── test/setup.ts     # Test configuration
```

### Data Model

Todos are stored as an array of objects:

```typescript
interface Todo {
  id: string;          // UUID
  text: string;        // Todo text
  createdAt: number;   // Timestamp
  completed: boolean;  // Completion status
}
```

### localStorage

- **Key**: `"todos"`
- **Format**: JSON-serialized array of Todo objects
- **Load**: On component mount
- **Save**: Whenever todos state changes

## Implementation Notes

- Single component architecture (no over-engineering)
- Minimal styling (inline styles for basic spacing)
- No external state management libraries
- No UI framework (plain React)
- No authentication or multi-user support
- Browser-only (no backend)
