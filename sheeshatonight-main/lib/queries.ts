/**
 * Database Query Helpers for Common Operations
 * Provides safe, type-safe database queries with built-in error handling
 */

import { prisma } from './prisma';
import { NotFoundError, ConflictError, ValidationError } from './errors';

/**
 * Find user by email (case-insensitive)
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          tier: true,
        },
      },
    },
  });
}

/**
 * Find user by ID with related data
 */
export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          tier: true,
        },
      },
    },
  });
}

/**
 * Check if email exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  return !!user;
}

/**
 * Check if phone exists
 */
export async function phoneExists(phone: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { phone },
    select: { id: true },
  });
  return !!user;
}

/**
 * Find product by ID
 */
export async function findProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  return product;
}

/**
 * Find vendor by ID
 */
export async function findVendorById(id: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      },
    },
  });

  if (!vendor) {
    throw new NotFoundError(`Vendor with ID ${id} not found`);
  }

  return vendor;
}

/**
 * Find order by ID
 */
export async function findOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundError(`Order with ID ${id} not found`);
  }

  return order;
}

/**
 * Get vendor's products with pagination
 */
export async function getVendorProducts(
  vendorId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { vendorId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: { vendorId } }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get customer's orders with pagination
 */
export async function getCustomerOrders(
  customerId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: customerId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.order.count({ where: { userId: customerId } }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get all users (admin only) with pagination
 */
export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  filters?: { role?: string; status?: string }
) {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (filters?.role) {
    where.role = filters.role;
  }
  if (filters?.status) {
    where.status = filters.status;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        verified: true,
        kycStatus: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get all vendors (admin only) with pagination
 */
export async function getAllVendors(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            status: true,
          },
        },
        _count: {
          select: { products: true, orders: true },
        },
      },
    }),
    prisma.vendor.count(),
  ]);

  return {
    vendors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get all orders (admin only) with pagination
 */
export async function getAllOrders(
  page: number = 1,
  limit: number = 20,
  filters?: { status?: string }
) {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Update product status
 */
export async function updateProductStatus(
  productId: string,
  status: 'ACTIVE' | 'INACTIVE'
) {
  return prisma.product.update({
    where: { id: productId },
    data: { isActive: status === 'ACTIVE' },
  });
}

/**
 * Update vendor status
 */
export async function updateVendorStatus(
  vendorId: string,
  isActive: boolean
) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: { isActive },
  });
}

/**
 * Update user status
 */
export async function updateUserStatus(
  userId: string,
  status: 'ACTIVE' | 'INACTIVE'
) {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  });
}

/**
 * Approve product
 */
export async function approveProduct(productId: string) {
  return prisma.product.update({
    where: { id: productId },
    data: {
      isActive: true,
      approvedAt: new Date(),
    },
  });
}

/**
 * Reject product
 */
export async function rejectProduct(productId: string) {
  return prisma.product.update({
    where: { id: productId },
    data: {
      isActive: false,
      rejectedAt: new Date(),
    },
  });
}

/**
 * Approve vendor
 */
export async function approveVendor(vendorId: string) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: {
      isActive: true,
    },
  });
}

/**
 * Reject vendor
 */
export async function rejectVendor(vendorId: string) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: {
      isActive: false,
    },
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  const statusMap: Record<string, any> = {
    accept: { status: 'CONFIRMED', acceptedAt: new Date() },
    decline: { status: 'CANCELLED', cancelledAt: new Date() },
    cancel: { status: 'CANCELLED', cancelledAt: new Date() },
    ship: { status: 'OUT_FOR_DELIVERY' },
    deliver: { status: 'DELIVERED', deliveredAt: new Date() },
  };

  const updateData = statusMap[status];
  if (!updateData) {
    throw new ValidationError(`Invalid order status: ${status}`);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string) {
  return prisma.product.delete({
    where: { id: productId },
  });
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Get dashboard stats (admin)
 */
export async function getDashboardStats() {
  const [totalUsers, totalVendors, totalOrders, totalProducts, revenueData] =
    await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

  return {
    totalUsers,
    totalVendors,
    totalOrders,
    totalProducts,
    totalRevenue: revenueData._sum.totalAmount || 0,
  };
}
