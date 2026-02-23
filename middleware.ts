import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function buildCsp(): string {
  const isDev = process.env.NODE_ENV === 'development';

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': isDev
      ? ["'self'", "'unsafe-eval'"]
      : ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': [
      "'self'",
      'https://horizon-testnet.stellar.org',
      'https://soroban-testnet.stellar.org',
      'https://horizon.stellar.org',
      'https://soroban-rpc.stellar.org',
    ],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };

  if (typeof WebAssembly !== 'undefined') {
    directives['script-src'].push("'wasm-unsafe-eval'");
  }

  if (!isDev) {
    directives['report-uri'] = ['/api/csp-report'];
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const csp = buildCsp();

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '0');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
