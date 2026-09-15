import { prisma } from './prisma';

export interface NotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Create a notification for a user
 */
export async function createNotification(notification: NotificationData) {
  try {
    await prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data ? JSON.stringify(notification.data) : null,
        read: false,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications are non-critical
  }
}

/**
 * Notify customer about order status change
 */
export async function notifyOrderStatusChange(orderId: string, newStatus: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vendor: { select: { name: true } } },
    });

    if (!order) return;

    const statusMessages: Record<string, { title: string; message: string }> = {
      PREPARING: {
        title: 'Order Confirmed',
        message: `Your order #${order.orderNumber} has been confirmed by ${order.vendor.name} and is being prepared.`,
      },
      READY_FOR_PICKUP: {
        title: 'Order Ready',
        message: `Your order #${order.orderNumber} is ready for pickup/delivery.`,
      },
      OUT_FOR_DELIVERY: {
        title: 'Out for Delivery',
        message: `Your order #${order.orderNumber} is on its way! Expected delivery soon.`,
      },
      DELIVERED: {
        title: 'Order Delivered',
        message: `Your order #${order.orderNumber} has been delivered. Enjoy your sheesha!`,
      },
      COMPLETED: {
        title: 'Order Completed',
        message: `Your order #${order.orderNumber} is complete. Please rate your experience!`,
      },
      CANCELLED: {
        title: 'Order Cancelled',
        message: `Your order #${order.orderNumber} has been cancelled.`,
      },
      ACTIVE_RENTAL: {
        title: 'Rental Active',
        message: `Your rental #${order.orderNumber} is now active. Enjoy!`,
      },
    };

    const notification = statusMessages[newStatus];
    if (!notification) return;

    await createNotification({
      userId: order.userId,
      type: 'ORDER_STATUS',
      title: notification.title,
      message: notification.message,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: newStatus,
      },
    });

  } catch (error) {
    console.error('Error notifying order status change:', error);
  }
}

/**
 * Notify vendor about new order
 */
export async function notifyVendorNewOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true } },
        vendor: { select: { userId: true } },
      },
    });

    if (!order) return;

    await createNotification({
      userId: order.vendor.userId,
      type: 'NEW_ORDER',
      title: 'New Order Received',
      message: `You have a new order #${order.orderNumber} from ${order.user.name}.`,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount.toString(),
      },
    });

  } catch (error) {
    console.error('Error notifying vendor:', error);
  }
}

/**
 * Notify customer to leave a review
 */
export async function notifyLeaveReview(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vendor: { select: { name: true } } },
    });

    if (!order) return;

    await createNotification({
      userId: order.userId,
      type: 'REVIEW_REQUEST',
      title: 'How was your experience?',
      message: `Please rate your order from ${order.vendor.name}. Your feedback helps us improve!`,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        vendorId: order.vendorId,
      },
    });

  } catch (error) {
    console.error('Error notifying review request:', error);
  }
}
