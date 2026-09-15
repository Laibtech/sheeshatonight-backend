import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get administrative dashboard statistics' })
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @ApiOperation({ summary: 'List and filter platform users' })
  @Get('users')
  async getUsers(@Query() query: any) {
    return this.adminService.getUsers(query);
  }

  @ApiOperation({ summary: 'Update user status or verification' })
  @Patch('users/:userId')
  async updateUserStatus(
    @Param('userId') userId: string,
    @Body() body: { status?: string; verified?: boolean },
  ) {
    return this.adminService.updateUserStatus(userId, body);
  }

  @ApiOperation({ summary: 'List and filter platform vendors' })
  @Get('vendors')
  async getVendors(@Query() query: any) {
    return this.adminService.getVendors(query);
  }

  @ApiOperation({ summary: 'Approve, reject, or update vendor' })
  @Patch('vendors/:vendorId')
  async updateVendorStatus(
    @Param('vendorId') vendorId: string,
    @Body() body: { isActive?: boolean; tier?: any },
  ) {
    return this.adminService.updateVendorStatus(vendorId, body);
  }

  @ApiOperation({ summary: 'List all products across vendors' })
  @Get('products')
  async getProducts() {
    return this.adminService.getProducts();
  }

  @ApiOperation({ summary: 'Create new product' })
  @Post('products')
  async createProduct(@Body() body: any) {
    return this.adminService.createProduct(body);
  }

  @ApiOperation({ summary: 'Toggle product active/featured status or update price/stock' })
  @Patch('products/:productId')
  async updateProductStatus(
    @Param('productId') productId: string,
    @Body() body: { isActive?: boolean; isFeatured?: boolean; stock?: number; price?: number },
  ) {
    return this.adminService.updateProductStatus(productId, body);
  }

  @ApiOperation({ summary: 'Delete product' })
  @Delete('products/:productId')
  async deleteProduct(@Param('productId') productId: string) {
    return this.adminService.deleteProduct(productId);
  }

  // Category endpoints
  @ApiOperation({ summary: 'List all categories' })
  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @ApiOperation({ summary: 'Create new category' })
  @Post('categories')
  async createCategory(@Body() body: any) {
    return this.adminService.createCategory(body);
  }

  @ApiOperation({ summary: 'Update category' })
  @Patch('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCategory(id, body);
  }

  @ApiOperation({ summary: 'Delete category' })
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  // Coupon endpoints
  @ApiOperation({ summary: 'List all coupons' })
  @Get('coupons')
  async getCoupons() {
    return this.adminService.getCoupons();
  }

  @ApiOperation({ summary: 'Create new coupon' })
  @Post('coupons')
  async createCoupon(@Body() body: any) {
    return this.adminService.createCoupon(body);
  }

  @ApiOperation({ summary: 'Update coupon' })
  @Patch('coupons/:id')
  async updateCoupon(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCoupon(id, body);
  }

  @ApiOperation({ summary: 'Delete coupon' })
  @Delete('coupons/:id')
  async deleteCoupon(@Param('id') id: string) {
    return this.adminService.deleteCoupon(id);
  }

  // Review endpoints
  @ApiOperation({ summary: 'List all customer reviews' })
  @Get('reviews')
  async getReviews() {
    return this.adminService.getReviews();
  }

  @ApiOperation({ summary: 'Update review status' })
  @Patch('reviews/:id')
  async updateReviewStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateReviewStatus(id, body.status);
  }

  @ApiOperation({ summary: 'Delete review' })
  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }

  // CMS Banners
  @ApiOperation({ summary: 'Get all CMS banners' })
  @Get('cms/banners')
  async getCmsBanners() {
    return this.adminService.getCmsBanners();
  }

  @ApiOperation({ summary: 'Create CMS banner' })
  @Post('cms/banners')
  async createCmsBanner(@Body() body: any) {
    return this.adminService.createCmsBanner(body);
  }

  @ApiOperation({ summary: 'Update CMS banner' })
  @Patch('cms/banners/:id')
  async updateCmsBanner(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCmsBanner(id, body);
  }

  @ApiOperation({ summary: 'Delete CMS banner' })
  @Delete('cms/banners/:id')
  async deleteCmsBanner(@Param('id') id: string) {
    return this.adminService.deleteCmsBanner(id);
  }

  // CMS Pages
  @ApiOperation({ summary: 'Get all CMS pages' })
  @Get('cms/pages')
  async getCmsPages() {
    return this.adminService.getCmsPages();
  }

  @ApiOperation({ summary: 'Create CMS page' })
  @Post('cms/pages')
  async createCmsPage(@Body() body: any) {
    return this.adminService.createCmsPage(body);
  }

  @ApiOperation({ summary: 'Update CMS page' })
  @Patch('cms/pages/:id')
  async updateCmsPage(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCmsPage(id, body);
  }

  // CMS Content (Key-Value e.g. hero, nav)
  @ApiOperation({ summary: 'Get CMS content by key' })
  @Get('cms/content/:key')
  async getCmsContent(@Param('key') key: string) {
    return this.adminService.getCmsContent(key);
  }

  @ApiOperation({ summary: 'Update CMS content by key' })
  @Post('cms/content/:key')
  async updateCmsContent(@Param('key') key: string, @Body() body: any) {
    return this.adminService.updateCmsContent(key, body);
  }

  // Orders
  @ApiOperation({ summary: 'Get all platform orders' })
  @Get('orders')
  async getOrders() {
    return this.adminService.getOrders();
  }

  @ApiOperation({ summary: 'Update order status' })
  @Patch('orders/:id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.adminService.updateOrderStatus(id, body.status);
  }

  @ApiOperation({ summary: 'List system audit logs' })
  @Get('audit-logs')
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
