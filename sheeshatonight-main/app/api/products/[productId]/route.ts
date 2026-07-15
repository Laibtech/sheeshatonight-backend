import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/middleware';
import { verifyTokenAndGetUser } from '@/lib/auth';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { updateProductSchema } from '@/lib/validation';

/**
 * GET /api/products/[productId]
 * Get product details
 */
export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
      },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Only show active products publicly, vendors/admins can see their own
    if (!product.isActive && product.deletedAt) {
      return errorResponse('Product not found', 404);
    }

    return NextResponse.json(
      successResponse(product, 'Product retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get product error:', error);
    return errorResponse('Failed to retrieve product', 500);
  }
}

/**
 * PUT /api/products/[productId]
 * Update product (vendor only)
 */
export async function PUT(request: Request, { params }: { params: { productId: string } }) {
  try {
    // Extract token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split('; ').find(c => c.startsWith('auth_token='))?.split('=')[1];

    if (!token || !verifyToken(token)) {
      return errorResponse('Authentication required', 401);
    }

    const user = await verifyTokenAndGetUser(token);
    if (!user || user.role !== 'VENDOR') {
      return errorResponse('Vendor access required', 403);
    }

    const vendorId = user.vendor?.id;
    const productId = params.productId;

    // Verify product exists and belongs to vendor
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    if (product.vendorId !== vendorId) {
      return errorResponse('Access denied', 403);
    }

    const body = await request.json();
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR',
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    const updateData: any = {};
    if (validation.data.title !== undefined) updateData.title = validation.data.title;
    if (validation.data.description !== undefined) updateData.description = validation.data.description;
    if (validation.data.type !== undefined) updateData.type = validation.data.type;
    if (validation.data.price !== undefined) updateData.price = validation.data.price;
    if (validation.data.currency !== undefined) updateData.currency = validation.data.currency;
    if (validation.data.stock !== undefined) updateData.stock = validation.data.stock;
    if (validation.data.images !== undefined) updateData.images = validation.data.images;
    if (validation.data.sku !== undefined) updateData.sku = validation.data.sku;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return successResponse(updatedProduct, 'Product updated successfully');
  } catch (error) {
    console.error('Update product error:', error);
    return errorResponse('Failed to update product', 500);
  }
}

/**
 * DELETE /api/products/[productId]
 * Soft delete product (vendor only)
 */
export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  try {
    // Extract token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split('; ').find(c => c.startsWith('auth_token='))?.split('=')[1];

    if (!token || !verifyToken(token)) {
      return errorResponse('Authentication required', 401);
    }

    const user = await verifyTokenAndGetUser(token);
    if (!user || user.role !== 'VENDOR') {
      return errorResponse('Vendor access required', 403);
    }

    const vendorId = user.vendor?.id;
    const productId = params.productId;

    // Verify product exists and belongs to vendor
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    if (product.vendorId !== vendorId) {
      return errorResponse('Access denied', 403);
    }

    // Soft delete
    await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return errorResponse('Failed to delete product', 500);
  }
}
