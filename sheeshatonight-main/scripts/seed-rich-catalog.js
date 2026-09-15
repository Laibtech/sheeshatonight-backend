const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich catalog into MySQL database...');

  const vendors = await prisma.vendor.findMany({ select: { id: true, name: true } });
  if (vendors.length === 0) {
    console.error('No vendors found!');
    return;
  }

  const vRoyal = vendors.find(v => v.name.includes('Royal')) || vendors[0];
  const vSultan = vendors.find(v => v.name.includes('Sultan')) || vendors[1] || vendors[0];
  const vBreeze = vendors.find(v => v.name.includes('Breeze')) || vendors[2] || vendors[0];

  const productsToSeed = [
    {
      title: "Russian Custom Hookah",
      description: "Handcrafted aerospace aluminum and surgical stainless steel stem with carbon fiber sleeve. Ultra-smooth vertical purge valve.",
      type: "SHEESHA_PIPE",
      price: 650.00,
      stock: 18,
      sku: "RCH-RUS-001",
      vendorId: vRoyal.id,
      images: JSON.stringify(["/Categories/Buy Sheesha.webp", "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800"]),
      isFeatured: true,
    },
    {
      title: "Double Apple Al Fakher Gold",
      description: "Authentic double red and green apple blend infused with sweet anise. Hand-harvested tobacco leaves from Ajman.",
      type: "TOBACCO_BLEND",
      price: 180.00,
      stock: 45,
      sku: "DA-AFG-002",
      vendorId: vSultan.id,
      images: JSON.stringify(["/Categories/flavor.webp", "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800"]),
      isFeatured: true,
    },
    {
      title: "Dubai Beach VIP Rental Setup",
      description: "Complete luxury beachfront setup including master hookah, 2 premium hoses, ice tip, charcoal burner, 1kg coconut charcoal, and setup assistant.",
      type: "RENTAL_PACKAGE",
      price: 499.00,
      stock: 12,
      sku: "RENT-VIP-003",
      vendorId: vBreeze.id,
      images: JSON.stringify(["/SHEESHA-SET.webp", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"]),
      isFeatured: true,
    },
    {
      title: "Matte Black Stealth Sheesha",
      description: "Minimalist stealth silhouette in satin matte black finish with magnetic click base lock and integrated stainless diffuser.",
      type: "SHEESHA_PIPE",
      price: 599.00,
      stock: 15,
      sku: "MBS-ST-004",
      vendorId: vRoyal.id,
      images: JSON.stringify(["/Categories/Buy Sheesha.webp"]),
      isFeatured: false,
    },
    {
      title: "Mint Frost Freeze Blend",
      description: "Glacial spearmint with peppermint extract delivers an arctic cooling blast. Perfect as a standalone or cooling mixer.",
      type: "TOBACCO_BLEND",
      price: 145.00,
      stock: 60,
      sku: "MFF-BL-005",
      vendorId: vSultan.id,
      images: JSON.stringify(["/Categories/flavor.webp"]),
      isFeatured: false,
    },
    {
      title: "Platinum VIP Hookah Set",
      description: "Bespoke platinum-plated showpiece created for discerning collectors and luxury lounges. Engraved serial emblem and dual hose ports.",
      type: "SHEESHA_PIPE",
      price: 849.00,
      stock: 8,
      sku: "PLT-VIP-006",
      vendorId: vRoyal.id,
      images: JSON.stringify(["/platinum.webp"]),
      isFeatured: true,
    },
    {
      title: "Silver Edition German V2A Sheesha",
      description: "Polished mirror-finish German stainless steel V2A. 100% rustproof, scratch-resistant, with CNC laser-milled downstems.",
      type: "SHEESHA_PIPE",
      price: 499.00,
      stock: 20,
      sku: "SLV-V2A-007",
      vendorId: vSultan.id,
      images: JSON.stringify(["/silver.webp"]),
      isFeatured: false,
    },
    {
      title: "Complete VIP Sheesha Lounge Set",
      description: "All-inclusive turnkey bundle: Master sheesha unit, 2 silicone hoses, stainless tongs, ceramic glazed phunnel bowl, and heat management chimney.",
      type: "RENTAL_PACKAGE",
      price: 749.00,
      stock: 10,
      sku: "VIP-LNG-008",
      vendorId: vBreeze.id,
      images: JSON.stringify(["/SHEESHA-SET.webp"]),
      isFeatured: true,
    },
    {
      title: "Deluxe Heat Management System",
      description: "Aviation aluminum heat manager with adjustable rotational airflow vents. Eliminates foil, reduces charcoal consumption.",
      type: "ACCESSORY",
      price: 119.00,
      stock: 35,
      sku: "HMD-DLX-009",
      vendorId: vRoyal.id,
      images: JSON.stringify(["/Categories/Accessories.webp"]),
      isFeatured: false,
    },
    {
      title: "Blueberry Citrus Breeze",
      description: "Wild Maine blueberry blended with zesty Mediterranean lemon zest and a hint of sweet vanilla custard.",
      type: "TOBACCO_BLEND",
      price: 165.00,
      stock: 40,
      sku: "BCB-BL-010",
      vendorId: vBreeze.id,
      images: JSON.stringify(["/Categories/flavor.webp"]),
      isFeatured: false,
    },
    {
      title: "Silicone Soft-Touch Hose & Carbon Handle",
      description: "Medical-grade washable food-safe silicone hose with lightweight woven real carbon-fiber handle and ergonomic grip.",
      type: "ACCESSORY",
      price: 89.00,
      stock: 50,
      sku: "SIL-HOS-011",
      vendorId: vSultan.id,
      images: JSON.stringify(["/Categories/Accessories.webp"]),
      isFeatured: false,
    },
    {
      title: "Electric Charcoal Burner 1000W",
      description: "Heavy-duty electric coil burner designed for rapid 5-minute ignition of natural coconut charcoals with thermo-shield plate.",
      type: "EQUIPMENT",
      price: 139.00,
      stock: 25,
      sku: "ECB-1KW-012",
      vendorId: vRoyal.id,
      images: JSON.stringify(["/Categories/Accessories.webp"]),
      isFeatured: false,
    }
  ];

  for (const item of productsToSeed) {
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { sku: item.sku },
          { title: item.title }
        ]
      }
    });

    if (existing) {
      console.log(`Product "${item.title}" already exists (${existing.id}), updating...`);
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...item,
          isActive: true,
          deletedAt: null,
        }
      });
    } else {
      const created = await prisma.product.create({
        data: {
          ...item,
          isActive: true,
        }
      });
      console.log(`Created product "${item.title}" (${created.id})`);
    }
  }

  const totalProducts = await prisma.product.count({ where: { deletedAt: null } });
  console.log(`Finished! Total active products in database: ${totalProducts}`);
}

main()
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
