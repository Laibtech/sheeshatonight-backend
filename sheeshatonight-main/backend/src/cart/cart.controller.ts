import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Get authenticated user cart' })
  @Get()
  async getCart(@CurrentUser('userId') userId: string) {
    const data = await this.cartService.getCart(userId);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Add product to cart' })
  @Post()
  async addToCart(
    @CurrentUser('userId') userId: string,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cartService.addToCart(userId, body.productId, body.quantity || 1);
  }

  @ApiOperation({ summary: 'Update cart item quantity' })
  @Patch(':itemId')
  async updateQuantity(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateQuantity(userId, itemId, body.quantity);
  }

  @ApiOperation({ summary: 'Remove item from cart' })
  @Delete(':itemId')
  async removeItem(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @ApiOperation({ summary: 'Clear all items from cart' })
  @Delete()
  async clearCart(@CurrentUser('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
