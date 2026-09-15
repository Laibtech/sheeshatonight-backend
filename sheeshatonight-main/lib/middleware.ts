import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    vendorId?: string;
    vendor?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  const tokenFromHeader = extractToken(authHeader || '');
  if (tokenFromHeader) return tokenFromHeader;

  const cookieToken = req.cookies.get('auth_token')?.value;
  if (cookieToken) return cookieToken;

  return null;
}

/**
 * Middleware to check authentication
 */
export function withAuth(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest, ...args: any[]) => {
    try {
      const token = getTokenFromRequest(req);

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized: No token provided' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid token' },
          { status: 401 }
        );
      }

      req.user = decoded;
      return handler(req, ...args);
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware to check if user is admin
 */
export function withAdmin(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest, ...args: any[]) => {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin role required' },
        { status: 403 }
      );
    }
    return handler(req, ...args);
  });
}

/**
 * Middleware to check if user is admin or staff
 */
export function withAdminOrStaff(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest, ...args: any[]) => {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Staff role required' },
        { status: 403 }
      );
    }
    return handler(req, ...args);
  });
}

/**
 * Middleware to check if user is vendor
 */
export function withVendor(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest, ...args: any[]) => {
    if (req.user?.role !== 'VENDOR' && req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Vendor role required' },
        { status: 403 }
      );
    }
    return handler(req, ...args);
  });
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: Record<string, any>
) {
  const responseBody: any = { error: message };

  if (code) {
    responseBody.code = code;
  }
  if (details) {
    responseBody.details = details;
  }

  return NextResponse.json(responseBody, { status });
}

/**
 * Success response helper
 */
export function successResponse(data: any, messageOrStatus: string | number = 200, status?: number) {
  let responseStatus = 200;
  let message: string | undefined;

  if (typeof messageOrStatus === 'number') {
    responseStatus = messageOrStatus;
  } else {
    message = messageOrStatus;
    responseStatus = status ?? 200;
  }

  const responseBody: any = {
    success: true,
    data,
  };

  if (message) {
    responseBody.message = message;
  }

  return NextResponse.json(responseBody, { status: responseStatus });
}

/**
 * Set auth cookie
 */
export function setAuthCookie(token: string, response: NextResponse, role?: string) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  
  // Also set user_role cookie for client-side routing
  if (role) {
    response.cookies.set('user_role', role, {
      httpOnly: false, // Allow JavaScript to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }
  
  return response;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  
  // Also clear user_role cookie
  response.cookies.set('user_role', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}
