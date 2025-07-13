'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, newText: string) => boolean;
}

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (onUpdate && onUpdate(todo.id, editText)) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md animate-in slide-in-from-top-2 fade-in-0">
      <CardContent className="flex items-center gap-3 p-3 sm:p-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          className="transition-all duration-200"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm sm:text-base"
              maxLength={500}
              autoFocus
            />
          ) : (
            <p
              className={cn(
                "text-sm break-words transition-all duration-300 sm:text-base cursor-pointer",
                todo.completed && "line-through text-muted-foreground opacity-60"
              )}
              onClick={onUpdate ? handleEdit : undefined}
            >
              {todo.text}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1 sm:text-sm">
            {formatDate(todo.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                aria-label="Lưu thay đổi"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
                aria-label="Hủy thay đổi"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {onUpdate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                  aria-label={`Chỉnh sửa "${todo.text}"`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                aria-label={`Xóa "${todo.text}"`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};