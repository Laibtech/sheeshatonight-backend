import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHome(@Res() res: Response) {
    return res.redirect('/api/docs');
  }

  @Get('health')
  getHealth() {
    return {
      success: true,
      service: 'SheeshaTonight NestJS API',
      status: 'UP',
      documentation: '/api/docs',
      timestamp: new Date().toISOString(),
    };
  }

  // Public CMS endpoints for Customer Website
  @Get('api/cms/pages')
  async getPublicCmsPages() {
    const pages = await this.prisma.cmsPage.findMany({
      where: { isActive: true },
      select: { id: true, title: true, slug: true, updatedAt: true },
    });
    return { success: true, data: pages };
  }

  @Get('api/cms/pages/:slug')
  async getPublicCmsPageBySlug(@Param('slug') slug: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { slug },
    });
    return { success: true, data: page };
  }

  @Get('api/cms/banners')
  async getPublicCmsBanners() {
    const banners = await this.prisma.cmsBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: banners };
  }

  @Get('api/cms/content/:key')
  async getPublicCmsContent(@Param('key') key: string) {
    const content = await this.prisma.cmsContent.findUnique({
      where: { key },
    });
    return { success: true, data: content ? content.value : null };
  }
}

