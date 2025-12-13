import {
  sanitizeInput,
  isValidEmail,
  validatePasswordStrength,
  isCommonPassword,
  generateSecureToken,
  generateCSRFToken,
  validateCSRFToken,
} from '@/lib/security';

describe('Security Library', () => {
  describe('sanitizeInput', () => {
    it('should remove null bytes', () => {
      const input = 'test\0string';
      expect(sanitizeInput(input)).toBe('teststring');
    });

    it('should escape HTML entities', () => {
      const input = '<script>alert("xss")</script>';
      expect(sanitizeInput(input)).not.toContain('<script>');
      expect(sanitizeInput(input)).toContain('&lt;script&gt;');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert(1)';
      expect(sanitizeInput(input)).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert(1)';
      expect(sanitizeInput(input)).not.toContain('onclick=');
    });

    it('should trim whitespace', () => {
      const input = '  test  ';
      expect(sanitizeInput(input)).toBe('test');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
      expect(sanitizeInput(123 as unknown as string)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
    });

    it('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePasswordStrength('Abc123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('비밀번호는 8자 이상이어야 합니다.');
    });

    it('should reject passwords longer than 128 characters', () => {
      const result = validatePasswordStrength('A'.repeat(129) + 'a1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('비밀번호는 128자 이하여야 합니다.');
    });

    it('should reject passwords without lowercase', () => {
      const result = validatePasswordStrength('ABCDEFG123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('소문자를 포함해야 합니다.');
    });

    it('should reject passwords without uppercase', () => {
      const result = validatePasswordStrength('abcdefg123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('대문자를 포함해야 합니다.');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePasswordStrength('Abcdefgh');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('숫자를 포함해야 합니다.');
    });

    it('should accept valid passwords', () => {
      const result = validatePasswordStrength('SecurePass123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('isCommonPassword', () => {
    it('should detect common passwords', () => {
      expect(isCommonPassword('password')).toBe(true);
      expect(isCommonPassword('123456')).toBe(true);
      expect(isCommonPassword('qwerty')).toBe(true);
      expect(isCommonPassword('admin')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isCommonPassword('PASSWORD')).toBe(true);
      expect(isCommonPassword('PassWord')).toBe(true);
    });

    it('should allow non-common passwords', () => {
      expect(isCommonPassword('MyUniqueP@ssw0rd!')).toBe(false);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate token of specified length', () => {
      const token16 = generateSecureToken(16);
      const token32 = generateSecureToken(32);
      expect(token16).toHaveLength(32); // hex encoding doubles length
      expect(token32).toHaveLength(64);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });

    it('should generate hex string', () => {
      const token = generateSecureToken();
      expect(token).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('CSRF Token', () => {
    it('should generate valid CSRF token', () => {
      const { token, expiresAt } = generateCSRFToken();
      expect(token).toBeTruthy();
      expect(token.split(':')).toHaveLength(3);
      expect(expiresAt).toBeGreaterThan(Date.now());
    });

    it('should validate valid CSRF token', () => {
      const { token } = generateCSRFToken();
      expect(validateCSRFToken(token)).toBe(true);
    });

    it('should reject invalid CSRF token', () => {
      expect(validateCSRFToken('invalid')).toBe(false);
      expect(validateCSRFToken('')).toBe(false);
      expect(validateCSRFToken('a:b')).toBe(false);
    });

    it('should reject tampered CSRF token', () => {
      const { token } = generateCSRFToken();
      const parts = token.split(':');
      parts[2] = 'tampered-signature';
      expect(validateCSRFToken(parts.join(':'))).toBe(false);
    });
  });
});
