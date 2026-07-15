import { NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { withAuth, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { getPaginationParams, buildPaginationResponse } from '@/lib/utils';
import { createOrderSchema } from '@/lib/validation';
import { generateOrderNumber } from '@/lib/utils';

/**
 * GET /api/orders
 * List orders (role-based access)
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;
    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip, take } = getPaginationParams(searchParams);
    const status = searchParams.get('status');

    let where: any = {};

    // Filter by role
    if (req.user?.role === 'CUSTOMER') {
      where.userId = userId;
    } else if (req.user?.role === 'VENDOR') {
      where.vendorId = req.user?.vendorId;
    }
    // ADMIN sees all orders

    // Filter by status
    if (status && ['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'ACTIVE_RENTAL', 'COMPLETED', 'CANCELLED'].includes(status)) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                },
              },
            },
          },
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json(
      buildPaginationResponse(orders, total, page, pageSize),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get orders error:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
});

/**
 * POST /api/orders
 * Create new order (customer)
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    if (req.user?.role !== 'CUSTOMER') {
      return errorResponse('Only customers can create orders', 403);
    }

    const body = await req.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR',
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    const { vendorId, items, rentalStartDate, rentalEndDate, notes } = validation.data;

    // Verify vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, isActive: true },
    });

    if (!vendor || !vendor.isActive) {
      return errorResponse('Vendor not found or inactive', 404);
    }

    // Fetch and validate products
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        vendorId,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        price: true,
        stock: true,
      },
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    // Validate all products exist and have stock
    let totalAmount = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return errorResponse(`Product ${item.productId} not found`, 400);
      }
      if (product.stock < item.quantity) {
        return errorResponse(`Product ${item.productId} has insufficient stock`, 400);
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        vendorId,
        status: 'PREPARING',
        totalAmount: new Decimal(totalAmount),
        rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : undefined,
        rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : undefined,
        notes,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return successResponse(order, 'Order created successfully', 201);
  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse('Failed to create order', 500);
  }
});
