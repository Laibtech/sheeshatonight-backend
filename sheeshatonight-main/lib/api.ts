/**
 * SheeshaTonight API Integration Layer
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  auth: {
    /**
     * Step 1: Login request sending OTP
     */
    login: async (payload: { phone?: string; email?: string }): Promise<LoginResponse> => {
      return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    /**
     * Step 2: Verify age and retrieve JWT token
     */
    ageGateVerify: async (payload: { sessionId: string; ageVerified: boolean }): Promise<AgeGateResponse> => {
      const res = await apiFetch<AgeGateResponse>('/auth/age-gate-verify', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.authToken) {
        localStorage.setItem('auth_token', res.authToken);
      }
      return res;
    },
  },

  notifications: {
    /**
     * Get all notifications for current user
     */
    getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.unreadOnly) query.append('unreadOnly', 'true');
      
      return apiFetch(`/notifications?${query.toString()}`);
    },

    /**
     * Get unread notification count
     */
    getUnreadCount: async () => {
      return apiFetch('/notifications/unread-count');
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (id: string) => {
      return apiFetch(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
      return apiFetch('/notifications/mark-all-read', {
        method: 'POST',
      });
    },

    /**
     * Delete notification
     */
    deleteNotification: async (id: string) => {
      return apiFetch(`/notifications/${id}`, {
        method: 'DELETE',
      });
    },

    /**
     * Get admin alerts (KYC, low stock, etc.)
     */
    getAdminAlerts: async () => {
      return apiFetch('/notifications/admin/alerts');
    },
  },

  marketplace: {
    /**
     * Fetch nearby lounges
     */
    search: async (lat = 25.2048, lng = 55.2708, radius = 10): Promise<{ success: boolean; data: Lounge[] }> => {
      return apiFetch<{ success: boolean; data: Lounge[] }>(`/search?lat=${lat}&lng=${lng}&radius=${radius}`);
    },

    /**
     * Get specific product detail
     */
    getProduct: async (id: string): Promise<{ success: boolean; data: Product }> => {
      return apiFetch<{ success: boolean; data: Product }>(`/products/${id}`);
    },
  },

  orders: {
    /**
     * Place order checkout
     */
    checkout: async (payload: {
      userId: string;
      vendorId: string;
      items: any[];
      totalAmount: number;
    }): Promise<CheckoutResponse> => {
      return apiFetch<CheckoutResponse>('/cart/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    /**
     * Update order status
     */
    updateStatus: async (orderId: string, status: string): Promise<OrderStatusResponse> => {
      return apiFetch<OrderStatusResponse>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  admin: {
    /**
     * Get pending KYC vendors
     */
    getPendingVendors: async (): Promise<{ success: boolean; data: PendingVendor[] }> => {
      return apiFetch<{ success: boolean; data: PendingVendor[] }>('/admin/vendors/pending');
    },

    /**
     * Approve vendor KYC
     */
    approveVendor: async (vendorId: string): Promise<ApproveVendorResponse> => {
      return apiFetch<ApproveVendorResponse>(`/admin/vendors/${vendorId}/approve`, {
        method: 'PATCH',
      });
    },

    /**
     * Reject vendor KYC
     */
    rejectVendor: async (vendorId: string, reason: string): Promise<ApproveVendorResponse> => {
      return apiFetch<ApproveVendorResponse>(`/admin/vendors/${vendorId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
  },
};
