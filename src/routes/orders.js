import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', orderController.createOrder);
router.post('/rental', orderController.createRentalOrder);
router.get('/', orderController.getOrders);
router.get('/:orderId', orderController.getOrder);
router.post('/:orderId/cancel', orderController.cancelOrder);

export default router;
