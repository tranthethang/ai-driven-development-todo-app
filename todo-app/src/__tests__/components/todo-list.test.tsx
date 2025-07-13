import React from 'react';
import { render, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { TodoList } from '@/components/todo/todo-list';
import { todoFixtures, mixedTodoList, createMockTodos } from '../fixtures/todo.fixtures';

describe('TodoList Component', () => {
  let mockOnToggle: jest.MockedFunction<(id: string) => void>;
  let mockOnDelete: jest.MockedFunction<(id: string) => void>;
  let mockOnUpdate: jest.MockedFunction<(id: string, newText: string) => boolean>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    mockOnToggle = jest.fn();
    mockOnDelete = jest.fn();
    mockOnUpdate = jest.fn();
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render list of todos', () => {
      render(
        <TodoList
          todos={mixedTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
      expect(screen.getByText('Read a book')).toBeInTheDocument();
      expect(screen.getByText('Complete project')).toBeInTheDocument();
      expect(screen.getByText('Schedule meeting')).toBeInTheDocument();
    });

    it('should render empty state when no todos', () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      expect(screen.getByText(/Thêm công việc đầu tiên/)).toBeInTheDocument();
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // CheckCircle icon
    });

    it('should pass props to TodoItem components correctly', async () => {
      render(
        <TodoList
          todos={[todoFixtures.incompleteTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(mockOnToggle).toHaveBeenCalledWith('todo-1');
    });

    it('should handle single todo correctly', () => {
      render(
        <TodoList
          todos={[todoFixtures.incompleteTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.queryByText('Chưa có công việc nào')).not.toBeInTheDocument();
    });
  });

  describe('Input Verification', () => {
    it('should handle empty todos array', () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Chưa có công việc nào')).toBeInTheDocument();
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should handle missing onUpdate prop', () => {
      render(
        <TodoList
          todos={[todoFixtures.incompleteTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.queryByLabelText(/chỉnh sửa/i)).not.toBeInTheDocument();
    });

    it('should handle todos with special characters', () => {
      render(
        <TodoList
          todos={[todoFixtures.specialCharsTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText(/Handle special chars/)).toBeInTheDocument();
    });
  });

  describe('Branching', () => {
    it('should sort todos correctly - pending first, then by date', () => {
      const unsortedTodos = [
        { ...todoFixtures.completedTodo, createdAt: '2024-01-01T12:00:00.000Z' }, // completed, newer
        { ...todoFixtures.incompleteTodo, createdAt: '2024-01-01T10:00:00.000Z' }, // incomplete, older
        { 
          ...todoFixtures.incompleteTodo, 
          id: 'todo-3', 
          text: 'Newer incomplete todo', 
          createdAt: '2024-01-01T14:00:00.000Z' 
        }, // incomplete, newer
        { 
          ...todoFixtures.completedTodo, 
          id: 'todo-4', 
          text: 'Older completed todo', 
          createdAt: '2024-01-01T08:00:00.000Z' 
        }, // completed, older
      ];
      
      render(
        <TodoList
          todos={unsortedTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoTexts = screen.getAllByText(/todo|groceries|Walk/);
      const textContents = todoTexts.map(el => el.textContent);
      
      // Should show pending todos first (newest first), then completed todos (newest first)
      expect(textContents[0]).toBe('Newer incomplete todo'); // Incomplete, newest
      expect(textContents[1]).toBe('Buy groceries'); // Incomplete, older
      expect(textContents[2]).toBe('Walk the dog'); // Completed, newer
      expect(textContents[3]).toBe('Older completed todo'); // Completed, oldest
    });

    it('should handle todos with same creation date', () => {
      const sameDateTodos = [
        { ...todoFixtures.incompleteTodo, id: 'todo-1' },
        { ...todoFixtures.incompleteTodo, id: 'todo-2', text: 'Second todo' },
        { ...todoFixtures.completedTodo, id: 'todo-3' },
        { ...todoFixtures.completedTodo, id: 'todo-4', text: 'Second completed' },
      ];
      
      render(
        <TodoList
          todos={sameDateTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // All incomplete todos should appear before completed todos
      const allTodos = screen.getAllByRole('checkbox');
      expect(allTodos).toHaveLength(4);
      
      // First two should be unchecked (incomplete)
      expect(allTodos[0]).not.toBeChecked();
      expect(allTodos[1]).not.toBeChecked();
      
      // Last two should be checked (completed)
      expect(allTodos[2]).toBeChecked();
      expect(allTodos[3]).toBeChecked();
    });

    it('should handle only completed todos', () => {
      const completedTodos = createMockTodos(3, [
        { completed: true, text: 'Completed 1', createdAt: '2024-01-01T10:00:00.000Z' },
        { completed: true, text: 'Completed 2', createdAt: '2024-01-01T12:00:00.000Z' },
        { completed: true, text: 'Completed 3', createdAt: '2024-01-01T08:00:00.000Z' },
      ]);
      
      render(
        <TodoList
          todos={completedTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoTexts = screen.getAllByText(/Completed/);
      
      // Should be sorted by date (newest first) since all are completed
      expect(todoTexts[0]).toHaveTextContent('Completed 2'); // 12:00
      expect(todoTexts[1]).toHaveTextContent('Completed 1'); // 10:00
      expect(todoTexts[2]).toHaveTextContent('Completed 3'); // 08:00
    });

    it('should handle only incomplete todos', () => {
      const incompleteTodos = createMockTodos(3, [
        { completed: false, text: 'Incomplete 1', createdAt: '2024-01-01T10:00:00.000Z' },
        { completed: false, text: 'Incomplete 2', createdAt: '2024-01-01T12:00:00.000Z' },
        { completed: false, text: 'Incomplete 3', createdAt: '2024-01-01T08:00:00.000Z' },
      ]);
      
      render(
        <TodoList
          todos={incompleteTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoTexts = screen.getAllByText(/Incomplete/);
      
      // Should be sorted by date (newest first) since all are incomplete
      expect(todoTexts[0]).toHaveTextContent('Incomplete 2'); // 12:00
      expect(todoTexts[1]).toHaveTextContent('Incomplete 1'); // 10:00
      expect(todoTexts[2]).toHaveTextContent('Incomplete 3'); // 08:00
    });
  });

  describe('Visual Elements and Animation', () => {
    it('should apply animation delay to todo items', () => {
      render(
        <TodoList
          todos={mixedTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoContainers = screen.getAllByText(/groceries|Walk|Read|Complete|Schedule/)
        .map(el => el.closest('[style*="animation-delay"]'));
      
      // Should have animation delays
      expect(todoContainers[0]).toHaveStyle('animation-delay: 0ms');
      expect(todoContainers[1]).toHaveStyle('animation-delay: 50ms');
      expect(todoContainers[2]).toHaveStyle('animation-delay: 100ms');
      expect(todoContainers[3]).toHaveStyle('animation-delay: 150ms');
      expect(todoContainers[4]).toHaveStyle('animation-delay: 200ms');
    });

    it('should apply correct CSS classes for empty state', () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const emptyStateCard = screen.getByText('Chưa có công việc nào').closest('.w-full');
      expect(emptyStateCard).toHaveClass('w-full', 'shadow-sm');
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon.closest('.animate-bounce')).toBeInTheDocument();
    });

    it('should apply spacing between todo items', () => {
      render(
        <TodoList
          todos={mixedTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoContainer = screen.getByText('Buy groceries').closest('.space-y-3');
      expect(todoContainer).toHaveClass('space-y-3');
    });
  });

  describe('Integration with TodoItem', () => {
    it('should handle toggle from child TodoItem', async () => {
      render(
        <TodoList
          todos={[todoFixtures.incompleteTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(mockOnToggle).toHaveBeenCalledWith('todo-1');
    });

    it('should handle delete from child TodoItem', async () => {
      render(
        <TodoList
          todos={[todoFixtures.incompleteTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const deleteButton = screen.getByLabelText('Xóa "Buy groceries"');
      await user.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith('todo-1');
    });

    it('should handle update from child TodoItem', async () => {
      mockOnUpdate.mockReturnValue(true);
      
      render(
        <TodoList
          todos={[todoFixtures.incompleteTodo]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      await user.type(input, 'Updated groceries');
      
      const saveButton = screen.getByLabelText('Lưu thay đổi');
      await user.click(saveButton);
      
      expect(mockOnUpdate).toHaveBeenCalledWith('todo-1', 'Updated groceries');
    });
  });

  describe('Performance', () => {
    it('should handle large number of todos efficiently', () => {
      const largeTodoList = createMockTodos(1000);
      
      const start = performance.now();
      render(
        <TodoList
          todos={largeTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      const end = performance.now();
      
      // Should render in reasonable time (less than 500ms for 1000 items)
      expect(end - start).toBeLessThan(500);
      
      // Should still render todos
      expect(screen.getAllByRole('checkbox')).toHaveLength(1000);
    });

    it('should not mutate original todos array', () => {
      const originalTodos = [...mixedTodoList];
      
      render(
        <TodoList
          todos={mixedTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Original array should remain unchanged
      expect(mixedTodoList).toEqual(originalTodos);
    });

    it('should use stable keys for todo items', () => {
      const { rerender } = render(
        <TodoList
          todos={mixedTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Reorder todos
      const reorderedTodos = [...mixedTodoList].reverse();
      
      rerender(
        <TodoList
          todos={reorderedTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // All todos should still be present
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle todos with invalid dates', () => {
      const todosWithInvalidDates = [
        { ...todoFixtures.incompleteTodo, createdAt: 'invalid-date' },
        { ...todoFixtures.completedTodo, createdAt: '' },
      ];
      
      render(
        <TodoList
          todos={todosWithInvalidDates}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Should render without crashing
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    });

    it('should handle todos with missing properties', () => {
      const incompleteTodos = [
        { id: 'test-1', text: 'Test todo', completed: false } as any, // Missing createdAt
      ];
      
      render(
        <TodoList
          todos={incompleteTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Should render without crashing
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    it('should handle duplicate todo IDs gracefully', () => {
      const duplicateTodos = [
        todoFixtures.incompleteTodo,
        { ...todoFixtures.incompleteTodo, text: 'Duplicate ID todo' },
      ];
      
      // React will warn about duplicate keys in console, but should still render
      render(
        <TodoList
          todos={duplicateTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Duplicate ID todo')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should provide proper list structure for screen readers', () => {
      render(
        <TodoList
          todos={mixedTodoList}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Should have multiple interactive elements
      const checkboxes = screen.getAllByRole('checkbox');
      const buttons = screen.getAllByRole('button');
      
      expect(checkboxes.length).toBeGreaterThan(0);
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have meaningful empty state message', () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Chưa có công việc nào');
      
      const description = screen.getByText(/Thêm công việc đầu tiên/);
      expect(description).toBeInTheDocument();
    });
  });
});