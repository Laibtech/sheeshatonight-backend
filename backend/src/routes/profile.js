import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import prisma from '../config/prisma.js';

const router = express.Router();

router.use(verifyToken);

// Get addresses
router.get('/addresses', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
    });

    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create address
router.post('/addresses', async (req, res) => {
  try {
    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        ...req.body,
      },
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update address
router.put('/addresses/:addressId', async (req, res) => {
  try {
    const address = await prisma.address.update({
      where: { id: req.params.addressId },
      data: req.body,
    });

    res.json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete address
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    await prisma.address.delete({
      where: { id: req.params.addressId },
    });

    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
