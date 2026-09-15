import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';

/**
 * GET /api/admin/finance
 * Returns real marketplace financials, platform commission settings, vendor totals, and reconciliation feed
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    // 1. Fetch platform commission setting
    let platformSetting = await prisma.platformSetting.findUnique({
      where: { key: 'platform_commission' },
    });

    if (!platformSetting) {
      platformSetting = await prisma.platformSetting.create({
        data: {
          key: 'platform_commission',
          commissionType: 'PERCENTAGE',
          commissionValue: 10.00,
          fixedFee: 0.00,
          description: 'Global marketplace default commission',
        },
      });
    }

    // 2. Query all orders for global finance calculations
    const [allOrders, recentOrders, settlements, vendors] = await Promise.all([
      prisma.order.findMany({
        select: {
          id: true,
          totalAmount: true,
          platformFee: true,
          vendorNet: true,
          commissionRate: true,
          status: true,
          payoutStatus: true,
          vendorId: true,
        },
      }),
      prisma.order.findMany({
        take: 12,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.settlement.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.vendor.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          commissionRate: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Financial aggregates
    let totalGmv = 0;
    let totalPlatformRevenue = 0;
    let totalVendorPayable = 0;
    let eligiblePayouts = 0;
    let pendingClearance = 0;
    let paidPayouts = 0;

    const vendorMap: Record<string, {
      id: string;
      name: string;
      slug: string;
      orderCount: number;
      grossSales: number;
      platformCommission: number;
      netEarnings: number;
      eligiblePayout: number;
      customRate: number | null;
    }> = {};

    vendors.forEach((v) => {
      vendorMap[v.id] = {
        id: v.id,
        name: v.name,
        slug: v.slug,
        orderCount: 0,
        grossSales: 0,
        platformCommission: 0,
        netEarnings: 0,
        eligiblePayout: 0,
        customRate: v.commissionRate ? Number(v.commissionRate) : null,
      };
    });

    for (const ord of allOrders) {
      const gross = Number(ord.totalAmount || 0);
      const fee = Number(ord.platformFee || 0);
      const net = Number(ord.vendorNet || (gross - fee));

      totalGmv += gross;
      totalPlatformRevenue += fee;
      totalVendorPayable += net;

      if (ord.payoutStatus === 'ELIGIBLE') {
        eligiblePayouts += net;
      } else if (ord.payoutStatus === 'PENDING') {
        pendingClearance += net;
      } else if (ord.payoutStatus === 'PAID') {
        paidPayouts += net;
      }

      if (ord.vendorId) {
        const vEntry = vendorMap[ord.vendorId];
        if (vEntry) {
          vEntry.orderCount += 1;
          vEntry.grossSales += gross;
          vEntry.platformCommission += fee;
          vEntry.netEarnings += net;
          if (ord.payoutStatus === 'ELIGIBLE') {
            vEntry.eligiblePayout += net;
          }
        }
      }
    }

    const vendorPerformance = Object.values(vendorMap).map((v) => ({
      ...v,
      grossSales: Math.round(v.grossSales * 100) / 100,
      platformCommission: Math.round(v.platformCommission * 100) / 100,
      netEarnings: Math.round(v.netEarnings * 100) / 100,
      eligiblePayout: Math.round(v.eligiblePayout * 100) / 100,
    }));

    const formattedRecentOrders = recentOrders.map((ord) => ({
      id: ord.id,
      orderNumber: ord.orderNumber,
      customer: ord.user?.name || 'Customer',
      customerEmail: ord.user?.email,
      vendor: ord.vendor?.name || 'Direct',
      vendorSlug: ord.vendor?.slug,
      totalAmount: Number(ord.totalAmount),
      platformFee: Number(ord.platformFee || 0),
      vendorNet: Number(ord.vendorNet || (Number(ord.totalAmount) - Number(ord.platformFee || 0))),
      commissionRate: Number(ord.commissionRate || 10),
      status: ord.status,
      payoutStatus: ord.payoutStatus,
      createdAt: ord.createdAt,
    }));

    const formattedSettlements = settlements.map((s) => ({
      id: s.id,
      vendorName: s.vendor?.name || 'Vendor',
      period: s.period,
      amount: Number(s.amount),
      commission: Number(s.commission),
      netAmount: Math.round((Number(s.amount) - Number(s.commission)) * 100) / 100,
      status: s.status,
      paidAt: s.paidAt,
      createdAt: s.createdAt,
    }));

    return successResponse({
      summary: {
        totalGmv: Math.round(totalGmv * 100) / 100,
        totalPlatformRevenue: Math.round(totalPlatformRevenue * 100) / 100,
        totalVendorPayable: Math.round(totalVendorPayable * 100) / 100,
        eligiblePayouts: Math.round(eligiblePayouts * 100) / 100,
        pendingClearance: Math.round(pendingClearance * 100) / 100,
        paidPayouts: Math.round(paidPayouts * 100) / 100,
        totalOrders: allOrders.length,
      },
      platformSetting: {
        id: platformSetting.id,
        key: platformSetting.key,
        commissionType: platformSetting.commissionType,
        commissionValue: Number(platformSetting.commissionValue),
        fixedFee: Number(platformSetting.fixedFee),
        description: platformSetting.description,
        updatedAt: platformSetting.updatedAt,
      },
      vendorPerformance,
      recentOrders: formattedRecentOrders,
      settlements: formattedSettlements,
    });
  } catch (error) {
    console.error('Admin finance GET error:', error);
    return errorResponse('Failed to fetch finance statistics', 500);
  }
});

/**
 * PATCH /api/admin/finance
 * Update platform commission rates & fees (Admin only)
 */
export const PATCH = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { commissionType, commissionValue, fixedFee, description } = body;

    if (commissionValue === undefined || commissionValue === null || Number(commissionValue) < 0) {
      return errorResponse('Valid commission value is required', 400);
    }

    const type = (commissionType || 'PERCENTAGE').toUpperCase();
    if (type !== 'PERCENTAGE' && type !== 'FIXED') {
      return errorResponse('commissionType must be PERCENTAGE or FIXED', 400);
    }

    const updated = await prisma.platformSetting.upsert({
      where: { key: 'platform_commission' },
      create: {
        key: 'platform_commission',
        commissionType: type,
        commissionValue: Number(commissionValue),
        fixedFee: Number(fixedFee || 0),
        description: description || 'Platform global commission rate',
      },
      update: {
        commissionType: type,
        commissionValue: Number(commissionValue),
        fixedFee: Number(fixedFee || 0),
        description: description || 'Platform global commission rate',
        updatedAt: new Date(),
      },
    });

    // Create Audit Log entry
    if (req.user?.userId) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'UPDATE_COMMISSION_SETTING',
          resourceType: 'PlatformSetting',
          resourceId: updated.id,
          afterState: JSON.stringify({
            commissionType: type,
            commissionValue: Number(commissionValue),
            fixedFee: Number(fixedFee || 0),
          }),
        },
      });
    }

    return successResponse({
      platformSetting: {
        id: updated.id,
        key: updated.key,
        commissionType: updated.commissionType,
        commissionValue: Number(updated.commissionValue),
        fixedFee: Number(updated.fixedFee),
        description: updated.description,
        updatedAt: updated.updatedAt,
      },
    }, 'Platform commission settings updated successfully');
  } catch (error: any) {
    console.error('Admin finance PATCH error:', error);
    return errorResponse(error.message || 'Failed to update commission settings', 500);
  }
});
