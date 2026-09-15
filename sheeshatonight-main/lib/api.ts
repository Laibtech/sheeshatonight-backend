/**
 * SheeshaTonight API Integration Layer
 * Now points to real Next.js API routes with database backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Centrally managed fetch wrapper with bearer token injection and error handling.
 */
async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject authentication token from localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new ApiError(data.message || data.error || 'Request failed', response.status, data);
  }

  return data as T;
}

export interface AuthUser {
  id: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  email: string;
  name?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  sessionId: string;
}

export interface AgeGateResponse {
  success: boolean;
  message: string;
  authToken: string;
  user: AuthUser;
}

export interface Lounge {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviews: number;
  location?: string;
  price?: string;
  badge?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  vendor: string;
  description?: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  status: string;
  message: string;
}

export interface OrderStatusResponse {
  success: boolean;
  orderId: string;
  newStatus: string;
}

export interface PendingVendor {
  vendorId: string;
  name: string;
  status: string;
  licenseUrl?: string;
  identityUrl?: string;
}

export interface ApproveVendorResponse {
  success: boolean;
  vendorId: string;
  newStatus: 'APPROVED' | 'REJECTED';
}

export const api = {
  // Note: Real auth endpoints are in /api/auth/login and /api/auth/register
  // These stub methods are kept for backward compatibility with existing frontend code
  // but should be migrated to use the real auth endpoints
  auth: {
    /**
     * @deprecated Use /api/auth/login instead
     * Legacy login stub - returns fake session for backward compatibility
     */
    login: async (payload: { phone?: string; email?: string }): Promise<LoginResponse> => {
      console.warn('Using deprecated auth.login - migrate to /api/auth/login');
      return {
        success: true,
        message: 'Please use /api/auth/login endpoint',
        sessionId: 'deprecated',
      };
    },

    /**
     * @deprecated Use /api/auth/register and /api/auth/login instead
     * Legacy age gate stub
     */
    ageGateVerify: async (payload: { sessionId: string; ageVerified: boolean }): Promise<AgeGateResponse> => {
      console.warn('Using deprecated ageGateVerify - migrate to real auth flow');
      return {
        success: false,
        message: 'Please use /api/auth/login endpoint',
        authToken: '',
        user: { id: '', role: 'CUSTOMER', email: '', name: '' },
      };
    },
  },

  notifications: {
    /**
     * @deprecated Mock endpoint - Notification system not yet fully implemented
     */
    getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
      console.warn('Notification system not yet implemented');
      return { success: true, data: [] };
    },

    getUnreadCount: async () => {
      console.warn('Notification system not yet implemented');
      return { success: true, count: 0 };
    },

    markAsRead: async (id: string) => {
      console.warn('Notification system not yet implemented');
      return { success: true };
    },

    markAllAsRead: async () => {
      console.warn('Notification system not yet implemented');
      return { success: true };
    },

    deleteNotification: async (id: string) => {
      console.warn('Notification system not yet implemented');
      return { success: true };
    },

    getAdminAlerts: async () => {
      console.warn('Notification system not yet implemented');
      return { success: true, data: [] };
    },
  },

  marketplace: {
    /**
     * @deprecated Mock endpoint - Use apiNext.vendors.getVendors() instead
     */
    search: async (lat = 25.2048, lng = 55.2708, radius = 10): Promise<{ success: boolean; data: Lounge[] }> => {
      console.warn('Using deprecated marketplace.search - use apiNext.vendors.getVendors()');
      return { success: true, data: [] };
    },

    /**
     * @deprecated Use /api/products/[id] instead
     */
    getProduct: async (id: string): Promise<{ success: boolean; data: Product }> => {
      console.warn('Using deprecated marketplace.getProduct - use /api/products/[id]');
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json();
    },
  },

  orders: {
    /**
     * @deprecated Use /api/checkout instead
     */
    checkout: async (payload: {
      userId: string;
      vendorId: string;
      items: any[];
      totalAmount: number;
    }): Promise<CheckoutResponse> => {
      console.warn('Using deprecated orders.checkout - use /api/checkout');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Checkout failed');
      }
      const data = await response.json();
      return {
        success: data.success,
        orderId: data.data?.orders?.[0]?.id || '',
        status: 'PREPARING',
        message: data.message,
      };
    },

    /**
     * @deprecated Use /api/orders/[orderId] POST instead
     */
    updateStatus: async (orderId: string, status: string): Promise<OrderStatusResponse> => {
      console.warn('Using deprecated orders.updateStatus - use /api/orders/[orderId] POST');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      const data = await response.json();
      return {
        success: data.success,
        orderId,
        newStatus: data.data?.status || status,
      };
    },
  },

  admin: {
    /**
     * @deprecated Mock endpoint - Use /api/admin/vendors with filters instead
     */
    getPendingVendors: async (): Promise<{ success: boolean; data: PendingVendor[] }> => {
      console.warn('Using deprecated admin.getPendingVendors - use /api/admin/vendors?isActive=false');
      const response = await fetch('/api/admin/vendors?isActive=false');
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const data = await response.json();
      return {
        success: true,
        data: data.data?.map((v: any) => ({
          vendorId: v.id,
          name: v.name,
          status: v.isActive ? 'APPROVED' : 'PENDING',
          licenseUrl: v.tradeLicense,
        })) || [],
      };
    },

    /**
     * Use /api/admin/vendors/[vendorId] POST with action: 'approve'
     */
    approveVendor: async (vendorId: string): Promise<ApproveVendorResponse> => {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, action: 'approve' }),
      });
      if (!response.ok) {
        throw new Error('Failed to approve vendor');
      }
      const data = await response.json();
      return {
        success: data.success,
        vendorId,
        newStatus: 'APPROVED',
      };
    },

    /**
     * Use /api/admin/vendors/[vendorId] POST with action: 'reject'
     */
    rejectVendor: async (vendorId: string, reason: string): Promise<ApproveVendorResponse> => {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, action: 'reject', reason }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject vendor');
      }
      const data = await response.json();
      return {
        success: data.success,
        vendorId,
        newStatus: 'REJECTED',
      };
    },
  },
};


export interface ProductItem {
  id: string;
  name: string;
  title: string;
  brand: string;
  vendor: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  type: string;
  quantity: number;
  slug: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  verified: boolean;
  image: string;
  tags: string[];
  description?: string;
  website?: string;
  socialMedia?: any;
}

export const apiNext = {
  products: {
    /**
     * Fetch products by category
     */
    getProducts: async (params?: {
      category?: string;
      type?: 'SALE' | 'RENTAL';
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }): Promise<{ success: boolean; data: ProductItem[]; count: number }> => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.type) query.append('type', params.type);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.order) query.append('order', params.order);
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.offset) query.append('offset', params.offset.toString());
      
      const response = await fetch(`/api/products?${query.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  },

  vendors: {
    /**
     * Fetch vendors
     */
    getVendors: async (params?: {
      category?: string;
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }): Promise<{ success: boolean; data: VendorItem[]; count: number }> => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.order) query.append('order', params.order);
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.offset) query.append('offset', params.offset.toString());
      
      const response = await fetch(`/api/vendors?${query.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      return response.json();
    },
  },
};
