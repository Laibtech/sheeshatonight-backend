import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';

/**
 * GET /api/admin/audit-logs
 * Get audit logs from database (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const action = searchParams.get('action');
    const resourceType = searchParams.get('resourceType');

    const where: any = {};
    if (action) where.action = action;
    if (resourceType) where.resourceType = resourceType;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Fetch user details for each audit log entry to show admin/user names
    const userIds = Array.from(new Set(logs.map(log => log.userId)));
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, role: true },
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    const formattedLogs = logs.map(log => ({
      ...log,
      user: userMap.get(log.userId) || { name: 'Unknown', email: log.userId, role: 'SYSTEM' },
    }));

    return NextResponse.json(
      buildPaginationResponse(formattedLogs, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get audit logs error:', error);
    return errorResponse('Failed to fetch audit logs', 500);
  }
});
