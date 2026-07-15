import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, validateRegisterInput } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/middleware';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword, role } = body;

    // Validate input
    const validation = validateRegisterInput({ name, email, password, confirmPassword });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with role (default to CUSTOMER if not provided)
    const userRole = role && ['CUSTOMER', 'VENDOR', 'ADMIN'].includes(role) ? role : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole as any,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response and set auth cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    return setAuthCookie(token, response);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
