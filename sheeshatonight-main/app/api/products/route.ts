import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, withVendor, AuthenticatedRequest } from '@/lib/middleware';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import { createProductSchema } from '@/lib/validation';

/**
 * GET /api/products
 * Get all active products (public endpoint)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { page, pageSize, skip, take } = getPaginationParams(url.searchParams);
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');
    const vendorId = url.searchParams.get('vendorId');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const isFeatured = url.searchParams.get('isFeatured');

    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (type && ['SHEESHA_PIPE', 'TOBACCO_BLEND', 'ACCESSORY', 'RENTAL_PACKAGE', 'EQUIPMENT'].includes(type)) {
      where.type = type;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          price: true,
          currency: true,
          stock: true,
          images: true,
          sku: true,
          isActive: true,
          isFeatured: true,
          createdAt: true,
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      buildPaginationResponse(products, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get products error:', error);
    return errorResponse('Failed to fetch products', 500);
  }
}

/**
 * POST /api/products
 * Create new product (vendor only)
 */
export const POST = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user?.vendorId;

    if (!vendorId) {
      return errorResponse('Vendor ID not found', 400);
    }

    const body = await req.json();
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR',
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    // Verify vendor exists and is active
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, isActive: true, tier: true },
    });

    if (!vendor || !vendor.isActive) {
      return errorResponse('Vendor not found or inactive', 404);
    }

    // Check product limit based on tier
    const existingProducts = await prisma.product.count({
      where: { vendorId, deletedAt: null },
    });

    const tierLimits: Record<string, number> = {
      SOLO: 5,
      MASTER: 20,
      ADVANCED: -1, // unlimited
    };

    const limit = tierLimits[vendor.tier] ?? 5;
    if (limit !== -1 && existingProducts >= limit) {
      return errorResponse(
        `Your ${vendor.tier} tier allows maximum ${limit} products`,
        403
      );
    }

    const { title, description, type, price, currency, stock, images, sku } = validation.data;

    // Check for duplicate SKU if provided
    if (sku) {
      const existing = await prisma.product.findUnique({
        where: { sku },
        select: { id: true },
      });
      if (existing) {
        return errorResponse('Product with this SKU already exists', 400);
      }
    }

    const product = await prisma.product.create({
      data: {
        vendorId,
        title,
        description,
        type,
        price,
        currency,
        stock,
        images,
        sku,
        isActive: true,
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(product, 'Product created successfully', 201);
  } catch (error) {
    console.error('Create product error:', error);
    return errorResponse('Failed to create product', 500);
  }
});
