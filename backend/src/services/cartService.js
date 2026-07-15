import prisma from '../config/prisma.js';

export const cartService = {
  async getCart(userId) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, price: true, rentalDailyRate: true, thumbnail: true, vendor: { select: { id: true, businessName: true } } } },
          },
        },
      },
    });
  },

  async addToCart(userId, productId, quantity = 1) {
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    }

    return await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: true },
    });
  },

  async updateCartItem(userId, itemId, quantity) {
    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) throw new Error('Cart not found');

    if (quantity <= 0) {
      return await prisma.cartItem.delete({ where: { id: itemId } });
    }

    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  async removeFromCart(userId, itemId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) throw new Error('Cart not found');

    return await prisma.cartItem.delete({ where: { id: itemId } });
  },

  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) throw new Error('Cart not found');

    return await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  },

  async getCartTotal(userId) {
    const cart = await this.getCart(userId);

    if (!cart || cart.items.length === 0) {
      return { subtotal: 0, tax: 0, total: 0, itemCount: 0 };
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.price || item.product.rentalDailyRate || 0;
      return sum + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      itemCount: cart.items.length,
      items: cart.items,
    };
  },
};
