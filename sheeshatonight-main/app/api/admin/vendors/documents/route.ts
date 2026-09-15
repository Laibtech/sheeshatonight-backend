import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';
import { DocStatus } from '@prisma/client';

/**
 * GET /api/admin/vendors/documents
 * List all vendor verification documents
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status as DocStatus;
    }

    const documents = await prisma.vendorDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    return successResponse({ documents });
  } catch (error) {
    console.error('Get vendor documents error:', error);
    return errorResponse('Failed to fetch vendor documents', 500);
  }
});

/**
 * PUT /api/admin/vendors/documents
 * Update vendor document status (APPROVED / REJECTED)
 */
export const PUT = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { documentId, status, notes } = body;

    if (!documentId || !status) {
      return errorResponse('Document ID and status are required', 400);
    }

    const updated = await prisma.vendorDocument.update({
      where: { id: documentId },
      data: {
        status: status as DocStatus,
        notes: notes || undefined,
      },
    });

    return successResponse({ document: updated }, 'Document status updated');
  } catch (error: any) {
    console.error('Update vendor document error:', error);
    return errorResponse(error.message || 'Failed to update document status', 500);
  }
});
