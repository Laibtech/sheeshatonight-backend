import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductType } from '../common/enums';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private resolveImageUrl(images: any): string {
    const defaultFallback = 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800';
    if (!images) return defaultFallback;

    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      if (typeof first === 'string' && first.trim() !== '') return first.trim();
    } else if (typeof images === 'string' && images.trim() !== '') {
      return images.trim();
    }

    return defaultFallback;
  }

  private resolveImagesList(images: any): string[] {
    const primary = this.resolveImageUrl(images);
    if (Array.isArray(images) && images.length > 0) {
      const valid = images.filter((img) => typeof img === 'string' && img.trim() !== '');
      if (valid.length > 0) return valid;
    }
    return [primary];
  }

  private formatVendorLocation(location: any): string {
    if (!location) return 'Dubai, UAE';
    if (typeof location === 'string') {
      try {
        const parsed = JSON.parse(location);
        return parsed.address || parsed.city || location;
      } catch {
        return location;
      }
    }
    if (typeof location === 'object') {
      return location.address || location.city || 'Dubai, UAE';
    }
    return 'Dubai, UAE';
  }

  async findAll(query: {
    category?: string;
    type?: string;
    vendorId?: string;
    isFeatured?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const limit = Number(query.limit || 50);
    const offset = Number(query.offset || 0);

    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (query.vendorId) {
      where.vendorId = query.vendorId;
    }

    if (query.isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (query.category) {
      where.type = query.category.toUpperCase() as ProductType;
    } else if (query.type) {
      where.type = query.type.toUpperCase() as ProductType;
    }

    if (query.search && query.search.trim() !== '') {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s } },
        { description: { contains: s } },
        { sku: { contains: s } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.price.lte = Number(query.maxPrice);
    }

    // Determine ordering
    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (query.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (query.sort === 'title') {
      orderBy = { title: 'asc' };
    } else if (query.sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              phone: true,
              location: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      this.prisma.product.count({ where }),
    ]);

    const formatted = products.map((p) => {
      const mainImage = this.resolveImageUrl(p.images);
      const allImages = this.resolveImagesList(p.images);
      const locationStr = this.formatVendorLocation(p.vendor?.location);

      return {
        id: p.id,
        name: p.title,
        title: p.title,
        description: p.description || '',
        brand: p.vendor?.name || 'SheeshaTonight Marketplace',
        vendor: p.vendor?.name || 'SheeshaTonight Marketplace',
        vendorId: p.vendorId,
        vendorLocation: locationStr,
        category: p.type,
        type: p.type,
        price: Number(p.price),
        rating: 4.8,
        reviews: 16,
        image: mainImage,
        images: allImages,
        stock: p.stock,
        sku: p.sku || 'SKU-GENERAL',
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        isRental: p.type === 'RENTAL_PACKAGE' || p.type === 'SHEESHA_PIPE',
        createdAt: p.createdAt,
      };
    });

    return {
      success: true,
      data: formatted,
      count: formatted.length,
      total,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            location: true,
            phone: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const mainImage = this.resolveImageUrl(product.images);
    const allImages = this.resolveImagesList(product.images);
    const locationStr = this.formatVendorLocation(product.vendor?.location);

    return {
      id: product.id,
      name: product.title,
      title: product.title,
      description: product.description || '',
      brand: product.vendor?.name || 'SheeshaTonight Marketplace',
      vendor: product.vendor?.name || 'SheeshaTonight Marketplace',
      vendorId: product.vendorId,
      vendorSlug: product.vendor?.slug || product.vendorId,
      vendorLocation: locationStr,
      vendorPhone: product.vendor?.phone || '+971 50 123 1111',
      category: product.type,
      type: product.type,
      price: Number(product.price),
      currency: product.currency || 'AED',
      stock: product.stock,
      sku: product.sku || 'SKU-GENERAL',
      image: mainImage,
      images: allImages,
      rating: 4.9,
      reviews: 24,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isRental: product.type === 'RENTAL_PACKAGE' || product.type === 'SHEESHA_PIPE',
      createdAt: product.createdAt,
    };
  }
}
