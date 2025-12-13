import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';

// Security headers configuration
export const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',

  // HSTS (uncomment for production with HTTPS)
  // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Add security headers to response
export function addSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

// CSRF Token generation and validation
const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export interface CSRFToken {
  token: string;
  expiresAt: number;
}

export function generateCSRFToken(): CSRFToken {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY;
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${token}:${expiresAt}`)
    .digest('hex');

  return {
    token: `${token}:${expiresAt}:${signature}`,
    expiresAt,
  };
}

export function validateCSRFToken(token: string): boolean {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;

    const [tokenValue, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check if token is expired
    if (Date.now() > expiresAt) return false;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', CSRF_SECRET)
      .update(`${tokenValue}:${expiresAt}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove potential script injections
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다.');
  }
  if (password.length > 128) {
    errors.push('비밀번호는 128자 이하여야 합니다.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Check for common weak passwords
const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'password1', '111111', '123123', 'admin', 'letmein',
  'welcome', 'monkey', 'dragon', 'master', 'qwerty123',
]);

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase());
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Hash sensitive data for logging
export function hashForLogging(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
}

// Middleware to check for suspicious patterns
export function detectSuspiciousRequest(request: NextRequest): boolean {
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';

  // Check for SQL injection patterns
  const sqlInjectionPatterns = [
    /(\b(select|insert|update|delete|drop|union|exec|execute)\b)/i,
    /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
    /(--|\*\/|\/\*)/,
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(url)) {
      return true;
    }
  }

  // Check for path traversal
  if (/\.\.[/\\]/.test(url)) {
    return true;
  }

  // Check for common scanner/bot user agents
  const suspiciousAgents = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /arachni/i,
    /burp/i,
    /zap/i,
    /havij/i,
  ];

  for (const pattern of suspiciousAgents) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

// Content Security Policy
export function getCSPHeader(): string {
  const policies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.google-analytics.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ];

  return policies.join('; ');
}
