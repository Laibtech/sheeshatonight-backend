import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create demo users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const vendorPassword = await bcrypt.hash('vendor123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    const admin = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'admin@sheeshatonight.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    const vendor = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'vendor@sheeshatonight.com',
        passwordHash: vendorPassword,
        firstName: 'Vendor',
        lastName: 'User',
        role: 'VENDOR',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    const customer = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'customer@sheeshatonight.com',
        passwordHash: customerPassword,
        firstName: 'Customer',
        lastName: 'User',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    // Create vendor profile
    const vendorProfile = await prisma.vendor.create({
      data: {
        id: uuidv4(),
        userId: vendor.id,
        businessName: 'Luxury Sheesha Lounge',
        businessType: 'Sheesha Bar',
        description: 'Premium sheesha rental and sales',
        rating: 4.8,
      },
    });

    // Create customer profile
    await prisma.customer.create({
      data: {
        id: uuidv4(),
        userId: customer.id,
      },
    });

    // Create empty cart for customer
    await prisma.cart.create({
      data: {
        id: uuidv4(),
        userId: customer.id,
      },
    });

    // Create demo products
    const products = [
      {
        id: uuidv4(),
        vendorId: vendorProfile.id,
        title: 'Premium Gold Sheesha',
        description: 'Luxury gold-plated sheesha set',
        sku: 'SKU-001',
        category: 'Premium',
        type: 'SALE',
        price: 450,
        images: ['https://via.placeholder.com/400x300'],
        thumbnail: 'https://via.placeholder.com/100x100',
        quantity: 10,
        status: 'ACTIVE',
        slug: 'premium-gold-sheesha',
        tags: ['luxury', 'gold', 'premium'],
      },
      {
        id: uuidv4(),
        vendorId: vendorProfile.id,
        title: 'Standard Sheesha Rental',
        description: 'Daily rental of standard sheesha',
        sku: 'SKU-002',
        category: 'Rental',
        type: 'RENTAL',
        rentalDailyRate: 50,
        rentalWeeklyRate: 300,
        rentalMonthlyRate: 1000,
        rentalDeposit: 200,
        minRentalDays: 1,
        images: ['https://via.placeholder.com/400x300'],
        thumbnail: 'https://via.placeholder.com/100x100',
        status: 'ACTIVE',
        slug: 'standard-sheesha-rental',
        tags: ['rental', 'standard'],
      },
      {
        id: uuidv4(),
        vendorId: vendorProfile.id,
        title: 'Flavored Tobacco Pack',
        description: 'Premium flavored tobacco collection',
        sku: 'SKU-003',
        category: 'Accessories',
        type: 'SALE',
        price: 25,
        images: ['https://via.placeholder.com/400x300'],
        thumbnail: 'https://via.placeholder.com/100x100',
        quantity: 50,
        status: 'ACTIVE',
        slug: 'flavored-tobacco-pack',
        tags: ['tobacco', 'flavor', 'accessories'],
      },
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`
Demo Credentials:
- Admin: admin@sheeshatonight.com / admin123
- Vendor: vendor@sheeshatonight.com / vendor123
- Customer: customer@sheeshatonight.com / customer123
    `);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
