import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

export const dynamic = 'force-dynamic';

function resolveImageUrl(images: any): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800';
  if (!images) return defaultFallback;
  try {
    const parsed = typeof images === 'string' && (images.startsWith('[') || images.startsWith('{')) ? JSON.parse(images) : images;
    if (Array.isArray(parsed) && parsed.length > 0) {
      const first = parsed[0];
      if (typeof first === 'string' && first.trim() !== '') return first.trim();
    } else if (typeof parsed === 'string' && parsed.trim() !== '') {
      return parsed.trim();
    }
  } catch {
    if (typeof images === 'string' && images.trim() !== '') return images.trim();
  }
  return defaultFallback;
}

function parseLocation(loc: any): string {
  if (!loc) return 'Dubai, UAE';
  if (typeof loc === 'string') {
    try {
      const parsed = JSON.parse(loc);
      return parsed.address || parsed.city || loc;
    } catch {
      return loc;
    }
  }
  if (typeof loc === 'object') {
    return loc.address || loc.city || 'Dubai, UAE';
  }
  return 'Dubai, UAE';
}

// GET - Fetch products
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const vendorId = searchParams.get('vendorId');
    const isFeatured = searchParams.get('isFeatured');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const requestedSort = searchParams.get('sort') || 'createdAt';
    const sortAliases: Record<string, { field: 'createdAt' | 'price'; order: 'asc' | 'desc' }> = {
      newest: { field: 'createdAt', order: 'desc' },
      price_asc: { field: 'price', order: 'asc' },
      price_desc: { field: 'price', order: 'desc' },
      createdAt: { field: 'createdAt', order: 'desc' },
      price: { field: 'price', order: 'desc' },
    };
    const sortConfig = sortAliases[requestedSort] ?? sortAliases.createdAt!;

    // Build where clause
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (category && category !== 'ALL') {
      where.type = category.toUpperCase();
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Fetch products
    const products = await prisma.product.findMany({
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
      orderBy: {
        [sortConfig.field]: sortConfig.order,
      },
      take: limit,
      skip: offset,
    });

    // Format response
    const formattedProducts = products.map((product) => {
      const mainImg = resolveImageUrl(product.images);
      let imgList: string[] = [mainImg];
      try {
        const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(parsed) && parsed.length > 0) imgList = parsed;
      } catch {}

      return {
        id: product.id,
        name: product.title,
        title: product.title,
        description: product.description || '',
        brand: product.vendor.name,
        vendor: product.vendor.name,
        vendorId: product.vendor.id,
        vendorLocation: parseLocation(product.vendor.location),
        location: parseLocation(product.vendor.location),
        category: product.type,
        price: Number(product.price),
        image: mainImg,
        images: imgList,
        type: product.type,
        stock: product.stock,
        quantity: product.stock,
        sku: product.sku,
        isFeatured: product.isFeatured,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
