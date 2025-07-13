# Function List - Ứng dụng To-do List

## Mô tả tổng quan
Ứng dụng To-do List đơn giản với các chức năng cơ bản: thêm, hiển thị, đánh dấu hoàn thành, xóa công việc và lưu trữ dữ liệu trong localStorage.

## Danh sách các Function cần thiết

### 1. Data Management Functions

#### `loadTodosFromStorage()`
- **Vai trò**: Tải danh sách công việc từ localStorage khi khởi động ứng dụng
- **Input**: Không có
- **Output**: Array of todo objects hoặc empty array nếu không có dữ liệu
- **Mô tả**: Đọc dữ liệu từ localStorage, parse JSON và trả về danh sách công việc

#### `saveTodosToStorage(todos)`
- **Vai trò**: Lưu danh sách công việc vào localStorage
- **Input**: `todos` (Array) - Danh sách tất cả công việc
- **Output**: Không có (void)
- **Mô tả**: Chuyển đổi danh sách thành JSON và lưu vào localStorage

### 2. Todo Management Functions

#### `addNewTodo(todoText)`
- **Vai trò**: Thêm một công việc mới vào danh sách
- **Input**: `todoText` (String) - Nội dung công việc
- **Output**: Object - Todo object mới được tạo
- **Mô tả**: Tạo todo object với id unique, text, completed status và timestamp

#### `deleteTodo(todoId)`
- **Vai trò**: Xóa một công việc khỏi danh sách
- **Input**: `todoId` (String/Number) - ID của công việc cần xóa
- **Output**: Boolean - true nếu xóa thành công, false nếu không tìm thấy
- **Mô tả**: Tìm và xóa todo theo ID, cập nhật localStorage

#### `toggleTodoComplete(todoId)`
- **Vai trò**: Đánh dấu/bỏ đánh dấu công việc đã hoàn thành
- **Input**: `todoId` (String/Number) - ID của công việc
- **Output**: Boolean - Trạng thái completed mới
- **Mô tả**: Thay đổi trạng thái completed của todo, cập nhật localStorage

#### `updateTodoText(todoId, newText)`
- **Vai trò**: Cập nhật nội dung của một công việc (tùy chọn mở rộng)
- **Input**: `todoId` (String/Number), `newText` (String)
- **Output**: Boolean - true nếu cập nhật thành công
- **Mô tả**: Tìm và cập nhật text của todo theo ID

### 3. UI Rendering Functions

#### `renderTodoList(todos)`
- **Vai trò**: Hiển thị danh sách công việc lên giao diện
- **Input**: `todos` (Array) - Danh sách công việc cần hiển thị
- **Output**: Không có (void)
- **Mô tả**: Tạo HTML elements cho từng todo và hiển thị trong container

#### `renderSingleTodo(todo)`
- **Vai trò**: Tạo HTML element cho một công việc đơn lẻ
- **Input**: `todo` (Object) - Todo object
- **Output**: HTMLElement - DOM element của todo
- **Mô tả**: Tạo div/li chứa checkbox, text, và button delete

#### `clearTodoInput()`
- **Vai trò**: Xóa nội dung trong input field sau khi thêm todo
- **Input**: Không có
- **Output**: Không có (void)
- **Mô tả**: Reset giá trị của input element về empty string

### 4. Event Handler Functions

#### `handleAddTodo(event)`
- **Vai trò**: Xử lý sự kiện thêm todo mới (submit form hoặc click button)
- **Input**: `event` (Event) - DOM event object
- **Output**: Không có (void)
- **Mô tả**: Lấy text từ input, validate, gọi addNewTodo và re-render

#### `handleToggleComplete(event)`
- **Vai trò**: Xử lý sự kiện click vào checkbox để toggle completed
- **Input**: `event` (Event) - DOM event object
- **Output**: Không có (void)
- **Mô tả**: Lấy todoId từ event target, gọi toggleTodoComplete và re-render

#### `handleDeleteTodo(event)`
- **Vai trò**: Xử lý sự kiện click vào button delete
- **Input**: `event` (Event) - DOM event object
- **Output**: Không có (void)
- **Mô tả**: Lấy todoId từ event target, gọi deleteTodo và re-render

### 5. Utility Functions

#### `generateTodoId()`
- **Vai trò**: Tạo ID unique cho todo mới
- **Input**: Không có
- **Output**: String/Number - ID unique
- **Mô tả**: Có thể dùng timestamp, random number hoặc counter

#### `validateTodoText(text)`
- **Vai trò**: Kiểm tra tính hợp lệ của text todo
- **Input**: `text` (String) - Nội dung cần validate
- **Output**: Boolean - true nếu hợp lệ
- **Mô tả**: Kiểm tra text không rỗng, không chỉ có whitespace

#### `initializeApp()`
- **Vai trò**: Khởi tạo ứng dụng khi page load
- **Input**: Không có
- **Output**: Không có (void)
- **Mô tả**: Load todos từ storage, render initial UI, bind event handlers

### 6. Constants/Configuration

#### `STORAGE_KEY`
- **Vai trò**: Key được sử dụng để lưu trữ trong localStorage
- **Giá trị**: String constant (ví dụ: 'todoList')

## Cấu trúc Todo Object

```javascript
{
  id: "unique_id",
  text: "Nội dung công việc",
  completed: false,
  createdAt: "timestamp"
}
```

## Luồng hoạt động chính

1. **Khởi tạo**: `initializeApp()` → `loadTodosFromStorage()` → `renderTodoList()`
2. **Thêm todo**: `handleAddTodo()` → `validateTodoText()` → `addNewTodo()` → `saveTodosToStorage()` → `renderTodoList()`
3. **Toggle complete**: `handleToggleComplete()` → `toggleTodoComplete()` → `saveTodosToStorage()` → `renderTodoList()`
4. **Xóa todo**: `handleDeleteTodo()` → `deleteTodo()` → `saveTodosToStorage()` → `renderTodoList()`