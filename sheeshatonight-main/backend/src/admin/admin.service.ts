import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      pendingKyc,
      revenueResult,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.vendor.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count(),
      this.prisma.vendorDocument.count({ where: { status: 'PENDING' } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
    ]);

    const totalRevenue = Number(revenueResult._sum.totalAmount || 0);

    return {
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        pendingKyc,
        totalRevenue,
      },
    };
  }

  async getUsers(query: { search?: string; role?: string; status?: string }) {
    const where: any = {};
    if (query.role) where.role = query.role.toUpperCase();
    if (query.status) where.status = query.status.toUpperCase();
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        verified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: users, count: users.length };
  }

  async updateUserStatus(userId: string, body: { status?: any; verified?: boolean; role?: any; name?: string; email?: string; phone?: string; kycStatus?: any }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.verified !== undefined) updateData.verified = body.verified;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.kycStatus !== undefined) updateData.kycStatus = body.kycStatus;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { success: true, message: 'User updated successfully', user: updated };
  }

  async getVendors(query: { search?: string; status?: string; isActive?: string }) {
    const where: any = {};
    if (query.isActive === 'true') where.isActive = true;
    if (query.isActive === 'false') where.isActive = false;
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { user: { email: { contains: query.search } } },
      ];
    }

    const vendors = await this.prisma.vendor.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: vendors, count: vendors.length };
  }

  async updateVendorStatus(vendorId: string, body: { name?: string; description?: string; phone?: string; location?: string; isActive?: boolean; tier?: any }) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = typeof body.location === 'object' ? JSON.stringify(body.location) : body.location;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.tier !== undefined) updateData.tier = body.tier;

    const updated = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: updateData,
    });

    return { success: true, message: 'Vendor updated successfully', vendor: updated };
  }

  async getProducts() {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        vendor: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: products, count: products.length };
  }

  async updateProductStatus(productId: string, body: any) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.type !== undefined) updateData.type = body.type;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.sku !== undefined && body.sku.trim() !== '') updateData.sku = body.sku.trim();

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return { success: true, message: 'Product updated successfully', product: updated };
  }

  async createProduct(body: any) {
    // 1. Ensure vendorId exists
    let vId = body.vendorId;
    if (!vId || typeof vId !== 'string' || vId.trim() === '') {
      const firstVendor = await this.prisma.vendor.findFirst();
      if (!firstVendor) {
        throw new NotFoundException('No active vendor store exists to assign this product');
      }
      vId = firstVendor.id;
    }

    // 2. Sanitize SKU
    let skuVal = body.sku && typeof body.sku === 'string' && body.sku.trim() !== '' ? body.sku.trim() : null;
    if (skuVal) {
      const existingSku = await this.prisma.product.findUnique({ where: { sku: skuVal } });
      if (existingSku) {
        skuVal = `${skuVal}-${Date.now().toString().slice(-4)}`;
      }
    } else {
      skuVal = `SKU-${Date.now().toString().slice(-6)}`;
    }

    const product = await this.prisma.product.create({
      data: {
        title: body.title || 'Untitled Product',
        description: body.description || '',
        price: body.price ? Number(body.price) : 0,
        stock: body.stock ? Number(body.stock) : 0,
        type: body.type || 'TOBACCO_BLEND',
        vendorId: vId,
        sku: skuVal,
        isActive: true,
        isFeatured: body.isFeatured ?? false,
        images: Array.isArray(body.images) ? body.images : [body.images || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600'],
      },
    });

    return { success: true, data: product, message: 'Product created successfully' };
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // If product is associated with order items, soft delete to preserve historical receipts
    if (product._count.orderItems > 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { isActive: false, deletedAt: new Date() },
      });
      return { success: true, message: 'Product deactivated & archived (order history preserved)' };
    }

    // If no order items exist, clean up cart/reviews and hard delete
    await this.prisma.cart.deleteMany({ where: { productId } });
    await this.prisma.review.deleteMany({ where: { productId } });
    await this.prisma.product.delete({ where: { id: productId } });

    return { success: true, message: 'Product deleted successfully from database' };
  }

  // Categories CRUD
  async getCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: categories, count: categories.length };
  }

  async createCategory(body: any) {
    const category = await this.prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        image: body.image,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        sortOrder: body.sortOrder || 0,
      },
    });
    return { success: true, data: category, message: 'Category created' };
  }

  async updateCategory(id: string, body: any) {
    const updated = await this.prisma.category.update({
      where: { id },
      data: body,
    });
    return { success: true, data: updated, message: 'Category updated' };
  }

  async deleteCategory(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { success: true, message: 'Category deleted' };
  }

  // Coupons CRUD
  async getCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: coupons, count: coupons.length };
  }

  async createCoupon(body: any) {
    const coupon = await this.prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        discountType: body.discountType || 'PERCENTAGE',
        discountValue: body.discountValue,
        minOrderAmount: body.minOrderAmount,
        maxDiscount: body.maxDiscount,
        usageLimit: body.usageLimit,
        startDate: body.startDate ? new Date(body.startDate) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        isActive: body.isActive ?? true,
      },
    });
    return { success: true, data: coupon, message: 'Coupon created' };
  }

  async updateCoupon(id: string, body: any) {
    const updated = await this.prisma.coupon.update({
      where: { id },
      data: body,
    });
    return { success: true, data: updated, message: 'Coupon updated' };
  }

  async deleteCoupon(id: string) {
    await this.prisma.coupon.delete({ where: { id } });
    return { success: true, message: 'Coupon deleted' };
  }

  // Reviews CRUD
  async getReviews() {
    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: reviews, count: reviews.length };
  }

  async updateReviewStatus(id: string, status: string) {
    const updated = await this.prisma.review.update({
      where: { id },
      data: { status },
    });
    return { success: true, data: updated, message: 'Review status updated' };
  }

  async deleteReview(id: string) {
    await this.prisma.review.delete({ where: { id } });
    return { success: true, message: 'Review deleted' };
  }

  // CMS Management
  async getCmsBanners() {
    const banners = await this.prisma.cmsBanner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: banners };
  }

  async createCmsBanner(body: any) {
    const banner = await this.prisma.cmsBanner.create({
      data: body,
    });
    return { success: true, data: banner, message: 'CMS Banner created' };
  }

  async updateCmsBanner(id: string, body: any) {
    const updated = await this.prisma.cmsBanner.update({
      where: { id },
      data: body,
    });
    return { success: true, data: updated, message: 'CMS Banner updated' };
  }

  async deleteCmsBanner(id: string) {
    await this.prisma.cmsBanner.delete({ where: { id } });
    return { success: true, message: 'CMS Banner deleted' };
  }

  async getCmsPages() {
    const pages = await this.prisma.cmsPage.findMany({
      orderBy: { title: 'asc' },
    });
    return { success: true, data: pages };
  }

  async createCmsPage(body: any) {
    const page = await this.prisma.cmsPage.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        isActive: body.isActive ?? true,
      },
    });
    return { success: true, data: page, message: 'CMS Page created' };
  }

  async updateCmsPage(id: string, body: any) {
    const updated = await this.prisma.cmsPage.update({
      where: { id },
      data: body,
    });
    return { success: true, data: updated, message: 'CMS Page updated' };
  }

  async getCmsContent(key: string) {
    const content = await this.prisma.cmsContent.findUnique({
      where: { key },
    });
    return { success: true, data: content ? content.value : null };
  }

  async updateCmsContent(key: string, value: any) {
    const updated = await this.prisma.cmsContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return { success: true, data: updated, message: 'CMS Content saved' };
  }

  async getOrders() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        vendor: { select: { name: true } },
        items: { include: { product: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: orders, count: orders.length };
  }

  async updateOrderStatus(orderId: string, status: any) {
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return { success: true, data: updated, message: 'Order status updated successfully' };
  }

  async getAuditLogs() {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { success: true, data: logs };
  }
}
