import { NextResponse, type NextRequest } from 'next/server';
import {
  securityHeaders,
  detectSuspiciousRequest,
  getCSPHeader,
} from '@/lib/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Add CSP header
  response.headers.set('Content-Security-Policy', getCSPHeader());

  // Detect and block suspicious requests
  if (detectSuspiciousRequest(request)) {
    console.warn(`Suspicious request detected: ${request.url}`);

    // In production, you might want to:
    // - Log to security monitoring service
    // - Add IP to temporary block list
    // - Return 403 for severe cases

    // For now, just log and continue (could return 403 in production)
    // return new NextResponse('Forbidden', { status: 403 });
  }

  // Add request ID for tracking
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
