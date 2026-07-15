import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, extractToken } from '@/lib/jwt';

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = extractToken(authHeader || '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin role required' },
        { status: 403 }
      );
    }

    // Get stats
    const [totalUsers, totalVendors, totalCustomers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.user.count({
        where: { role: 'CUSTOMER' },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });

    const vendorCount = await prisma.user.count({
      where: { role: 'VENDOR' },
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalUsers,
          totalVendors,
          totalCustomers,
          adminCount,
          vendorCount,
          customerCount: totalCustomers,
          usersByRole: {
            customer: totalCustomers,
            vendor: vendorCount,
            admin: adminCount,
          },
        },
        recentUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
