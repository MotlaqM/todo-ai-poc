const STORAGE_KEY = 'todos';

export interface Todo {
  id: string;
  text: string;
  createdAt: number;
  completed: boolean;
}

export function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
