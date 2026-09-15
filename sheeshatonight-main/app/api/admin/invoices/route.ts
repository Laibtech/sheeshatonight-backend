import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/invoices
 * List invoices from the real Invoice table (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { order: { orderNumber: { contains: search } } },
        { order: { user: { name: { contains: search } } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take,
        orderBy: { issuedAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    const formatted = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      orderId: inv.orderId,
      orderNumber: inv.order.orderNumber,
      orderStatus: inv.order.status,
      customerName: inv.order.user.name,
      customerEmail: inv.order.user.email,
      subtotal: Number(inv.subtotal),
      tax: Number(inv.tax),
      total: Number(inv.total),
      issuedAt: inv.issuedAt,
      pdfUrl: inv.pdfUrl,
    }));

    return NextResponse.json(
      buildPaginationResponse(formatted, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get invoices error:', error);
    return errorResponse('Failed to fetch invoices', 500);
  }
});
