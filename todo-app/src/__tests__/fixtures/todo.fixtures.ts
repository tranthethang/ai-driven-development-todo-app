import { Todo } from '@/types/todo';

/**
 * Factory function to create mock Todo objects
 */
export const createMockTodo = (overrides: Partial<Todo> = {}): Todo => {
  const defaultTodo: Todo = {
    id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: 'Sample todo item',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  return { ...defaultTodo, ...overrides };
};

/**
 * Factory function to create multiple mock Todo objects
 */
export const createMockTodos = (count: number, overrides: Partial<Todo>[] = []): Todo[] => {
  return Array.from({ length: count }, (_, index) => {
    const baseOverride = overrides[index] || {};
    return createMockTodo({
      id: `todo-${index + 1}`,
      text: `Todo item ${index + 1}`,
      ...baseOverride,
    });
  });
};

/**
 * Predefined test data fixtures
 */
export const todoFixtures = {
  // Basic todo items
  incompleteTodo: createMockTodo({
    id: 'todo-1',
    text: 'Buy groceries',
    completed: false,
    createdAt: '2024-01-01T10:00:00.000Z',
  }),

  completedTodo: createMockTodo({
    id: 'todo-2',
    text: 'Walk the dog',
    completed: true,
    createdAt: '2024-01-01T09:00:00.000Z',
  }),

  // Edge cases
  emptyTodo: createMockTodo({
    id: 'todo-empty',
    text: '',
    completed: false,
    createdAt: '2024-01-01T12:00:00.000Z',
  }),

  longTextTodo: createMockTodo({
    id: 'todo-long',
    text: 'A'.repeat(500), // Maximum length
    completed: false,
    createdAt: '2024-01-01T11:00:00.000Z',
  }),

  veryLongTextTodo: createMockTodo({
    id: 'todo-very-long',
    text: 'A'.repeat(501), // Over maximum length
    completed: false,
    createdAt: '2024-01-01T11:00:00.000Z',
  }),

  // Special characters
  specialCharsTodo: createMockTodo({
    id: 'todo-special',
    text: 'Handle special chars: <script>alert("XSS")</script> & 中文 & émojis 🎉',
    completed: false,
    createdAt: '2024-01-01T11:00:00.000Z',
  }),

  // Whitespace tests
  whitespaceOnlyTodo: createMockTodo({
    id: 'todo-whitespace',
    text: '   \t\n   ',
    completed: false,
    createdAt: '2024-01-01T11:00:00.000Z',
  }),

  leadingTrailingSpacesTodo: createMockTodo({
    id: 'todo-spaces',
    text: '   Valid todo with spaces   ',
    completed: false,
    createdAt: '2024-01-01T11:00:00.000Z',
  }),
};

/**
 * Mixed todo list for testing various scenarios
 */
export const mixedTodoList: Todo[] = [
  todoFixtures.incompleteTodo,
  todoFixtures.completedTodo,
  createMockTodo({
    id: 'todo-3',
    text: 'Read a book',
    completed: false,
    createdAt: '2024-01-01T08:00:00.000Z',
  }),
  createMockTodo({
    id: 'todo-4',
    text: 'Complete project',
    completed: true,
    createdAt: '2024-01-01T07:00:00.000Z',
  }),
  createMockTodo({
    id: 'todo-5',
    text: 'Schedule meeting',
    completed: false,
    createdAt: '2024-01-01T06:00:00.000Z',
  }),
];

/**
 * Test data for localStorage scenarios
 */
export const localStorageTestData = {
  validTodoList: JSON.stringify(mixedTodoList),
  emptyTodoList: JSON.stringify([]),
  invalidJson: '{"invalid": json}',
  nullValue: null,
  undefinedValue: undefined,
  nonArrayValue: JSON.stringify({ todos: mixedTodoList }),
  corruptedData: '{"id":"todo-1","text":"incomplete"', // Missing closing brace
};

/**
 * Mock localStorage implementation for testing
 */
export const createMockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get store() {
      return store;
    },
  };
};