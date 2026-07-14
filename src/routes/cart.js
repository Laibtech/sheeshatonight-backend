import express from 'express';
import { cartController } from '../controllers/cartController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', cartController.getCart);
router.get('/total', cartController.getCartTotal);
router.post('/add', cartController.addToCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/items/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
