// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (!p.startsWith('/admin')) return NextResponse.next();

  // Si quieres dejar libre en local, descomenta:
  // if (process.env.NODE_ENV === 'development') return NextResponse.next();

  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');

  // Si no mandan credenciales -> pedirlas
  if (scheme !== 'Basic' || !encoded) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="VibeTech Admin"' },
    });
  }

  // Edge runtime: usar atob en vez de Buffer
  let user = '', pass = '';
  try {
    const decoded = atob(encoded); // "user:pass"
    const idx = decoded.indexOf(':');
    user = decoded.slice(0, idx);
    pass = decoded.slice(idx + 1);
  } catch {
    return new Response('Invalid auth', { status: 400 });
  }

  const ok =
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS;

  if (!ok) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="VibeTech Admin"' },
    });
  }

  return NextResponse.next();
}

// El middleware siempre corre en Edge; no uses APIs de Node aquí.
export const config = { matcher: ['/admin/:path*'] };
