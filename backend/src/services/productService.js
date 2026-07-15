import prisma from '../config/prisma.js';

export const productService = {
  async getAll(page = 1, limit = 20, filters = {}) {
    const skip = (page - 1) * limit;
    const where = {
      status: 'ACTIVE',
      ...filters,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          vendor: { select: { id: true, businessName: true, rating: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async getById(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: {
        vendor: true,
        reviews: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
        cartItems: { select: { quantity: true } },
      },
    });
  },

  async search(query, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = {
      status: 'ACTIVE',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async getByCategory(category, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { category, status: 'ACTIVE' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: { category, status: 'ACTIVE' } }),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async getWishlist(userId) {
    return await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
    });
  },

  async addToWishlist(userId, productId) {
    return await prisma.wishlistItem.create({
      data: { userId, productId },
    });
  },

  async removeFromWishlist(userId, productId) {
    return await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  },
};
