import { NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export const POST = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'approve-kyc':
        result = await prisma.user.update({
          where: { id: userId },
          data: { 
            kycStatus: 'APPROVED',
            kycApprovedAt: new Date(),
          },
        });
        break;

      case 'reject-kyc':
        result = await prisma.user.update({
          where: { id: userId },
          data: { 
            kycStatus: 'REJECTED',
            kycRejectedAt: new Date(),
          },
        });
        break;

      case 'activate':
        result = await prisma.user.update({
          where: { id: userId },
          data: { status: 'ACTIVE' },
        });
        break;

      case 'deactivate':
        result = await prisma.user.update({
          where: { id: userId },
          data: { status: 'INACTIVE' },
        });
        break;

      case 'delete':
        result = await prisma.user.delete({
          where: { id: userId },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('User action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
