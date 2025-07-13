import { generateTodoId, validateTodoText, cn } from '@/lib/utils';
import { testUtils } from '../test-utils';

describe('Utils Functions', () => {
  describe('generateTodoId', () => {
    describe('Happy Path', () => {
      it('should generate unique IDs each time', () => {
        // Mock crypto to return different values for each call
        const mockCrypto = testUtils.mockCrypto();
        mockCrypto.randomUUID
          .mockReturnValueOnce('test-uuid-1234')
          .mockReturnValueOnce('test-uuid-5678');
        
        const id1 = generateTodoId();
        const id2 = generateTodoId();
        
        expect(id1).not.toBe(id2);
        expect(typeof id1).toBe('string');
        expect(typeof id2).toBe('string');
        expect(id1).toBe('test-uuid-1234');
        expect(id2).toBe('test-uuid-5678');
      });

      it('should use crypto.randomUUID when available', () => {
        const mockCrypto = testUtils.mockCrypto();
        mockCrypto.randomUUID.mockReturnValue('crypto-uuid-123');
        
        const id = generateTodoId();
        
        expect(id).toBe('crypto-uuid-123');
        expect(mockCrypto.randomUUID).toHaveBeenCalledTimes(1);
      });
    });

    describe('Branching', () => {
      it('should fallback to timestamp-based ID when crypto is not available', () => {
        // Mock crypto as undefined
        const originalCrypto = global.crypto;
        // @ts-ignore
        global.crypto = undefined;
        
        const mockDateNow = testUtils.mockDateNow(1640995200000);
        const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
        
        const id = generateTodoId();
        
        expect(id).toMatch(/^todo-1640995200000-[a-z0-9]+$/);
        expect(mockDateNow).toHaveBeenCalled();
        expect(mockMath).toHaveBeenCalled();
        
        // Restore
        global.crypto = originalCrypto;
        mockDateNow.mockRestore();
        mockMath.mockRestore();
      });

      it('should fallback when crypto.randomUUID is not available', () => {
        // Mock crypto without randomUUID
        Object.defineProperty(global, 'crypto', {
          value: {},
          writable: true,
        });
        
        const mockDateNow = testUtils.mockDateNow(1640995200000);
        const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
        
        const id = generateTodoId();
        
        expect(id).toMatch(/^todo-1640995200000-[a-z0-9]+$/);
        expect(mockDateNow).toHaveBeenCalled();
        expect(mockMath).toHaveBeenCalled();
        
        mockDateNow.mockRestore();
        mockMath.mockRestore();
      });
    });

    describe('Input Verification', () => {
      it('should generate IDs with correct format for fallback', () => {
        // @ts-ignore
        global.crypto = undefined;
        
        const id = generateTodoId();
        
        expect(id).toMatch(/^todo-\d+-[a-z0-9]+$/);
      });

      it('should generate consistent length IDs with fallback', () => {
        // @ts-ignore
        global.crypto = undefined;
        
        const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
        
        const id1 = generateTodoId();
        const id2 = generateTodoId();
        
        const randomPart1 = id1.split('-')[2];
        const randomPart2 = id2.split('-')[2];
        
        expect(randomPart1).toBe(randomPart2); // Same random value
        expect(randomPart1.length).toBe(9); // substr(2, 9) from base36
        
        mockMath.mockRestore();
      });
    });
  });

  describe('validateTodoText', () => {
    describe('Happy Path', () => {
      it('should validate normal text', () => {
        expect(validateTodoText('Valid todo text')).toBe(true);
      });

      it('should validate text with exactly 500 characters', () => {
        const text = 'A'.repeat(500);
        expect(validateTodoText(text)).toBe(true);
      });

      it('should validate text with 1 character', () => {
        expect(validateTodoText('A')).toBe(true);
      });
    });

    describe('Input Verification', () => {
      it('should reject empty string', () => {
        expect(validateTodoText('')).toBe(false);
      });

      it('should reject text with only whitespace', () => {
        expect(validateTodoText('   ')).toBe(false);
        expect(validateTodoText('\t\n\r')).toBe(false);
        expect(validateTodoText('  \t  \n  ')).toBe(false);
      });

      it('should reject text longer than 500 characters', () => {
        const text = 'A'.repeat(501);
        expect(validateTodoText(text)).toBe(false);
      });

      it('should reject very long text', () => {
        const text = 'A'.repeat(1000);
        expect(validateTodoText(text)).toBe(false);
      });
    });

    describe('Branching', () => {
      it('should validate text with leading/trailing spaces after trim', () => {
        expect(validateTodoText('  Valid text  ')).toBe(true);
      });

      it('should reject text that is empty after trim', () => {
        expect(validateTodoText('   \t\n   ')).toBe(false);
      });

      it('should validate text with special characters', () => {
        expect(validateTodoText('Todo with émojis 🎉 and 中文')).toBe(true);
      });

      it('should validate text with HTML-like content', () => {
        expect(validateTodoText('<script>alert("test")</script>')).toBe(true);
      });
    });

    describe('Exception Handling', () => {
      it('should handle null input gracefully', () => {
        // @ts-ignore - Testing runtime behavior
        expect(validateTodoText(null)).toBe(false);
      });

      it('should handle undefined input gracefully', () => {
        // @ts-ignore - Testing runtime behavior
        expect(validateTodoText(undefined)).toBe(false);
      });

      it('should handle number input gracefully', () => {
        // @ts-ignore - Testing runtime behavior
        expect(validateTodoText(123)).toBe(false);
      });

      it('should handle object input gracefully', () => {
        // @ts-ignore - Testing runtime behavior
        expect(validateTodoText({})).toBe(false);
      });
    });
  });

  describe('cn (className utility)', () => {
    describe('Happy Path', () => {
      it('should merge class names correctly', () => {
        const result = cn('class1', 'class2');
        expect(result).toBe('class1 class2');
      });

      it('should handle conditional classes', () => {
        const result = cn('base', true && 'conditional', false && 'excluded');
        expect(result).toBe('base conditional');
      });
    });

    describe('Input Verification', () => {
      it('should handle empty inputs', () => {
        expect(cn()).toBe('');
        expect(cn('')).toBe('');
        expect(cn('', '')).toBe('');
      });

      it('should handle undefined and null', () => {
        expect(cn(undefined, null, 'valid')).toBe('valid');
      });

      it('should handle array of classes', () => {
        expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
      });
    });

    describe('Branching', () => {
      it('should handle mixed types correctly', () => {
        const result = cn(
          'base',
          { active: true, disabled: false },
          ['array1', 'array2'],
          undefined,
          null,
          'end'
        );
        expect(result).toContain('base');
        expect(result).toContain('active');
        expect(result).toContain('array1');
        expect(result).toContain('array2');
        expect(result).toContain('end');
        expect(result).not.toContain('disabled');
      });

      it('should handle Tailwind merge conflicts', () => {
        // This tests the twMerge functionality
        const result = cn('p-4', 'p-2');
        expect(result).toBe('p-2'); // Should merge and use the last one
      });
    });
  });
});