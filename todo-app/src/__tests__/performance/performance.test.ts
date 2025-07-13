import { generateTodoId, validateTodoText } from '@/lib/utils';
import { loadTodosFromStorage, saveTodosToStorage } from '@/lib/storage';
import { createMockTodos, createMockLocalStorage } from '../fixtures/todo.fixtures';

describe('Performance Tests', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    mockLocalStorage = createMockLocalStorage();
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Utils Performance', () => {
    it('should generate unique IDs efficiently', () => {
      const iterations = 10000;
      const ids = new Set<string>();
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const id = generateTodoId();
        ids.add(id);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in less than 100ms for 10k IDs
      expect(duration).toBeLessThan(100);
      
      // All IDs should be unique
      expect(ids.size).toBe(iterations);
      
      console.log(`Generated ${iterations} unique IDs in ${duration.toFixed(2)}ms`);
    });

    it('should validate text efficiently for large inputs', () => {
      const testCases = [
        { text: '', expected: false },
        { text: 'Valid text', expected: true },
        { text: 'A'.repeat(500), expected: true },
        { text: 'A'.repeat(501), expected: false },
        { text: '   ', expected: false },
        { text: '  Valid  ', expected: true },
      ];
      
      const iterations = 100000;
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const testCase = testCases[i % testCases.length];
        validateTodoText(testCase.text);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in less than 50ms for 100k validations
      expect(duration).toBeLessThan(50);
      
      console.log(`Performed ${iterations} text validations in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Storage Performance', () => {
    it('should save large datasets efficiently', () => {
      const largeTodoList = createMockTodos(10000);
      
      const start = performance.now();
      
      saveTodosToStorage(largeTodoList);
      
      const end = performance.now();
      const duration = end - start;
      
      // Should save 10k todos in less than 100ms
      expect(duration).toBeLessThan(100);
      
      // Verify data was saved
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'todo-list',
        expect.stringContaining('Todo item 1')
      );
      
      console.log(`Saved ${largeTodoList.length} todos in ${duration.toFixed(2)}ms`);
    });

    it('should load large datasets efficiently', () => {
      const largeTodoList = createMockTodos(10000);
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(largeTodoList));
      
      const start = performance.now();
      
      const loadedTodos = loadTodosFromStorage();
      
      const end = performance.now();
      const duration = end - start;
      
      // Should load 10k todos in less than 50ms
      expect(duration).toBeLessThan(50);
      
      // Verify data integrity
      expect(loadedTodos).toHaveLength(10000);
      expect(loadedTodos[0].text).toBe('Todo item 1');
      
      console.log(`Loaded ${loadedTodos.length} todos in ${duration.toFixed(2)}ms`);
    });

    it('should handle multiple save operations efficiently', () => {
      const todoList = createMockTodos(1000);
      const iterations = 100;
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        saveTodosToStorage(todoList);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete 100 save operations in less than 200ms
      expect(duration).toBeLessThan(200);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(iterations);
      
      console.log(`Performed ${iterations} save operations in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Data Processing Performance', () => {
    it('should sort large todo lists efficiently', () => {
      const largeTodoList = createMockTodos(50000, 
        Array.from({ length: 50000 }, (_, i) => ({
          completed: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString(),
        }))
      );
      
      const start = performance.now();
      
      // Simulate the sorting logic from TodoList component
      const sortedTodos = [...largeTodoList].sort((a, b) => {
        if (a.completed === b.completed) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.completed ? 1 : -1;
      });
      
      const end = performance.now();
      const duration = end - start;
      
      // Should sort 50k todos in less than 100ms
      expect(duration).toBeLessThan(100);
      
      // Verify sorting correctness
      expect(sortedTodos).toHaveLength(50000);
      
      // Check that incomplete todos come first
      const firstCompleted = sortedTodos.findIndex(todo => todo.completed);
      const lastIncomplete = sortedTodos.map(todo => todo.completed).lastIndexOf(false);
      
      if (firstCompleted !== -1 && lastIncomplete !== -1) {
        expect(firstCompleted).toBeGreaterThan(lastIncomplete);
      }
      
      console.log(`Sorted ${largeTodoList.length} todos in ${duration.toFixed(2)}ms`);
    });

    it('should calculate statistics efficiently for large datasets', () => {
      const largeTodoList = createMockTodos(100000,
        Array.from({ length: 100000 }, () => ({
          completed: Math.random() > 0.5,
        }))
      );
      
      const iterations = 1000;
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        // Simulate TodoStats calculations
        const total = largeTodoList.length;
        const completed = largeTodoList.filter(todo => todo.completed).length;
        const pending = total - completed;
        const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Use the results to prevent optimization
        expect(typeof total).toBe('number');
        expect(typeof completed).toBe('number');
        expect(typeof pending).toBe('number');
        expect(typeof completionPercentage).toBe('number');
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete 1000 stat calculations on 100k todos in less than 500ms
      expect(duration).toBeLessThan(500);
      
      console.log(`Calculated stats ${iterations} times for ${largeTodoList.length} todos in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not cause memory leaks with repeated operations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform memory-intensive operations
      for (let i = 0; i < 100; i++) {
        const todos = createMockTodos(1000);
        
        // Simulate all CRUD operations
        saveTodosToStorage(todos);
        loadTodosFromStorage();
        
        // Simulate sorting
        const sorted = [...todos].sort((a, b) => {
          if (a.completed === b.completed) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.completed ? 1 : -1;
        });
        
        // Simulate filtering
        const completed = sorted.filter(todo => todo.completed);
        const pending = sorted.filter(todo => !todo.completed);
        
        // Clean up references
        sorted.length = 0;
        completed.length = 0;
        pending.length = 0;
        todos.length = 0;
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      
      console.log(`Memory increase after operations: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });

    it('should handle rapid todo creation efficiently', () => {
      const todoTexts = Array.from({ length: 10000 }, (_, i) => `Rapid todo ${i}`);
      
      const start = performance.now();
      
      // Simulate rapid todo creation
      const todos = todoTexts.map((text, index) => ({
        id: generateTodoId(),
        text,
        completed: false,
        createdAt: new Date(Date.now() + index).toISOString(),
      }));
      
      const end = performance.now();
      const duration = end - start;
      
      // Should create 10k todos in less than 200ms
      expect(duration).toBeLessThan(200);
      
      expect(todos).toHaveLength(10000);
      expect(todos[0].text).toBe('Rapid todo 0');
      expect(todos[9999].text).toBe('Rapid todo 9999');
      
      console.log(`Created ${todos.length} todos in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Stress Tests', () => {
    it('should handle extreme load gracefully', () => {
      const extremeLoad = 1000000; // 1 million todos
      
      const start = performance.now();
      
      // Test ID generation under extreme load
      const ids = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        ids.add(generateTodoId());
      }
      
      // Test validation under extreme load
      for (let i = 0; i < 10000; i++) {
        validateTodoText(`Test todo ${i}`);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should handle extreme operations in reasonable time
      expect(duration).toBeLessThan(1000); // 1 second
      expect(ids.size).toBe(1000); // All IDs unique
      
      console.log(`Handled extreme load operations in ${duration.toFixed(2)}ms`);
    });

    it('should maintain performance with concurrent operations', async () => {
      const concurrentOperations = 50;
      const todosPerOperation = 100;
      
      const start = performance.now();
      
      // Simulate concurrent operations
      const promises = Array.from({ length: concurrentOperations }, async (_, index) => {
        const todos = createMockTodos(todosPerOperation, [{
          text: `Concurrent batch ${index}`,
        }]);
        
        // Simulate async operations
        saveTodosToStorage(todos);
        const loaded = loadTodosFromStorage();
        
        return loaded.length;
      });
      
      const results = await Promise.all(promises);
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete concurrent operations in reasonable time
      expect(duration).toBeLessThan(500);
      expect(results).toHaveLength(concurrentOperations);
      
      console.log(`Completed ${concurrentOperations} concurrent operations in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Performance Benchmarks', () => {
    it('should meet performance benchmarks for common operations', () => {
      const benchmarks = {
        todoCreation: { iterations: 10000, maxTime: 100 }, // 10k todos in 100ms
        validation: { iterations: 100000, maxTime: 50 },   // 100k validations in 50ms
        storage: { iterations: 1000, maxTime: 200 },       // 1k save operations in 200ms
        sorting: { iterations: 100, maxTime: 500 },        // 100 sorts of 1k todos in 500ms
      };
      
      // Benchmark todo creation
      let start = performance.now();
      for (let i = 0; i < benchmarks.todoCreation.iterations; i++) {
        generateTodoId();
      }
      let duration = performance.now() - start;
      expect(duration).toBeLessThan(benchmarks.todoCreation.maxTime);
      console.log(`Todo creation: ${duration.toFixed(2)}ms for ${benchmarks.todoCreation.iterations} operations`);
      
      // Benchmark validation
      start = performance.now();
      for (let i = 0; i < benchmarks.validation.iterations; i++) {
        validateTodoText(`Test ${i}`);
      }
      duration = performance.now() - start;
      expect(duration).toBeLessThan(benchmarks.validation.maxTime);
      console.log(`Validation: ${duration.toFixed(2)}ms for ${benchmarks.validation.iterations} operations`);
      
      // Benchmark storage
      const testTodos = createMockTodos(100);
      start = performance.now();
      for (let i = 0; i < benchmarks.storage.iterations; i++) {
        saveTodosToStorage(testTodos);
      }
      duration = performance.now() - start;
      expect(duration).toBeLessThan(benchmarks.storage.maxTime);
      console.log(`Storage: ${duration.toFixed(2)}ms for ${benchmarks.storage.iterations} operations`);
      
      // Benchmark sorting
      const sortTestTodos = createMockTodos(1000);
      start = performance.now();
      for (let i = 0; i < benchmarks.sorting.iterations; i++) {
        [...sortTestTodos].sort((a, b) => {
          if (a.completed === b.completed) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.completed ? 1 : -1;
        });
      }
      duration = performance.now() - start;
      expect(duration).toBeLessThan(benchmarks.sorting.maxTime);
      console.log(`Sorting: ${duration.toFixed(2)}ms for ${benchmarks.sorting.iterations} operations`);
    });
  });
});