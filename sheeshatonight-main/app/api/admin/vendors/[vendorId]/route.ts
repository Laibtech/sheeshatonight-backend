import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest } from '@/lib/middleware';
import {
  ValidationError,
  NotFoundError,
  sendSuccess,
  sendError,
  withErrorHandler,
} from '@/lib/errors';
import {
  updateVendorStatus,
  findVendorById,
  deleteUser,
} from '@/lib/queries';
import { createAuditLog } from '@/lib/utils';

interface VendorActionRequest {
  vendorId: string;
  action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete';
}

/**
 * Handle vendor actions: approve, reject, activate, deactivate, delete
 * POST /api/admin/vendors/[vendorId]
 */
export const POST = withErrorHandler(
  withAdmin(async (req: AuthenticatedRequest) => {
    try {
      // Parse request body
      const body = (await req.json()) as VendorActionRequest;
      const { vendorId, action } = body;

      // Validate input
      if (!vendorId || !action) {
        throw new ValidationError('Missing required fields: vendorId, action');
      }

      const validActions = ['approve', 'reject', 'activate', 'deactivate', 'delete'];
      if (!validActions.includes(action)) {
        throw new ValidationError(`Invalid action. Must be one of: ${validActions.join(', ')}`);
      }

      // Verify vendor exists
      const vendor = await findVendorById(vendorId);

      // Perform action
      let result;

      switch (action) {
        case 'approve':
          result = await updateVendorStatus(vendorId, true);
          break;

        case 'reject':
          result = await updateVendorStatus(vendorId, false);
          break;

        case 'activate':
          result = await updateVendorStatus(vendorId, true);
          break;

        case 'deactivate':
          result = await updateVendorStatus(vendorId, false);
          break;

        case 'delete':
          // Delete vendor user account (cascades to vendor)
          result = await deleteUser(vendor.userId);
          break;

        default:
          throw new ValidationError(`Unknown action: ${action}`);
      }

      // Create audit log
      if (req.user) {
        await createAuditLog(
          req.user.userId,
          action,
          'vendor',
          vendorId,
          vendor,
          result,
          req
        );
      }

      return sendSuccess(result, 200, {
        message: `Vendor ${action}d successfully`,
      });
    } catch (error) {
      throw error;
    }
  })
);
