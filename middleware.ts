import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (!p.startsWith('/admin')) return NextResponse.next();

  // Uncomment to allow bypass in local dev
  // if (process.env.NODE_ENV === 'development') return NextResponse.next();

  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="VibeTech Admin"' },
    });
  }

  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
  const ok = user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
  if (!ok) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="VibeTech Admin"' },
    });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
