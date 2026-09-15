import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        verified: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async getAddresses(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return { success: true, data: addresses };
  }

  async addAddress(
    userId: string,
    body: {
      label: string;
      street: string;
      building?: string;
      city: string;
      country: string;
      zipcode?: string;
      isDefault?: boolean;
    },
  ) {
    if (body.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        userId,
        label: body.label,
        street: body.street,
        building: body.building,
        city: body.city,
        country: body.country,
        zipcode: body.zipcode,
        isDefault: body.isDefault || false,
      },
    });

    return { success: true, address };
  }

  async deleteAddress(userId: string, addressId: string) {
    const addr = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!addr) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({ where: { id: addressId } });
    return { success: true, message: 'Address deleted' };
  }
}
