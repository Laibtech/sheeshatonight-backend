import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVendor, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';

/**
 * GET /api/vendor/documents
 * Get vendor documents
 * Uses EXISTING VendorDocument table
 */
export const GET = withVendor(async (req: AuthenticatedRequest) => {
  try {
    const vendorId = req.user!.vendorId!;

    const documents = await prisma.vendorDocument.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });

    // Group by document type for easy display
    const groupedDocs = {
      TRADE_LICENSE: documents.filter(d => d.type === 'TRADE_LICENSE'),
      IDENTITY: documents.filter(d => d.type === 'IDENTITY'),
      BUSINESS_REGISTRATION: documents.filter(d => d.type === 'BUSINESS_REGISTRATION'),
      TAX_CERTIFICATE: documents.filter(d => d.type === 'TAX_CERTIFICATE'),
    };

    // Count by status
    const statusCounts = {
      PENDING: documents.filter(d => d.status === 'PENDING').length,
      APPROVED: documents.filter(d => d.status === 'APPROVED').length,
      REJECTED: documents.filter(d => d.status === 'REJECTED').length,
      EXPIRED: documents.filter(d => d.status === 'EXPIRED').length,
    };

    return successResponse({
      documents: documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        url: doc.url,
        status: doc.status,
        notes: doc.notes,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      grouped: groupedDocs,
      statusCounts,
    });
  } catch (error) {
    console.error('Vendor documents GET error:', error);
    return errorResponse('Failed to fetch documents', 500);
  }
});
