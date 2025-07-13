export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
}