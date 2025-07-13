import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { AddTodoForm } from '@/components/todo/add-todo-form';

describe('AddTodoForm Component', () => {
  let mockOnAdd: jest.MockedFunction<(text: string) => boolean>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    mockOnAdd = jest.fn();
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render form with input and button', () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      expect(screen.getByPlaceholderText('Thêm công việc mới...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /thêm công việc/i })).toBeInTheDocument();
      expect(screen.getByText('Thêm')).toBeInTheDocument();
    });

    it('should add todo when form is submitted', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.type(input, 'New todo item');
      await user.click(button);
      
      expect(mockOnAdd).toHaveBeenCalledWith('New todo item');
    });

    it('should clear input after successful submission', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'New todo item');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('should submit form when Enter key is pressed', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'New todo item');
      await user.keyboard('{Enter}');
      
      expect(mockOnAdd).toHaveBeenCalledWith('New todo item');
    });
  });

  describe('Input Verification', () => {
    it('should not submit empty todo', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.click(button);
      
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should not submit whitespace-only todo', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should disable button when input is empty', () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      expect(button).toBeDisabled();
    });

    it('should disable button when input is whitespace only', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.type(input, '   ');
      
      expect(button).toBeDisabled();
    });

    it('should enable button when input has valid text', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.type(input, 'Valid todo');
      
      expect(button).not.toBeDisabled();
    });

    it('should handle maximum length constraint', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const longText = 'A'.repeat(501);
      
      await user.type(input, longText);
      
      // Input should be truncated to 500 characters
      expect(input).toHaveValue('A'.repeat(500));
    });

    it('should show character count warning when approaching limit', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const textNearLimit = 'A'.repeat(451);
      
      await user.type(input, textNearLimit);
      
      expect(screen.getByText('49 ký tự còn lại')).toBeInTheDocument();
    });
  });

  describe('Branching', () => {
    it('should not clear input when submission fails', async () => {
      mockOnAdd.mockReturnValue(false);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'Failed todo');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      await waitFor(() => {
        expect(input).toHaveValue('Failed todo');
      });
    });

    it('should handle Enter key with Shift modifier correctly', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'New todo');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      
      // Should not submit when Shift+Enter is pressed
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
      // Mock onAdd to take some time
      mockOnAdd.mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(true), 100)) as any;
      });
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.type(input, 'Loading todo');
      
      // Start submission
      user.click(button);
      
      // Should show loading state immediately
      await waitFor(() => {
        expect(screen.getByText('Đang thêm...')).toBeInTheDocument();
      });
      
      // Input and button should be disabled during loading
      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
    });

    it('should update character count dynamically', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      // Type text near the limit
      await user.type(input, 'A'.repeat(460));
      expect(screen.getByText('40 ký tự còn lại')).toBeInTheDocument();
      
      // Add more characters
      await user.type(input, 'B'.repeat(20));
      expect(screen.getByText('20 ký tự còn lại')).toBeInTheDocument();
    });

    it('should only show character count when near limit', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      // Type text below the warning threshold
      await user.type(input, 'A'.repeat(400));
      expect(screen.queryByText(/ký tự còn lại/)).not.toBeInTheDocument();
      
      // Type text above the warning threshold
      await user.type(input, 'B'.repeat(60));
      expect(screen.getByText('40 ký tự còn lại')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByLabelText('Nhập nội dung công việc mới');
      const button = screen.getByLabelText('Thêm công việc');
      
      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const form = screen.getByRole('form', { hidden: true });
      expect(form).toBeInTheDocument();
    });

    it('should associate input with proper attributes', () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('maxLength', '500');
      expect(input).toHaveAttribute('aria-label', 'Nhập nội dung công việc mới');
    });

    it('should be keyboard navigable', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      // Tab to input
      await user.tab();
      expect(screen.getByPlaceholderText('Thêm công việc mới...')).toHaveFocus();
      
      // Tab to button
      await user.tab();
      expect(screen.getByRole('button', { name: /thêm công việc/i })).toHaveFocus();
    });
  });

  describe('Exception Handling', () => {
    it('should handle onAdd function throwing error', async () => {
      mockOnAdd.mockImplementation(() => {
        throw new Error('Submission error');
      });
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'Error todo');
      
      // Should not crash when onAdd throws
      expect(() => {
        user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      }).not.toThrow();
    });

    it('should handle async onAdd rejection', async () => {
      mockOnAdd.mockRejectedValue(new Error('Async error'));
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'Async error todo');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      // Should eventually exit loading state
      await waitFor(() => {
        expect(screen.queryByText('Đang thêm...')).not.toBeInTheDocument();
      });
    });

    it('should reset loading state after error', async () => {
      mockOnAdd.mockImplementation(() => {
        throw new Error('Submission error');
      });
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      await user.type(input, 'Error todo');
      
      // Click button and handle error
      await user.click(button);
      
      // Should not be in loading state after error
      await waitFor(() => {
        expect(screen.queryByText('Đang thêm...')).not.toBeInTheDocument();
        expect(input).not.toBeDisabled();
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('User Experience', () => {
    it('should show loading spinner during submission', async () => {
      mockOnAdd.mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(true), 100)) as any;
      });
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'Loading todo');
      user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      // Should show spinner
      await waitFor(() => {
        const spinner = screen.getByRole('button', { name: /thêm công việc/i })
          .querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });

    it('should handle rapid form submissions', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const button = screen.getByRole('button', { name: /thêm công việc/i });
      
      // Rapid submissions
      await user.type(input, 'Todo 1');
      await user.click(button);
      
      await user.type(input, 'Todo 2');
      await user.click(button);
      
      await user.type(input, 'Todo 3');
      await user.click(button);
      
      expect(mockOnAdd).toHaveBeenCalledTimes(3);
      expect(mockOnAdd).toHaveBeenCalledWith('Todo 1');
      expect(mockOnAdd).toHaveBeenCalledWith('Todo 2');
      expect(mockOnAdd).toHaveBeenCalledWith('Todo 3');
    });

    it('should maintain focus on input after submission', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      
      await user.type(input, 'Focus test todo');
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      // Input should maintain focus after successful submission for better UX
      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in input', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const specialText = 'Todo với ký tự đặc biệt: <>&"\'`{}[]()';
      
      await user.type(input, specialText);
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      expect(mockOnAdd).toHaveBeenCalledWith(specialText);
    });

    it('should handle emoji in input', async () => {
      mockOnAdd.mockReturnValue(true);
      
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const emojiText = 'Todo with emojis 🎉🚀💻';
      
      await user.type(input, emojiText);
      await user.click(screen.getByRole('button', { name: /thêm công việc/i }));
      
      expect(mockOnAdd).toHaveBeenCalledWith(emojiText);
    });

    it('should handle very long text input gracefully', async () => {
      render(<AddTodoForm onAdd={mockOnAdd} />);
      
      const input = screen.getByPlaceholderText('Thêm công việc mới...');
      const veryLongText = 'A'.repeat(1000);
      
      // Simulate pasting very long text
      fireEvent.change(input, { target: { value: veryLongText } });
      
      // Should be truncated to maxLength
      expect(input).toHaveValue('A'.repeat(500));
    });
  });
});