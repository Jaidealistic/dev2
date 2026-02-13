// turbo
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

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
    '/register'
  ],
};
