import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/payouts
 * Get payouts/settlements list (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [settlements, total] = await Promise.all([
      prisma.settlement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
              tier: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.settlement.count({ where }),
    ]);

    const formattedSettlements = settlements.map((s) => ({
      id: s.id,
      vendorId: s.vendorId,
      vendorName: s.vendor.name,
      vendorEmail: s.vendor.user.email,
      period: s.period,
      amount: Number(s.amount),
      commission: Number(s.commission),
      netAmount: Number(s.amount) - Number(s.commission),
      status: s.status,
      paidAt: s.paidAt,
      createdAt: s.createdAt,
    }));

    return NextResponse.json(
      buildPaginationResponse(formattedSettlements, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin payouts error:', error);
    return errorResponse('Failed to fetch payouts', 500);
  }
});
