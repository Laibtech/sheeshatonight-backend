import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import vendorRoutes from './routes/vendor.js';
import adminRoutes from './routes/admin.js';
import profileRoutes from './routes/profile.js';
import paymentRoutes from './routes/payments.js';
import notificationRoutes from './routes/notifications.js';

// Import middleware
import errorHandler from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/logger.js';

// Initialize express app
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// BODY PARSER
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================
// LOGGING MIDDLEWARE
// ============================================
app.use(requestLogger);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'SheeshaTonight Backend',
    version: '1.0.0'
  });
});

// ============================================
// API ROUTES
// ============================================

// Auth Routes
app.use('/api/auth', authRoutes);

// Public Product Routes
app.use('/api/products', productRoutes);

// Order Routes
app.use('/api/orders', orderRoutes);

// Cart Routes
app.use('/api/cart', cartRoutes);

// Profile Routes
app.use('/api/profile', profileRoutes);

// Vendor Routes
app.use('/api/vendor', vendorRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// Payment Routes
app.use('/api/payments', paymentRoutes);

// Notification Routes
app.use('/api/notifications', notificationRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.path,
  });
});

// ============================================
// ERROR HANDLER (Must be last)
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🍵 SheeshaTonight Backend Server Running      ║
╠════════════════════════════════════════════════╣
║  Server: ${HOST}:${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Database: ${process.env.DATABASE_URL ? '✓ Connected' : '✗ Not configured'}
╚════════════════════════════════════════════════╝
  `);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Graceful shutdown initiated.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Graceful shutdown initiated.');
  process.exit(0);
});
