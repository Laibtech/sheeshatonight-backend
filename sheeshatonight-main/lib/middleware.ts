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

/**
 * Middleware to check authentication
 */
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    try {
      const authHeader = req.headers.get('Authorization');
      const token = extractToken(authHeader || '');

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
      return handler(req);
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
export function withAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin role required' },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

/**
 * Middleware to check if user is admin or staff
 */
export function withAdminOrStaff(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Forbidden: Admin or Staff role required' },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

/**
 * Middleware to check if user is vendor
 */
export function withVendor(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'Forbidden: Vendor role required' },
        { status: 403 }
      );
    }
    return handler(req);
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
export function setAuthCookie(token: string, response: NextResponse) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
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
  return response;
}
