import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it'
);

export async function middleware(req: NextRequest) {
  let token: any = null;
  const authHeader = req.headers.get('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const tokenValue = authHeader.split(' ')[1];
      const { payload } = await jwtVerify(tokenValue, SECRET_KEY);
      token = payload;
    } catch (err) {
      console.error('Middleware JWT Verify Error:', err);
    }
  }

  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  // API Protection
  if (req.nextUrl.pathname.startsWith('/api')) {
    // Debug route immediate return
    if (req.nextUrl.pathname === '/api/debug') {
      return NextResponse.next();
    }

    // Exclude auth routes
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Check auth
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin protection for API
    if (req.nextUrl.pathname.startsWith('/api/admin') && token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return null;
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // Role-based protection
  if (req.nextUrl.pathname.startsWith('/educator') && token?.role !== 'EDUCATOR') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/homeschool') && token?.role !== 'PARENT_EDUCATOR') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/educator/:path*',
    '/homeschool/:path*',
    '/login',
    '/register',
    '/api/:path*'
  ],
};
