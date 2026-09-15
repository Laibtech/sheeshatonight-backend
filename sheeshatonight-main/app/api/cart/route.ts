import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import type { Cart, Product, Vendor } from '@prisma/client';

type CartWithProduct = Cart & {
  product: Product & {
    vendor: Pick<Vendor, 'name'>;
  };
};

// GET - Fetch user's cart
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch cart items for user with product details
    const cartItems = (await prisma.cart.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            vendor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })) as any as CartWithProduct[];

    if (cartItems.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          total: 0,
        },
      });
    }

    // Calculate subtotal from actual product prices
    let subtotal = 0;
    const formattedItems = cartItems.map((item) => {
      const itemTotal = Number(item.product.price) * item.quantity;
      subtotal += itemTotal;
      
      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: Number(item.product.price),
          currency: item.product.currency,
          images: item.product.images,
          stock: item.product.stock,
          isActive: item.product.isActive,
          vendor: item.product.vendor.name,
        },
        itemTotal,
        createdAt: item.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        subtotal,
        total: subtotal, // Can add tax/shipping later
      },
    });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
});

// POST - Add item to cart
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true, stock: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product is not available' },
        { status: 400 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity (check total doesn't exceed stock)
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { success: false, error: 'Insufficient stock' },
          { status: 400 }
        );
      }

      const updated = await prisma.cart.update({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
        data: {
          quantity: newQuantity,
        },
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Cart updated',
      });
    }

    // Create new cart item
    const cartItem = await prisma.cart.create({
      data: {
        userId: user.id,
        productId,
        quantity,
      },
    });

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Added to cart',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add to cart' },
      { status: 500 }
    );
  }
});

// DELETE - Clear cart
export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all cart items for user
    await prisma.cart.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear cart' },
      { status: 500 }
    );
  }
});
