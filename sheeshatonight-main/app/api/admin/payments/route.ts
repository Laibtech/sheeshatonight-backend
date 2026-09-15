import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/payments
 * Get payment and invoice records from real database (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take,
        orderBy: { issuedAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              currency: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              vendor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.invoice.count(),
    ]);

    const formattedInvoices = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      orderId: inv.orderId,
      orderNumber: inv.order.orderNumber,
      customerName: inv.order.user.name,
      customerEmail: inv.order.user.email,
      vendorName: inv.order.vendor.name,
      subtotal: Number(inv.subtotal),
      tax: Number(inv.tax),
      total: Number(inv.total),
      currency: inv.order.currency || 'AED',
      status: inv.order.status,
      issuedAt: inv.issuedAt,
    }));

    return NextResponse.json(
      buildPaginationResponse(formattedInvoices, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin payments error:', error);
    return errorResponse('Failed to fetch payments', 500);
  }
});
