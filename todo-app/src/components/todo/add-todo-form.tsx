'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (text: string) => boolean;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = onAdd(inputValue);
      if (success) {
        setInputValue('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Thêm công việc mới..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            maxLength={500}
            aria-label="Nhập nội dung công việc mới"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            size="default"
            className="transition-all duration-200 hover:scale-105 w-full sm:w-auto"
            aria-label="Thêm công việc"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </form>
        
        {inputValue.length > 450 && (
          <p className="text-xs text-muted-foreground mt-2 animate-in fade-in-0">
            {500 - inputValue.length} ký tự còn lại
          </p>
        )}
      </CardContent>
    </Card>
  );
};