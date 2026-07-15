import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import prisma from '../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// ============================================
// CREATE PAYMENT
// ============================================

router.post('/', verifyToken, async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    if (!orderId || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: 'orderId, amount, and method required',
      });
    }

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: req.user.id },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        id: uuidv4(),
        orderId,
        amount,
        method,
        status: 'PENDING',
      },
    });

    // In production, integrate with Stripe/Checkout.com here
    // For now, simulate payment processing

    res.status(201).json({
      success: true,
      message: 'Payment initiated',
      data: payment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// PROCESS PAYMENT
// ============================================

router.post('/:paymentId/process', verifyToken, async (req, res) => {
  try {
    const { transactionId } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: req.params.paymentId },
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Update payment
    const updated = await prisma.payment.update({
      where: { id: req.params.paymentId },
      data: {
        status: 'COMPLETED',
        transactionId,
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CONFIRMED' },
    });

    res.json({
      success: true,
      message: 'Payment processed',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// GET PAYMENT
// ============================================

router.get('/:paymentId', verifyToken, async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.paymentId },
      include: { order: true },
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Verify user owns the order
    if (payment.order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// WEBHOOK (for payment gateway)
// ============================================

router.post('/webhook', async (req, res) => {
  try {
    const { orderId, status, transactionId } = req.body;

    // Verify webhook signature (implement in production)

    if (status === 'SUCCESS') {
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          transactionId,
        },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
    } else if (status === 'FAILED') {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'FAILED' },
      });
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
