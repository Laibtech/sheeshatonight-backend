import { z } from 'zod';

/**
 * Authentication Validation Schemas
 */

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number, and special character'
  ),
  confirmPassword: z.string(),
  role: z.enum(['CUSTOMER', 'VENDOR']).default('CUSTOMER'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Vendor Validation Schemas
 */

export const vendorCreateSchema = z.object({
  name: z.string().min(2, 'Vendor name must be at least 2 characters').max(150),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    city: z.string(),
    address: z.string(),
  }).optional(),
  tier: z.enum(['SOLO', 'MASTER', 'ADVANCED']).default('SOLO'),
});

export const vendorUpdateSchema = vendorCreateSchema.partial();

/**
 * Product Validation Schemas
 */

export const productCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  sku: z.string().min(1, 'SKU is required').max(100),
  barcode: z.string().optional(),
  quantity: z.number().int().min(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

/**
 * Order Validation Schemas
 */

export const orderCreateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().cuid('Invalid product ID'),
      quantity: z.number().int().positive('Quantity must be greater than 0'),
      price: z.number().positive('Price must be greater than 0'),
    })
  ).min(1, 'Order must contain at least one item'),
  shippingAddressId: z.string().cuid().optional(),
  shippingAddress: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().optional(),
    country: z.string().default('AE'),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'CASH_ON_DELIVERY', 'WALLET']),
});

export const orderUpdateSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]).optional(),
  shippingTrackingId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * KYC Validation Schemas
 */

export const kycSubmitSchema = z.object({
  documentType: z.enum(['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE']),
  documentNumber: z.string().min(3).max(50),
  dateOfBirth: z.string().datetime(),
  documentImages: z.array(z.string().url()).min(1).max(5),
  addressProof: z.string().url().optional(),
});

/**
 * Review & Rating Schemas
 */

export const reviewSchema = z.object({
  orderId: z.string().cuid(),
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
  images: z.array(z.string().url()).max(5).optional(),
});

/**
 * Pagination & Filtering
 */

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Export types from schemas
 */

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VendorCreateInput = z.infer<typeof vendorCreateSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
export type KYCSubmitInput = z.infer<typeof kycSubmitSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
