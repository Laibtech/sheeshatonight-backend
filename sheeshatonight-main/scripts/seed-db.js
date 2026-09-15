const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seed for sheeshatonight-main...');

  // 1. Password hash for seeded accounts
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sheeshatonight.com' },
    update: {
      name: 'Super Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      verified: true,
      kycStatus: 'APPROVED',
      password: passwordHash,
    },
    create: {
      name: 'Super Admin',
      email: 'admin@sheeshatonight.com',
      phone: '+971500000001',
      password: passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      verified: true,
      kycStatus: 'APPROVED',
    },
  });
  console.log('✅ Admin user ready:', admin.email);

  // 3. Seed Main Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@sheeshatonight.com' },
    update: {
      name: 'Valued Customer',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      verified: true,
      password: passwordHash,
    },
    create: {
      name: 'Valued Customer',
      email: 'customer@sheeshatonight.com',
      phone: '+971500000002',
      password: passwordHash,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      verified: true,
    },
  });
  console.log('✅ Main customer ready:', customer.email);

  // 4. Seed Additional Customers
  const cust2 = await prisma.user.upsert({
    where: { email: 'ahmed@example.com' },
    update: { name: 'Ahmed Al Mansoori', role: 'CUSTOMER', password: passwordHash },
    create: { name: 'Ahmed Al Mansoori', email: 'ahmed@example.com', phone: '+971501112233', password: passwordHash, role: 'CUSTOMER' },
  });

  const cust3 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: { name: 'Sarah Jenkins', role: 'CUSTOMER', password: passwordHash },
    create: { name: 'Sarah Jenkins', email: 'sarah@example.com', phone: '+971502223344', password: passwordHash, role: 'CUSTOMER' },
  });

  // 5. Seed Vendor Users & Vendors
  const vendorUser1 = await prisma.user.upsert({
    where: { email: 'sultan@loungedubai.ae' },
    update: { name: 'Sultan Lounge Manager', role: 'VENDOR', password: passwordHash, verified: true, kycStatus: 'APPROVED' },
    create: { name: 'Sultan Lounge Manager', email: 'sultan@loungedubai.ae', phone: '+971504445566', password: passwordHash, role: 'VENDOR', verified: true, kycStatus: 'APPROVED' },
  });

  const vendor1 = await prisma.vendor.upsert({
    where: { userId: vendorUser1.id },
    update: {
      name: 'Sultan Shisha Lounge',
      slug: 'sultan-shisha-lounge',
      description: 'Luxury Downtown Dubai Shisha Lounge offering premium blends & VIP cabanas.',
      location: JSON.stringify({ address: 'Downtown Dubai, Boulevard Crescent', city: 'Dubai', lat: 25.1972, lng: 55.2744 }),
      phone: '+97143339988',
      tier: 'ADVANCED',
      isActive: true,
    },
    create: {
      userId: vendorUser1.id,
      name: 'Sultan Shisha Lounge',
      slug: 'sultan-shisha-lounge',
      description: 'Luxury Downtown Dubai Shisha Lounge offering premium blends & VIP cabanas.',
      location: JSON.stringify({ address: 'Downtown Dubai, Boulevard Crescent', city: 'Dubai', lat: 25.1972, lng: 55.2744 }),
      phone: '+97143339988',
      tier: 'ADVANCED',
      isActive: true,
    },
  });

  const vendorUser2 = await prisma.user.upsert({
    where: { email: 'breeze@jbrshisha.ae' },
    update: { name: 'Breeze Beach Manager', role: 'VENDOR', password: passwordHash, verified: true, kycStatus: 'APPROVED' },
    create: { name: 'Breeze Beach Manager', email: 'breeze@jbrshisha.ae', phone: '+971507778899', password: passwordHash, role: 'VENDOR', verified: true, kycStatus: 'APPROVED' },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { userId: vendorUser2.id },
    update: {
      name: 'Breeze Beach Lounge',
      slug: 'breeze-beach-lounge',
      description: ' beachfront shisha lounge with ocean sunset views and signature fruit bowls.',
      location: JSON.stringify({ address: 'Jumeirah Beach Residence, The Walk', city: 'Dubai', lat: 25.0772, lng: 55.1332 }),
      phone: '+97144445511',
      tier: 'MASTER',
      isActive: true,
    },
    create: {
      userId: vendorUser2.id,
      name: 'Breeze Beach Lounge',
      slug: 'breeze-beach-lounge',
      description: 'Beachfront shisha lounge with ocean sunset views and signature fruit bowls.',
      location: JSON.stringify({ address: 'Jumeirah Beach Residence, The Walk', city: 'Dubai', lat: 25.0772, lng: 55.1332 }),
      phone: '+97144445511',
      tier: 'MASTER',
      isActive: true,
    },
  });

  console.log('✅ Vendors ready:', vendor1.name, ',', vendor2.name);

  // 6. Seed Categories
  const categoriesData = [
    { name: 'Sheesha Pipes', slug: 'sheesha-pipes', description: 'High-end tobacco pipes and hookahs', isFeatured: true, sortOrder: 1 },
    { name: 'Tobacco Blends', slug: 'tobacco-blends', description: 'Premium import & local shisha tobacco flavors', isFeatured: true, sortOrder: 2 },
    { name: 'Accessories', slug: 'accessories', description: 'Charcoal, hoses, bowls, heat managers', isFeatured: true, sortOrder: 3 },
    { name: 'Rental Packages', slug: 'rental-packages', description: 'Full shisha setup rentals for events and lounges', isFeatured: true, sortOrder: 4 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // 7. Seed Products
  const productsData = [
    {
      vendorId: vendor1.id,
      title: 'Khalil Mamoon Gold Hookah Pipe',
      description: 'Authentic handmade Egyptian brass shisha pipe with gold coating.',
      type: 'SHEESHA_PIPE',
      price: 450.00,
      stock: 15,
      sku: 'KM-GOLD-001',
      isFeatured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600']),
    },
    {
      vendorId: vendor1.id,
      title: 'Starbuzz Blue Mist Tobacco 250g',
      description: 'Best-selling sweet blueberry mint signature flavor.',
      type: 'TOBACCO_BLEND',
      price: 85.00,
      stock: 40,
      sku: 'SB-BM-250',
      isFeatured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600']),
    },
    {
      vendorId: vendor1.id,
      title: 'VIP Sultan Lounge Full Package Rental',
      description: 'Includes premium pipe, 2 flavors of choice, natural charcoal & setup master.',
      type: 'RENTAL_PACKAGE',
      price: 350.00,
      stock: 10,
      sku: 'VIP-RENT-001',
      isFeatured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600']),
    },
    {
      vendorId: vendor2.id,
      title: 'Al Fakher Double Apple 1KG',
      description: 'Classic double apple flavor preferred by traditional connoisseurs.',
      type: 'TOBACCO_BLEND',
      price: 175.00,
      stock: 25,
      sku: 'AF-DA-1000',
      isFeatured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600']),
    },
    {
      vendorId: vendor2.id,
      title: 'Kaloud Lotus Heat Management Device',
      description: 'Engineered HMD for even heat distribution and clean sessions.',
      type: 'ACCESSORY',
      price: 120.00,
      stock: 30,
      sku: 'KL-HMD-002',
      isFeatured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600']),
    },
    {
      vendorId: vendor2.id,
      title: 'Beachfront Shisha Sunset Rental Package',
      description: 'Includes lounge beach seating reserve + fresh watermelon fruit head shisha.',
      type: 'RENTAL_PACKAGE',
      price: 250.00,
      stock: 8,
      sku: 'BRZ-BEACH-PACK',
      isFeatured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600']),
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const p = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: prod,
      create: prod,
    });
    createdProducts.push(p);
  }
  console.log('✅ Products seeded:', createdProducts.length);

  // 8. Seed Orders for Main Customer so Customer Dashboard has real live data
  const existingOrderCount = await prisma.order.count({ where: { userId: customer.id } });
  if (existingOrderCount === 0) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-2026-101',
        userId: customer.id,
        vendorId: vendor1.id,
        status: 'DELIVERED',
        totalAmount: 435.00,
        currency: 'AED',
        deliveredAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        items: {
          create: [
            { productId: createdProducts[0].id, quantity: 1, price: 350.00 },
            { productId: createdProducts[1].id, quantity: 1, price: 85.00 },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-2026-102',
        userId: customer.id,
        vendorId: vendor2.id,
        status: 'PREPARING',
        totalAmount: 250.00,
        currency: 'AED',
        rentalStartDate: new Date(Date.now() + 3600000 * 2), // in 2 hours
        items: {
          create: [
            { productId: createdProducts[5].id, quantity: 1, price: 250.00 },
          ],
        },
      },
    });

    // Order for Customer 2
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-2026-103',
        userId: cust2.id,
        vendorId: vendor1.id,
        status: 'DELIVERED',
        totalAmount: 450.00,
        currency: 'AED',
        items: {
          create: [
            { productId: createdProducts[0].id, quantity: 1, price: 450.00 },
          ],
        },
      },
    });

    console.log('✅ Orders seeded:', order1.orderNumber, order2.orderNumber);
  }

  // 9. Seed Coupons
  const coupons = [
    { code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, minOrderAmount: 100, isActive: true },
    { code: 'SHEESHA20', discountType: 'PERCENTAGE', discountValue: 20, minOrderAmount: 200, isActive: true },
    { code: 'VIPSUMMER', discountType: 'FIXED', discountValue: 50, minOrderAmount: 300, isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log('✅ Coupons seeded');

  // 10. Seed CMS Banners
  const existingBanners = await prisma.cmsBanner.count();
  if (existingBanners === 0) {
    await prisma.cmsBanner.createMany({
      data: [
        {
          heading: 'Experience Dubai’s Finest Shisha Tonight',
          subtitle: 'Book luxury lounges & premium tobacco delivered to your door',
          ctaText: 'Explore Lounges',
          ctaUrl: '/browse',
          position: 'HOMEPAGE_HERO',
          sortOrder: 1,
          isActive: true,
        },
        {
          heading: 'VIP Beachfront Shisha Packages',
          subtitle: 'Exclusive JBR & Palm Jumeirah Sunset Specials',
          ctaText: 'Book VIP Package',
          ctaUrl: '/products',
          position: 'PROMO_SECTION',
          sortOrder: 2,
          isActive: true,
        },
      ],
    });
    console.log('✅ CMS Banners seeded');
  }

  // 11. Seed CMS Pages
  const pages = [
    { title: 'About Us', slug: 'about', content: 'SheeshaTonight is UAE premier shisha marketplace connecting lounges and customers.' },
    { title: 'Contact Us', slug: 'contact', content: 'Get in touch with support@sheeshatonight.com or call +971 4 800 7433.' },
    { title: 'Privacy Policy', slug: 'privacy', content: 'We prioritize your personal privacy and secure transactions.' },
    { title: 'Terms & Conditions', slug: 'terms', content: 'By using SheeshaTonight services you agree to local UAE legal regulations.' },
    { title: 'FAQ', slug: 'faq', content: 'Frequently asked questions about lounge bookings and shisha rentals.' },
  ];

  for (const p of pages) {
    await prisma.cmsPage.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('✅ CMS Pages seeded');

  console.log('🎉 Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
