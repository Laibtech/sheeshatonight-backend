import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/notifications
 * Get admin/system notifications from database (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const readParam = searchParams.get('read');

    const where: any = {};
    if (readParam === 'true') where.read = true;
    if (readParam === 'false') where.read = false;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return NextResponse.json(
      buildPaginationResponse(notifications, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin notifications error:', error);
    return errorResponse('Failed to fetch notifications', 500);
  }
});

/**
 * PUT /api/admin/notifications
 * Mark notification(s) as read
 */
export const PUT = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { id, readAll } = body;

    if (readAll) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
      return successResponse(null, 'All notifications marked as read');
    }

    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      return successResponse(null, 'Notification marked as read');
    }

    return errorResponse('Notification ID or readAll flag is required', 400);
  } catch (error) {
    console.error('Update notification error:', error);
    return errorResponse('Failed to update notification', 500);
  }
});

/**
 * POST /api/admin/notifications
 * Create notification (Admin only)
 */
export const POST = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { userId, type, title, message, data } = body;

    if (!userId || !title || !message) {
      return errorResponse('Missing required fields: userId, title, message', 400);
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type || 'SYSTEM',
        title,
        message,
        data: data ? JSON.stringify(data) : null,
      },
    });

    return successResponse({ notification }, 'Notification created successfully', 201);
  } catch (error) {
    console.error('Create notification error:', error);
    return errorResponse('Failed to create notification', 500);
  }
});
