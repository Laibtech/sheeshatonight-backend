import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/middleware';

/**
 * POST /api/auth/logout
 * Clear auth token and logout user
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    return clearAuthCookie(response);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/logout
 * Support GET logout for backward compatibility
 */
export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    return clearAuthCookie(response);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
