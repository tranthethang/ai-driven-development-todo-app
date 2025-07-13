import { loadTodosFromStorage, saveTodosToStorage } from '@/lib/storage';
import { STORAGE_KEY } from '@/lib/constants';
import { todoFixtures, mixedTodoList, localStorageTestData, createMockLocalStorage } from '../fixtures/todo.fixtures';
import { testUtils } from '../test-utils';

describe('Storage Functions', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;
  let mockConsole: ReturnType<typeof testUtils.mockConsole>;

  beforeEach(() => {
    mockLocalStorage = createMockLocalStorage();
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    mockConsole = testUtils.mockConsole();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockConsole.restore();
  });

  describe('loadTodosFromStorage', () => {
    describe('Happy Path', () => {
      it('should load todos from localStorage successfully', () => {
        mockLocalStorage.getItem.mockReturnValue(localStorageTestData.validTodoList);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual(mixedTodoList);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      });

      it('should return empty array when no data exists', () => {
        mockLocalStorage.getItem.mockReturnValue(null);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      });

      it('should return empty array when storage is empty', () => {
        mockLocalStorage.getItem.mockReturnValue(localStorageTestData.emptyTodoList);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      });
    });

    describe('Input Verification', () => {
      it('should handle invalid JSON gracefully', () => {
        mockLocalStorage.getItem.mockReturnValue(localStorageTestData.invalidJson);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error loading todos from storage:', 
          expect.any(Error)
        );
      });

      it('should handle corrupted JSON data', () => {
        mockLocalStorage.getItem.mockReturnValue(localStorageTestData.corruptedData);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error loading todos from storage:', 
          expect.any(Error)
        );
      });

      it('should handle non-array data gracefully', () => {
        mockLocalStorage.getItem.mockReturnValue(localStorageTestData.nonArrayValue);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
      });
    });

    describe('Branching', () => {
      it('should return empty array in SSR environment', () => {
        const ssrMock = testUtils.simulateSSR();
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
        
        ssrMock.restore();
      });

      it('should validate that parsed data is an array', () => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ todos: mixedTodoList }));
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
      });

      it('should handle null as stored value', () => {
        mockLocalStorage.getItem.mockReturnValue(null);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
      });

      it('should handle undefined as stored value', () => {
        mockLocalStorage.getItem.mockReturnValue(undefined as any);
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
      });
    });

    describe('Exception Handling', () => {
      it('should handle localStorage access errors', () => {
        mockLocalStorage.getItem.mockImplementation(() => {
          throw new Error('localStorage access denied');
        });
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error loading todos from storage:', 
          expect.any(Error)
        );
      });

      it('should handle JSON.parse errors', () => {
        mockLocalStorage.getItem.mockReturnValue('{"invalid": json}');
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error loading todos from storage:', 
          expect.any(Error)
        );
      });

      it('should handle localStorage quota exceeded during read', () => {
        mockLocalStorage.getItem.mockImplementation(() => {
          throw new Error('localStorage quota exceeded');
        });
        
        const result = loadTodosFromStorage();
        
        expect(result).toEqual([]);
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error loading todos from storage:', 
          expect.any(Error)
        );
      });
    });
  });

  describe('saveTodosToStorage', () => {
    describe('Happy Path', () => {
      it('should save todos to localStorage successfully', () => {
        saveTodosToStorage(mixedTodoList);
        
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify(mixedTodoList)
        );
      });

      it('should save empty array successfully', () => {
        saveTodosToStorage([]);
        
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify([])
        );
      });

      it('should save single todo successfully', () => {
        const singleTodo = [todoFixtures.incompleteTodo];
        
        saveTodosToStorage(singleTodo);
        
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify(singleTodo)
        );
      });
    });

    describe('Input Verification', () => {
      it('should handle todos with special characters', () => {
        const specialTodos = [todoFixtures.specialCharsTodo];
        
        saveTodosToStorage(specialTodos);
        
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify(specialTodos)
        );
      });

      it('should handle todos with long text', () => {
        const longTodos = [todoFixtures.longTextTodo];
        
        saveTodosToStorage(longTodos);
        
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify(longTodos)
        );
      });
    });

    describe('Branching', () => {
      it('should do nothing in SSR environment', () => {
        const ssrMock = testUtils.simulateSSR();
        
        saveTodosToStorage(mixedTodoList);
        
        expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
        
        ssrMock.restore();
      });

      it('should handle window undefined gracefully', () => {
        const originalWindow = global.window;
        // @ts-ignore
        delete global.window;
        
        saveTodosToStorage(mixedTodoList);
        
        expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
        
        global.window = originalWindow;
      });
    });

    describe('Exception Handling', () => {
      it('should handle localStorage access errors', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('localStorage access denied');
        });
        
        saveTodosToStorage(mixedTodoList);
        
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error saving todos to storage:', 
          expect.any(Error)
        );
      });

      it('should handle localStorage quota exceeded', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('localStorage quota exceeded');
        });
        
        saveTodosToStorage(mixedTodoList);
        
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error saving todos to storage:', 
          expect.any(Error)
        );
      });

      it('should handle JSON.stringify errors', () => {
        // Create a circular reference that would cause JSON.stringify to fail
        const circularTodos: any = [{ id: '1', text: 'test', completed: false, createdAt: new Date().toISOString() }];
        circularTodos[0].self = circularTodos[0];
        
        saveTodosToStorage(circularTodos);
        
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error saving todos to storage:', 
          expect.any(Error)
        );
      });

      it('should handle localStorage setItem with invalid data', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('Invalid data format');
        });
        
        saveTodosToStorage(mixedTodoList);
        
        expect(mockConsole.mockError).toHaveBeenCalledWith(
          'Error saving todos to storage:', 
          expect.any(Error)
        );
      });
    });
  });

  describe('Integration Tests', () => {
    it('should maintain data integrity through save and load cycle', () => {
      // Save data
      saveTodosToStorage(mixedTodoList);
      
      // Simulate what localStorage would return
      const savedData = JSON.stringify(mixedTodoList);
      mockLocalStorage.getItem.mockReturnValue(savedData);
      
      // Load data
      const loadedTodos = loadTodosFromStorage();
      
      expect(loadedTodos).toEqual(mixedTodoList);
    });

    it('should handle multiple save operations', () => {
      saveTodosToStorage(mixedTodoList);
      saveTodosToStorage([]);
      saveTodosToStorage([todoFixtures.incompleteTodo]);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3);
      expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        JSON.stringify([todoFixtures.incompleteTodo])
      );
    });

    it('should handle load after storage error', () => {
      // First save should fail
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      saveTodosToStorage(mixedTodoList);
      
      // Then load should return empty array
      mockLocalStorage.getItem.mockReturnValue(null);
      const result = loadTodosFromStorage();
      
      expect(result).toEqual([]);
      expect(mockConsole.mockError).toHaveBeenCalledWith(
        'Error saving todos to storage:', 
        expect.any(Error)
      );
    });
  });
});