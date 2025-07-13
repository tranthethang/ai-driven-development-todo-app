# Implementation Checklist - Todo App với Next.js + Tailwind + shadcn/ui

## Phase 1: Project Setup & Configuration

### 1.1 Initialize Next.js Project
- [ ] Tạo Next.js project với TypeScript: `npx create-next-app@latest todo-app --typescript --tailwind --eslint`
- [ ] Cài đặt dependencies cần thiết
- [ ] Cấu hình Tailwind CSS (đã có sẵn)

### 1.2 Setup shadcn/ui
- [ ] Cài đặt shadcn/ui CLI: `npx shadcn-ui@latest init`
- [ ] Cấu hình components.json
- [ ] Install các components cần thiết:
  - [ ] `npx shadcn-ui@latest add button`
  - [ ] `npx shadcn-ui@latest add input`
  - [ ] `npx shadcn-ui@latest add checkbox`
  - [ ] `npx shadcn-ui@latest add card`
  - [ ] `npx shadcn-ui@latest add badge`
  - [ ] `npx shadcn-ui@latest add trash-2` (icon)

### 1.3 Project Structure
- [ ] Tạo cấu trúc thư mục:
  ```
  src/
  ├── app/
  │   ├── page.tsx (main todo page)
  │   └── layout.tsx
  ├── components/
  │   ├── todo/
  │   │   ├── TodoList.tsx
  │   │   ├── TodoItem.tsx
  │   │   ├── AddTodoForm.tsx
  │   │   └── TodoStats.tsx
  │   └── ui/ (shadcn components)
  ├── lib/
  │   ├── utils.ts
  │   └── storage.ts
  ├── types/
  │   └── todo.ts
  └── hooks/
      └── useTodos.ts
  ```

## Phase 2: Type Definitions & Constants

### 2.1 Define Types
- [ ] Tạo `src/types/todo.ts`:
  ```typescript
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
  ```

### 2.2 Define Constants
- [ ] Tạo `src/lib/constants.ts`:
  ```typescript
  export const STORAGE_KEY = 'todo-list';
  ```

## Phase 3: Core Utility Functions

### 3.1 Storage Functions (`src/lib/storage.ts`)
- [ ] Implement `loadTodosFromStorage()`:
  - Try-catch để handle JSON parse errors
  - Return empty array nếu không có data
  - Handle case localStorage không available (SSR)

- [ ] Implement `saveTodosToStorage(todos: Todo[])`:
  - Stringify todos array
  - Handle localStorage errors
  - Check if localStorage available

### 3.2 Utility Functions (`src/lib/utils.ts`)
- [ ] Implement `generateTodoId()`:
  - Sử dụng `crypto.randomUUID()` hoặc `Date.now().toString()`

- [ ] Implement `validateTodoText(text: string)`:
  - Check text.trim().length > 0
  - Optional: check max length

## Phase 4: Custom Hook for State Management

### 4.1 Create `useTodos` Hook (`src/hooks/useTodos.ts`)
- [ ] State management với `useState<Todo[]>`
- [ ] Effect để load initial data từ localStorage
- [ ] Implement functions:
  - [ ] `addNewTodo(todoText: string)`: Tạo todo mới, update state, save to storage
  - [ ] `deleteTodo(todoId: string)`: Remove todo, update state, save to storage  
  - [ ] `toggleTodoComplete(todoId: string)`: Toggle completed, update state, save to storage
  - [ ] `updateTodoText(todoId: string, newText: string)`: Update text, save to storage
- [ ] Return: `{ todos, addTodo, deleteTodo, toggleComplete, updateTodo }`

## Phase 5: UI Components

### 5.1 TodoItem Component (`src/components/todo/TodoItem.tsx`)
**shadcn/ui components**: Checkbox, Button, Card
- [ ] Props: `todo: Todo`, `onToggle: (id: string) => void`, `onDelete: (id: string) => void`
- [ ] Layout: Card container với:
  - [ ] Checkbox từ shadcn/ui để toggle completed
  - [ ] Text với styling conditional (strikethrough nếu completed)
  - [ ] Delete button với Trash icon
  - [ ] Timestamp display (optional)
- [ ] Handle click events cho checkbox và delete button
- [ ] Accessibility: proper labels, keyboard navigation

### 5.2 AddTodoForm Component (`src/components/todo/AddTodoForm.tsx`)
**shadcn/ui components**: Input, Button, Card
- [ ] Props: `onAdd: (text: string) => void`
- [ ] State: input value với `useState`
- [ ] Form với Input và Button từ shadcn/ui
- [ ] Handle form submission:
  - [ ] Prevent default
  - [ ] Validate input
  - [ ] Call onAdd prop
  - [ ] Clear input
- [ ] Enter key support
- [ ] Loading state (optional)

### 5.3 TodoList Component (`src/components/todo/TodoList.tsx`)
**shadcn/ui components**: Card
- [ ] Props: `todos: Todo[]`, `onToggle`, `onDelete`
- [ ] Render danh sách TodoItem components
- [ ] Empty state UI khi không có todos
- [ ] Optional: Sort todos (pending first, then completed)

### 5.4 TodoStats Component (`src/components/todo/TodoStats.tsx`)
**shadcn/ui components**: Badge, Card
- [ ] Props: `todos: Todo[]`
- [ ] Calculate và display:
  - [ ] Total todos
  - [ ] Completed todos
  - [ ] Pending todos
- [ ] Use Badge components để show numbers
- [ ] Nice visual layout

## Phase 6: Main Page Integration

### 6.1 Main Page (`src/app/page.tsx`)
- [ ] Use `useTodos` hook
- [ ] Layout structure:
  - [ ] Page title/header
  - [ ] TodoStats component
  - [ ] AddTodoForm component  
  - [ ] TodoList component
- [ ] Pass appropriate props to each component
- [ ] Handle all event callbacks
- [ ] Responsive design với Tailwind classes

### 6.2 Layout (`src/app/layout.tsx`)
- [ ] Setup proper HTML structure
- [ ] Include necessary meta tags
- [ ] Configure fonts (optional)
- [ ] Global styles nếu cần

## Phase 7: Styling & UX Enhancements

### 7.1 Responsive Design
- [ ] Mobile-first approach với Tailwind
- [ ] Test trên các screen sizes
- [ ] Proper spacing và layout

### 7.2 Animations & Transitions
- [ ] Smooth transitions cho state changes
- [ ] Hover effects trên buttons
- [ ] Loading states
- [ ] Add/remove animations (optional)

### 7.3 Dark Mode Support (Optional)
- [ ] Configure Tailwind dark mode
- [ ] Update shadcn/ui theme
- [ ] Add theme toggle

## Phase 8: Testing & Optimization

### 8.1 Manual Testing
- [ ] Test all CRUD operations
- [ ] Test localStorage persistence
- [ ] Test edge cases (empty input, long text)
- [ ] Test responsive design
- [ ] Test keyboard navigation

### 8.2 Performance Optimization
- [ ] Check component re-renders
- [ ] Optimize với React.memo nếu cần
- [ ] Bundle size analysis

### 8.3 Code Quality
- [ ] ESLint checking
- [ ] TypeScript strict mode
- [ ] Code formatting với Prettier

## Phase 9: Deployment Preparation

### 9.1 Build & Deploy
- [ ] `npm run build` success
- [ ] Test production build locally

## Development Notes

### Key Implementation Points:
1. **Client-side only**: Sử dụng `useEffect` và check `typeof window !== 'undefined'` cho localStorage
2. **TypeScript**: Strict typing cho tất cả functions và components
3. **shadcn/ui**: Consistent component usage, follow design system
4. **State management**: Centralized trong `useTodos` hook
5. **Error handling**: Graceful fallbacks cho localStorage issues

### Recommended Development Order:
1. Setup project → Types → Storage utils → useTodos hook
2. TodoItem → AddTodoForm → TodoList → TodoStats
3. Main page integration → Styling → Testing

### AI Agent Prompts Suggestions:
- Chia thành 9 prompts tương ứng với 9 phases
- Mỗi prompt focus vào 1 phase cụ thể
- Provide context từ previous phases khi cần
- Test sau mỗi phase trước khi continue