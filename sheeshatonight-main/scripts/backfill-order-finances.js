const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  console.log('--- Backfilling historical order financial fields ---');
  const orders = await prisma.order.findMany({
    include: {
      vendor: true,
    },
  });

  console.log(`Found ${orders.length} orders to check/backfill.`);
  let updatedCount = 0;

  for (const ord of orders) {
    const gross = Number(ord.totalAmount || 0);
    const existingFee = Number(ord.platformFee || 0);
    const existingNet = Number(ord.vendorNet || 0);

    // If platformFee and vendorNet are 0/null or don't sum to gross
    if (existingFee === 0 && existingNet === 0 && gross > 0) {
      const rate = ord.vendor?.commissionRate ? Number(ord.vendor.commissionRate) : 10;
      const fee = Math.round((gross * rate) / 100 * 100) / 100;
      const net = Math.round((gross - fee) * 100) / 100;

      let payoutStatus = ord.payoutStatus || 'PENDING';
      if (ord.status === 'DELIVERED' || ord.status === 'COMPLETED') {
        payoutStatus = 'ELIGIBLE';
      }

      await prisma.order.update({
        where: { id: ord.id },
        data: {
          subtotal: ord.subtotal || gross,
          commissionRate: rate,
          platformFee: fee,
          vendorNet: net,
          payoutStatus: payoutStatus,
        },
      });

      console.log(`  ✓ Updated Order #${ord.orderNumber || ord.id.slice(0, 8)}: Gross=AED ${gross}, Fee(${rate}%)=AED ${fee}, Net=AED ${net}, Payout=${payoutStatus}`);
      updatedCount++;
    }
  }

  console.log(`\nBackfill complete! Updated ${updatedCount} historical orders.`);
}

backfill()
  .catch((e) => {
    console.error('Backfill error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
