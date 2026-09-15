import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';

/**
 * PUT /api/admin/categories/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdmin(async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();
      const { name, slug, description, image, isActive, isFeatured, sortOrder } = body;

      const updated = await prisma.category.update({
        where: { id: params.id },
        data: {
          ...(name ? { name } : {}),
          ...(slug ? { slug } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(image !== undefined ? { image } : {}),
          ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
          ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
          ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
        },
      });

      return successResponse({ category: updated }, 'Category updated successfully');
    } catch (error: any) {
      console.error('Update category error:', error);
      return errorResponse(error.message || 'Failed to update category', 500);
    }
  })(request);
}

/**
 * DELETE /api/admin/categories/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdmin(async () => {
    try {
      await prisma.category.delete({
        where: { id: params.id },
      });
      return successResponse({ id: params.id }, 'Category deleted successfully');
    } catch (error) {
      console.error('Delete category error:', error);
      return errorResponse('Failed to delete category', 500);
    }
  })(request);
}
