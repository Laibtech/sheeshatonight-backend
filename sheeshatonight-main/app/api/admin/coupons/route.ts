import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';

/**
 * GET /api/admin/coupons
 * List all coupons from the real Coupon table
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = coupons.map((c) => ({
      ...c,
      discountValue: Number(c.discountValue),
      minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
      maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
    }));

    return successResponse({ coupons: formatted });
  } catch (error) {
    console.error('Get coupons error:', error);
    return errorResponse('Failed to fetch coupons', 500);
  }
});

/**
 * POST /api/admin/coupons
 * Create a new coupon
 */
export const POST = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const {
      code,
      discountType = 'PERCENTAGE',
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      startDate,
      expiryDate,
      isActive = true,
    } = body;

    if (!code || discountValue === undefined) {
      return errorResponse('Coupon code and discount value are required', 400);
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: Boolean(isActive),
      },
    });

    return successResponse({
      coupon: {
        ...coupon,
        discountValue: Number(coupon.discountValue),
      },
    }, 'Coupon created successfully', 201);
  } catch (error: any) {
    console.error('Create coupon error:', error);
    if (error.code === 'P2002') {
      return errorResponse('A coupon with this code already exists', 409);
    }
    return errorResponse(error.message || 'Failed to create coupon', 500);
  }
});
