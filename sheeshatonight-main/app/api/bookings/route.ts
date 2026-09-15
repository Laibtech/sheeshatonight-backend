import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/bookings - Get user's bookings (rental orders)
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await prisma.order.findMany({
      where: {
        userId,
        rentalStartDate: { not: null }, // Only rental orders
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                type: true,
                images: true,
              },
            },
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });

  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/bookings - Create a rental booking
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      productId,
      quantity = 1,
      rentalStartDate,
      rentalEndDate,
      deliveryAddress,
      notes,
    } = body;

    // Validation
    if (!productId || !rentalStartDate || !rentalEndDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const startDate = new Date(rentalStartDate);
    const endDate = new Date(rentalEndDate);

    if (startDate >= endDate) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (startDate < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    // Verify product exists and is rental type
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { vendor: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.type !== 'RENTAL_PACKAGE' && product.type !== 'EQUIPMENT') {
      return NextResponse.json(
        { success: false, error: 'Product is not available for rental' },
        { status: 400 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product is not available' },
        { status: 400 }
      );
    }

    // Check availability for the requested dates
    const conflictingBookings = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId,
          },
        },
        status: {
          in: ['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'ACTIVE_RENTAL'],
        },
        OR: [
          {
            rentalStartDate: {
              lte: endDate,
            },
            rentalEndDate: {
              gte: startDate,
            },
          },
        ],
      },
      include: {
        items: true,
      },
    });

    const availableStock = product.stock - conflictingBookings.reduce((sum, order) => {
      const orderQuantity = order.items?.find(item => item.productId === productId)?.quantity || 0;
      return sum + orderQuantity;
    }, 0);

    if (availableStock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Product not available for selected dates' },
        { status: 400 }
      );
    }

    // Calculate rental cost
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = Number(product.price) * quantity * durationDays;

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `RENT-${new Date().getFullYear()}-${String(orderCount + 1).padStart(3, '0')}`;

    // Create booking (rental order)
    const booking = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          vendorId: product.vendorId,
          totalAmount,
          currency: product.currency,
          status: 'PREPARING',
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          notes: notes || null,
        },
      });

      // Create order item
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
          price: product.price,
        },
      });

      // Create invoice
      const tax = totalAmount * 0.05;
      await tx.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber: `INV-${orderNumber}`,
          subtotal: totalAmount,
          tax,
          total: totalAmount + tax,
          issuedAt: new Date(),
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
});
