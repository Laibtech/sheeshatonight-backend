import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/customers
 * List customers with order count and total spending (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status')?.trim();

    const where: any = {
      role: 'CUSTOMER',
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          verified: true,
          kycStatus: true,
          createdAt: true,
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
            },
          },
          _count: {
            select: {
              orders: true,
              wishlistItems: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const formattedCustomers = users.map((u) => {
      const totalSpent = u.orders.reduce(
        (sum, ord) => (ord.status !== 'CANCELLED' ? sum + Number(ord.totalAmount) : sum),
        0
      );

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        status: u.status,
        verified: u.verified,
        kycStatus: u.kycStatus,
        createdAt: u.createdAt,
        ordersCount: u._count.orders,
        wishlistCount: u._count.wishlistItems,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });

    return NextResponse.json(
      buildPaginationResponse(formattedCustomers, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin customers error:', error);
    return errorResponse('Failed to fetch customers', 500);
  }
});
