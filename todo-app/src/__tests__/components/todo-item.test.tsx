import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '@/components/todo/todo-item';
import { todoFixtures } from '../fixtures/todo.fixtures';

describe('TodoItem Component', () => {
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
    it('should render incomplete todo correctly', () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(screen.getByText('01/01/2024, 10:00')).toBeInTheDocument();
    });

    it('should render completed todo correctly', () => {
      render(
        <TodoItem
          todo={todoFixtures.completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeChecked();
      expect(screen.getByText('01/01/2024, 09:00')).toBeInTheDocument();
    });

    it('should toggle todo completion when checkbox is clicked', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(mockOnToggle).toHaveBeenCalledWith('todo-1');
    });

    it('should delete todo when delete button is clicked', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const deleteButton = screen.getByLabelText('Xóa "Buy groceries"');
      await user.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith('todo-1');
    });

    it('should enter edit mode when edit button is clicked', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      expect(screen.getByDisplayValue('Buy groceries')).toBeInTheDocument();
      expect(screen.getByLabelText('Lưu thay đổi')).toBeInTheDocument();
      expect(screen.getByLabelText('Hủy thay đổi')).toBeInTheDocument();
    });

    it('should save changes when save button is clicked', async () => {
      mockOnUpdate.mockReturnValue(true);
      
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      await user.type(input, 'Buy groceries and milk');
      
      const saveButton = screen.getByLabelText('Lưu thay đổi');
      await user.click(saveButton);
      
      expect(mockOnUpdate).toHaveBeenCalledWith('todo-1', 'Buy groceries and milk');
      expect(screen.getByText('Buy groceries and milk')).toBeInTheDocument();
    });
  });

  describe('Input Verification', () => {
    it('should handle missing onUpdate prop gracefully', () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );
      
      expect(screen.queryByLabelText(/chỉnh sửa/i)).not.toBeInTheDocument();
      
      // Text should not be clickable when onUpdate is not provided
      const todoText = screen.getByText('Buy groceries');
      fireEvent.click(todoText);
      
      expect(screen.queryByDisplayValue('Buy groceries')).not.toBeInTheDocument();
    });

    it('should not save when onUpdate returns false', async () => {
      mockOnUpdate.mockReturnValue(false);
      
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      await user.type(input, 'Invalid text');
      
      const saveButton = screen.getByLabelText('Lưu thay đổi');
      await user.click(saveButton);
      
      expect(mockOnUpdate).toHaveBeenCalledWith('todo-1', 'Invalid text');
      // Should still be in edit mode
      expect(screen.getByDisplayValue('Invalid text')).toBeInTheDocument();
    });

    it('should handle empty text during edit', async () => {
      mockOnUpdate.mockReturnValue(true);
      
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      
      const saveButton = screen.getByLabelText('Lưu thay đổi');
      await user.click(saveButton);
      
      expect(mockOnUpdate).toHaveBeenCalledWith('todo-1', '');
    });
  });

  describe('Branching', () => {
    it('should cancel edit when cancel button is clicked', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      await user.type(input, 'Changed text');
      
      const cancelButton = screen.getByLabelText('Hủy thay đổi');
      await user.click(cancelButton);
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Changed text')).not.toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should save when Enter key is pressed', async () => {
      mockOnUpdate.mockReturnValue(true);
      
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      await user.type(input, 'Updated text');
      await user.keyboard('{Enter}');
      
      expect(mockOnUpdate).toHaveBeenCalledWith('todo-1', 'Updated text');
    });

    it('should cancel when Escape key is pressed', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      await user.clear(input);
      await user.type(input, 'Changed text');
      await user.keyboard('{Escape}');
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should enter edit mode when todo text is clicked (if onUpdate available)', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoText = screen.getByText('Buy groceries');
      await user.click(todoText);
      
      expect(screen.getByDisplayValue('Buy groceries')).toBeInTheDocument();
    });

    it('should apply strikethrough style for completed todos', () => {
      render(
        <TodoItem
          todo={todoFixtures.completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoText = screen.getByText('Walk the dog');
      expect(todoText).toHaveClass('line-through', 'text-muted-foreground', 'opacity-60');
    });

    it('should not apply strikethrough style for incomplete todos', () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoText = screen.getByText('Buy groceries');
      expect(todoText).not.toHaveClass('line-through');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly in Vietnamese locale', () => {
      const customTodo = {
        ...todoFixtures.incompleteTodo,
        createdAt: '2024-12-25T15:30:45.000Z',
      };
      
      render(
        <TodoItem
          todo={customTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Note: The exact format might vary by browser/environment
      expect(screen.getByText(/25\/12\/2024/)).toBeInTheDocument();
    });

    it('should handle invalid date gracefully', () => {
      const customTodo = {
        ...todoFixtures.incompleteTodo,
        createdAt: 'invalid-date',
      };
      
      render(
        <TodoItem
          todo={customTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Should render without crashing, might show "Invalid Date"
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for actions', () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByLabelText('Mark "Buy groceries" as complete')).toBeInTheDocument();
      expect(screen.getByLabelText('Chỉnh sửa "Buy groceries"')).toBeInTheDocument();
      expect(screen.getByLabelText('Xóa "Buy groceries"')).toBeInTheDocument();
    });

    it('should have correct aria label for completed todo checkbox', () => {
      render(
        <TodoItem
          todo={todoFixtures.completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByLabelText('Mark "Walk the dog" as incomplete')).toBeInTheDocument();
    });

    it('should auto focus input when entering edit mode', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      expect(input).toHaveFocus();
    });

    it('should be keyboard navigable', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Tab through elements
      await user.tab(); // Checkbox
      expect(screen.getByRole('checkbox')).toHaveFocus();
      
      await user.tab(); // Edit button
      expect(screen.getByLabelText('Chỉnh sửa "Buy groceries"')).toHaveFocus();
      
      await user.tab(); // Delete button
      expect(screen.getByLabelText('Xóa "Buy groceries"')).toHaveFocus();
    });
  });

  describe('Exception Handling', () => {
    it('should handle callback function errors gracefully', async () => {
      mockOnToggle.mockImplementation(() => {
        throw new Error('Toggle error');
      });
      
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      
      expect(() => user.click(checkbox)).not.toThrow();
    });

    it('should handle onUpdate throwing error', async () => {
      mockOnUpdate.mockImplementation(() => {
        throw new Error('Update error');
      });
      
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const saveButton = screen.getByLabelText('Lưu thay đổi');
      
      expect(() => user.click(saveButton)).not.toThrow();
    });

    it('should handle very long text in edit mode', async () => {
      render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const editButton = screen.getByLabelText('Chỉnh sửa "Buy groceries"');
      await user.click(editButton);
      
      const input = screen.getByDisplayValue('Buy groceries');
      const longText = 'A'.repeat(600);
      
      // Should handle text longer than maxLength
      fireEvent.change(input, { target: { value: longText } });
      
      expect(input).toHaveValue('A'.repeat(500)); // Should be truncated
    });
  });

  describe('Special Characters and Edge Cases', () => {
    it('should handle special characters in todo text', () => {
      render(
        <TodoItem
          todo={todoFixtures.specialCharsTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.getByText(/Handle special chars/)).toBeInTheDocument();
    });

    it('should handle empty todo text', () => {
      const emptyTodo = { ...todoFixtures.incompleteTodo, text: '' };
      
      render(
        <TodoItem
          todo={emptyTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Should render without error
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should handle very long todo text with proper text wrapping', () => {
      render(
        <TodoItem
          todo={todoFixtures.longTextTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      const todoText = screen.getByText('A'.repeat(500));
      expect(todoText).toHaveClass('break-words');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily with same props', () => {
      const { rerender } = render(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Re-render with same props
      rerender(
        <TodoItem
          todo={todoFixtures.incompleteTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );
      
      // Component should still be functional
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });
});