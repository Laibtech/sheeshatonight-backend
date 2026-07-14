import prisma from '../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';

export const orderService = {
  async createOrder(userId, orderData) {
    const { items, shippingAddress } = orderData;

    if (!items || items.length === 0) {
      throw new Error('Order must contain items');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });

      if (!product) throw new Error(`Product ${item.productId} not found`);

      const unitPrice = product.price || 0;
      const totalPrice = unitPrice * item.quantity;

      subtotal += totalPrice;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const tax = subtotal * 0.05; // 5% tax
    const totalAmount = subtotal + tax;

    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderNumber: `ORD-${Date.now()}`,
        customerId: userId,
        vendorId: orderItems[0]?.productId ? (await prisma.product.findUnique({ where: { id: orderItems[0].productId } })).vendorId : null,
        subtotal,
        tax,
        totalAmount,
        shippingAddress,
        items: {
          create: orderItems.map(item => ({
            id: uuidv4(),
            ...item,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return order;
  },

  async getOrder(orderId, userId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: userId,
      },
      include: {
        items: { include: { product: true } },
        payment: true,
        vendor: { select: { businessName: true } },
      },
    });

    if (!order) throw new Error('Order not found');
    return order;
  },

  async getOrders(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId: userId },
        skip,
        take: limit,
        include: { items: true, payment: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { customerId: userId } }),
    ]);

    return {
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async updateOrderStatus(orderId, status) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });
  },

  async cancelOrder(orderId, userId) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: userId },
    });

    if (!order) throw new Error('Order not found');

    if (['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(order.status)) {
      throw new Error('Cannot cancel this order');
    }

    return await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  },

  async getVendorOrders(vendorId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { vendorId },
        skip,
        take: limit,
        include: { customer: { select: { firstName: true, lastName: true, email: true } }, items: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { vendorId } }),
    ]);

    return {
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async createRentalOrder(userId, rentalData) {
    const { productId, startDate, endDate } = rentalData;

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || product.type !== 'RENTAL') {
      throw new Error('Invalid rental product');
    }

    // Calculate rental days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (rentalDays < product.minRentalDays) {
      throw new Error(`Minimum rental period is ${product.minRentalDays} days`);
    }

    // Check availability
    const bookedDates = await prisma.rentalCalendar.findMany({
      where: {
        productId,
        date: { gte: start, lte: end },
        isAvailable: false,
      },
    });

    if (bookedDates.length > 0) {
      throw new Error('Product not available for selected dates');
    }

    // Calculate price
    let rentalPrice = 0;
    if (rentalDays >= 30 && product.rentalMonthlyRate) {
      rentalPrice = product.rentalMonthlyRate * (rentalDays / 30);
    } else if (rentalDays >= 7 && product.rentalWeeklyRate) {
      rentalPrice = product.rentalWeeklyRate * (rentalDays / 7);
    } else {
      rentalPrice = product.rentalDailyRate * rentalDays;
    }

    const depositAmount = product.rentalDeposit || 0;
    const totalAmount = rentalPrice + depositAmount;

    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderNumber: `RENTAL-${Date.now()}`,
        customerId: userId,
        vendorId: product.vendorId,
        type: 'RENTAL',
        rentalStartDate: start,
        rentalEndDate: end,
        rentalDays,
        subtotal: rentalPrice,
        totalAmount,
        items: {
          create: {
            id: uuidv4(),
            productId,
            quantity: 1,
            unitPrice: rentalPrice,
            totalPrice: rentalPrice,
          },
        },
      },
    });

    // Mark dates as booked
    const currentDate = new Date(start);
    while (currentDate <= end) {
      await prisma.rentalCalendar.upsert({
        where: { productId_date: { productId, date: currentDate } },
        update: { isAvailable: false, orderId: order.id },
        create: {
          productId,
          date: currentDate,
          isAvailable: false,
          orderId: order.id,
        },
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return order;
  },
};
