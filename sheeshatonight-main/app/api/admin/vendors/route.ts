import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import { VendorTier } from '@prisma/client';

export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, pageSize } = getPaginationParams(searchParams);
    const tier = searchParams.get('tier');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (tier && tier !== 'ALL') where.tier = tier as VendorTier;
    if (isActive !== null && isActive !== undefined && isActive !== 'ALL') {
      where.isActive = isActive === 'true';
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { user: { email: { contains: search } } },
        { user: { name: { contains: search } } },
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
          orders: {
            select: {
              id: true,
              totalAmount: true,
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

    const formattedVendors = vendors.map((v) => {
      const revenue = v.orders.reduce(
        (sum, ord) => (ord.status !== 'CANCELLED' ? sum + Number(ord.totalAmount) : sum),
        0
      );

      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        tier: v.tier,
        isActive: v.isActive,
        planExpiry: v.planExpiry,
        location: v.location,
        phone: v.phone || v.user?.phone,
        createdAt: v.createdAt,
        user: v.user,
        productsCount: v._count.products,
        ordersCount: v._count.orders,
        revenue: Math.round(revenue * 100) / 100,
      };
    });

    return NextResponse.json(buildPaginationResponse(formattedVendors, total, page, pageSize));
  } catch (error) {
    console.error('Admin vendors GET error:', error);
    return errorResponse('Failed to fetch vendors', 500);
  }
});
