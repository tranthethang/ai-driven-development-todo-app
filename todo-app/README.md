# Todo App - Ứng dụng Quản lý Công việc

Một ứng dụng quản lý công việc hàng ngày đơn giản và hiệu quả được xây dựng với Next.js, TypeScript, Tailwind CSS và shadcn/ui.

## ✨ Tính năng

- ✅ **Thêm công việc mới** - Thêm công việc với giao diện đơn giản
- ✏️ **Chỉnh sửa công việc** - Click vào text hoặc nút edit để chỉnh sửa
- ☑️ **Đánh dấu hoàn thành** - Checkbox để đánh dấu công việc đã hoàn thành
- 🗑️ **Xóa công việc** - Xóa công việc không cần thiết
- 📊 **Thống kê** - Hiển thị tổng số, đang chờ, và đã hoàn thành
- 💾 **Lưu trữ cục bộ** - Dữ liệu được lưu trong localStorage
- 📱 **Responsive** - Hoạt động tốt trên mọi thiết bị
- 🎨 **Animations** - Hiệu ứng mượt mà và thông báo toast
- ♿ **Accessibility** - Hỗ trợ keyboard navigation và screen readers

## 🛠️ Công nghệ sử dụng

- **Next.js 15** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Build cho production

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm start
```

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── todo/              # Todo-specific components
│   │   ├── add-todo-form.tsx
│   │   ├── todo-item.tsx
│   │   ├── todo-list.tsx
│   │   └── todo-stats.tsx
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
│   └── useTodos.ts        # Todo state management
├── lib/                   # Utility libraries
│   ├── constants.ts       # App constants
│   ├── storage.ts         # localStorage utilities
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions
    └── todo.ts            # Todo-related types
```

## 🎯 Cách sử dụng

### Thêm công việc mới
1. Nhập nội dung công việc vào ô input
2. Nhấn nút "Thêm" hoặc phím Enter
3. Công việc sẽ xuất hiện ở đầu danh sách

### Chỉnh sửa công việc
1. Click vào text của công việc hoặc nút edit (✏️)
2. Chỉnh sửa nội dung trong ô input
3. Nhấn Enter hoặc nút check (✓) để lưu
4. Nhấn Escape hoặc nút X để hủy

### Đánh dấu hoàn thành
- Click vào checkbox bên trái công việc
- Công việc hoàn thành sẽ có gạch ngang và chuyển xuống cuối danh sách

### Xóa công việc
- Click vào nút thùng rác (🗑️) bên phải công việc

## 🎨 Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa file `src/app/globals.css` để thay đổi color scheme.

### Thêm tính năng mới
1. Cập nhật types trong `src/types/todo.ts`
2. Thêm logic vào `src/hooks/useTodos.ts`
3. Tạo hoặc cập nhật components trong `src/components/todo/`

## 📝 Ghi chú phát triển

### Coding Conventions
- **File naming**: kebab-case (`todo-item.tsx`)
- **Component naming**: PascalCase (`TodoItem`)
- **Function/variable naming**: camelCase (`handleSubmit`)
- **Function components**: Arrow functions
- **Imports**: Absolute imports với `@/` alias

### State Management
- Sử dụng custom hook `useTodos` để quản lý state
- localStorage để persist data
- Toast notifications cho user feedback

### Styling
- Tailwind CSS cho styling
- shadcn/ui components cho consistency
- Responsive design với mobile-first approach
- Smooth animations và transitions

## 🐛 Troubleshooting

### localStorage không hoạt động
- Đảm bảo ứng dụng chạy trong browser (không phải SSR)
- Kiểm tra browser có hỗ trợ localStorage không
- Xóa cache browser nếu cần

### Build errors
```bash
# Xóa cache và reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

Được xây dựng với ❤️ bằng Next.js và shadcn/ui
