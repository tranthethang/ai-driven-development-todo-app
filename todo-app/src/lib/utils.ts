import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateTodoId = (): string => {
  // Use crypto.randomUUID if available, fallback to timestamp-based ID
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateTodoText = (text: string): boolean => {
  if (typeof text !== 'string') {
    return false;
  }
  const trimmedText = text.trim();
  return trimmedText.length > 0 && trimmedText.length <= 500; // Max 500 characters
};
