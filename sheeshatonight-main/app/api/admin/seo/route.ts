import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, errorResponse, successResponse, AuthenticatedRequest } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

export const DEFAULT_SEO_CONFIG = {
  global: {
    siteName: 'SheeshaTonight',
    titleTemplate: '%s | SheeshaTonight UAE',
    defaultTitle: 'SheeshaTonight - Premium Luxury Sheesha Rental & Tobacco Marketplace Dubai',
    defaultDescription: 'Experience luxury on-demand sheesha delivery and event catering in Dubai & UAE. Premium German and Russian hookahs, exotic flavors, and white-glove masters for villas, yachts, and private gatherings.',
    keywords: 'sheesha rental dubai, shisha delivery uae, luxury hookah hire, yacht sheesha service, private party sheesha master, buy sheesha dubai',
    canonicalBase: 'https://sheeshatonight.com',
    author: 'SheeshaTonight LLC',
    robots: 'index, follow',
    language: 'en-AE',
  },
  pages: {
    home: {
      title: 'SheeshaTonight | Premium On-Demand Sheesha Rentals & Marketplace Dubai',
      description: 'Rent premium sheesha setups with 45-min delivery across Dubai. Handcrafted Russian & German pipes, top lounge masters, and exclusive flavors.',
      keywords: 'sheesha delivery dubai, rent shisha dubai, sheesha tonight, luxury hookah dubai, villa sheesha',
      canonical: 'https://sheeshatonight.com',
      robots: 'index, follow',
      ogImage: '/hero-banner.png',
    },
    rentals: {
      title: 'Rent a Sheesha | Full Setup & Shisha Master Catering Dubai',
      description: 'Book luxury sheesha catering for villas, yachts, and weddings. Dedicated shisha sommelier, natural coconut coals, and premium flavors.',
      keywords: 'rent sheesha uae, shisha catering dubai, yacht sheesha hire, wedding hookah lounge',
      canonical: 'https://sheeshatonight.com/rentals',
      robots: 'index, follow',
      ogImage: '/rentals-hero-banner.webp',
    },
    shop: {
      title: 'Sheesha Shop | Buy Premium Hookahs, Bowls & Accessories UAE',
      description: 'Buy authentic Russian & German hookahs, premium tobacco flavors, silicone hoses, and natural charcoal in Dubai.',
      keywords: 'buy sheesha dubai, hookah shop uae, shisha flavors online, sheesha accessories',
      canonical: 'https://sheeshatonight.com/shop',
      robots: 'index, follow',
      ogImage: '/SHOP-BANNER.webp',
    },
    experiences: {
      title: 'Bespoke Sheesha Experiences | Villa, Yacht & VIP Events Dubai',
      description: 'Tailored luxury sheesha setups for intimate gatherings, birthdays, corporate lounges, and luxury yacht nights in Dubai.',
      keywords: 'yacht sheesha dubai, villa hookah experience, corporate shisha lounge, luxury sheesha party',
      canonical: 'https://sheeshatonight.com/experiences',
      robots: 'index, follow',
      ogImage: '/experience-hero-banner.webp',
    },
    about: {
      title: 'About SheeshaTonight | UAE’s First Luxury Sheesha Marketplace',
      description: 'Learn about SheeshaTonight, connecting verified licensed lounges, masters, and sheesha enthusiasts across the UAE.',
      keywords: 'about sheesha tonight, luxury shisha brand dubai, sheesha marketplace uae',
      canonical: 'https://sheeshatonight.com/about',
      robots: 'index, follow',
      ogImage: '/made for dubai.webp',
    },
    contact: {
      title: 'Contact SheeshaTonight | 24/7 VIP Concierge & Support',
      description: 'Reach our 24/7 customer support and event booking specialists for urgent deliveries, corporate inquiries, and custom packages.',
      keywords: 'contact sheesha tonight, shisha customer support dubai, book sheesha master',
      canonical: 'https://sheeshatonight.com/contact',
      robots: 'index, follow',
      ogImage: '/contact-us-banner.webp',
    },
  },
  social: {
    ogType: 'website',
    ogSiteName: 'SheeshaTonight',
    defaultOgImage: '/hero-banner.png',
    twitterCard: 'summary_large_image',
    twitterSite: '@sheeshatonight',
    twitterCreator: '@sheeshatonight',
    facebookAppId: '',
  },
  schema: {
    enabled: true,
    businessType: 'LocalBusiness',
    name: 'SheeshaTonight UAE',
    legalName: 'SheeshaTonight Portal L.L.C',
    telephone: '+971 4 555 1234',
    email: 'concierge@sheeshatonight.com',
    priceRange: '$$$',
    currenciesAccepted: 'AED, USD, EUR',
    paymentAccepted: 'Cash, Credit Card, Apple Pay, Tabby',
    streetAddress: 'Downtown Boulevard, Burj Plaza',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    postalCode: '00000',
    addressCountry: 'AE',
    latitude: 25.1972,
    longitude: 55.2744,
    enableFaqSchema: true,
    faqs: [
      {
        question: "How fast is Sheesha delivery in Dubai?",
        answer: "We deliver luxury on-demand sheesha setups within 45 minutes across Dubai Marina, Downtown, Palm Jumeirah, Business Bay, and all major UAE locations."
      },
      {
        question: "What is included with a SheeshaTonight rental setup?",
        answer: "Every rental includes handcrafted German/Russian pipes, premium crystal vases, odorless natural coconut charcoal, fresh silicone hoses, and top-tier exotic flavors."
      },
      {
        question: "Can I book a dedicated sheesha master for a yacht or private villa party?",
        answer: "Yes, our certified sheesha sommeliers provide white-glove table service, coal replenishment, and custom flavor mixology for villas, yachts, and luxury events."
      }
    ],
  },
  verification: {
    google: 'google-site-verification=ST_UAE_DXB_2026_VERIFIED',
    bing: 'msvalidate.01=A9824FE09B82C10298',
    yandex: '',
  },
  analytics: {
    ga4Id: 'G-DXB88SHEESHA',
    metaPixelId: '984029182390123',
    gtmId: '',
  },
  sitemap: {
    changefreq: 'daily',
    priority: '0.9',
    autoGenerate: true,
  },
  robotsTxt: {
    allowAll: true,
    disallowPaths: ['/admin/', '/api/', '/dashboard/settings', '/checkout'],
  },
};

export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const record = await prisma.cmsContent.findUnique({
      where: { key: 'seo_settings' },
    });

    if (!record || !record.value) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_SEO_CONFIG,
        source: 'default',
      });
    }

    return NextResponse.json({
      success: true,
      data: record.value,
      source: 'database',
    });
  } catch (error: any) {
    console.error('Failed to get SEO settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch SEO settings', data: DEFAULT_SEO_CONFIG },
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();

    const updated = await prisma.cmsContent.upsert({
      where: { key: 'seo_settings' },
      update: {
        value: body,
        updatedAt: new Date(),
      },
      create: {
        key: 'seo_settings',
        value: body,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'SEO settings updated successfully',
      data: updated.value,
    });
  } catch (error: any) {
    console.error('Failed to save SEO settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save SEO settings' },
      { status: 500 }
    );
  }
});
