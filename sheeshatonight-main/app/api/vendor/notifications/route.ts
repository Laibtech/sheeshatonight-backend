import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/vendor/notifications
 * Get vendor notifications
 * Uses EXISTING Notification table
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.user!.vendorId! },
      select: { userId: true },
    });

    if (!vendor) {
      return errorResponse('Vendor not found', 404);
    }

    const { searchParams } = new URL(req.url);
    const { skip, take, page, pageSize } = getPaginationParams(searchParams);
    const read = searchParams.get('read');

    const where: any = { userId: vendor.userId };
    
    if (read !== null) {
      where.read = read === 'true';
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: vendor.userId, read: false },
      }),
    ]);

    return successResponse({
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        data: n.data,
        createdAt: n.createdAt,
      })),
      unreadCount,
      pagination: buildPaginationResponse(notifications, total, page, pageSize).pagination,
    });
  } catch (error) {
    console.error('Vendor notifications GET error:', error);
    return errorResponse('Failed to fetch notifications', 500);
  }
});
