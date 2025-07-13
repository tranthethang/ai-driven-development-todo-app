'use client';

import { Todo } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats = ({ todos }: TodoStatsProps) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Thống kê công việc</h2>
          {total > 0 && (
            <div className="text-sm sm:text-base text-muted-foreground font-medium">
              {completionPercentage}% hoàn thành
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-blue-50 transition-all duration-200 hover:bg-blue-100">
            <div className="flex items-center space-x-2">
              <ListTodo className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Tổng cộng</span>
            </div>
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2 bg-blue-100 text-blue-700"
              data-testid="total-count"
            >
              {total}
            </Badge>
          </div>

          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-orange-50 transition-all duration-200 hover:bg-orange-100">
            <div className="flex items-center space-x-2">
              <Circle className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Đang chờ</span>
            </div>
            <Badge 
              variant="outline" 
              className="text-lg px-4 py-2 border-orange-500 text-orange-600 bg-white"
              data-testid="pending-count"
            >
              {pending}
            </Badge>
          </div>

          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-green-50 transition-all duration-200 hover:bg-green-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Hoàn thành</span>
            </div>
            <Badge 
              variant="outline" 
              className="text-lg px-4 py-2 border-green-500 text-green-600 bg-white"
              data-testid="completed-count"
            >
              {completed}
            </Badge>
          </div>
        </div>

        {total > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Tiến độ hoàn thành</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
                role="progressbar"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${completionPercentage}% hoàn thành`}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};