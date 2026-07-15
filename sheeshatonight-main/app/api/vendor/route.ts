import { NextResponse } from 'next/server';
import { withAuth, withAdmin, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { createVendorSchema, updateVendorProfileSchema } from '@/lib/validation';
import { getPaginationParams, buildPaginationResponse, generateSlug } from '@/lib/utils';

/**
 * GET /api/vendor
 * Get list of vendors or current vendor profile
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    // If admin, return all vendors list
    if (req.user?.role === 'ADMIN') {
      const { page, pageSize, skip, take } = getPaginationParams(searchParams);
      const search = searchParams.get('search');
      const tier = searchParams.get('tier');
      const isActive = searchParams.get('isActive');

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (tier && ['SOLO', 'MASTER', 'ADVANCED'].includes(tier)) {
        where.tier = tier;
      }
      if (isActive !== null) {
        where.isActive = isActive === 'true';
      }

      const [vendors, total] = await Promise.all([
        prisma.vendor.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.vendor.count({ where }),
      ]);

      return NextResponse.json(
        buildPaginationResponse(vendors, total, page, pageSize),
        { status: 200 }
      );
    }

    // If vendor, return own profile
    if (req.user?.role === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.user?.userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              kycStatus: true,
            },
          },
          documents: {
            select: {
              id: true,
              type: true,
              status: true,
              url: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      });

      if (!vendor) {
        return errorResponse('Vendor profile not found', 404);
      }

      return NextResponse.json(
        successResponse(vendor, 'Vendor profile retrieved successfully'),
        { status: 200 }
      );
    }

    return errorResponse('Access denied', 403);
  } catch (error) {
    console.error('Get vendor error:', error);
    return errorResponse('Failed to retrieve vendor', 500);
  }
});

/**
 * POST /api/vendor
 * Create vendor profile (for existing user)
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    const body = await req.json();
    const validation = createVendorSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR',
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    // Check if user already has vendor profile
    const existingVendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      return errorResponse('Vendor profile already exists for this user', 409);
    }

    // Check if slug is unique
    const slug = generateSlug(validation.data.name);
    const existingSlug = await prisma.vendor.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return errorResponse('Vendor name already taken', 409);
    }

    // Update user role to VENDOR
    const vendor = await prisma.vendor.create({
      data: {
        userId,
        name: validation.data.name,
        slug,
        description: validation.data.description,
        location: validation.data.location,
        phone: validation.data.phone,
        tier: 'SOLO', // Default tier
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'VENDOR' },
    });

    return NextResponse.json(
      successResponse(vendor, 'Vendor profile created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vendor error:', error);
    return errorResponse('Failed to create vendor profile', 500);
  }
});

/**
 * PUT /api/vendor
 * Update vendor profile
 */
export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    if (req.user?.role !== 'VENDOR') {
      return errorResponse('Only vendors can update vendor profile', 403);
    }

    const body = await req.json();
    const validation = updateVendorProfileSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR',
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    const updateData: any = {};
    if (validation.data.name !== undefined) updateData.name = validation.data.name;
    if (validation.data.description !== undefined) updateData.description = validation.data.description;
    if (validation.data.location !== undefined) updateData.location = validation.data.location;
    if (validation.data.phone !== undefined) updateData.phone = validation.data.phone;

    const vendor = await prisma.vendor.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      successResponse(vendor, 'Vendor profile updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update vendor error:', error);
    return errorResponse('Failed to update vendor profile', 500);
  }
});
