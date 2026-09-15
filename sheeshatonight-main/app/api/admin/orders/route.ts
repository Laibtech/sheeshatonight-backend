import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/orders
 * Get orders list with search, status filter, and pagination (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status')?.trim();

    const payoutStatus = searchParams.get('payoutStatus')?.trim();

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { vendor: { name: { contains: search } } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (payoutStatus && payoutStatus !== 'ALL') {
      where.payoutStatus = payoutStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  images: true,
                },
              },
            },
          },
          tracking: true,
          invoice: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    const formattedOrders = orders.map((order) => {
      const gross = Number(order.totalAmount || 0);
      const fee = Number(order.platformFee || 0);
      const net = Number(order.vendorNet || (gross - fee));
      const commRate = Number(order.commissionRate || 10);

      return {
        ...order,
        totalAmount: gross,
        subtotal: Number(order.subtotal || gross),
        platformFee: fee,
        vendorNet: net,
        commissionRate: commRate,
        payoutStatus: order.payoutStatus || 'PENDING',
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      };
    });

    return NextResponse.json(
      buildPaginationResponse(formattedOrders, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin orders error:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
});
