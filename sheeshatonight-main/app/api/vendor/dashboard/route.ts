import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/vendor/dashboard
 * Get complete vendor dashboard statistics and recent data
 * Uses EXISTING database tables - NO fake data
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;

    // Fetch vendor details
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!vendor) {
      return errorResponse('Vendor not found', 404, 'NOT_FOUND');
    }

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all orders for this vendor
    const [
      allOrders,
      todayOrders,
      monthOrders,
      products,
      settlements,
      reviews,
      recentNotifications,
    ] = await Promise.all([
      // All orders
      prisma.order.findMany({
        where: { vendorId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Today's orders
      prisma.order.findMany({
        where: {
          vendorId,
          createdAt: { gte: todayStart },
        },
      }),

      // This month's orders
      prisma.order.findMany({
        where: {
          vendorId,
          createdAt: { gte: monthStart },
        },
      }),

      // Products
      prisma.product.findMany({
        where: {
          vendorId,
          deletedAt: null,
        },
      }),

      // Settlements
      prisma.settlement.findMany({
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Reviews
      prisma.review.findMany({
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Recent notifications
      prisma.notification.findMany({
        where: { userId: vendor.userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Calculate statistics
    const totalRevenue = allOrders.reduce((sum, order) => 
      sum + Number(order.totalAmount), 0
    );

    const todayRevenue = todayOrders.reduce((sum, order) => 
      sum + Number(order.totalAmount), 0
    );

    const monthRevenue = monthOrders.reduce((sum, order) => 
      sum + Number(order.totalAmount), 0
    );

    // Order status counts
    const ordersByStatus = {
      preparing: allOrders.filter(o => o.status === 'PREPARING').length,
      readyForPickup: allOrders.filter(o => o.status === 'READY_FOR_PICKUP').length,
      outForDelivery: allOrders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
      delivered: allOrders.filter(o => o.status === 'DELIVERED').length,
      activeRental: allOrders.filter(o => o.status === 'ACTIVE_RENTAL').length,
      completed: allOrders.filter(o => o.status === 'COMPLETED').length,
      cancelled: allOrders.filter(o => o.status === 'CANCELLED').length,
    };

    // Product counts
    const activeProducts = products.filter(p => p.isActive).length;
    const pendingApproval = products.filter(p => !p.approvedAt && !p.rejectedAt).length;
    const approvedProducts = products.filter(p => p.approvedAt).length;
    const rejectedProducts = products.filter(p => p.rejectedAt).length;

    // Settlement calculations
    const pendingSettlement = settlements
      .filter(s => s.status === 'PENDING')
      .reduce((sum, s) => sum + Number(s.amount), 0);

    const paidSettlement = settlements
      .filter(s => s.status === 'PAID')
      .reduce((sum, s) => sum + Number(s.amount), 0);

    const availableBalance = settlements
      .filter(s => s.status === 'PROCESSED')
      .reduce((sum, s) => sum + Number(s.amount), 0);

    // Review statistics
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Recent orders (last 10)
    const recentOrders = allOrders.slice(0, 10).map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      currency: order.currency,
      customerName: order.user.name,
      customerEmail: order.user.email,
      itemCount: order.items.length,
      items: order.items.map(item => ({
        productTitle: item.product.title,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      createdAt: order.createdAt,
      acceptedAt: order.acceptedAt,
      deliveredAt: order.deliveredAt,
    }));

    // Recent reviews with user details
    const recentReviews = await Promise.all(
      reviews.slice(0, 5).map(async (review) => {
        const user = await prisma.user.findUnique({
          where: { id: review.userId },
          select: { name: true, email: true },
        });

        let product = null;
        if (review.productId) {
          product = await prisma.product.findUnique({
            where: { id: review.productId },
            select: { title: true, images: true },
          });
        }

        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          createdAt: review.createdAt,
          userName: user?.name || 'Anonymous',
          userEmail: user?.email || '',
          productTitle: product?.title || 'General Review',
          productImage: product?.images ? (product.images as any)[0] : null,
        };
      })
    );

    // Top selling products (from order items)
    const productSales = new Map<string, { product: any; count: number; revenue: number }>();
    
    for (const order of allOrders) {
      for (const item of order.items) {
        const existing = productSales.get(item.productId);
        if (existing) {
          existing.count += item.quantity;
          existing.revenue += Number(item.price) * item.quantity;
        } else {
          productSales.set(item.productId, {
            product: item.product,
            count: item.quantity,
            revenue: Number(item.price) * item.quantity,
          });
        }
      }
    }

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(({ product, count, revenue }) => ({
        productTitle: product.title,
        productImage: product.images ? (product.images as any)[0] : null,
        totalSold: count,
        revenue,
      }));

    // Unread notifications count
    const unreadNotifications = recentNotifications.filter(n => !n.read).length;

    // Sales chart data (last 7 days)
    const salesChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = allOrders.filter(o => 
        o.createdAt >= date && o.createdAt < nextDate
      );

      const daySales = dayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

      salesChart.push({
        date: date.toISOString().split('T')[0],
        sales: daySales,
        orders: dayOrders.length,
      });
    }

    // Build response
    const dashboardData = {
      vendor: {
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug,
        tier: vendor.tier,
        isActive: vendor.isActive,
        phone: vendor.phone,
        location: vendor.location,
        userName: vendor.user.name,
        userEmail: vendor.user.email,
        userPhone: vendor.user.phone,
      },

      statistics: {
        revenue: {
          total: totalRevenue,
          today: todayRevenue,
          thisMonth: monthRevenue,
        },
        balance: {
          available: availableBalance,
          pending: pendingSettlement,
          paid: paidSettlement,
        },
        orders: {
          total: allOrders.length,
          today: todayOrders.length,
          thisMonth: monthOrders.length,
          ...ordersByStatus,
        },
        products: {
          total: products.length,
          active: activeProducts,
          pendingApproval,
          approved: approvedProducts,
          rejected: rejectedProducts,
        },
        reviews: {
          total: reviews.length,
          averageRating: Math.round(avgRating * 10) / 10,
        },
        notifications: {
          unread: unreadNotifications,
        },
      },

      recentOrders,
      recentReviews,
      recentNotifications: recentNotifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        data: n.data,
        createdAt: n.createdAt,
      })),
      topProducts,
      salesChart,
      settlements: settlements.map(s => ({
        id: s.id,
        period: s.period,
        amount: Number(s.amount),
        commission: Number(s.commission),
        status: s.status,
        paidAt: s.paidAt,
        createdAt: s.createdAt,
      })),
    };

    return successResponse(dashboardData, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    return errorResponse('Failed to load dashboard', 500);
  }
});
