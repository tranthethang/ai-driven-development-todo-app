import { Todo } from '@/types/todo';
import { STORAGE_KEY } from './constants';

export const loadTodosFromStorage = (): Todo[] => {
  // Check if localStorage is available (handle SSR)
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (!storedTodos) {
      return [];
    }
    
    const parsedTodos = JSON.parse(storedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    console.error('Error loading todos from storage:', error);
    return [];
  }
};

export const saveTodosToStorage = (todos: Todo[]): void => {
  // Check if localStorage is available
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to storage:', error);
  }
};