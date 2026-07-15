import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Production-Ready Error Handler
 * Centralized error handling for all API endpoints
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

/**
 * Check if error is an ApiError
 */
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): ValidationError {
  const details: Record<string, any> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    details[path] = err.message;
  });

  return new ValidationError('Validation failed', details);
}

/**
 * Parse and handle errors from promise rejection
 */
export function parseError(error: any): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message);
  }

  return new InternalServerError('An unexpected error occurred');
}

/**
 * Global error handler for API routes
 */
export function handleApiError(error: any, request?: NextRequest): NextResponse {
  const parsedError = parseError(error);

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', {
      statusCode: parsedError.statusCode,
      code: parsedError.code,
      message: parsedError.message,
      details: parsedError.details,
      path: request?.nextUrl.pathname,
      method: request?.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Don't leak internal error details to client in production
  const clientDetails =
    process.env.NODE_ENV === 'production' && parsedError.statusCode >= 500
      ? undefined
      : parsedError.details;

  const response: any = {
    success: false,
    error: parsedError.message,
    ...(parsedError.code && { code: parsedError.code }),
    ...(clientDetails && { details: clientDetails }),
  };

  // Add retry-after header for rate limit errors
  const headers: Record<string, string> = {};
  if (parsedError instanceof RateLimitError) {
    headers['Retry-After'] = parsedError.retryAfter.toString();
  }

  return NextResponse.json(response, {
    status: parsedError.statusCode,
    headers,
  });
}

/**
 * Safe async handler wrapper for API routes
 * Automatically catches and formats errors
 */
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return handleApiError(error, req);
    }
  };
}

/**
 * Structured response builders
 */

export interface SuccessResponsePayload<T = any> {
  success: true;
  data?: T;
  message?: string;
  code?: string;
  meta?: Record<string, any>;
}

export interface ErrorResponsePayload {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Build success response
 */
export function buildSuccessResponse<T = any>(
  data?: T,
  options?: {
    message?: string;
    code?: string;
    meta?: Record<string, any>;
  }
): SuccessResponsePayload<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...options,
  };
}

/**
 * Build error response
 */
export function buildErrorResponse(
  message: string,
  options?: {
    code?: string;
    details?: Record<string, any>;
  }
): ErrorResponsePayload {
  return {
    success: false,
    error: message,
    ...options,
  };
}

/**
 * Send success response
 */
export function sendSuccess<T = any>(
  data?: T,
  statusCode: number = 200,
  options?: {
    message?: string;
    code?: string;
    meta?: Record<string, any>;
  }
): NextResponse {
  return NextResponse.json(buildSuccessResponse(data, options), { status: statusCode });
}

/**
 * Send error response
 */
export function sendError(
  message: string,
  statusCode: number = 400,
  options?: {
    code?: string;
    details?: Record<string, any>;
  }
): NextResponse {
  return NextResponse.json(buildErrorResponse(message, options), { status: statusCode });
}

/**
 * Paginated response builder
 */
export interface PaginatedResponsePayload<T = any> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

export function buildPaginatedResponse<T = any>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): PaginatedResponsePayload<T> {
  const pages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
    ...(message && { message }),
  };
}

/**
 * Send paginated response
 */
export function sendPaginated<T = any>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode: number = 200,
  message?: string
): NextResponse {
  return NextResponse.json(buildPaginatedResponse(data, page, limit, total, message), {
    status: statusCode,
  });
}
