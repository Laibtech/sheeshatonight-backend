import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest, errorResponse, successResponse } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import { ProductType } from '@prisma/client';

/**
 * GET /api/admin/products
 * Get products with search, filtering, stock filter, and pagination (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const search = searchParams.get('search')?.trim();
    const type = searchParams.get('type')?.trim();
    const isActive = searchParams.get('isActive')?.trim();
    const stockFilter = searchParams.get('stock')?.trim();

    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const where: any = {};
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
        { vendor: { name: { contains: search } } },
      ];
    }

    if (type && type !== 'ALL') {
      where.type = type as ProductType;
    }

    if (isActive && isActive !== 'ALL') {
      where.isActive = isActive === 'true';
    }

    if (stockFilter === 'low') {
      where.stock = { lte: 5, gt: 0 };
    } else if (stockFilter === 'out') {
      where.stock = { lte: 0 };
    } else if (stockFilter === 'in') {
      where.stock = { gt: 0 };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return NextResponse.json(
      buildPaginationResponse(formattedProducts, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin products error:', error);
    return errorResponse('Failed to fetch products', 500);
  }
});

/**
 * POST /api/admin/products
 * Create a new product (Admin only)
 */
export const POST = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const {
      title,
      description,
      type,
      price,
      currency = 'AED',
      stock = 0,
      sku,
      vendorId,
      images,
      isActive = true,
      isFeatured = false,
    } = body;

    if (!title || !type || price === undefined) {
      return errorResponse('Title, product type, and price are required', 400);
    }

    // Default to first active vendor if not provided
    let targetVendorId = vendorId;
    if (!targetVendorId) {
      const defaultVendor = await prisma.vendor.findFirst({ where: { isActive: true } });
      if (!defaultVendor) {
        return errorResponse('A vendor must be selected or created first', 400);
      }
      targetVendorId = defaultVendor.id;
    }

    const newProduct = await prisma.product.create({
      data: {
        vendorId: targetVendorId,
        title,
        description,
        type: type as ProductType,
        price: Number(price),
        currency,
        stock: Number(stock),
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        images: Array.isArray(images) ? images : images ? [images] : [],
        isActive: Boolean(isActive),
        isFeatured: Boolean(isFeatured),
        approvedAt: new Date(),
      },
    });

    return successResponse(
      {
        product: {
          ...newProduct,
          price: Number(newProduct.price),
        },
      },
      'Product created successfully',
      201
    );
  } catch (error: any) {
    console.error('Create product error:', error);
    return errorResponse(error.message || 'Failed to create product', 500);
  }
});
