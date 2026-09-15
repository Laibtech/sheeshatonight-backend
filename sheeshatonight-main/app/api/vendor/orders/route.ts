import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import type { OrderStatus, PayoutStatus } from '@prisma/client';

/**
 * GET /api/vendor/orders
 * Get all orders strictly belonging to the authenticated vendor
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return errorResponse('Vendor profile not found', 403);
    }

    const { searchParams } = new URL(req.url);
    const { skip, take, page, pageSize } = getPaginationParams(searchParams);
    const status = searchParams.get('status');
    const payoutStatus = searchParams.get('payoutStatus');
    const sort = searchParams.get('sort') || '-createdAt';

    const search = searchParams.get('search')?.trim();

    // Strict vendor isolation: query orders assigned to this vendor
    const where: any = {
      vendorId,
    };

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status.toUpperCase();
    }

    if (payoutStatus && payoutStatus !== 'ALL') {
      where.payoutStatus = payoutStatus.toUpperCase();
    }

    const [orders, total, allVendorOrders] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              addresses: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  images: true,
                  type: true,
                },
              },
            },
          },
          invoice: {
            select: {
              invoiceNumber: true,
              total: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
      prisma.order.findMany({
        where: { vendorId },
        select: {
          totalAmount: true,
          platformFee: true,
          vendorNet: true,
          status: true,
          payoutStatus: true,
        },
      }),
    ]);

    const formattedOrders = orders.map((order) => {
      const gross = Number(order.totalAmount || 0);
      const fee = Number(order.platformFee || 0);
      const net = Number(order.vendorNet || (gross - fee));
      const rate = Number(order.commissionRate || 10);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        payoutStatus: order.payoutStatus,
        totalAmount: gross,
        subtotal: Number(order.subtotal || gross),
        platformFee: fee,
        vendorNet: net,
        commissionRate: rate,
        currency: order.currency || 'AED',
        createdAt: order.createdAt,
        user: order.user,
        customerName: order.user?.name || 'Customer',
        customerEmail: order.user?.email,
        customerPhone: order.user?.phone,
        items: order.items,
        invoiceNumber: order.invoice?.invoiceNumber,
      };
    });

    const summary = allVendorOrders.reduce(
      (acc, ord) => {
        const gross = Number(ord.totalAmount || 0);
        const fee = Number(ord.platformFee || 0);
        const net = Number(ord.vendorNet || (gross - fee));
        acc.grossSales += gross;
        acc.platformFees += fee;
        acc.netEarnings += net;
        if (ord.payoutStatus === 'ELIGIBLE') acc.eligiblePayout += net;
        if (ord.payoutStatus === 'PENDING') acc.pendingPayout += net;
        if (ord.payoutStatus === 'PAID') acc.paidPayout += net;
        return acc;
      },
      {
        grossSales: 0,
        platformFees: 0,
        netEarnings: 0,
        eligiblePayout: 0,
        pendingPayout: 0,
        paidPayout: 0,
        totalOrders: allVendorOrders.length,
      }
    );

    const paginationResponse = buildPaginationResponse(formattedOrders, total, page, pageSize);
    return successResponse({
      ...paginationResponse,
      summary,
    });
  } catch (error) {
    console.error('Vendor orders GET error:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
});

/**
 * POST /api/vendor/orders
 * Update order status for vendor's order (Vendor only)
 */
export const POST = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return errorResponse('Vendor profile not found', 403);
    }

    const body = await req.json();
    const { orderId, status, notes } = body;

    if (!orderId || !status) {
      return errorResponse('Order ID and status are required', 400, 'VALIDATION_ERROR');
    }

    // Verify order belongs strictly to this vendor
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        vendorId,
      },
    });

    if (!order) {
      return errorResponse('Order not found or unauthorized', 404, 'NOT_FOUND');
    }

    const targetStatus = status.toUpperCase() as OrderStatus;

    // Determine payout status transition based on order status
    let targetPayoutStatus: PayoutStatus = order.payoutStatus;
    if (targetStatus === 'DELIVERED' || targetStatus === 'COMPLETED') {
      if (order.payoutStatus === 'PENDING') {
        targetPayoutStatus = 'ELIGIBLE';
      }
    } else if (targetStatus === 'CANCELLED') {
      targetPayoutStatus = 'FAILED';
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: targetStatus,
        payoutStatus: targetPayoutStatus,
        ...(notes && { notes }),
        ...(targetStatus === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(targetStatus === 'CANCELLED' && { cancelledAt: new Date() }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return successResponse(updatedOrder, 'Order status updated successfully');
  } catch (error) {
    console.error('Vendor orders POST error:', error);
    return errorResponse('Failed to update order', 500);
  }
});
