import { orderService } from '../services/orderService.js';

export const orderController = {
  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Order created',
        data: order,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async createRentalOrder(req, res) {
    try {
      const order = await orderService.createRentalOrder(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Rental order created',
        data: order,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getOrders(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await orderService.getOrders(req.user.id, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getOrder(req, res) {
    try {
      const order = await orderService.getOrder(req.params.orderId, req.user.id);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async cancelOrder(req, res) {
    try {
      const order = await orderService.cancelOrder(req.params.orderId, req.user.id);

      res.json({
        success: true,
        message: 'Order cancelled',
        data: order,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
