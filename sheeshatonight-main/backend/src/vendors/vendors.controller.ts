import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('vendors')
@Controller()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @ApiOperation({ summary: 'List active marketplace vendors' })
  @Get('vendors')
  async findAll(@Query() query: any) {
    return this.vendorsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get vendor store details by ID' })
  @Get('vendors/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.vendorsService.findOne(id);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Submit vendor application (Requires Auth)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('vendor/apply')
  async apply(
    @CurrentUser('userId') userId: string,
    @Body() body: { name: string; description?: string; phone?: string },
  ) {
    return this.vendorsService.apply(userId, body);
  }
}
