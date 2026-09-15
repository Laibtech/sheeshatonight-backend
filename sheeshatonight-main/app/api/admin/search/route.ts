import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/admin/search
 * Global search across Orders, Products, Customers, and Vendors (Admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const [orders, products, customers, vendors] = await Promise.all([
      // Search Orders
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q } },
            { user: { name: { contains: q } } },
            { user: { email: { contains: q } } },
          ],
        },
        take: 4,
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          user: { select: { name: true } },
        },
      }),

      // Search Products
      prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { sku: { contains: q } },
          ],
        },
        take: 4,
        select: {
          id: true,
          title: true,
          sku: true,
          price: true,
          stock: true,
        },
      }),

      // Search Customers
      prisma.user.findMany({
        where: {
          role: 'CUSTOMER',
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        },
        take: 4,
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),

      // Search Vendors
      prisma.vendor.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
            { phone: { contains: q } },
          ],
        },
        take: 4,
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          isActive: true,
        },
      }),
    ]);

    const results = [
      ...orders.map((o) => ({
        id: o.id,
        type: 'order' as const,
        title: `Order #${o.orderNumber}`,
        subtitle: `${o.user?.name || 'Customer'} • AED ${Number(o.totalAmount)}`,
        badge: o.status,
        url: `/admin/orders/${o.id}`,
      })),
      ...products.map((p) => ({
        id: p.id,
        type: 'product' as const,
        title: p.title,
        subtitle: `SKU: ${p.sku || 'N/A'} • AED ${Number(p.price)} • Stock: ${p.stock}`,
        badge: p.stock <= 5 ? 'Low Stock' : undefined,
        url: `/admin/products/${p.id}`,
      })),
      ...customers.map((c) => ({
        id: c.id,
        type: 'customer' as const,
        title: c.name,
        subtitle: c.email,
        url: `/admin/customers/${c.id}`,
      })),
      ...vendors.map((v) => ({
        id: v.id,
        type: 'vendor' as const,
        title: v.name,
        subtitle: `Tier: ${v.tier} • ${v.isActive ? 'Active' : 'Inactive'}`,
        badge: v.tier,
        url: `/admin/vendors/${v.id}`,
      })),
    ];

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Global search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute global search' },
      { status: 500 }
    );
  }
});
