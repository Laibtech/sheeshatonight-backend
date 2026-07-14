import { cartService } from '../services/cartService.js';

export const cartController = {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      res.json({ success: true, data: cart });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID required' });
      }

      const item = await cartService.addToCart(req.user.id, productId, quantity);

      res.status(201).json({
        success: true,
        message: 'Added to cart',
        data: item,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateCartItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Quantity required' });
      }

      const item = await cartService.updateCartItem(req.user.id, itemId, quantity);

      res.json({
        success: true,
        message: 'Cart item updated',
        data: item,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async removeFromCart(req, res) {
    try {
      const { itemId } = req.params;

      await cartService.removeFromCart(req.user.id, itemId);

      res.json({
        success: true,
        message: 'Removed from cart',
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async clearCart(req, res) {
    try {
      await cartService.clearCart(req.user.id);

      res.json({
        success: true,
        message: 'Cart cleared',
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getCartTotal(req, res) {
    try {
      const total = await cartService.getCartTotal(req.user.id);

      res.json({
        success: true,
        data: total,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
