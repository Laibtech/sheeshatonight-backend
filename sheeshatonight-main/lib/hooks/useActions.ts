'use client';

import { useState, useCallback } from 'react';
import { adminAPI, vendorAPI, orderAPI } from '@/lib/api-client';

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const useActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performAction = useCallback(
    async (
      resource: 'vendor' | 'product' | 'user' | 'order' | 'vendor-product',
      id: string,
      action: string,
      scope?: 'admin' | 'vendor'
    ): Promise<ActionResult> => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (scope === 'admin') {
          if (resource === 'vendor') {
            response = await adminAPI.updateVendor(id, { status: action });
          } else if (resource === 'product') {
            if (action === 'delete') {
              response = await adminAPI.deleteProduct(id);
            } else {
              response = await adminAPI.updateProduct(id, { action });
            }
          } else if (resource === 'user') {
            response = await adminAPI.updateUser(id, { status: action });
          }
        } else if (scope === 'vendor') {
          if (resource === 'vendor-product') {
            if (action === 'delete') {
              response = await adminAPI.deleteProduct(id);
            } else {
              response = await vendorAPI.productAction(id, action);
            }
          }
        } else if (resource === 'order') {
          response = await orderAPI.performAction(id, action);
        }

        if (!response || response.success === false) {
          throw new Error(response?.error || response?.message || 'Action failed');
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    performAction,
    clearError,
  };
};
