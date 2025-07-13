STEP 1: Phân tích nghiệp vụ

Tôi muốn xây dựng một ứng dụng To-do List đơn giản.

Yêu cầu:
- Người dùng có thể thêm công việc mới
- Hiển thị danh sách công việc
- Có thể đánh dấu công việc đã hoàn thành
- Có thể xóa công việc
- Dữ liệu được lưu và tải lại từ localStorage

Hãy phân tích và liệt kê tất cả các chức năng (function list) cần thiết để hiện thực ứng dụng này.
Với mỗi function:
- Đặt tên hàm gợi nhớ, theo camelCase
- Mô tả rõ vai trò của hàm
- Ghi rõ input/output nếu có
- Lưu file tại thư mục ./docs

----------------------------

STEP 2:
Từ nội dung file `./docs/function-list.md`, kết hợp với yêu cầu công nghệ:
- Next.js
- Tailwind CSS
- shadcn/ui (theme components)

Hãy tạo một file check-list chi tiết (dưới dạng bullet list hoặc bảng) để hướng dẫn AI Agent từng bước code các tính năng đã liệt kê trong `function-list.md`.

Yêu cầu:
- Mỗi mục nên mô tả ngắn gọn công việc cần làm
- Nếu có liên quan đến UI, hãy chỉ rõ component nào sẽ dùng từ shadcn/ui
- Nếu có logic backend/API, hãy ghi chú rõ (ví dụ: tạo API route trong Next.js)
- Check-list cần đủ rõ để chia thành nhiều prompt nhỏ hoặc để AI Agent hiểu và code từng phần.
- Check-list bỏ qua phần testing và deploy
- Lưu file tại thư mục ./docs

----------------------------

STEP 3:
Hãy thực hiện việc lập trình đầy đủ các tính năng theo nội dung trong file `docs/implementation-checklist.md`.

Yêu cầu công nghệ:
- Next.js (App Router, TypeScript mặc định)
- Tailwind CSS
- shadcn/ui (component-based design)

Coding convention:
- Dùng function component với arrow function
- Chia code theo cấu trúc thư mục: `app/`, `components/`, `lib/`, `types/`, `utils/`
- Logic được tách riêng khi hợp lý (hooks đặt trong `lib/hooks`, hàm xử lý đặt trong `lib/utils`)
- UI nên dùng component từ shadcn/ui nếu phù hợp (`Button`, `Input`, `Card`, `Dialog`, `Textarea`, v.v.)

Naming convention:
- Tên file: kebab-case (ví dụ: `task-card.tsx`, `todo-form.tsx`)
- Tên component: PascalCase (`TaskCard`, `TodoForm`)
- Tên biến và hàm: camelCase (`handleSubmit`, `getTaskList`)
- API route: theo chuẩn REST, đặt trong `app/api/[resource]/route.ts`

Yêu cầu bổ sung:
- Viết mã nguồn rõ ràng, dễ hiểu
- Nếu cần tạo nhiều file, hãy ghi rõ: tên file, đường dẫn, và nội dung của từng file
- Bắt đầu lần lượt từ đầu checklist, thực hiện từng bước một cách có hệ thống

