import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrderStatus } from '../common/enums';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Execute order checkout from shopping cart' })
  @Post('checkout')
  async checkout(
    @CurrentUser('userId') userId: string,
    @Body() body: { addressId?: string; notes?: string },
  ) {
    return this.ordersService.checkout(userId, body);
  }

  @ApiOperation({ summary: 'List orders for authenticated user/vendor/admin' })
  @Get('orders')
  async getOrders(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @CurrentUser('vendorId') vendorId?: string,
  ) {
    return this.ordersService.getOrders(userId, role, vendorId);
  }

  @ApiOperation({ summary: 'Get order details by orderId' })
  @Get('orders/:orderId')
  async getOrder(
    @Param('orderId') orderId: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.ordersService.getOrder(orderId, userId, role);
  }

  @ApiOperation({ summary: 'Update status of order' })
  @Patch('orders/:orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.ordersService.updateOrderStatus(orderId, body.status);
  }
}
