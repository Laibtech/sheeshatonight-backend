import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  async me(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.getProfile(userId);
    return { success: true, user };
  }

  @ApiOperation({ summary: 'List current user saved addresses' })
  @Get('me/addresses')
  async getAddresses(@CurrentUser('userId') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @ApiOperation({ summary: 'Add a new saved delivery address' })
  @Post('me/addresses')
  async addAddress(
    @CurrentUser('userId') userId: string,
    @Body() body: any,
  ) {
    return this.usersService.addAddress(userId, body);
  }

  @ApiOperation({ summary: 'Delete a saved address' })
  @Delete('me/addresses/:addressId')
  async deleteAddress(
    @CurrentUser('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.deleteAddress(userId, addressId);
  }
}
