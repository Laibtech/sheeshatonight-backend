import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/health
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: true,
      message: 'Backend is healthy',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
