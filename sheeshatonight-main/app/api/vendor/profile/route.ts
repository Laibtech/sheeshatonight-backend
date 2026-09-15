import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/vendor/profile
 * Get vendor profile details
 * Uses EXISTING Vendor and User tables
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            dob: true,
            locale: true,
            verified: true,
            kycStatus: true,
            status: true,
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vendor) {
      return errorResponse('Vendor not found', 404, 'NOT_FOUND');
    }

    return successResponse({
      id: vendor.id,
      userId: vendor.userId,
      name: vendor.name,
      slug: vendor.slug,
      description: vendor.description,
      tradeLicense: vendor.tradeLicense,
      tier: vendor.tier,
      planExpiry: vendor.planExpiry,
      isActive: vendor.isActive,
      location: vendor.location,
      phone: vendor.phone,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
      user: vendor.user,
      documents: vendor.documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        url: doc.url,
        status: doc.status,
        notes: doc.notes,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Vendor profile GET error:', error);
    return errorResponse('Failed to fetch profile', 500);
  }
});

/**
 * PATCH /api/vendor/profile
 * Update vendor profile
 * Uses EXISTING Vendor table fields
 */
export const PATCH = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;
    const body = await req.json();

    // Only allow updating certain fields
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = body.location;

    // Update vendor
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return successResponse(updatedVendor, 'Profile updated successfully');
  } catch (error) {
    console.error('Vendor profile PATCH error:', error);
    return errorResponse('Failed to update profile', 500);
  }
});
