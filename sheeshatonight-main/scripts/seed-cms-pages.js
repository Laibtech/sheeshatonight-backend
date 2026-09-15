const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const staticPages = [
  {
    title: "About SheeshaTonight",
    slug: "about",
    seoTitle: "About Us | SheeshaTonight - Premium Sheesha Experiences across UAE",
    seoDescription: "Discover SheeshaTonight, the UAE's premier luxury sheesha rental and marketplace platform catering to villas, yachts, and private gatherings.",
    isActive: true,
    content: `## Elevating the Sheesha Experience

SheeshaTonight is the United Arab Emirates' premier luxury sheesha rental, catalog, and event concierge service. Founded with a passion for traditional hospitality merged with contemporary excellence, we curate the finest European and Russian sheesha apparatus, artisanal tobacco blends, and white-glove setup services for discerning clients.

### Our Mission
To deliver unforgettable, bespoke lounge experiences directly to private villas, luxury yachts, corporate retreats, and celebratory gatherings across Dubai, Abu Dhabi, and the wider UAE.

### Quality & Authenticity Guaranteed
Every setup includes medical-grade silicone hoses, precision-crafted stainless steel or Bohemian crystal stems, natural coconut charcoal, and masterfully prepared flavors by certified shisha sommeliers.`
  },
  {
    title: "Contact SheeshaTonight",
    slug: "contact",
    seoTitle: "Contact Us | SheeshaTonight UAE Support & Inquiries",
    seoDescription: "Get in touch with the SheeshaTonight team for reservations, custom VIP setups, vendor partnerships, or customer assistance.",
    isActive: true,
    content: `## Get in Touch With Our Concierge

Whether you are planning an intimate gathering or an extravagant wedding celebration, our concierge team is available 24/7 to assist with bookings, flavor selection, and custom arrangements.

### VIP Concierge & Bookings
- **Hotline & WhatsApp:** +971 50 912 1111
- **Email:** support@sheeshatonight.com
- **Operational Hours:** Monday - Sunday: 12:00 PM – 4:00 AM (UAE Standard Time)

### Headquarters
SheeshaTonight FZ-LLC  
Downtown Dubai, Boulevard Crescent  
Dubai, United Arab Emirates`
  },
  {
    title: "Frequently Asked Questions",
    slug: "faqs",
    seoTitle: "FAQs | SheeshaTonight Questions & Answers",
    seoDescription: "Find quick answers regarding our same-day delivery, rental durations, age requirements, and equipment care.",
    isActive: true,
    content: `## Common Questions & Answers

### 1. What is the minimum age to order or rent sheesha?
In strict compliance with UAE federal laws, you must be at least **18 years of age** to purchase tobacco or book our rental experiences. Valid Emirates ID or passport verification is required upon delivery.

### 2. How fast is delivery in Dubai?
We provide same-day VIP express delivery across Dubai within **60 to 90 minutes** of order confirmation. Abu Dhabi, Sharjah, and Ajman deliveries are scheduled within 2 to 4 hours.

### 3. Does the rental package include charcoal and tongs?
Yes. All turnkey rental packages come complete with the master pipe, premium disposable mouthpieces, charcoal burner, coconut charcoals, heat management device, and tongs.

### 4. What happens when our event ends?
Our logistics team handles next-day collection at your convenience, or you can opt for on-site master attendant service throughout your event.`
  },
  {
    title: "Terms & Conditions",
    slug: "terms",
    seoTitle: "Terms of Service & Conditions | SheeshaTonight",
    seoDescription: "Read the official Terms and Conditions governing your use of SheeshaTonight website, purchases, and rental services.",
    isActive: true,
    content: `## SheeshaTonight Terms & Conditions

### 1. Acceptance of Terms
By accessing or using SheeshaTonight (the "Platform"), you agree to be bound by these Terms and Conditions and all applicable UAE local and federal laws.

### 2. Age Requirement & Verification
All users must be 18 years or older. SheeshaTonight and its licensed vendor partners reserve the right to verify legal age before fulfilling any order or rental setup.

### 3. Rental Equipment Custody & Care
Clients are responsible for taking reasonable care of all rented items. Breakage, accidental damage, or loss of crystal bases, electronic coal burners, or custom stems will incur replacement costs based on prevailing retail value.

### 4. Cancellation & Rescheduling
Rental bookings may be rescheduled or cancelled free of charge up to 4 hours prior to the agreed delivery window.`
  },
  {
    title: "Privacy Policy",
    slug: "privacy",
    seoTitle: "Privacy Policy | SheeshaTonight UAE Data Protection",
    seoDescription: "Learn how SheeshaTonight collects, protects, and handles your personal information in compliance with UAE Data Protection Law.",
    isActive: true,
    content: `## SheeshaTonight Privacy Policy

Your privacy is paramount. This Privacy Policy details the data collected during your interaction with SheeshaTonight and how we ensure its security.

### 1. Information Collected
We collect personal information necessary to deliver orders and rental experiences, including your name, contact phone number, delivery address, and payment confirmation tokens.

### 2. Payment Security
All payment processing is handled through PCI-DSS Level 1 compliant payment gateways. We do not store full credit or debit card numbers on our servers.

### 3. Data Retention & Access
Your information is retained strictly for order fulfillment, warranty, and statutory tax compliance under UAE Federal Tax Authority (FTA) regulations.`
  },
  {
    title: "Refund & Cancellation Policy",
    slug: "refund-policy",
    seoTitle: "Refund Policy | SheeshaTonight Cancellation Guidelines",
    seoDescription: "Understand the terms for refunds, returns, and booking cancellations on SheeshaTonight.",
    isActive: true,
    content: `## Refund & Return Guidelines

### 1. Rental Cancellations
- **More than 4 hours before delivery:** 100% full refund.
- **Under 4 hours or driver dispatched:** A AED 50 dispatch fee applies; the remainder is refunded immediately.

### 2. Consumables & Flavors
Unopened tobacco blends, charcoals, and sealed hygienic accessories can be returned within 7 days for a full refund or exchange.

### 3. Defective Equipment
If any equipment arrives damaged or malfunctions during initial lighting, our on-call logistics team will replace the unit within 45 minutes at no extra charge.`
  },
  {
    title: "Shipping & VIP Delivery Policy",
    slug: "shipping-policy",
    seoTitle: "Shipping & Delivery Policy | SheeshaTonight Express UAE",
    seoDescription: "Review our same-day delivery zones, cutoff times, and delivery fees across Dubai, Abu Dhabi, and Northern Emirates.",
    isActive: true,
    content: `## Same-Day Delivery Across the UAE

### Delivery Zones & Turnaround Times
- **Dubai (Downtown, Marina, JBR, Palm Jumeirah, Hills):** 60–90 minutes.
- **Dubai Outskirts (Damac Hills, Silicon Oasis, Dubailand):** 90–120 minutes.
- **Abu Dhabi & Yas Island:** 2–3 hours.
- **Sharjah & Ajman:** 90–120 minutes.

### Delivery Fees
Orders above AED 300 qualify for **Complimentary VIP Delivery**. Standard delivery for orders below AED 300 is charged at a flat rate of AED 25.`
  },
  {
    title: "Vendor Terms & Marketplace Agreement",
    slug: "vendor-terms",
    seoTitle: "Vendor Marketplace Agreement | SheeshaTonight Partners",
    seoDescription: "Terms, commission structure, and operational standards for registered vendors on SheeshaTonight.",
    isActive: true,
    content: `## SheeshaTonight Vendor Partner Agreement

### 1. Merchant Standards
All registered vendors agree to maintain authentic, genuine brand stock and fulfill orders within agreed service-level agreements (SLAs).

### 2. Platform Commission & Settlements
- Platform commission is deducted automatically upon checkout at the agreed rate (standard 10% or contractual tier).
- Vendor net proceeds transition to **Eligible for Payout** once orders are marked Delivered.
- Settlements are remitted via direct UAE IBAN bank transfer on scheduled weekly or bi-weekly cycles.`
  }
];

async function main() {
  console.log('Seeding CMS static pages into MySQL database...');

  for (const page of staticPages) {
    const existing = await prisma.cmsPage.findUnique({ where: { slug: page.slug } });
    if (existing) {
      console.log(`Page "${page.slug}" already exists, updating with full content and SEO...`);
      await prisma.cmsPage.update({
        where: { slug: page.slug },
        data: {
          title: page.title,
          content: page.content,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          isActive: true,
        }
      });
    } else {
      const created = await prisma.cmsPage.create({
        data: {
          title: page.title,
          slug: page.slug,
          content: page.content,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          isActive: true,
        }
      });
      console.log(`Created CMS page: "${created.title}" (slug: ${created.slug})`);
    }
  }

  // Ensure default platform commission setting exists
  const existingSetting = await prisma.platformSetting.findUnique({
    where: { key: 'platform_commission' }
  });

  if (existingSetting) {
    console.log('Platform commission setting already exists:', existingSetting);
  } else {
    const createdSetting = await prisma.platformSetting.create({
      data: {
        key: 'platform_commission',
        commissionType: 'PERCENTAGE',
        commissionValue: 10.00,
        fixedFee: 0.00,
        description: 'Global marketplace default commission rate (%) deducted from vendor earnings',
      }
    });
    console.log('Created default platform setting:', createdSetting);
  }

  const totalPages = await prisma.cmsPage.count();
  console.log(`Finished! Total CMS pages in database: ${totalPages}`);
}

main()
  .catch(err => {
    console.error('Seed CMS error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
