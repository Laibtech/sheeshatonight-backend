import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * POST /api/vendor/apply
 * Apply to become a vendor
 * Requires authentication
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has a vendor profile
    const existingVendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: 'You already have a vendor profile' },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { name, description, phone, tradeLicense, location } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const slugExists = await prisma.vendor.findUnique({
      where: { slug },
    });

    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

    // Create vendor profile (inactive by default, pending admin approval)
    const vendor = await prisma.vendor.create({
      data: {
        userId,
        name,
        slug: finalSlug,
        description: description || null,
        phone,
        tradeLicense: tradeLicense || null,
        location: location || null,
        isActive: false, // Requires admin approval
        tier: 'SOLO', // Default tier
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Create trade license document if provided
    if (tradeLicense) {
      await prisma.vendorDocument.create({
        data: {
          vendorId: vendor.id,
          type: 'TRADE_LICENSE',
          url: tradeLicense,
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Vendor application submitted successfully. Pending admin approval.',
        data: {
          id: vendor.id,
          name: vendor.name,
          slug: vendor.slug,
          isActive: vendor.isActive,
          createdAt: vendor.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Vendor application error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit vendor application' },
      { status: 500 }
    );
  }
});
