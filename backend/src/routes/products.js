import express from 'express';
import { productController } from '../controllers/productController.js';
import { verifyToken, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, productController.getAll);
router.get('/search', optionalAuth, productController.search);
router.get('/category/:category', optionalAuth, productController.getByCategory);
router.get('/:productId', optionalAuth, productController.getById);

// Protected routes - Wishlist
router.get('/wishlist/items', verifyToken, productController.getWishlist);
router.post('/wishlist/add', verifyToken, productController.addToWishlist);
router.delete('/wishlist/:productId', verifyToken, productController.removeFromWishlist);

export default router;
