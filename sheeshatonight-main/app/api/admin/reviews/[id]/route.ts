import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';

/**
 * PUT /api/admin/reviews/[id]
 * Moderate review status (APPROVED, REJECTED, PENDING)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdmin(async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();
      const { status } = body;

      if (!status) {
        return errorResponse('Status is required', 400);
      }

      const updated = await prisma.review.update({
        where: { id: params.id },
        data: { status },
      });

      return successResponse({ review: updated }, 'Review status updated');
    } catch (error: any) {
      console.error('Update review error:', error);
      return errorResponse(error.message || 'Failed to update review', 500);
    }
  })(request);
}

/**
 * DELETE /api/admin/reviews/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdmin(async () => {
    try {
      await prisma.review.delete({
        where: { id: params.id },
      });
      return successResponse({ id: params.id }, 'Review deleted successfully');
    } catch (error) {
      console.error('Delete review error:', error);
      return errorResponse('Failed to delete review', 500);
    }
  })(request);
}
