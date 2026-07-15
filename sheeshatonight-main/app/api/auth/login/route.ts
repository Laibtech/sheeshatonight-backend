import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, validateLoginInput } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/middleware';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    const validation = validateLoginInput({ email, password });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    let vendorId: string | undefined;
    if (user.role === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      vendorId = vendor?.id;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      vendorId,
    });

    // Create response and set auth cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    return setAuthCookie(token, response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
