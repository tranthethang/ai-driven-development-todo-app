'use client';

import { useState, useEffect, useRef } from 'react';
import { Todo } from '@/types/todo';
import { loadTodosFromStorage, saveTodosToStorage } from '@/lib/storage';
import { generateTodoId, validateTodoText } from '@/lib/utils';
import { toast } from 'sonner';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasInitialLoadCompletedRef = useRef(false);

  // Load initial data from localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Add a small delay to make it truly async for testing
        await new Promise(resolve => setTimeout(resolve, 0));
        const loadedTodos = loadTodosFromStorage();
        
        setTodos(loadedTodos);
        setIsLoaded(true);
        
        // Mark initial load as completed in the next tick
        setTimeout(() => {
          hasInitialLoadCompletedRef.current = true;
        }, 0);
      } catch (error) {
        console.error('Error loading todos:', error);
        setTodos([]);
        setIsLoaded(true);
        
        setTimeout(() => {
          hasInitialLoadCompletedRef.current = true;
        }, 0);
      }
    };
    
    loadData();
  }, []);

  // Save to storage whenever todos change (but not on initial load)
  useEffect(() => {
    if (isLoaded && hasInitialLoadCompletedRef.current) {
      saveTodosToStorage(todos);
    }
  }, [todos, isLoaded]);

  const addTodo = (todoText: string): boolean => {
    if (!validateTodoText(todoText)) {
      toast.error('Vui lòng nhập nội dung công việc hợp lệ (1-500 ký tự)');
      return false;
    }

    const newTodo: Todo = {
      id: generateTodoId(),
      text: todoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    toast.success('Đã thêm công việc mới thành công!');
    return true;
  };

  const deleteTodo = (todoId: string): void => {
    const todoToDelete = todos.find(todo => todo.id === todoId);
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    
    if (todoToDelete) {
      toast.success('Đã xóa công việc thành công!');
    }
  };

  const toggleComplete = (todoId: string): void => {
    const todo = todos.find(t => t.id === todoId);
    
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );

    if (todo) {
      const message = !todo.completed 
        ? 'Đã đánh dấu hoàn thành!' 
        : 'Đã đánh dấu chưa hoàn thành!';
      toast.success(message);
    }
  };

  const updateTodo = (todoId: string, newText: string): boolean => {
    if (!validateTodoText(newText)) {
      toast.error('Vui lòng nhập nội dung công việc hợp lệ (1-500 ký tự)');
      return false;
    }

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId
          ? { ...todo, text: newText.trim() }
          : todo
      )
    );
    
    toast.success('Đã cập nhật công việc thành công!');
    return true;
  };

  return {
    todos,
    isLoaded,
    addTodo,
    deleteTodo,
    toggleComplete,
    updateTodo,
  };
};