import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import prisma from '../config/prisma.js';

const router = express.Router();

router.use(verifyToken, requireRole('ADMIN'));

// ============================================
// USERS MANAGEMENT
// ============================================

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/users/:userId', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: req.body,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/users/:userId', async (req, res) => {
  try {
    const { action } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let updatedUser;
    if (action === 'suspend') {
      updatedUser = await prisma.user.update({
        where: { id: req.params.userId },
        data: { status: 'SUSPENDED' },
      });
    } else if (action === 'activate') {
      updatedUser = await prisma.user.update({
        where: { id: req.params.userId },
        data: { status: 'ACTIVE' },
      });
    } else if (action === 'delete') {
      await prisma.user.delete({
        where: { id: req.params.userId },
      });
      return res.json({ success: true, message: 'User deleted successfully' });
    } else {
      updatedUser = await prisma.user.update({
        where: { id: req.params.userId },
        data: req.body,
      });
    }

    res.json({ success: true, message: 'User updated', data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// VENDORS MANAGEMENT
// ============================================

router.get('/vendors', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.kycStatus = status;

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      }),
      prisma.vendor.count({ where }),
    ]);

    res.json({
      success: true,
      data: vendors,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get pending vendors
router.get('/vendors/pending', async (req, res) => {
  try {
    const pendingVendors = await prisma.vendor.findMany({
      where: { kycStatus: 'PENDING' },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: pendingVendors });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get specific vendor by ID
router.get('/vendors/:vendorId', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.vendorId },
      include: { 
        user: { select: { email: true, firstName: true, lastName: true } },
        products: { take: 10, orderBy: { createdAt: 'desc' } },
        orders: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update vendor status
router.post('/vendors/:vendorId', async (req, res) => {
  try {
    const { action } = req.body;
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.vendorId },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    let updatedVendor;
    if (action === 'approve') {
      updatedVendor = await prisma.vendor.update({
        where: { id: req.params.vendorId },
        data: {
          kycStatus: 'APPROVED',
          kycVerifiedAt: new Date(),
          kycVerifiedBy: req.user.id,
        },
      });
    } else if (action === 'reject') {
      updatedVendor = await prisma.vendor.update({
        where: { id: req.params.vendorId },
        data: {
          kycStatus: 'REJECTED',
        },
      });
    } else if (action === 'delete') {
      await prisma.vendor.delete({
        where: { id: req.params.vendorId },
      });
      return res.json({ success: true, message: 'Vendor deleted successfully' });
    } else if (action === 'deactivate') {
      updatedVendor = await prisma.vendor.update({
        where: { id: req.params.vendorId },
        data: {
          isActive: false,
        },
      });
    } else if (action === 'activate') {
      updatedVendor = await prisma.vendor.update({
        where: { id: req.params.vendorId },
        data: {
          isActive: true,
        },
      });
    } else {
      updatedVendor = await prisma.vendor.update({
        where: { id: req.params.vendorId },
        data: req.body,
      });
    }

    res.json({ success: true, message: 'Vendor updated', data: updatedVendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/vendors/:vendorId/approve-kyc', async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.vendorId },
      data: {
        kycStatus: 'APPROVED',
        kycVerifiedAt: new Date(),
        kycVerifiedBy: req.user.id,
      },
    });

    res.json({ success: true, message: 'KYC approved', data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH endpoint for approving vendor
router.patch('/vendors/:vendorId/approve', async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.vendorId },
      data: {
        kycStatus: 'APPROVED',
        kycVerifiedAt: new Date(),
        kycVerifiedBy: req.user.id,
        isActive: true,
      },
    });

    res.json({ success: true, message: 'Vendor approved', data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH endpoint for rejecting vendor
router.patch('/vendors/:vendorId/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const vendor = await prisma.vendor.update({
      where: { id: req.params.vendorId },
      data: {
        kycStatus: 'REJECTED',
        kycRejectionReason: reason,
        isActive: false,
      },
    });

    res.json({ success: true, message: 'Vendor rejected', data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// ORDERS MANAGEMENT
// ============================================

router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          customer: { select: { firstName: true, lastName: true, email: true } },
          vendor: { select: { businessName: true } },
          items: true,
        },
      }),
      prisma.order.count({ where }),
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

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { vendor: { select: { businessName: true } } },
      }),
      prisma.product.count({ where }),
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

router.post('/products/:productId', async (req, res) => {
  try {
    const { action } = req.body;
    const product = await prisma.product.findUnique({
      where: { id: req.params.productId },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let updatedProduct;
    if (action === 'approve') {
      updatedProduct = await prisma.product.update({
        where: { id: req.params.productId },
        data: { status: 'ACTIVE' },
      });
    } else if (action === 'reject') {
      updatedProduct = await prisma.product.update({
        where: { id: req.params.productId },
        data: { status: 'REJECTED' },
      });
    } else if (action === 'deactivate') {
      updatedProduct = await prisma.product.update({
        where: { id: req.params.productId },
        data: { status: 'INACTIVE' },
      });
    } else if (action === 'delete') {
      await prisma.product.delete({
        where: { id: req.params.productId },
      });
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      updatedProduct = await prisma.product.update({
        where: { id: req.params.productId },
        data: req.body,
      });
    }

    res.json({ success: true, message: 'Product updated', data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// STATS
// ============================================

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalOrders, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
    ]);

    const pendingKyc = await prisma.vendor.count({
      where: { kycStatus: 'PENDING' },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingKyc,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// FINANCE
// ============================================

router.get('/finance/payouts', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { vendor: { select: { businessName: true } } },
      }),
      prisma.payout.count({ where }),
    ]);

    res.json({
      success: true,
      data: payouts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// KYC MANAGEMENT
// ============================================

router.get('/kyc', async (req, res) => {
  try {
    const verifications = await prisma.verification.findMany({
      where: { status: 'PENDING' },
      include: { vendor: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: verifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/kyc/:verificationId/approve', async (req, res) => {
  try {
    const verification = await prisma.verification.update({
      where: { id: req.params.verificationId },
      data: {
        status: 'APPROVED',
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
      },
    });

    res.json({ success: true, message: 'Verification approved', data: verification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/kyc/:verificationId/reject', async (req, res) => {
  try {
    const verification = await prisma.verification.update({
      where: { id: req.params.verificationId },
      data: {
        status: 'REJECTED',
        notes: req.body.notes,
      },
    });

    res.json({ success: true, message: 'Verification rejected', data: verification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
