'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoStats } from '@/components/todo/todo-stats';
import { AddTodoForm } from '@/components/todo/add-todo-form';
import { TodoList } from '@/components/todo/todo-list';
import { ListTodo } from 'lucide-react';

export default function Home() {
  const { todos, isLoaded, addTodo, deleteTodo, toggleComplete, updateTodo } = useTodos();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 animate-in slide-in-from-top-4 fade-in-0">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <ListTodo className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Todo App
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Quản lý công việc hàng ngày của bạn một cách hiệu quả và có tổ chức
          </p>
        </div>

        {/* Stats */}
        <div className="animate-in slide-in-from-top-6 fade-in-0" style={{ animationDelay: '100ms' }}>
          <TodoStats todos={todos} />
        </div>

        {/* Add Todo Form */}
        <div className="animate-in slide-in-from-top-8 fade-in-0" style={{ animationDelay: '200ms' }}>
          <AddTodoForm onAdd={addTodo} />
        </div>

        {/* Todo List */}
        <div className="animate-in slide-in-from-bottom-4 fade-in-0" style={{ animationDelay: '300ms' }}>
          <TodoList
            todos={todos}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </div>
      </div>
    </div>
  );
}
