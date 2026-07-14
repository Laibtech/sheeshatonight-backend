import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { notificationController } from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get notifications for current user
router.get('/', notificationController.getNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all as read
router.post('/mark-all-read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Admin routes
router.get('/admin/alerts', requireRole('ADMIN'), notificationController.getAdminAlerts);
router.post('/admin/create', requireRole('ADMIN'), notificationController.createNotification);

export default router;
