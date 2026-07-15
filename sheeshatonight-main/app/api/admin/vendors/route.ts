import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, pageSize } = getPaginationParams(searchParams);
    const tier = searchParams.get('tier');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: any = {};
    if (tier) where.tier = tier;
    if (isActive !== null) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          isActive: true,
          planExpiry: true,
          location: true,
          phone: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              kycStatus: true,
              status: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      }),
      prisma.vendor.count({ where }),
    ]);

    return successResponse(buildPaginationResponse(vendors, total, page, pageSize));
  } catch (error) {
    console.error('Admin vendors GET error:', error);
    return errorResponse('Failed to fetch vendors', 500);
  }
});
