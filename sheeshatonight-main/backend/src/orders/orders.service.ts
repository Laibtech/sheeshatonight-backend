import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, body: { addressId?: string; notes?: string }) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            vendor: true,
          },
        },
      },
    });

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Your shopping cart is empty');
    }

    // Group items by vendor
    const itemsByVendor = new Map<string, typeof cartItems>();
    for (const item of cartItems) {
      const vId = item.product.vendorId;
      if (!itemsByVendor.has(vId)) {
        itemsByVendor.set(vId, []);
      }
      itemsByVendor.get(vId)!.push(item);
    }

    const createdOrders: any[] = [];

    // Execute in Prisma Transaction
    await this.prisma.$transaction(async (tx) => {
      for (const [vendorId, items] of itemsByVendor.entries()) {
        const orderSubtotal = items.reduce(
          (sum, item) => sum + Number(item.product.price) * item.quantity,
          0,
        );
        const tax = Math.round(orderSubtotal * 0.05 * 100) / 100;
        const deliveryFee = 25;
        const totalAmount = orderSubtotal + tax + deliveryFee;

        const orderNum = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
          Math.random() * 1000,
        )}`;

        const order = await tx.order.create({
          data: {
            orderNumber: orderNum,
            userId,
            vendorId,
            status: OrderStatus.PREPARING,
            totalAmount,
            notes: body.notes,
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
            invoice: {
              create: {
                invoiceNumber: `INV-${orderNum}`,
                subtotal: orderSubtotal,
                tax,
                total: totalAmount,
              },
            },
            tracking: {
              create: {
                status: OrderStatus.PREPARING,
                events: [
                  {
                    status: 'PREPARING',
                    message: 'Order created and sent to vendor',
                    timestamp: new Date().toISOString(),
                  },
                ],
              },
            },
          },
          include: {
            items: true,
            vendor: { select: { name: true } },
          },
        });

        // Decrement product stock
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        createdOrders.push(order);
      }

      // Empty cart
      await tx.cart.deleteMany({ where: { userId } });
    });

    return {
      success: true,
      message: 'Order created successfully',
      orders: createdOrders,
    };
  }

  async getOrders(userId: string, userRole: string, vendorId?: string) {
    const where: any = {};
    if (userRole === 'CUSTOMER') {
      where.userId = userId;
    } else if (userRole === 'VENDOR' && vendorId) {
      where.vendorId = vendorId;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { title: true, images: true } } },
        },
        vendor: { select: { id: true, name: true, phone: true } },
        user: { select: { id: true, name: true, email: true } },
        tracking: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: orders,
      count: orders.length,
    };
  }

  async getOrder(orderId: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
        vendor: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        tracking: true,
        invoice: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === 'CUSTOMER' && order.userId !== userId) {
      throw new BadRequestException('Unauthorized access to order');
    }

    return { success: true, data: order };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return { success: true, message: 'Order status updated', order: updated };
  }
}
