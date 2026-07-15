import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import prisma from '../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.use(verifyToken, requireRole('VENDOR', 'ADMIN'));

// Get vendor profile
router.get('/profile', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      include: { user: true },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get vendor products
router.get('/products', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { vendorId: vendor.id },
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where: { vendorId: vendor.id } }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const product = await prisma.product.create({
      data: {
        id: uuidv4(),
        vendorId: vendor.id,
        ...req.body,
        slug: req.body.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update product
router.put('/products/:productId', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    const product = await prisma.product.findFirst({
      where: { id: req.params.productId, vendorId: vendor.id },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = await prisma.product.update({
      where: { id: req.params.productId },
      data: req.body,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete product
router.delete('/products/:productId', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    const product = await prisma.product.findFirst({
      where: { id: req.params.productId, vendorId: vendor.id },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.product.delete({ where: { id: req.params.productId } });

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get vendor orders
router.get('/orders', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { vendorId: vendor.id },
        skip,
        take: parseInt(limit),
        include: { customer: true, items: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { vendorId: vendor.id } }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get vendor earnings
router.get('/earnings', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const orders = await prisma.order.findMany({
      where: { vendorId: vendor.id, status: 'COMPLETED' },
      include: { items: true },
    });

    const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const commissionRate = vendor.commissionRate || 15;
    const vendorEarnings = totalEarnings * (1 - commissionRate / 100);

    res.json({
      success: true,
      data: {
        totalEarnings,
        commissionRate,
        vendorEarnings,
        orderCount: orders.length,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
