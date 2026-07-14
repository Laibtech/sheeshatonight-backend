import prisma from '../config/prisma.js';

export const notificationController = {
  // Get all notifications for current user
  async getNotifications(req, res) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = req.query;
      const skip = (page - 1) * limit;

      const where = {
        userId: req.user.id,
        ...(unreadOnly === 'true' && { read: false }),
      };

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: { userId: req.user.id, read: false },
        }),
      ]);

      res.json({
        success: true,
        data: notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get unread count
  async getUnreadCount(req, res) {
    try {
      const count = await prisma.notification.count({
        where: {
          userId: req.user.id,
          read: false,
        },
      });

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.update({
        where: {
          id,
          userId: req.user.id,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Mark all as read
  async markAllAsRead(req, res) {
    try {
      await prisma.notification.updateMany({
        where: {
          userId: req.user.id,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete notification
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      await prisma.notification.delete({
        where: {
          id,
          userId: req.user.id,
        },
      });

      res.json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Create notification (system/admin use)
  async createNotification(req, res) {
    try {
      const { userId, type, title, message, data } = req.body;

      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: data || {},
        },
      });

      res.status(201).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get admin alerts (KYC pending, low stock, etc.)
  async getAdminAlerts(req, res) {
    try {
      const [
        pendingKyc,
        lowStockProducts,
        pendingOrders,
        pendingPayouts,
      ] = await Promise.all([
        prisma.vendor.count({ where: { kycStatus: 'PENDING' } }),
        prisma.product.count({ where: { quantity: { lte: 10 } } }), // Changed from 'stock' to 'quantity'
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.payout.count({ where: { status: 'PENDING' } }),
      ]);

      const alerts = [];

      if (pendingKyc > 0) {
        alerts.push({
          type: 'KYC',
          count: pendingKyc,
          message: `${pendingKyc} vendor${pendingKyc > 1 ? 's' : ''} pending KYC approval`,
          severity: 'high',
          action: '/admin/kyc',
        });
      }

      if (lowStockProducts > 0) {
        alerts.push({
          type: 'STOCK',
          count: lowStockProducts,
          message: `${lowStockProducts} product${lowStockProducts > 1 ? 's' : ''} with low stock`,
          severity: 'medium',
          action: '/admin/products',
        });
      }

      if (pendingOrders > 0) {
        alerts.push({
          type: 'ORDERS',
          count: pendingOrders,
          message: `${pendingOrders} pending order${pendingOrders > 1 ? 's' : ''}`,
          severity: 'high',
          action: '/admin/orders',
        });
      }

      if (pendingPayouts > 0) {
        alerts.push({
          type: 'PAYOUTS',
          count: pendingPayouts,
          message: `${pendingPayouts} payout${pendingPayouts > 1 ? 's' : ''} pending`,
          severity: 'medium',
          action: '/admin/finance',
        });
      }

      res.json({
        success: true,
        data: alerts,
        totalCount: alerts.reduce((sum, alert) => sum + alert.count, 0),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
