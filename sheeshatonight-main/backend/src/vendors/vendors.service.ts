import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorsService {
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

  async findAll(query: { limit?: number; offset?: number }) {
    const limit = Number(query.limit || 50);
    const offset = Number(query.offset || 0);

    const vendors = await this.prisma.vendor.findMany({
      where: { isActive: true },
      include: {
        user: { select: { name: true, email: true } },
        products: { where: { isActive: true, deletedAt: null }, select: { type: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const formatted = vendors.map((v) => {
      const tags = Array.from(new Set(v.products.map((p) => p.type)));
      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        description: v.description || 'Luxury Sheesha Lounge & Marketplace Partner.',
        location: this.formatVendorLocation(v.location),
        phone: v.phone || '+971 4 333 9988',
        tier: v.tier,
        distance: '1.5 km',
        rating: 4.8,
        reviews: 24,
        verified: v.isActive,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600',
        tags: tags.length > 0 ? tags : ['SHEESHA_PIPE', 'TOBACCO_BLEND'],
      };
    });

    return {
      success: true,
      data: formatted,
      count: formatted.length,
    };
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        user: { select: { name: true, email: true } },
        products: {
          where: { isActive: true, deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor store not found');
    }

    const locationStr = this.formatVendorLocation(vendor.location);

    return {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      description: vendor.description || 'Luxury Sheesha Lounge & Marketplace Partner in UAE offering premium hookahs, tobacco blends, and cabana setup services.',
      location: locationStr,
      phone: vendor.phone || '+971 4 333 9988',
      tier: vendor.tier,
      rating: 4.9,
      reviews: 48,
      verified: vendor.isActive,
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600',
      bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      services: ['VIP Cabana Rental', 'Express Doorstep Delivery', 'Custom Flavor Mixing', 'Event Catering'],
      products: vendor.products.map((p) => ({
        id: p.id,
        name: p.title,
        title: p.title,
        description: p.description || '',
        price: Number(p.price),
        type: p.type,
        category: p.type,
        stock: p.stock,
        rating: 4.8,
        reviews: 12,
        image: this.resolveImageUrl(p.images),
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [this.resolveImageUrl(p.images)],
        isRental: p.type === 'RENTAL_PACKAGE' || p.type === 'SHEESHA_PIPE',
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorLocation: locationStr,
      })),
    };
  }

  async apply(userId: string, body: { name: string; description?: string; phone?: string }) {
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        name: body.name,
        slug,
        description: body.description,
        phone: body.phone,
        isActive: false, // Requires admin approval
      },
    });

    return {
      success: true,
      message: 'Vendor application submitted successfully. Pending admin approval.',
      vendor,
    };
  }
}
