import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { Todo } from './storage';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the todo list heading', () => {
    render(<App />);
    expect(screen.getByText('To-Do List')).toBeInTheDocument();
  });

  it('shows empty state when no todos exist', () => {
    render(<App />);
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('adds a todo when user types and clicks Add', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');
    const addButton = screen.getByText('Add');

    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText(/No todos yet/i)).not.toBeInTheDocument();
  });

  it('adds a todo when user presses Enter', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');

    await user.type(input, 'Write tests{Enter}');

    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('clears input after adding todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...') as HTMLInputElement;

    await user.type(input, 'Test task');
    await user.click(screen.getByText('Add'));

    expect(input.value).toBe('');
  });

  it('does not add empty todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = screen.getByText('Add');

    await user.click(addButton);

    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('does not add whitespace-only todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');
    const addButton = screen.getByText('Add');

    await user.type(input, '   ');
    await user.click(addButton);

    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('toggles todo completion state', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');
    await user.type(input, 'Complete me{Enter}');

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('deletes a todo when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add two todos
    const input = screen.getByPlaceholderText('Enter a todo...');
    await user.type(input, 'First task{Enter}');
    await user.type(input, 'Second task{Enter}');

    // Verify both todos exist
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();

    // Click Delete on first todo
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    // First todo should be removed
    expect(screen.queryByText('First task')).not.toBeInTheDocument();
    // Second todo should still exist
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('deletes all todos and shows empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo
    await user.type(screen.getByPlaceholderText('Enter a todo...'), 'Only task{Enter}');
    expect(screen.getByText('Only task')).toBeInTheDocument();

    // Delete it
    await user.click(screen.getByText('Delete'));

    // Should show empty state
    expect(screen.queryByText('Only task')).not.toBeInTheDocument();
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('persists deletion to localStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // Add two todos
    const input = screen.getByPlaceholderText('Enter a todo...');
    await user.type(input, 'Task A{Enter}');
    await user.type(input, 'Task B{Enter}');

    // Delete first todo
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    // Unmount and remount to simulate page reload
    unmount();
    render(<App />);

    // Only Task B should exist after reload
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  it('shows Clear All button only when todos exist', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Enter a todo...'), 'Task{Enter}');
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('clears all todos when Clear All is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');
    await user.type(input, 'First{Enter}');
    await user.type(input, 'Second{Enter}');

    await user.click(screen.getByText('Clear All'));

    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(screen.queryByText('Second')).not.toBeInTheDocument();
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('persists clear all to localStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');
    await user.type(input, 'Task A{Enter}');
    await user.type(input, 'Task B{Enter}');

    await user.click(screen.getByText('Clear All'));

    unmount();
    render(<App />);

    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
    expect(screen.queryByText('Task B')).not.toBeInTheDocument();
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('persists todos to localStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    const input = screen.getByPlaceholderText('Enter a todo...');
    await user.type(input, 'Persistent task{Enter}');

    unmount();

    // Render app again to simulate page reload
    render(<App />);

    expect(screen.getByText('Persistent task')).toBeInTheDocument();
  });

  describe('Acceptance Criteria - TODO-1', () => {
    describe('AC1: User can type a todo item and submit it', () => {
      it('submits todo via Add button and item appears in list', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Initial state: empty list
        expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();

        // User types a todo
        const input = screen.getByPlaceholderText('Enter a todo...');
        await user.type(input, 'Buy groceries');

        // User clicks Add button
        const addButton = screen.getByText('Add');
        await user.click(addButton);

        // Submitted item appears in list
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
        expect(screen.queryByText(/No todos yet/i)).not.toBeInTheDocument();
      });

      it('submits todo via Enter key and item appears in list', async () => {
        const user = userEvent.setup();
        render(<App />);

        // User types a todo and presses Enter
        const input = screen.getByPlaceholderText('Enter a todo...');
        await user.type(input, 'Write documentation{Enter}');

        // Submitted item appears in list
        expect(screen.getByText('Write documentation')).toBeInTheDocument();
      });

      it('allows submitting multiple todos and all appear in list', async () => {
        const user = userEvent.setup();
        render(<App />);

        const input = screen.getByPlaceholderText('Enter a todo...');
        const addButton = screen.getByText('Add');

        // Add first todo
        await user.type(input, 'First task');
        await user.click(addButton);

        // Add second todo
        await user.type(input, 'Second task');
        await user.click(addButton);

        // Add third todo
        await user.type(input, 'Third task');
        await user.click(addButton);

        // All items appear in list
        expect(screen.getByText('First task')).toBeInTheDocument();
        expect(screen.getByText('Second task')).toBeInTheDocument();
        expect(screen.getByText('Third task')).toBeInTheDocument();
      });
    });

    describe('AC2: Page reload does not break the list', () => {
      it('loads existing todos from localStorage on mount', () => {
        // Simulate existing data in localStorage (as if from previous session)
        const existingTodos: Todo[] = [
          {
            id: '1',
            text: 'Existing task 1',
            createdAt: Date.now() - 1000,
            completed: false,
          },
          {
            id: '2',
            text: 'Existing task 2',
            createdAt: Date.now(),
            completed: true,
          },
        ];
        localStorage.setItem('todos', JSON.stringify(existingTodos));

        // Render app (simulates page load)
        render(<App />);

        // List shows stored items
        expect(screen.getByText('Existing task 1')).toBeInTheDocument();
        expect(screen.getByText('Existing task 2')).toBeInTheDocument();

        // Check completion state is preserved
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).not.toBeChecked(); // First todo not completed
        expect(checkboxes[1]).toBeChecked(); // Second todo completed
      });

      it('persists newly added todos across app remount', async () => {
        const user = userEvent.setup();

        // First session: add todos
        const { unmount } = render(<App />);
        const input = screen.getByPlaceholderText('Enter a todo...');

        await user.type(input, 'Task A{Enter}');
        await user.type(input, 'Task B{Enter}');

        // Verify todos appear
        expect(screen.getByText('Task A')).toBeInTheDocument();
        expect(screen.getByText('Task B')).toBeInTheDocument();

        // Simulate page reload
        unmount();

        // Second session: remount app
        render(<App />);

        // List still shows stored items
        expect(screen.getByText('Task A')).toBeInTheDocument();
        expect(screen.getByText('Task B')).toBeInTheDocument();
      });

      it('persists todo completion state across reload', async () => {
        const user = userEvent.setup();

        // First session: add todo and mark as completed
        const { unmount } = render(<App />);
        await user.type(
          screen.getByPlaceholderText('Enter a todo...'),
          'Complete this{Enter}'
        );

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox); // Mark as completed
        expect(checkbox).toBeChecked();

        // Simulate page reload
        unmount();

        // Second session: remount app
        render(<App />);

        // Todo still exists and is still marked as completed
        expect(screen.getByText('Complete this')).toBeInTheDocument();
        const reloadedCheckbox = screen.getByRole('checkbox');
        expect(reloadedCheckbox).toBeChecked();
      });

      it('handles empty localStorage gracefully', () => {
        // Explicitly ensure localStorage is empty
        localStorage.clear();

        // Render app
        render(<App />);

        // Shows empty state
        expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
      });

      it('handles corrupted localStorage gracefully', () => {
        // Simulate corrupted data
        localStorage.setItem('todos', 'invalid json{');

        // Render app (should not crash)
        render(<App />);

        // Shows empty state instead of crashing
        expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
      });
    });
  });
});
