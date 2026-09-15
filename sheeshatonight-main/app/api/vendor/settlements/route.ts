import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import type { SettlementStatus } from '@prisma/client';

/**
 * GET /api/vendor/settlements
 * Get vendor settlement history, orders breakdown, and earnings
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;
    const { searchParams } = new URL(req.url);
    const { skip, take, page, pageSize } = getPaginationParams(searchParams);

    const status = searchParams.get('status');
    const period = searchParams.get('period');

    const where: any = { vendorId };
    if (status && status !== 'ALL') {
      where.status = status as SettlementStatus;
    }
    if (period) {
      where.period = period;
    }

    // Fetch settlements and all vendor orders concurrently
    const [settlements, total, allOrders] = await Promise.all([
      prisma.settlement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.settlement.count({ where }),
      prisma.order.findMany({
        where: { vendorId },
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          platformFee: true,
          vendorNet: true,
          commissionRate: true,
          status: true,
          payoutStatus: true,
          createdAt: true,
        },
      }),
    ]);

    // Live order-based financial calculations
    let grossRevenue = 0;
    let totalCommission = 0;
    let netEarnings = 0;
    let availableBalance = 0;
    let pendingSettlement = 0;
    let paidTotal = 0;

    for (const ord of allOrders) {
      const gross = Number(ord.totalAmount || 0);
      const fee = Number(ord.platformFee || 0);
      const net = Number(ord.vendorNet || (gross - fee));

      grossRevenue += gross;
      totalCommission += fee;
      netEarnings += net;

      if (ord.payoutStatus === 'ELIGIBLE') {
        availableBalance += net;
      } else if (ord.payoutStatus === 'PENDING') {
        pendingSettlement += net;
      } else if (ord.payoutStatus === 'PAID') {
        paidTotal += net;
      }
    }

    // Also include completed settlements in paidTotal if not already counted
    const paidSettlementsTotal = settlements
      .filter((s) => s.status === 'PAID')
      .reduce((sum, s) => sum + (Number(s.amount) - Number(s.commission)), 0);

    if (paidSettlementsTotal > paidTotal) {
      paidTotal = paidSettlementsTotal;
    }

    const formattedSettlements = settlements.map((s) => {
      const amt = Number(s.amount);
      const comm = Number(s.commission);
      return {
        id: s.id,
        period: s.period,
        amount: amt,
        commission: comm,
        netAmount: Math.round((amt - comm) * 100) / 100,
        status: s.status,
        paidAt: s.paidAt,
        createdAt: s.createdAt,
      };
    });

    return successResponse({
      settlements: formattedSettlements,
      summary: {
        grossRevenue: Math.round(grossRevenue * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        netEarnings: Math.round(netEarnings * 100) / 100,
        availableBalance: Math.round(availableBalance * 100) / 100,
        pendingSettlement: Math.round(pendingSettlement * 100) / 100,
        paidTotal: Math.round(paidTotal * 100) / 100,
        totalOrders: allOrders.length,
      },
      pagination: buildPaginationResponse(settlements, total, page, pageSize).pagination,
    });
  } catch (error) {
    console.error('Vendor settlements GET error:', error);
    return errorResponse('Failed to fetch settlements', 500);
  }
});

/**
 * POST /api/vendor/settlements
 * Request settlement payout for eligible delivered orders
 */
export const POST = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;

    // Find all orders eligible for payout
    const eligibleOrders = await prisma.order.findMany({
      where: {
        vendorId,
        payoutStatus: 'ELIGIBLE',
      },
      select: {
        id: true,
        totalAmount: true,
        platformFee: true,
        vendorNet: true,
      },
    });

    if (!eligibleOrders || eligibleOrders.length === 0) {
      return errorResponse('No eligible earnings available for settlement request', 400);
    }

    let totalGross = 0;
    let totalFee = 0;
    let totalNet = 0;

    for (const ord of eligibleOrders) {
      const gross = Number(ord.totalAmount || 0);
      const fee = Number(ord.platformFee || 0);
      const net = Number(ord.vendorNet || (gross - fee));
      totalGross += gross;
      totalFee += fee;
      totalNet += net;
    }

    if (totalNet <= 0) {
      return errorResponse('Eligible net payout balance must be greater than zero', 400);
    }

    const now = new Date();
    const periodStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Perform settlement creation and mark orders within an atomic transaction
    const settlement = await prisma.$transaction(async (tx) => {
      const createdSettlement = await tx.settlement.create({
        data: {
          vendorId,
          period: periodStr,
          amount: totalGross,
          commission: totalFee,
          status: 'PENDING',
        },
      });

      // Mark the eligible orders as PAID / SETTLED
      await tx.order.updateMany({
        where: {
          id: { in: eligibleOrders.map((o) => o.id) },
        },
        data: {
          payoutStatus: 'PAID',
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: req.user!.userId,
          type: 'SETTLEMENT_REQUEST',
          title: 'Settlement Payout Requested',
          message: `Payout request of AED ${totalNet.toFixed(2)} submitted for review.`,
        },
      });

      return createdSettlement;
    });

    return successResponse(
      {
        settlement: {
          ...settlement,
          amount: Number(settlement.amount),
          commission: Number(settlement.commission),
          netAmount: totalNet,
        },
        requestedAmount: totalNet,
        orderCount: eligibleOrders.length,
      },
      'Settlement payout request submitted successfully',
      201
    );
  } catch (error: any) {
    console.error('Vendor request settlement error:', error);
    return errorResponse(error.message || 'Failed to submit settlement request', 500);
  }
});
