import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';

/**
 * GET /api/admin/reports
 * Get real database analytics & reports (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || '30Days';

    let startDate = new Date();
    if (timeframe === '7Days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === '30Days') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (timeframe === '3Months') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeframe === '6Months') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (timeframe === '1Year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    const [
      ordersPeriod,
      usersPeriod,
      topVendors,
      orderStatusCounts,
      productsCount,
    ] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      prisma.user.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          role: true,
          createdAt: true,
        },
      }),

      prisma.vendor.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          _count: {
            select: {
              orders: true,
              products: true,
            },
          },
        },
        take: 5,
        orderBy: {
          orders: {
            _count: 'desc',
          },
        },
      }),

      prisma.order.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),

      prisma.product.count({
        where: { isActive: true },
      }),
    ]);

    // Calculate sales summary
    const totalSales = ordersPeriod.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    const completedOrders = ordersPeriod.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED').length;
    const cancelledOrders = ordersPeriod.filter(o => o.status === 'CANCELLED').length;
    const pendingOrders = ordersPeriod.filter(o => o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY').length;

    const newCustomers = usersPeriod.filter(u => u.role === 'CUSTOMER').length;
    const newVendors = usersPeriod.filter(u => u.role === 'VENDOR').length;

    // Group sales by day/month for chart rendering
    const salesChartMap = new Map<string, { date: string; sales: number; count: number }>();
    
    ordersPeriod.forEach(order => {
      const dateKey = new Date(order.createdAt).toISOString().split('T')[0] ?? '';
      const existing = salesChartMap.get(dateKey) || { date: dateKey, sales: 0, count: 0 };
      existing.sales += Number(order.totalAmount);
      existing.count += 1;
      salesChartMap.set(dateKey, existing);
    });

    const salesChartData = Array.from(salesChartMap.values());

    return successResponse({
      timeframe,
      summary: {
        totalSales,
        totalOrders: ordersPeriod.length,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        averageOrderValue: ordersPeriod.length > 0 ? totalSales / ordersPeriod.length : 0,
        newCustomers,
        newVendors,
        activeProducts: productsCount,
      },
      salesChartData,
      topVendors,
      orderStatusCounts: orderStatusCounts.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return errorResponse('Failed to generate reports', 500);
  }
});
