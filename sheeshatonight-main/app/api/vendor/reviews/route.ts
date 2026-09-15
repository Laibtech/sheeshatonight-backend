import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/vendor/reviews
 * Get all reviews for vendor's products
 * Uses EXISTING Review table
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;
    const { searchParams } = new URL(req.url);
    const { skip, take, page, pageSize } = getPaginationParams(searchParams);
    
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build where clause
    const where: any = {
      OR: [
        { vendorId }, // Direct vendor reviews
        {
          product: {
            vendorId, // Reviews on vendor's products
          },
        },
      ],
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    // Fetch reviews with user and product details
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc',
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Enrich with user and product data
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const [user, product] = await Promise.all([
          prisma.user.findUnique({
            where: { id: review.userId },
            select: {
              name: true,
              email: true,
            },
          }),
          review.productId
            ? prisma.product.findUnique({
                where: { id: review.productId },
                select: {
                  title: true,
                  images: true,
                  type: true,
                },
              })
            : null,
        ]);

        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          createdAt: review.createdAt,
          user: {
            name: user?.name || 'Anonymous',
            email: user?.email || '',
          },
          product: product
            ? {
                id: review.productId,
                title: product.title,
                image: product.images ? (product.images as any)[0] : null,
                type: product.type,
              }
            : null,
          isVendorReview: review.vendorId === vendorId,
        };
      })
    );

    // Calculate summary statistics
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return successResponse({
      reviews: enrichedReviews,
      summary: {
        total,
        averageRating: Math.round(avgRating * 10) / 10,
        ratingDistribution,
      },
      pagination: buildPaginationResponse(enrichedReviews, total, page, pageSize).pagination,
    });
  } catch (error) {
    console.error('Vendor reviews GET error:', error);
    return errorResponse('Failed to fetch reviews', 500);
  }
});
