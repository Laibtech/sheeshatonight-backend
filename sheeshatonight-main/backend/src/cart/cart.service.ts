import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            vendor: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price),
        type: item.product.type,
        images: item.product.images,
        vendorId: item.product.vendorId,
        vendorName: item.product.vendor.name,
        stock: item.product.stock,
      },
    }));

    const subtotal = formattedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% VAT
    const deliveryFee = subtotal > 0 ? 25 : 0;
    const total = subtotal + tax + deliveryFee;

    return {
      items: formattedItems,
      summary: {
        itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        tax,
        deliveryFee,
        total,
      },
    };
  }

  async addToCart(userId: string, productId: string, quantity = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock. Only ${product.stock} items available.`);
    }

    const cartItem = await this.prisma.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });

    return { success: true, message: 'Added to cart', cartItem };
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    const item = await this.prisma.cart.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const updated = await this.prisma.cart.update({
      where: { id: itemId },
      data: { quantity },
    });

    return { success: true, cartItem: updated };
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cart.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cart.delete({ where: { id: itemId } });
    return { success: true, message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    await this.prisma.cart.deleteMany({ where: { userId } });
    return { success: true, message: 'Cart cleared' };
  }
}
