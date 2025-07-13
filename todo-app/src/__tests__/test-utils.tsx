import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Toaster } from 'sonner';

/**
 * Custom render function that includes providers and common setup
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Test utilities for common operations
 */
export const testUtils = {
  // Mock window.crypto for consistent testing
  mockCrypto: () => {
    const mockCrypto = {
      randomUUID: jest.fn(() => 'test-uuid-1234'),
    };
    Object.defineProperty(global, 'crypto', {
      value: mockCrypto,
      writable: true,
    });
    return mockCrypto;
  },

  // Mock Date.now for consistent timestamps
  mockDateNow: (timestamp: number = 1640995200000) => {
    const spy = jest.spyOn(Date, 'now').mockReturnValue(timestamp);
    return spy;
  },

  // Mock console methods
  mockConsole: () => {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    const mockError = jest.fn();
    const mockWarn = jest.fn();
    const mockLog = jest.fn();

    console.error = mockError;
    console.warn = mockWarn;
    console.log = mockLog;

    return {
      mockError,
      mockWarn,
      mockLog,
      restore: () => {
        console.error = originalError;
        console.warn = originalWarn;
        console.log = originalLog;
      },
    };
  },

  // Wait for async operations
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),

  // Helper to simulate localStorage behavior
  simulateLocalStorageError: () => {
    const mockSetItem = jest.fn(() => {
      throw new Error('localStorage quota exceeded');
    });
    const mockGetItem = jest.fn(() => {
      throw new Error('localStorage access error');
    });

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    return { mockSetItem, mockGetItem };
  },

  // Simulate SSR environment
  simulateSSR: () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    return {
      restore: () => {
        global.window = originalWindow;
      },
    };
  },

  // Common assertion helpers
  expectToHaveBeenCalledWithTodo: (mockFn: jest.Mock, expectedTodo: any) => {
    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining(expectedTodo)
    );
  },

  expectArrayToContainTodo: (array: any[], expectedTodo: any) => {
    expect(array).toContainEqual(
      expect.objectContaining(expectedTodo)
    );
  },
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';