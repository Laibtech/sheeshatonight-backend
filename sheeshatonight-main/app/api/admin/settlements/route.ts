import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import { SettlementStatus } from '@prisma/client';

/**
 * GET /api/admin/settlements
 * List settlements from the real Settlement table (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status as SettlementStatus;
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
            },
          },
        },
      }),
      prisma.settlement.count({ where }),
    ]);

    const formatted = settlements.map((s) => ({
      ...s,
      amount: Number(s.amount),
      commission: Number(s.commission),
      netAmount: Math.round((Number(s.amount) - Number(s.commission)) * 100) / 100,
    }));

    return NextResponse.json(
      buildPaginationResponse(formatted, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get settlements error:', error);
    return errorResponse('Failed to fetch settlements', 500);
  }
});

/**
 * POST /api/admin/settlements
 * Create a new settlement record
 */
export const POST = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { vendorId, period, amount, commission, status = 'PENDING' } = body;

    if (!vendorId || !period || amount === undefined || commission === undefined) {
      return errorResponse('vendorId, period, amount, and commission are required', 400);
    }

    const settlement = await prisma.settlement.create({
      data: {
        vendorId,
        period,
        amount: Number(amount),
        commission: Number(commission),
        status: status as SettlementStatus,
        ...(status === 'PAID' ? { paidAt: new Date() } : {}),
      },
    });

    return successResponse({
      settlement: {
        ...settlement,
        amount: Number(settlement.amount),
        commission: Number(settlement.commission),
      },
    }, 'Settlement created successfully', 201);
  } catch (error: any) {
    console.error('Create settlement error:', error);
    return errorResponse(error.message || 'Failed to create settlement', 500);
  }
});
