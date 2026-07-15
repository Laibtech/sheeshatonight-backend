import { z } from 'zod';

// ========================================
// Common Validation Patterns
// ========================================

export const emailSchema = z.string().email('Invalid email format').toLowerCase();

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 international format)')
  .optional();

export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .finite('Price must be a valid number')
  .refine((val) => Number(val.toFixed(2)) === val, 'Price must have at most 2 decimal places');

export const dateSchema = z
  .string()
  .datetime('Invalid date format (ISO 8601 required)')
  .or(z.date());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// ========================================
// Authentication Schemas
// ========================================

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// ========================================
// User Management Schemas
// ========================================

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: phoneSchema,
  dob: dateSchema.optional(),
  locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, 'Invalid locale format (e.g., en-AE)').optional(),
});

export const updateUserKycSchema = z.object({
  kycStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

// ========================================
// Address Schemas
// ========================================

export const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  street: z.string().min(1, 'Street is required').max(200),
  building: z.string().max(100).optional(),
  city: z.string().min(1, 'City is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  zipcode: z.string().max(20).optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

// ========================================
// Product Schemas
// ========================================

export const productTypeEnum = z.enum([
  'SHEESHA_PIPE',
  'TOBACCO_BLEND',
  'ACCESSORY',
  'RENTAL_PACKAGE',
  'EQUIPMENT',
]);

export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  type: productTypeEnum,
  price: priceSchema,
  currency: z.string().length(3, 'Currency must be 3-letter code (e.g., AED)').default('AED'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  sku: z.string().max(50).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  type: productTypeEnum.optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  vendorId: z.string().optional(),
  search: z.string().max(200).optional(),
  inStock: z.boolean().optional(),
});

// ========================================
// Order Schemas
// ========================================

export const orderStatusEnum = z.enum([
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'ACTIVE_RENTAL',
  'COMPLETED',
  'CANCELLED',
]);

export const createOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  items: z.array(createOrderItemSchema).min(1, 'At least one item is required'),
  rentalStartDate: dateSchema.optional(),
  rentalEndDate: dateSchema.optional(),
  notes: z.string().max(500).optional(),
});

export const updateOrderSchema = z.object({
  notes: z.string().max(500).optional(),
  rentalStartDate: dateSchema.optional(),
  rentalEndDate: dateSchema.optional(),
});

// ========================================
// Vendor Schemas
// ========================================

export const vendorTierEnum = z.enum(['SOLO', 'MASTER', 'ADVANCED']);

export const createVendorSchema = z.object({
  name: z.string().min(2, 'Vendor name must be at least 2 characters').max(200),
  description: z.string().max(1000).optional(),
  location: z.string().max(500).optional(), // JSON string
  phone: phoneSchema,
});

export const updateVendorProfileSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional(),
  location: z.string().max(500).optional(),
  phone: phoneSchema,
});

export const updateVendorAdminSchema = z.object({
  tier: vendorTierEnum.optional(),
  planExpiry: dateSchema.optional(),
  location: z.string().max(500).optional(),
});

export const vendorDocumentTypeEnum = z.enum([
  'TRADE_LICENSE',
  'IDENTITY',
  'BUSINESS_REGISTRATION',
  'TAX_CERTIFICATE',
]);

export const createVendorDocumentSchema = z.object({
  type: vendorDocumentTypeEnum,
  url: z.string().url('Invalid document URL'),
  notes: z.string().max(500).optional(),
});

// ========================================
// Cart Schemas
// ========================================

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// ========================================
// Settlement Schemas
// ========================================

export const settlementStatusEnum = z.enum(['PENDING', 'PROCESSED', 'PAID', 'FAILED']);

export const createSettlementSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be in format YYYY-MM'),
  amount: priceSchema,
  commission: priceSchema,
});

export const updateSettlementSchema = z.object({
  status: settlementStatusEnum,
});

// ========================================
// Pagination and Sorting Schemas
// ========================================

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ========================================
// Action Schemas
// ========================================

export const productActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'feature', 'unfeature', 'delete']),
});

export const vendorActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'activate', 'deactivate']),
});

export const orderActionSchema = z.object({
  action: z.enum(['accept', 'decline', 'ship', 'deliver', 'cancel']),
});

export const bulkActionSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  ids: z.array(z.string()).min(1, 'At least one ID is required').max(100, 'Maximum 100 items per bulk action'),
});

// ========================================
// Helper Functions
// ========================================

/**
 * Format Zod validation errors into user-friendly messages
 */
export function formatZodErrors(errors: z.ZodIssue[]): Record<string, string> {
  const formatted: Record<string, string> = {};
  errors.forEach((error) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });
  return formatted;
}

/**
 * Validate and parse request body with schema
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string> }> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: formatZodErrors(result.error.errors),
  };
}
