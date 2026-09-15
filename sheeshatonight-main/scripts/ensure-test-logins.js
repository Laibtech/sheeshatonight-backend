const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Synchronizing standard test logins...');

  const adminHash = await bcrypt.hash('admin123', 10);
  const vendorHash = await bcrypt.hash('vendor123', 10);
  const customerHash = await bcrypt.hash('customer123', 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { email: 'admin@sheeshatonight.com' },
    update: { password: adminHash, role: 'ADMIN', status: 'ACTIVE', verified: true },
    create: { name: 'Super Admin', email: 'admin@sheeshatonight.com', password: adminHash, role: 'ADMIN', status: 'ACTIVE', verified: true }
  });
  console.log('✅ Admin: admin@sheeshatonight.com / admin123');

  // 2. Customer
  await prisma.user.upsert({
    where: { email: 'customer@sheeshatonight.com' },
    update: { password: customerHash, role: 'CUSTOMER', status: 'ACTIVE', verified: true },
    create: { name: 'Valued Customer', email: 'customer@sheeshatonight.com', password: customerHash, role: 'CUSTOMER', status: 'ACTIVE', verified: true }
  });
  console.log('✅ Customer: customer@sheeshatonight.com / customer123');

  // 3. Vendor User
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@sheeshatonight.com' },
    update: { password: vendorHash, role: 'VENDOR', status: 'ACTIVE', verified: true },
    create: { name: 'Royal Sheesha Lounge Manager', email: 'vendor@sheeshatonight.com', password: vendorHash, role: 'VENDOR', status: 'ACTIVE', verified: true }
  });

  // Ensure vendor record exists and is linked
  const existingVendor = await prisma.vendor.findFirst({
    where: { userId: vendorUser.id }
  });

  if (!existingVendor) {
    await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        name: 'Royal Sheesha Lounge',
        slug: 'royal-sheesha-lounge',
        description: 'Elite Downtown Dubai Lounge with Russian Hookahs and VIP Services.',
        location: 'Downtown Dubai, Boulevard Crescent',
        phone: '+97143339988',
        tier: 'MASTER',
        isActive: true
      }
    });
  }
  console.log('✅ Vendor: vendor@sheeshatonight.com / vendor123');

  // Also sync breeze@jbrshisha.ae
  const breezeUser = await prisma.user.findUnique({ where: { email: 'breeze@jbrshisha.ae' } });
  if (breezeUser) {
    await prisma.user.update({
      where: { email: 'breeze@jbrshisha.ae' },
      data: { password: vendorHash }
    });
    console.log('✅ Vendor 2: breeze@jbrshisha.ae / vendor123');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
