import { renderHook, act } from '@testing-library/react';
import { useTodos } from '@/hooks/useTodos';
import { todoFixtures, mixedTodoList, createMockLocalStorage } from '../fixtures/todo.fixtures';
import { testUtils } from '../test-utils';
import { toast } from 'sonner';

// Mock external dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/lib/storage', () => ({
  loadTodosFromStorage: jest.fn(),
  saveTodosToStorage: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  generateTodoId: jest.fn(),
  validateTodoText: jest.fn(),
}));

const mockToast = toast as jest.Mocked<typeof toast>;
const mockLoadTodos = require('@/lib/storage').loadTodosFromStorage as jest.MockedFunction<any>;
const mockSaveTodos = require('@/lib/storage').saveTodosToStorage as jest.MockedFunction<any>;
const mockGenerateId = require('@/lib/utils').generateTodoId as jest.MockedFunction<any>;
const mockValidateText = require('@/lib/utils').validateTodoText as jest.MockedFunction<any>;

describe('useTodos Hook', () => {
  let mockConsole: ReturnType<typeof testUtils.mockConsole>;

  beforeEach(() => {
    mockConsole = testUtils.mockConsole();
    mockLoadTodos.mockReturnValue([]);
    mockSaveTodos.mockImplementation(() => {});
    mockGenerateId.mockReturnValue('test-id-123');
    mockValidateText.mockReturnValue(true);
    mockToast.success.mockClear();
    mockToast.error.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockConsole.restore();
  });

  describe('Initialization', () => {
    describe('Happy Path', () => {
      it('should initialize with empty todos and load from storage', async () => {
        mockLoadTodos.mockReturnValue(mixedTodoList);
        
        const { result } = renderHook(() => useTodos());
        
        expect(result.current.todos).toEqual([]);
        expect(result.current.isLoaded).toBe(false);
        
        // Wait for useEffect to run
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        expect(result.current.todos).toEqual(mixedTodoList);
        expect(result.current.isLoaded).toBe(true);
        expect(mockLoadTodos).toHaveBeenCalledTimes(1);
      });

      it('should initialize with empty array when no storage data', async () => {
        mockLoadTodos.mockReturnValue([]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        expect(result.current.todos).toEqual([]);
        expect(result.current.isLoaded).toBe(true);
        expect(mockLoadTodos).toHaveBeenCalledTimes(1);
      });
    });

    describe('Input Verification', () => {
      it('should handle storage loading errors gracefully', async () => {
        mockLoadTodos.mockImplementation(() => {
          throw new Error('Storage error');
        });
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        expect(result.current.todos).toEqual([]);
        expect(result.current.isLoaded).toBe(true);
      });
    });

    describe('Branching', () => {
      it('should not save to storage on initial load', async () => {
        mockLoadTodos.mockReturnValue(mixedTodoList);
        
        renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        // Should not save during initial load
        expect(mockSaveTodos).not.toHaveBeenCalled();
      });

      it('should save to storage after todos change post-initialization', async () => {
        mockLoadTodos.mockReturnValue([]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
          // Wait for the initial load completion flag to be set
          await new Promise(resolve => setTimeout(resolve, 10));
        });
        
        // Now add a todo - this should trigger save
        act(() => {
          result.current.addTodo('New todo');
        });
        
        expect(mockSaveTodos).toHaveBeenCalledWith([
          expect.objectContaining({
            id: 'test-id-123',
            text: 'New todo',
            completed: false,
          }),
        ]);
      });
    });
  });

  describe('addTodo', () => {
    describe('Happy Path', () => {
      it('should add a new todo successfully', async () => {
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        let addResult: boolean;
        act(() => {
          addResult = result.current.addTodo('Buy groceries');
        });
        
        expect(addResult!).toBe(true);
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0]).toEqual({
          id: 'test-id-123',
          text: 'Buy groceries',
          completed: false,
          createdAt: expect.any(String),
        });
        expect(mockToast.success).toHaveBeenCalledWith('Đã thêm công việc mới thành công!');
      });

      it('should add todo to beginning of list', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.addTodo('New todo');
        });
        
        expect(result.current.todos[0].text).toBe('New todo');
        expect(result.current.todos[1]).toEqual(todoFixtures.incompleteTodo);
      });
    });

    describe('Input Verification', () => {
      it('should reject invalid todo text', async () => {
        mockValidateText.mockReturnValue(false);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        let addResult: boolean;
        act(() => {
          addResult = result.current.addTodo('');
        });
        
        expect(addResult!).toBe(false);
        expect(result.current.todos).toHaveLength(0);
        expect(mockToast.error).toHaveBeenCalledWith('Vui lòng nhập nội dung công việc hợp lệ (1-500 ký tự)');
      });

      it('should trim whitespace from todo text', async () => {
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.addTodo('  Todo with spaces  ');
        });
        
        expect(result.current.todos[0].text).toBe('Todo with spaces');
      });
    });

    describe('Branching', () => {
      it('should handle validation failure gracefully', async () => {
        mockValidateText.mockReturnValue(false);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.addTodo('Invalid text');
        });
        
        expect(result.current.todos).toHaveLength(0);
        expect(mockToast.success).not.toHaveBeenCalled();
      });

      it('should generate unique IDs for multiple todos', async () => {
        mockGenerateId.mockReturnValueOnce('id-1').mockReturnValueOnce('id-2');
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.addTodo('Todo 1');
          result.current.addTodo('Todo 2');
        });
        
        expect(result.current.todos[0].id).toBe('id-2');
        expect(result.current.todos[1].id).toBe('id-1');
      });
    });

    describe('Exception Handling', () => {
      it('should handle ID generation errors', async () => {
        mockGenerateId.mockImplementation(() => {
          throw new Error('ID generation failed');
        });
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        expect(() => {
          act(() => {
            result.current.addTodo('Test todo');
          });
        }).toThrow('ID generation failed');
      });
    });
  });

  describe('deleteTodo', () => {
    describe('Happy Path', () => {
      it('should delete todo successfully', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo, todoFixtures.completedTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.deleteTodo('todo-1');
        });
        
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0]).toEqual(todoFixtures.completedTodo);
        expect(mockToast.success).toHaveBeenCalledWith('Đã xóa công việc thành công!');
      });

      it('should delete from middle of list', async () => {
        const todos = [
          todoFixtures.incompleteTodo,
          todoFixtures.completedTodo,
          { ...todoFixtures.incompleteTodo, id: 'todo-3', text: 'Third todo' },
        ];
        mockLoadTodos.mockReturnValue(todos);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.deleteTodo('todo-2');
        });
        
        expect(result.current.todos).toHaveLength(2);
        expect(result.current.todos.find(t => t.id === 'todo-2')).toBeUndefined();
      });
    });

    describe('Input Verification', () => {
      it('should handle non-existent todo ID gracefully', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.deleteTodo('non-existent-id');
        });
        
        expect(result.current.todos).toHaveLength(1);
        expect(mockToast.success).not.toHaveBeenCalled();
      });

      it('should handle empty todo list', async () => {
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.deleteTodo('any-id');
        });
        
        expect(result.current.todos).toHaveLength(0);
        expect(mockToast.success).not.toHaveBeenCalled();
      });
    });

    describe('Branching', () => {
      it('should only show success toast for existing todos', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.deleteTodo('todo-1');
        });
        
        expect(mockToast.success).toHaveBeenCalledWith('Đã xóa công việc thành công!');
        
        act(() => {
          result.current.deleteTodo('non-existent');
        });
        
        expect(mockToast.success).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('toggleComplete', () => {
    describe('Happy Path', () => {
      it('should toggle todo completion status', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.toggleComplete('todo-1');
        });
        
        expect(result.current.todos[0].completed).toBe(true);
        expect(mockToast.success).toHaveBeenCalledWith('Đã đánh dấu hoàn thành!');
      });

      it('should toggle completed todo to incomplete', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.completedTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.toggleComplete('todo-2');
        });
        
        expect(result.current.todos[0].completed).toBe(false);
        expect(mockToast.success).toHaveBeenCalledWith('Đã đánh dấu chưa hoàn thành!');
      });
    });

    describe('Input Verification', () => {
      it('should handle non-existent todo ID gracefully', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.toggleComplete('non-existent-id');
        });
        
        expect(result.current.todos[0].completed).toBe(false);
        expect(mockToast.success).not.toHaveBeenCalled();
      });
    });

    describe('Branching', () => {
      it('should only affect the targeted todo', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo, todoFixtures.completedTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.toggleComplete('todo-1');
        });
        
        expect(result.current.todos[0].completed).toBe(true); // todo-1 was toggled to complete
        expect(result.current.todos[1].completed).toBe(true); // todo-2 stays completed
      });

      it('should show correct message based on previous state', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo, todoFixtures.completedTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        // Toggle incomplete to complete
        act(() => {
          result.current.toggleComplete('todo-1');
        });
        
        expect(mockToast.success).toHaveBeenCalledWith('Đã đánh dấu hoàn thành!');
        
        // Toggle complete to incomplete
        act(() => {
          result.current.toggleComplete('todo-2');
        });
        
        expect(mockToast.success).toHaveBeenCalledWith('Đã đánh dấu chưa hoàn thành!');
      });
    });
  });

  describe('updateTodo', () => {
    describe('Happy Path', () => {
      it('should update todo text successfully', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        let updateResult: boolean;
        act(() => {
          updateResult = result.current.updateTodo('todo-1', 'Updated text');
        });
        
        expect(updateResult!).toBe(true);
        expect(result.current.todos[0].text).toBe('Updated text');
        expect(mockToast.success).toHaveBeenCalledWith('Đã cập nhật công việc thành công!');
      });

      it('should trim whitespace from updated text', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.updateTodo('todo-1', '  Updated text  ');
        });
        
        expect(result.current.todos[0].text).toBe('Updated text');
      });
    });

    describe('Input Verification', () => {
      it('should reject invalid todo text', async () => {
        mockValidateText.mockReturnValue(false);
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        let updateResult: boolean;
        act(() => {
          updateResult = result.current.updateTodo('todo-1', '');
        });
        
        expect(updateResult!).toBe(false);
        expect(result.current.todos[0].text).toBe('Buy groceries');
        expect(mockToast.error).toHaveBeenCalledWith('Vui lòng nhập nội dung công việc hợp lệ (1-500 ký tự)');
      });

      it('should handle non-existent todo ID gracefully', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        let updateResult: boolean;
        act(() => {
          updateResult = result.current.updateTodo('non-existent-id', 'New text');
        });
        
        expect(updateResult!).toBe(true);
        expect(result.current.todos[0].text).toBe('Buy groceries');
        expect(mockToast.success).toHaveBeenCalledWith('Đã cập nhật công việc thành công!');
      });
    });

    describe('Branching', () => {
      it('should only update the targeted todo', async () => {
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo, todoFixtures.completedTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.updateTodo('todo-1', 'Updated first todo');
        });
        
        expect(result.current.todos[0].text).toBe('Updated first todo');
        expect(result.current.todos[1].text).toBe('Walk the dog');
      });

      it('should handle validation failure gracefully', async () => {
        mockValidateText.mockReturnValue(false);
        mockLoadTodos.mockReturnValue([todoFixtures.incompleteTodo]);
        
        const { result } = renderHook(() => useTodos());
        
        await act(async () => {
          await testUtils.waitForAsync();
        });
        
        act(() => {
          result.current.updateTodo('todo-1', 'Invalid text');
        });
        
        expect(result.current.todos[0].text).toBe('Buy groceries');
        expect(mockToast.success).not.toHaveBeenCalled();
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle multiple operations in sequence', async () => {
      mockGenerateId.mockReturnValueOnce('first-id').mockReturnValueOnce('second-id');
      
      const { result } = renderHook(() => useTodos());
      
      await act(async () => {
        await testUtils.waitForAsync();
      });
      
      // Add todos
      act(() => {
        result.current.addTodo('First todo');
        result.current.addTodo('Second todo');
      });
      
      expect(result.current.todos).toHaveLength(2);
      
      // Toggle completion of first todo (which is at index 1 due to prepending)
      act(() => {
        result.current.toggleComplete('first-id');
      });
      
      expect(result.current.todos[1].completed).toBe(true);
      
      // Update first todo
      act(() => {
        result.current.updateTodo('first-id', 'Updated first todo');
      });
      
      expect(result.current.todos[1].text).toBe('Updated first todo');
      
      // Delete first todo
      act(() => {
        result.current.deleteTodo('first-id');
      });
      
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Second todo');
    });

    it('should save to storage after each operation', async () => {
      const { result } = renderHook(() => useTodos());
      
      await act(async () => {
        await testUtils.waitForAsync();
        // Wait for the initial load completion flag to be set
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      
      // Add todo
      act(() => {
        result.current.addTodo('Test todo');
      });
      
      expect(mockSaveTodos).toHaveBeenCalledWith([
        expect.objectContaining({ text: 'Test todo' }),
      ]);
      
      // Toggle completion
      act(() => {
        result.current.toggleComplete('test-id-123');
      });
      
      expect(mockSaveTodos).toHaveBeenCalledWith([
        expect.objectContaining({ completed: true }),
      ]);
      
      // Update todo
      act(() => {
        result.current.updateTodo('test-id-123', 'Updated todo');
      });
      
      expect(mockSaveTodos).toHaveBeenCalledWith([
        expect.objectContaining({ text: 'Updated todo' }),
      ]);
      
      // Delete todo
      act(() => {
        result.current.deleteTodo('test-id-123');
      });
      
      expect(mockSaveTodos).toHaveBeenCalledWith([]);
    });
  });
});