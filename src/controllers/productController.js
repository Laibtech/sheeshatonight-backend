import { productService } from '../services/productService.js';

export const productController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20, category, type } = req.query;
      const filters = {};
      if (category) filters.category = category;
      if (type) filters.type = type;

      const result = await productService.getAll(parseInt(page), parseInt(limit), filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const product = await productService.getById(req.params.productId);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async search(req, res) {
    try {
      const { q, page = 1, limit = 20 } = req.query;

      if (!q) {
        return res.status(400).json({ success: false, message: 'Search query required' });
      }

      const result = await productService.search(q, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await productService.getByCategory(category, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getWishlist(req, res) {
    try {
      const wishlist = await productService.getWishlist(req.user.id);

      res.json({
        success: true,
        data: wishlist,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async addToWishlist(req, res) {
    try {
      const { productId } = req.body;

      const item = await productService.addToWishlist(req.user.id, productId);

      res.status(201).json({
        success: true,
        message: 'Added to wishlist',
        data: item,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Already in wishlist' });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async removeFromWishlist(req, res) {
    try {
      const { productId } = req.params;

      await productService.removeFromWishlist(req.user.id, productId);

      res.json({
        success: true,
        message: 'Removed from wishlist',
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
