import { authService } from '../services/authService.js';
import { validateLoginInput, validateRegisterInput } from '../validations/authValidation.js';

export const authController = {
  // ============================================
  // LOGIN
  // ============================================
  async login(req, res) {
    const { error, value } = validateLoginInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details,
      });
    }

    try {
      const result = await authService.login(value.email, value.password);

      res.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  },

  // ============================================
  // REGISTER
  // ============================================
  async register(req, res) {
    const { error, value } = validateRegisterInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details,
      });
    }

    try {
      const result = await authService.register(value);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  },

  // ============================================
  // REFRESH TOKEN
  // ============================================
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token required',
        });
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed',
        data: tokens,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token refresh failed',
      });
    }
  },

  // ============================================
  // GET CURRENT USER (ME)
  // ============================================
  async getCurrentUser(req, res) {
    try {
      const user = await authService.getCurrentUser(req.user.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ============================================
  // LOGOUT
  // ============================================
  async logout(req, res) {
    try {
      await authService.logout(req.user.id);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Logout failed',
      });
    }
  },

  // ============================================
  // CHANGE PASSWORD
  // ============================================
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'All fields required',
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match',
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters',
        });
      }

      await authService.changePassword(req.user.id, oldPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ============================================
  // UPDATE PROFILE
  // ============================================
  async updateProfile(req, res) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);

      res.json({
        success: true,
        message: 'Profile updated',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
