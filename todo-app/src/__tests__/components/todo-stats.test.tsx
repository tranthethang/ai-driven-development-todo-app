import React from 'react';
import { render, screen } from '../test-utils';
import { TodoStats } from '@/components/todo/todo-stats';
import { todoFixtures, mixedTodoList, createMockTodos } from '../fixtures/todo.fixtures';

describe('TodoStats Component', () => {
  describe('Happy Path', () => {
    it('should render stats for mixed todo list', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      expect(screen.getByText('Thống kê công việc')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // Total
      expect(screen.getByText('3')).toBeInTheDocument(); // Pending
      expect(screen.getByText('2')).toBeInTheDocument(); // Completed
      expect(screen.getByText('40% hoàn thành')).toBeInTheDocument();
    });

    it('should render all stat categories correctly', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      expect(screen.getByText('Tổng cộng')).toBeInTheDocument();
      expect(screen.getByText('Đang chờ')).toBeInTheDocument();
      expect(screen.getByText('Hoàn thành')).toBeInTheDocument();
    });

    it('should display progress bar for todos with completion', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '40%' });
    });

    it('should show completion percentage in header', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      expect(screen.getByText('40% hoàn thành')).toBeInTheDocument();
    });
  });

  describe('Input Verification', () => {
    it('should handle empty todo list', () => {
      render(<TodoStats todos={[]} />);
      
      expect(screen.getByText('Thống kê công việc')).toBeInTheDocument();
      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
      expect(screen.getByTestId('pending-count')).toHaveTextContent('0');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('0');
      expect(screen.queryByText('% hoàn thành')).not.toBeInTheDocument();
      expect(screen.queryByText('Tiến độ hoàn thành')).not.toBeInTheDocument();
    });

    it('should handle single incomplete todo', () => {
      render(<TodoStats todos={[todoFixtures.incompleteTodo]} />);
      
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
      expect(screen.getByTestId('pending-count')).toHaveTextContent('1');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('0');
      expect(screen.getByText('0% hoàn thành')).toBeInTheDocument();
    });

    it('should handle single completed todo', () => {
      render(<TodoStats todos={[todoFixtures.completedTodo]} />);
      
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
      expect(screen.getByTestId('pending-count')).toHaveTextContent('0');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('1');
      expect(screen.getByText('100% hoàn thành')).toBeInTheDocument();
    });
  });

  describe('Branching', () => {
    it('should calculate correct percentages for various completion rates', () => {
      // Test 25% completion (1 out of 4)
      const quarter = createMockTodos(4, [
        { completed: true },
        { completed: false },
        { completed: false },
        { completed: false },
      ]);
      
      const { rerender } = render(<TodoStats todos={quarter} />);
      expect(screen.getByText('25% hoàn thành')).toBeInTheDocument();
      
      // Test 50% completion (2 out of 4)
      const half = createMockTodos(4, [
        { completed: true },
        { completed: true },
        { completed: false },
        { completed: false },
      ]);
      
      rerender(<TodoStats todos={half} />);
      expect(screen.getByText('50% hoàn thành')).toBeInTheDocument();
      
      // Test 75% completion (3 out of 4)
      const threeQuarters = createMockTodos(4, [
        { completed: true },
        { completed: true },
        { completed: true },
        { completed: false },
      ]);
      
      rerender(<TodoStats todos={threeQuarters} />);
      expect(screen.getByText('75% hoàn thành')).toBeInTheDocument();
    });

    it('should round percentage correctly', () => {
      // Test 33.33% (1 out of 3) should round to 33%
      const oneThird = createMockTodos(3, [
        { completed: true },
        { completed: false },
        { completed: false },
      ]);
      
      render(<TodoStats todos={oneThird} />);
      expect(screen.getByText('33% hoàn thành')).toBeInTheDocument();
    });

    it('should show progress section only when there are todos', () => {
      const { rerender } = render(<TodoStats todos={[]} />);
      
      expect(screen.queryByText('Tiến độ hoàn thành')).not.toBeInTheDocument();
      
      rerender(<TodoStats todos={[todoFixtures.incompleteTodo]} />);
      
      expect(screen.getByText('Tiến độ hoàn thành')).toBeInTheDocument();
    });

    it('should show completion percentage in header only when there are todos', () => {
      const { rerender } = render(<TodoStats todos={[]} />);
      
      expect(screen.queryByText(/% hoàn thành/)).not.toBeInTheDocument();
      
      rerender(<TodoStats todos={[todoFixtures.incompleteTodo]} />);
      
      expect(screen.getByText('0% hoàn thành')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should render proper icons for each category', () => {
      const { container } = render(<TodoStats todos={mixedTodoList} />);
      
      // Check for icon presence using class names
      const listTodoIcon = container.querySelector('.lucide-list-todo');
      const circleIcon = container.querySelector('.lucide-circle');
      const checkCircleIcon = container.querySelector('.lucide-circle-check-big');
      
      expect(listTodoIcon).toBeInTheDocument();
      expect(circleIcon).toBeInTheDocument();
      expect(checkCircleIcon).toBeInTheDocument();
    });

    it('should apply correct CSS classes for styling', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      const card = screen.getByText('Thống kê công việc').closest('.w-full');
      expect(card).toHaveClass('w-full');
      
      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toHaveClass('bg-gradient-to-r', 'from-green-400', 'to-green-500');
    });

    it('should have proper responsive layout classes', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      const grid = screen.getByText('Tổng cộng').closest('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Thống kê công việc');
    });

    it('should have progress bar with proper attributes', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toHaveStyle({ width: '40%' });
    });

    it('should have readable text contrast classes', () => {
      render(<TodoStats todos={mixedTodoList} />);
      
      const percentageText = screen.getByText('40%');
      expect(percentageText.closest('.text-muted-foreground')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers correctly', () => {
      const largeTodoList = createMockTodos(999, 
        Array.from({ length: 999 }, (_, i) => ({ 
          completed: i < 333 // 333 completed out of 999
        }))
      );
      
      render(<TodoStats todos={largeTodoList} />);
      
      expect(screen.getByText('999')).toBeInTheDocument(); // Total
      expect(screen.getByText('666')).toBeInTheDocument(); // Pending
      expect(screen.getByText('333')).toBeInTheDocument(); // Completed
      expect(screen.getByText('33% hoàn thành')).toBeInTheDocument();
    });

    it('should handle all completed todos', () => {
      const allCompleted = createMockTodos(5, 
        Array.from({ length: 5 }, () => ({ completed: true }))
      );
      
      render(<TodoStats todos={allCompleted} />);
      
      expect(screen.getByTestId('total-count')).toHaveTextContent('5');
      expect(screen.getByTestId('pending-count')).toHaveTextContent('0');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('5');
      expect(screen.getByText('100% hoàn thành')).toBeInTheDocument();
      
      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('should handle all incomplete todos', () => {
      const allIncomplete = createMockTodos(5, 
        Array.from({ length: 5 }, () => ({ completed: false }))
      );
      
      render(<TodoStats todos={allIncomplete} />);
      
      expect(screen.getByTestId('total-count')).toHaveTextContent('5');
      expect(screen.getByTestId('pending-count')).toHaveTextContent('5');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('0');
      expect(screen.getByText('0% hoàn thành')).toBeInTheDocument();
      
      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toHaveStyle({ width: '0%' });
    });
  });

  describe('Performance', () => {
    it('should calculate stats efficiently for large datasets', () => {
      const start = performance.now();
      
      const largeTodoList = createMockTodos(10000);
      render(<TodoStats todos={largeTodoList} />);
      
      const end = performance.now();
      const renderTime = end - start;
      
      // Should render in less than 100ms for 10k items
      expect(renderTime).toBeLessThan(100);
    });

    it('should render consistently with same data', () => {
      const todos = mixedTodoList;
      const { rerender } = render(<TodoStats todos={todos} />);
      
      // First render values
      const totalCount1 = screen.getByTestId('total-count').textContent;
      const pendingCount1 = screen.getByTestId('pending-count').textContent;
      const completedCount1 = screen.getByTestId('completed-count').textContent;
      
      // Re-render with same data
      rerender(<TodoStats todos={todos} />);
      
      // Should render same values consistently
      expect(screen.getByTestId('total-count')).toHaveTextContent(totalCount1!);
      expect(screen.getByTestId('pending-count')).toHaveTextContent(pendingCount1!);
      expect(screen.getByTestId('completed-count')).toHaveTextContent(completedCount1!);
    });
  });
});