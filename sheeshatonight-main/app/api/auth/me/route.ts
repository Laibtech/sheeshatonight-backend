import { NextResponse } from 'next/server';
import { withAuth, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * 
 * Returns user details with vendor information if applicable
 * Requires valid JWT token in HttpOnly cookie
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    // Fetch complete user profile with vendor info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        dob: true,
        locale: true,
        verified: true,
        kycStatus: true,
        kycApprovedAt: true,
        kycRejectedAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            tier: true,
            planExpiry: true,
            isActive: true,
            location: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse('Account is inactive', 403);
    }

    return successResponse(user, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse('Failed to retrieve user profile', 500);
  }
});
