const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============ AUTH ENDPOINTS ============
app.post('/api/auth/login', (req, res) => {
  const { phone, email } = req.body;
  console.log(`[AUTH] Login request: ${phone || email}`);
  
  res.json({
    success: true,
    message: 'OTP sent successfully',
    sessionId: `sess_${Date.now()}`,
  });
});

app.post('/api/auth/age-gate-verify', (req, res) => {
  const { sessionId, ageVerified } = req.body;
  
  if (!ageVerified) {
    return res.status(400).json({ success: false, message: 'Age verification required' });
  }
  
  res.json({
    success: true,
    message: 'Age verified',
    authToken: `token_${Date.now()}`,
    user: {
      id: 'user_123',
      role: 'CUSTOMER',
      email: 'user@sheesha.ae',
    },
  });
});

// ============ SEARCH & DISCOVERY ============
app.get('/api/search', (req, res) => {
  const { lat, lng, radius } = req.query;
  console.log(`[SEARCH] Nearby venues: lat=${lat}, lng=${lng}, radius=${radius}km`);
  
  res.json({
    success: true,
    data: [
      {
        id: 'v1',
        name: 'Bespoke Sheesha Co.',
        distance: 0.8,
        rating: 4.8,
        reviews: 342,
      },
      {
        id: 'v2',
        name: 'The Ember Room',
        distance: 1.2,
        rating: 4.6,
        reviews: 215,
      },
    ],
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[PRODUCTS] Fetching product: ${id}`);
  
  res.json({
    success: true,
    data: {
      id,
      title: 'Premium Turkish Blend',
      price: 89.99,
      stock: 45,
      vendor: 'Bespoke Sheesha Co.',
    },
  });
});

// ============ BOOKING & ORDERS ============
app.post('/api/cart/checkout', (req, res) => {
  const { userId, vendorId, items, totalAmount } = req.body;
  console.log(`[CHECKOUT] Order for user ${userId}, vendor ${vendorId}, total ${totalAmount}`);
  
  const orderId = `ORD-2026-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
  
  res.json({
    success: true,
    orderId,
    status: 'PREPARING',
    message: 'Order placed successfully',
  });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`[ORDERS] Update order ${id} status: ${status}`);
  
  res.json({
    success: true,
    orderId: id,
    newStatus: status,
  });
});

// ============ ADMIN OPERATIONS ============
app.get('/api/admin/vendors/pending', (req, res) => {
  console.log('[ADMIN] Fetching pending vendor KYC approvals');
  
  res.json({
    success: true,
    data: [
      {
        vendorId: 'v1',
        name: 'Bespoke Sheesha Co.',
        status: 'PENDING',
        licenseUrl: 'https://s3.../license-001.pdf',
      },
      {
        vendorId: 'v2',
        name: 'The Ember Room',
        status: 'PENDING',
        identityUrl: 'https://s3.../identity-002.pdf',
      },
    ],
  });
});

app.patch('/api/admin/vendors/:id/approve', (req, res) => {
  const { id } = req.params;
  console.log(`[ADMIN] Approved vendor ${id}`);
  
  res.json({
    success: true,
    vendorId: id,
    newStatus: 'APPROVED',
  });
});

app.patch('/api/admin/vendors/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  console.log(`[ADMIN] Rejected vendor ${id}: ${reason}`);
  
  res.json({
    success: true,
    vendorId: id,
    newStatus: 'REJECTED',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SheeshaTonight Backend running on port ${PORT}`);
});
