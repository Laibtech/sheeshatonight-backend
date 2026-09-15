import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';

/**
 * GET /api/admin/reviews
 * Moderation queue for reviews (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Populate user and product/vendor info
    const enriched = await Promise.all(
      reviews.map(async (rev) => {
        const [user, product, vendor] = await Promise.all([
          prisma.user.findUnique({
            where: { id: rev.userId },
            select: { name: true, email: true },
          }),
          rev.productId
            ? prisma.product.findUnique({
                where: { id: rev.productId },
                select: { title: true },
              })
            : null,
          rev.vendorId
            ? prisma.vendor.findUnique({
                where: { id: rev.vendorId },
                select: { name: true },
              })
            : null,
        ]);

        return {
          ...rev,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || '',
          productTitle: product?.title || null,
          vendorName: vendor?.name || null,
        };
      })
    );

    return successResponse({ reviews: enriched });
  } catch (error) {
    console.error('Get admin reviews error:', error);
    return errorResponse('Failed to fetch reviews', 500);
  }
});
