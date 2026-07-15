import { NextResponse } from 'next/server';
import { withAdmin, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role && ['CUSTOMER', 'VENDOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    if (status && ['ACTIVE', 'INACTIVE'].includes(status)) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          verified: true,
          kycStatus: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          vendor: {
            select: {
              id: true,
              name: true,
              tier: true,
            },
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      buildPaginationResponse(users, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin users error:', error);
    return errorResponse('Failed to fetch users', 500);
  }
});
