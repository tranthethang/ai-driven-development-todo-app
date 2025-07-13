import React from 'react';
import { render, screen, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { useTodos } from '@/hooks/useTodos';
import { AddTodoForm } from '@/components/todo/add-todo-form';
import { TodoList } from '@/components/todo/todo-list';
import { TodoStats } from '@/components/todo/todo-stats';
import { createMockLocalStorage, todoFixtures } from '../fixtures/todo.fixtures';

// Complete Todo App Integration Component
const TodoApp = () => {
  const { todos, addTodo, deleteTodo, toggleComplete, updateTodo, isLoaded } = useTodos();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <AddTodoForm onAdd={addTodo} />
      <TodoStats todos={todos} />
      <TodoList
        todos={todos}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />
    </div>
  );
};

describe('Todo App Integration Tests', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    mockLocalStorage = createMockLocalStorage();
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Workflows', () => {
    it('should handle complete todo creation workflow', async () => {
      render(<TodoApp />);
      
      // Wait for component to load
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Initially should show empty state
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
      
      // Add a new todo
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const addButton = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.type(input, 'Buy groceries');
      await user.click(addButton);
      
      // Should show the new todo
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });
      
      // Stats should update
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
      expect(screen.queryByText('Chưa có công việc nào')).not.toBeInTheDocument();
      
      // Input should be cleared
      expect(input).toHaveValue('');
    });

    it('should handle todo completion workflow', async () => {
      // Pre-populate with a todo
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([todoFixtures.incompleteTodo]));
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });
      
      // Initial stats: 1 total, 1 pending, 0 completed
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
      expect(screen.getByTestId('pending-count')).toHaveTextContent('1');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('0');
      expect(screen.getByText('0% hoàn thành')).toBeInTheDocument();
      
      // Complete the todo
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Stats should update
      await waitFor(() => {
        expect(screen.getByText('100% hoàn thành')).toBeInTheDocument();
      });
      
      // Todo should show as completed
      expect(checkbox).toBeChecked();
      const todoText = screen.getByText('Buy groceries');
      expect(todoText).toHaveClass('line-through');
    });

    it('should handle todo editing workflow', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([todoFixtures.incompleteTodo]));
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });
      
      // Start editing
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      // Should show edit input
      const editInput = screen.getByDisplayValue('Buy groceries');
      expect(editInput).toBeInTheDocument();
      expect(editInput).toHaveFocus();
      
      // Edit the todo
      await user.clear(editInput);
      await user.type(editInput, 'Buy groceries and milk');
      
      // Save changes
      const saveButton = screen.getByLabelText('Lưu thay đổi');
      await user.click(saveButton);
      
      // Should show updated text
      await waitFor(() => {
        expect(screen.getByText('Buy groceries and milk')).toBeInTheDocument();
      });
      
      expect(screen.queryByDisplayValue('Buy groceries and milk')).not.toBeInTheDocument();
    });

    it('should handle todo deletion workflow', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([todoFixtures.incompleteTodo]));
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });
      
      // Initial state: 1 todo
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
      
      // Delete the todo
      const deleteButton = screen.getByLabelText('Xóa "Buy groceries"');
      await user.click(deleteButton);
      
      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      });
      
      // Stats should update
      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
    });
  });

  describe('Multi-Todo Scenarios', () => {
    it('should handle adding multiple todos', async () => {
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const addButton = screen.getByRole('button', { name: /thêm công việc/i });
      
      // Add first todo
      await user.type(input, 'First todo');
      await user.click(addButton);
      
      // Add second todo
      await user.type(input, 'Second todo');
      await user.click(addButton);
      
      // Add third todo
      await user.type(input, 'Third todo');
      await user.click(addButton);
      
      // All todos should be visible
      await waitFor(() => {
        expect(screen.getByText('First todo')).toBeInTheDocument();
        expect(screen.getByText('Second todo')).toBeInTheDocument();
        expect(screen.getByText('Third todo')).toBeInTheDocument();
      });
      
      // Stats should show 3 total, 3 pending, 0 completed
      expect(screen.getByTestId('total-count')).toHaveTextContent('3');
      expect(screen.getByText('0% hoàn thành')).toBeInTheDocument();
      
      // Third todo should be first (newest first)
      const todoTexts = screen.getAllByText(/todo$/);
      expect(todoTexts[0]).toHaveTextContent('Third todo');
    });

    it('should handle mixed completion states correctly', async () => {
      const mixedTodos = [
        { ...todoFixtures.incompleteTodo, id: 'todo-1', text: 'Incomplete 1' },
        { ...todoFixtures.completedTodo, id: 'todo-2', text: 'Completed 1' },
        { ...todoFixtures.incompleteTodo, id: 'todo-3', text: 'Incomplete 2' },
      ];
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mixedTodos));
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.getByText('Incomplete 1')).toBeInTheDocument();
      });
      
      // Should show correct stats: 3 total, 2 pending, 1 completed
      const badges = screen.getAllByText('3');
      expect(badges[0]).toBeInTheDocument(); // Total
      
      expect(screen.getByTestId('pending-count')).toHaveTextContent('2');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('1');
      expect(screen.getByText('33% hoàn thành')).toBeInTheDocument();
      
      // Incomplete todos should be shown first
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked(); // Incomplete 1
      expect(checkboxes[1]).not.toBeChecked(); // Incomplete 2
      expect(checkboxes[2]).toBeChecked(); // Completed 1
    });

    it('should handle rapid user interactions', async () => {
      // Setup unique ID generation for this test
      let idCounter = 0;
      Object.defineProperty(global, 'crypto', {
        value: {
          randomUUID: () => `rapid-test-uuid-${++idCounter}`,
        },
        writable: true,
      });

      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const addButton = screen.getByRole('button', { name: /thêm công việc/i });
      
      // Rapidly add todos
      for (let i = 1; i <= 5; i++) {
        await user.type(input, `Rapid todo ${i}`);
        await user.click(addButton);
        // Small delay between additions to ensure proper state updates
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // All todos should be added
      await waitFor(() => {
        expect(screen.getByText('Rapid todo 1')).toBeInTheDocument();
        expect(screen.getByText('Rapid todo 5')).toBeInTheDocument();
      });
      
      // Stats should reflect all todos
      expect(screen.getByTestId('total-count')).toHaveTextContent('5');
      
      // Complete exactly 3 todos (should result in 60% completion)
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(5);
      
      // Complete first 3 todos with delays between clicks
      await user.click(checkboxes[0]);
      await new Promise(resolve => setTimeout(resolve, 50));
      await user.click(checkboxes[1]);
      await new Promise(resolve => setTimeout(resolve, 50));
      await user.click(checkboxes[2]);
      
      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Stats should update (3 out of 5 completed = 60%)
      await waitFor(() => {
        expect(screen.getByTestId('completed-count')).toHaveTextContent('3');
        expect(screen.getByTestId('pending-count')).toHaveTextContent('2');
        expect(screen.getByTestId('total-count')).toHaveTextContent('5');
        expect(screen.getByText('60% hoàn thành')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Data Persistence Integration', () => {
    it('should persist todos to localStorage', async () => {
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Add a todo
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      await user.type(input, 'Persistent todo');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      // Should have saved to localStorage
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'todo-list',
          expect.stringContaining('Persistent todo')
        );
      });
    });

    it('should load todos from localStorage on mount', async () => {
      const savedTodos = [
        todoFixtures.incompleteTodo,
        todoFixtures.completedTodo,
      ];
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedTodos));
      
      render(<TodoApp />);
      
      // Should load and display saved todos
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
        expect(screen.getByText('Walk the dog')).toBeInTheDocument();
      });
      
      // Stats should reflect loaded todos
      expect(screen.getByTestId('total-count')).toHaveTextContent('2');
      expect(screen.getByText('50% hoàn thành')).toBeInTheDocument();
    });

    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw errors
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Should still allow adding todos despite storage errors
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      await user.type(input, 'Todo despite error');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      // Todo should still appear in UI
      await waitFor(() => {
        expect(screen.getByText('Todo despite error')).toBeInTheDocument();
      });
    });
  });

  describe('Validation Integration', () => {
    it('should show validation errors and prevent invalid submissions', async () => {
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const addButton = screen.getByRole('button', { name: /thêm công việc/i });
      
      // Try to submit empty todo
      await user.click(addButton);
      
      // Should not create any todo
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
      
      // Try whitespace-only todo
      await user.type(input, '   ');
      await user.click(addButton);
      
      // Should still not create any todo
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      
      // Valid todo should work
      await user.clear(input);
      await user.type(input, 'Valid todo');
      await user.click(addButton);
      
      // Should create the todo
      await waitFor(() => {
        expect(screen.getByText('Valid todo')).toBeInTheDocument();
      });
    });

    it('should handle character limit correctly', async () => {
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      // Type text near character limit
      const longText = 'A'.repeat(460);
      await user.type(input, longText);
      
      // Should show character count warning
      expect(screen.getByText('40 ký tự còn lại')).toBeInTheDocument();
      
      // Add more characters to reach limit
      await user.type(input, 'B'.repeat(40));
      
      // Should show 0 characters remaining
      expect(screen.getByText('0 ký tự còn lại')).toBeInTheDocument();
      
      // Should still allow submission at limit
      const addButton = screen.getByRole('button', { name: /thêm công việc/i });
      await user.click(addButton);
      
      // Todo should be created
      await waitFor(() => {
        expect(screen.getByText('A'.repeat(460) + 'B'.repeat(40))).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from component errors gracefully', async () => {
      // Mock console.error to suppress error logs during test
      const originalError = console.error;
      console.error = jest.fn();
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // App should render normally
      expect(screen.getByPlaceholderText('Thêm công việc mới...')).toBeInTheDocument();
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      
      // Restore console.error
      console.error = originalError;
    });

    it('should handle malformed localStorage data', async () => {
      // Mock corrupted localStorage data
      mockLocalStorage.getItem.mockReturnValue('{"invalid": json}');
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Should show empty state instead of crashing
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      
      // Should still allow normal operations
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      await user.type(input, 'Recovery todo');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Recovery todo')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should support full keyboard navigation', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([todoFixtures.incompleteTodo]));
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });
      
      // Start from input and add some text to enable the button
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      await user.type(input, 'Test navigation');
      
      // Tab through form
      await user.tab(); // Add button
      expect(screen.getByRole('button', { name: /thêm công việc/i })).toHaveFocus();
      
      await user.tab(); // Todo checkbox
      expect(screen.getByRole('checkbox')).toHaveFocus();
      
      await user.tab(); // Edit button
      expect(screen.getByLabelText('Chỉnh sửa "Buy groceries"')).toHaveFocus();
      
      await user.tab(); // Delete button
      expect(screen.getByLabelText('Xóa "Buy groceries"')).toHaveFocus();
    });

    it('should provide proper ARIA labels throughout the app', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([todoFixtures.incompleteTodo]));
      
      render(<TodoApp />);
      
      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });
      
      // Check form accessibility
      expect(screen.getByLabelText('Nhập nội dung công việc mới')).toBeInTheDocument();
      expect(screen.getByLabelText('Thêm công việc')).toBeInTheDocument();
      
      // Check todo item accessibility
      expect(screen.getByLabelText('Mark "Buy groceries" as complete')).toBeInTheDocument();
      expect(screen.getByLabelText('Chỉnh sửa "Buy groceries"')).toBeInTheDocument();
      expect(screen.getByLabelText('Xóa "Buy groceries"')).toBeInTheDocument();
    });
  });
});