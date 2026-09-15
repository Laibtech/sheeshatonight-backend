import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sheeshatonight.com';

  // Static routes
  const staticPages = [
    '',
    '/rentals',
    '/shop',
    '/experiences',
    '/about',
    '/contact',
    '/blogs',
    '/auth/login',
    '/auth/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic products
  let productPages: any[] = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, deletedAt: null },
      select: { id: true, updatedAt: true },
      take: 100,
    });
    productPages = products.map((p) => ({
      url: `${baseUrl}/shop/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (e) {}

  return [...staticPages, ...productPages];
}
