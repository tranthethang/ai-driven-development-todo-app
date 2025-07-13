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


----------------------------

STEP 4:

# Prompt Tạo Unit Test cho AI Agent

## Bối cảnh
Bạn là một chuyên gia testing AI. Ứng dụng to-do list đã được phát triển hoàn thành và đang chạy bình thường. Hãy tạo unit test toàn diện cho toàn bộ codebase.

## Nhiệm vụ
Tạo bộ test suite hoàn chỉnh với các yêu cầu sau:

### 1. Yêu cầu về độ bao phủ test
- **Tối thiểu 90% code coverage** trên tất cả module
- Test tất cả method public, edge case và error scenario
- Bao gồm integration test cho API endpoints
- Test tương tác database và validation dữ liệu
- Bao phủ logic authentication và authorization

### 2. Cấu trúc test
- Sử dụng framework test phù hợp (Jest, PHPUnit, v.v.)
- Tuân theo pattern AAA (Arrange, Act, Assert)
- Tạo mô tả test có ý nghĩa
- Nhóm các test liên quan trong describe/test suite
- Bao gồm setup và teardown method

### 3. Phân loại test
- **Unit Tests**: Từng function/method riêng lẻ
- **Integration Tests**: Tương tác giữa các component
- **API Tests**: HTTP endpoints và responses
- **Database Tests**: Các thao tác CRUD và query
- **Validation Tests**: Validation input và sanitization
- **Authentication Tests**: Login, permissions, security

### 4. Dữ liệu test
- Tạo fixture và mock data thực tế
- Sử dụng factory để generate test object
- Bao gồm boundary value testing
- Test với input không hợp lệ/độc hại

### 5. Các khu vực cần test cụ thể
- Thao tác CRUD của task (create, read, update, delete)
- Authentication và session management của user
- Validation dữ liệu và xử lý lỗi
- Format response API và status code
- Ràng buộc database và relationship
- Biện pháp bảo mật và input sanitization

### 6. Định dạng output
- Tạo test file với naming convention đúng
- Bao gồm file config và setup test
- Cung cấp documentation rõ ràng để chạy test
- Thêm performance benchmark nếu có

## Sản phẩm cần giao
1. File test suite hoàn chỉnh
2. File cấu hình test
3. File mock/fixture data
4. Documentation để thực thi test
5. Script tích hợp CI/CD pipeline

Hãy tạo unit test toàn diện, ready-to-production để đảm bảo chất lượng code và độ tin cậy.


----------------------------


STEP 5:

# Prompt Fix Lỗi Unit Test cho AI Agent

## Bối cảnh
Bạn là một chuyên gia debugging và testing AI. Các unit test đã được tạo hoàn thành nhưng khi chạy có nhiều test case bị lỗi. Nhiệm vụ của bạn là phân tích và fix tất cả các lỗi test.

## Nhiệm vụ chính
Phân tích và sửa chữa tất cả lỗi unit test với quy trình sau:

### 1. Phân tích lỗi toàn diện
- **Thu thập thông tin lỗi**: Đọc kỹ tất cả error message, stack trace
- **Phân loại lỗi**: Xác định loại lỗi (syntax, logic, config, dependency, v.v.)
- **Ưu tiên xử lý**: Sắp xếp thứ tự fix theo mức độ nghiêm trọng
- **Tác động**: Đánh giá tác động của từng lỗi lên toàn bộ test suite

### 2. Điều tra nguyên nhân gốc rễ
**QUAN TRỌNG**: Với mỗi test case lỗi, hãy kiểm tra theo thứ tự:

#### Bước 1: Kiểm tra code chức năng
- Verify logic trong source code có đúng không
- Kiểm tra các edge case trong implementation
- Xác minh API response format và status code
- Validate database schema và constraint
- Review authentication/authorization logic

#### Bước 2: Nếu code chức năng có lỗi
- **FIX BUG TRONG CODE CHỨC NĂNG TRƯỚC**
- Sửa logic business sai
- Fix lỗi database query
- Correct API endpoint implementation
- Patch security vulnerability

#### Bước 3: Sau khi fix code chức năng
- Cập nhật test case cho phù hợp
- Adjust expected result theo logic mới
- Update mock data nếu cần
- Sync test với behavior mới

### 3. Các loại lỗi cần xử lý
- **Lỗi setup/teardown**: Database connection, test environment
- **Lỗi assertion**: Expected vs actual result không match
- **Lỗi mock**: Mock object không đúng behavior
- **Lỗi dependency**: Package, import, configuration
- **Lỗi timing**: Async operation, race condition
- **Lỗi data**: Test fixture, factory, seed data

### 4. Quy trình fix cụ thể
**Cho mỗi test case lỗi:**

1. **Analyze Error**
   - Đọc error message chi tiết
   - Trace stack để tìm root cause
   - Identify exact failure point

2. **Investigate Source Code**
   - Kiểm tra function/method được test
   - Verify input/output behavior
   - Check business logic correctness

3. **Determine Fix Strategy**
   - Nếu code chức năng sai → Fix source code trước
   - Nếu test case sai → Update test case
   - Nếu cả hai → Fix code trước, rồi update test

4. **Apply Fix**
   - Implement solution cho source code (nếu cần)
   - Update test case accordingly
   - Verify fix không break other tests

5. **Validate**
   - Chạy lại test case đã fix
   - Run toàn bộ test suite
   - Đảm bảo coverage không giảm

### 5. Yêu cầu output
- **Báo cáo chi tiết**: Liệt kê tất cả lỗi và nguyên nhân
- **Source code fixes**: Tất cả thay đổi trong code chức năng
- **Test case updates**: Tất cả thay đổi trong test files
- **Documentation**: Giải thích từng fix và lý do
- **Verification**: Kết quả chạy test sau khi fix

### 6. Tiêu chí hoàn thành
- ✅ 100% test case pass
- ✅ Maintain hoặc improve code coverage
- ✅ Không có regression bug
- ✅ Performance không bị ảnh hưởng
- ✅ Code quality được cải thiện

## Lưu ý quan trọng
1. **Luôn fix bug trong code chức năng trước**, sau đó mới sửa test case
2. **Không skip test case** - mọi lỗi đều phải được fix
3. **Maintain test quality** - đảm bảo test vẫn meaningful sau khi fix
4. **Document changes** - ghi rõ lý do thay đổi
5. **Verify regression** - đảm bảo fix không tạo ra lỗi mới

## Bắt đầu
Hãy phân tích từng lỗi test case, xác định nguyên nhân, và thực hiện fix theo quy trình trên. Ưu tiên fix bug trong source code trước, sau đó mới adjust test case cho phù hợp.
