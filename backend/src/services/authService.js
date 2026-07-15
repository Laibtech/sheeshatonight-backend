import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  // ============================================
  // LOGIN
  // ============================================
  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        vendor: true,
        customer: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  },

  // ============================================
  // REGISTER
  // ============================================
  async register(data) {
    const { email, password, phone, firstName, lastName, region, role = 'CUSTOMER' } = data;

    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (existing) {
      throw new Error('Email or phone already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: email.toLowerCase(),
        phone,
        passwordHash,
        firstName,
        lastName,
        role,
        region,
      },
    });

    // Create vendor or customer profile
    if (role === 'VENDOR') {
      await prisma.vendor.create({
        data: {
          id: uuidv4(),
          userId: user.id,
          businessName: firstName + ' ' + lastName,
        },
      });
    } else if (role === 'CUSTOMER') {
      await prisma.customer.create({
        data: {
          id: uuidv4(),
          userId: user.id,
        },
      });

      // Create empty cart
      await prisma.cart.create({
        data: {
          id: uuidv4(),
          userId: user.id,
        },
      });
    }

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  },

  // ============================================
  // GENERATE TOKENS
  // ============================================
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '24h',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });

    return { accessToken, refreshToken };
  },

  // ============================================
  // REFRESH TOKEN
  // ============================================
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const tokens = this.generateTokens({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        phone: decoded.phone,
      });
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  // ============================================
  // GET CURRENT USER
  // ============================================
  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        region: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            rating: true,
            kycStatus: true,
          },
        },
        customer: {
          select: {
            id: true,
            loyaltyPoints: true,
            totalSpent: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  // ============================================
  // LOGOUT
  // ============================================
  async logout(userId) {
    // Could implement token blacklist here if needed
    return { success: true };
  },

  // ============================================
  // CHANGE PASSWORD
  // ============================================
  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.passwordHash))) {
      throw new Error('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true };
  },

  // ============================================
  // UPDATE PROFILE
  // ============================================
  async updateProfile(userId, data) {
    const { firstName, lastName, avatar, bio, region } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        avatar,
        bio,
        region,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        region: true,
      },
    });

    return user;
  },
};
