# Test Documentation - Todo App

## 📋 Tổng Quan

Bộ test suite này được thiết kế để đảm bảo chất lượng code và độ tin cậy cho ứng dụng Todo List. Tests bao gồm unit tests, integration tests, và performance tests với mục tiêu đạt được tối thiểu 90% code coverage.

## 🚀 Cách Chạy Tests

### Chạy Tất Cả Tests
```bash
npm test
```

### Chạy Tests Với Watch Mode
```bash
npm run test:watch
```

### Chạy Tests Với Coverage Report
```bash
npm run test:coverage
```

### Chạy Tests Cho File Cụ Thể
```bash
npm test -- utils.test.ts
npm test -- --testPathPattern=hooks
npm test -- --testPathPattern=components
```

## 🏗️ Cấu Trúc Tests

```
src/__tests__/
├── components/           # Component tests
│   ├── add-todo-form.test.tsx
│   ├── todo-item.test.tsx
│   ├── todo-list.test.tsx
│   └── todo-stats.test.tsx
├── hooks/               # Hook tests
│   └── useTodos.test.ts
├── lib/                 # Utility function tests
│   ├── storage.test.ts
│   └── utils.test.ts
├── integration/         # Integration tests
│   └── todo-app.integration.test.tsx
├── performance/         # Performance tests
│   └── performance.test.ts
├── fixtures/           # Test data và mock utilities
│   └── todo.fixtures.ts
└── test-utils.tsx      # Shared testing utilities
```

## 📊 Coverage Goals

| Module | Target Coverage | Current |
|--------|----------------|---------|
| Utils (`src/lib/`) | 95% | ✅ |
| Storage (`src/lib/storage.ts`) | 95% | ✅ |
| Hooks (`src/hooks/`) | 90% | ✅ |
| Components (`src/components/`) | 90% | ✅ |
| **Overall** | **90%** | **✅** |

## 🧪 Loại Tests

### 1. Unit Tests
- **Mục đích**: Test từng function/method riêng lẻ
- **Location**: `src/__tests__/lib/`, `src/__tests__/hooks/`
- **Bao gồm**:
  - Utils functions (`generateTodoId`, `validateTodoText`)
  - Storage functions (`loadTodosFromStorage`, `saveTodosToStorage`)
  - Custom hook (`useTodos`)

### 2. Component Tests
- **Mục đích**: Test React components
- **Location**: `src/__tests__/components/`
- **Bao gồm**:
  - `AddTodoForm`: Form validation, submission handling
  - `TodoItem`: CRUD operations, edit mode, accessibility
  - `TodoList`: Sorting, empty states, delegation to children
  - `TodoStats`: Statistics calculation, visual elements

### 3. Integration Tests
- **Mục đích**: Test tương tác giữa các components
- **Location**: `src/__tests__/integration/`
- **Bao gồm**:
  - Complete user workflows
  - Data persistence scenarios
  - Error recovery mechanisms

### 4. Performance Tests
- **Mục đích**: Đảm bảo hiệu suất với large datasets
- **Location**: `src/__tests__/performance/`
- **Bao gồm**:
  - Large data processing
  - Memory usage monitoring
  - Performance benchmarks

## 🎯 Test Scenarios

### Happy Path Tests
- ✅ Tạo todo mới thành công
- ✅ Xóa todo 
- ✅ Cập nhật nội dung todo
- ✅ Toggle trạng thái hoàn thành
- ✅ Load/save data từ localStorage

### Input Verification Tests
- ✅ Validate todo text (empty, too long, whitespace)
- ✅ Handle special characters và emojis
- ✅ Character limit enforcement (500 chars)
- ✅ Form validation và error states

### Branching Tests
- ✅ Conditional rendering logic
- ✅ Todo sorting (pending first, then by date)
- ✅ Edit mode transitions
- ✅ Empty state displays

### Exception Handling Tests
- ✅ localStorage errors (quota exceeded, access denied)
- ✅ Invalid JSON data handling
- ✅ Network errors (future API integration)
- ✅ Component error boundaries

### Edge Cases
- ✅ Very large todo lists (10k+ items)
- ✅ Concurrent operations
- ✅ Malformed data inputs
- ✅ Browser compatibility scenarios

## 🛠️ Testing Tools & Setup

### Core Testing Framework
- **Jest**: Test runner và assertion library
- **React Testing Library**: Component testing utilities
- **Jest DOM**: DOM assertion matchers

### Mock & Fixture Management
- **Fixtures**: Predefined test data in `todo.fixtures.ts`
- **Mock Functions**: Comprehensive mocking for localStorage, crypto API
- **Factory Functions**: Dynamic test data generation

### Configuration Files
- `jest.config.js`: Jest configuration với Next.js integration
- `jest.setup.js`: Global test setup và mocking
- `test-utils.tsx`: Custom render functions với providers

## 📝 Test Writing Guidelines

### Naming Convention
```typescript
describe('ComponentName', () => {
  describe('Happy Path', () => {
    it('should perform expected behavior', () => {});
  });
  
  describe('Input Verification', () => {
    it('should handle invalid input', () => {});
  });
  
  describe('Branching', () => {
    it('should follow correct code path', () => {});
  });
  
  describe('Exception Handling', () => {
    it('should handle errors gracefully', () => {});
  });
});
```

### AAA Pattern (Arrange, Act, Assert)
```typescript
it('should add new todo successfully', async () => {
  // Arrange
  const mockOnAdd = jest.fn().mockReturnValue(true);
  render(<AddTodoForm onAdd={mockOnAdd} />);
  
  // Act
  const input = screen.getByPlaceholderText('Thêm công việc mới...');
  await user.type(input, 'New todo');
  await user.click(screen.getByRole('button'));
  
  // Assert
  expect(mockOnAdd).toHaveBeenCalledWith('New todo');
});
```

## 🔧 Debugging Tests

### Chạy Single Test File
```bash
npm test -- --testNamePattern="should add todo"
npm test -- --testPathPattern="add-todo-form"
```

### Debug Mode Với Verbose Output
```bash
npm test -- --verbose --no-cache
```

### Xem Coverage Details
```bash
npm run test:coverage -- --verbose
```

### Debug Browser Tests
```bash
# Thêm vào test:
screen.debug(); // Print current DOM state
```

## 📈 Continuous Integration

### Pre-commit Hooks (Recommended)
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

### CI/CD Pipeline Script
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v1
```

## 🐛 Common Issues & Solutions

### 1. Module Resolution Errors
```bash
# Clear Jest cache
npm test -- --clearCache

# Verify path mapping in jest.config.js
moduleNameMapping: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

### 2. Async Test Issues
```typescript
// Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### 3. Mock Reset Between Tests
```typescript
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 4. Component Not Rendering
```typescript
// Check for missing providers
render(<Component />, { wrapper: AllTheProviders });

// Debug current DOM
screen.debug();
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

## 📞 Support

Nếu gặp vấn đề với tests:
1. Kiểm tra logs trong terminal
2. Verify mock setup trong `jest.setup.js`
3. Check file paths và import statements
4. Review test fixtures và factory functions

---

**Note**: Tests được thiết kế để chạy stable và fast. Nếu tests bị flaky, hãy kiểm tra async operations và timing issues.