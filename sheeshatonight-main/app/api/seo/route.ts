import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SEO_CONFIG } from '@/app/api/admin/seo/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const record = await prisma.cmsContent.findUnique({
      where: { key: 'seo_settings' },
    });

    const config = record?.value || DEFAULT_SEO_CONFIG;

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_SEO_CONFIG,
    });
  }
}
