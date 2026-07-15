import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token and role from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // Public routes that don't need authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/', '/about', '/contact'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If not logged in and trying to access protected route
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If logged in and trying to access auth pages, redirect to appropriate dashboard
  if (authToken && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
    const roleRoutes: Record<string, string> = {
      CUSTOMER: '/dashboard',
      VENDOR: '/vendor',
      ADMIN: '/admin',
    };
    const redirectPath = roleRoutes[userRole || 'CUSTOMER'] || '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Role-based access control
  if (authToken && userRole) {
    // Admin routes
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      const roleRoutes: Record<string, string> = {
        CUSTOMER: '/dashboard',
        VENDOR: '/vendor',
      };
      const redirectPath = roleRoutes[userRole] || '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Vendor routes
    if (pathname.startsWith('/vendor') && userRole !== 'VENDOR') {
      const roleRoutes: Record<string, string> = {
        CUSTOMER: '/dashboard',
        ADMIN: '/admin',
      };
      const redirectPath = roleRoutes[userRole] || '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Customer routes
    if (pathname.startsWith('/dashboard') && userRole !== 'CUSTOMER') {
      const roleRoutes: Record<string, string> = {
        VENDOR: '/vendor',
        ADMIN: '/admin',
      };
      const redirectPath = roleRoutes[userRole] || '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
};
