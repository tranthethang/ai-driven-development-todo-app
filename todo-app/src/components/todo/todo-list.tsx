'use client';

import { Todo } from '@/types/todo';
import { TodoItem } from './todo-item';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, newText: string) => boolean;
}

export const TodoList = ({ todos, onToggle, onDelete, onUpdate }: TodoListProps) => {
  // Sort todos: pending first, then completed
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      // If same completion status, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Pending todos first
    return a.completed ? 1 : -1;
  });

  if (todos.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="animate-bounce">
            <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-muted-foreground mb-2">
            Chưa có công việc nào
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Thêm công việc đầu tiên của bạn ở trên để bắt đầu quản lý công việc hàng ngày
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTodos.map((todo, index) => (
        <div
          key={todo.id}
          className="animate-in slide-in-from-left-2 fade-in-0"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  );
};