import { NextResponse } from 'next/server';
import { withAuth, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { createAddressSchema, updateAddressSchema } from '@/lib/validation';

/**
 * GET /api/users/me/addresses
 * Get user's addresses
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(
      successResponse(addresses, 'Addresses retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get addresses error:', error);
    return errorResponse('Failed to retrieve addresses', 500);
  }
});

/**
 * POST /api/users/me/addresses
 * Create new address
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    const body = await req.json();
    const validation = createAddressSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR',
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    // If this is set as default, unset other defaults
    if (validation.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        ...validation.data,
      },
    });

    return NextResponse.json(
      successResponse(address, 'Address created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create address error:', error);
    return errorResponse('Failed to create address', 500);
  }
});
