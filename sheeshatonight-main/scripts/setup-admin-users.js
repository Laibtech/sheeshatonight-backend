const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmails = [
    'admin@sheeshatonight.com',
    'laibazafar131@gmail.com',
    'admin@test.com',
  ];

  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('--- UPSERTING ADMIN ACCOUNTS IN MYSQL ---');

  for (const email of adminEmails) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          verified: true,
          kycStatus: 'APPROVED',
        },
      });
      console.log(`Updated admin user: ${email} -> Role: ADMIN, Status: ACTIVE`);
    } else {
      await prisma.user.create({
        data: {
          name: email.split('@')[0].toUpperCase() + ' Admin',
          email,
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          verified: true,
          kycStatus: 'APPROVED',
        },
      });
      console.log(`Created admin user: ${email} -> Role: ADMIN, Status: ACTIVE`);
    }
  }

  console.log('\n--- ALL ADMIN ACCOUNTS ARE READY ---');
  console.log('Password for all admin emails:', password);
}

main()
  .catch(err => console.error('Error:', err))
  .finally(() => prisma.$disconnect());
