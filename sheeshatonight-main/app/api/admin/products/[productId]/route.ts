import { NextRequest } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/middleware';
import {
  ValidationError,
  sendSuccess,
  withErrorHandler,
} from '@/lib/errors';
import {
  findProductById,
  updateProductStatus,
  approveProduct,
  rejectProduct,
  deleteProduct,
} from '@/lib/queries';
import { createAuditLog } from '@/lib/utils';

interface ProductActionRequest {
  productId: string;
  action: 'approve' | 'reject' | 'feature' | 'unfeature' | 'delete';
}

/**
 * Handle product actions: approve, reject, feature, unfeature, delete
 * POST /api/admin/products/[productId]
 */
export const POST = withErrorHandler(
  withAdmin(async (req: AuthenticatedRequest) => {
    const body = (await req.json()) as ProductActionRequest;
    const { productId, action } = body;

    // Validate input
    if (!productId || !action) {
      throw new ValidationError('Missing required fields: productId, action');
    }

    const validActions = ['approve', 'reject', 'feature', 'unfeature', 'delete'];
    if (!validActions.includes(action)) {
      throw new ValidationError(`Invalid action. Must be one of: ${validActions.join(', ')}`);
    }

    // Verify product exists
    const product = await findProductById(productId);

    // Perform action
    let result;

    switch (action) {
      case 'approve':
        result = await approveProduct(productId);
        break;

      case 'reject':
        result = await rejectProduct(productId);
        break;

      case 'feature':
        result = await updateProductStatus(productId, 'ACTIVE');
        break;

      case 'unfeature':
        result = await updateProductStatus(productId, 'INACTIVE');
        break;

      case 'delete':
        result = await deleteProduct(productId);
        break;

      default:
        throw new ValidationError(`Unknown action: ${action}`);
    }

    // Create audit log
    if (req.user) {
      await createAuditLog(
        req.user.userId,
        action,
        'product',
        productId,
        product,
        result,
        req
      );
    }

    return sendSuccess(result, 200, {
      message: `Product ${action}d successfully`,
    });
  })
);
