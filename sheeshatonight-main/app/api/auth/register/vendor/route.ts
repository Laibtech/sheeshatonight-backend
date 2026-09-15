import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/middleware';

/**
 * POST /api/auth/register/vendor
 * Register a new vendor (creates both User and Vendor profile)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // User fields
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      // Vendor fields
      businessName,
      businessType,
      region,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All personal fields are required' },
        { status: 400 }
      );
    }

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // Create user and vendor profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with VENDOR role
      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone: phone || null,
          password: hashedPassword,
          role: 'VENDOR',
          status: 'ACTIVE',
          verified: false, // Will be verified after KYC
        },
      });

      // Generate slug from business name
      const slug = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug exists
      const slugExists = await tx.vendor.findUnique({
        where: { slug },
      });

      const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

      // Create vendor profile
      const vendor = await tx.vendor.create({
        data: {
          userId: user.id,
          name: businessName,
          slug: finalSlug,
          description: businessType ? `${businessType} business` : null,
          phone: phone || null,
          location: region || null,
          isActive: false, // Requires admin approval
          tier: 'SOLO', // Default tier
        },
      });

      return { user, vendor };
    });

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      vendorId: result.vendor.id,
    });

    // Create response and set auth cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Vendor registration successful! Your account is pending approval.',
        token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        vendor: {
          id: result.vendor.id,
          name: result.vendor.name,
          slug: result.vendor.slug,
          isActive: result.vendor.isActive,
        },
      },
      { status: 201 }
    );

    return setAuthCookie(token, response, result.user.role);
  } catch (error: any) {
    console.error('Vendor registration error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Vendor registration failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
