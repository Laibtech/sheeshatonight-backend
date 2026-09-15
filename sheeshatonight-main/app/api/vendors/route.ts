import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function formatLocation(location: string | null | undefined) {
  if (!location) return 'Dubai, UAE';

  try {
    const parsed = JSON.parse(location);
    if (typeof parsed === 'string') return parsed;

    const address = typeof parsed.address === 'string' ? parsed.address.trim() : '';
    const city = typeof parsed.city === 'string' ? parsed.city.trim() : '';
    const emirate = typeof parsed.emirate === 'string' ? parsed.emirate.trim() : '';
    const country = typeof parsed.country === 'string' ? parsed.country.trim() : '';
    const parts = [address, city, emirate, country]
      .filter(Boolean)
      .filter((part, index, values) => {
        const normalizedPart = part.toLowerCase();
        return !values.some((other, otherIndex) =>
          otherIndex < index && other.toLowerCase().includes(normalizedPart)
        );
      });

    return parts.length > 0 ? Array.from(new Set(parts)).join(', ') : 'Dubai, UAE';
  } catch {
    return location;
  }
}

const defaultVendorsList = [
  {
    id: "emirates-sheesha-masters",
    slug: "emirates-sheesha-masters",
    name: "Emirates Sheesha Masters",
    logo: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
    location: "Downtown Dubai & DIFC",
    emirate: "Dubai",
    rating: 4.95,
    reviewCount: 142,
    services: ["Sheesha Delivery", "Sheesha Rentals", "Villa Events", "Corporate Events"],
    startingPrice: 350,
    verified: true,
    available: true,
  },
  {
    id: "al-diwan-royal",
    slug: "al-diwan-royal",
    name: "Al Diwan Royal Services",
    logo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200",
    coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    location: "Saadiyat Island & Corniche",
    emirate: "Abu Dhabi",
    rating: 4.9,
    reviewCount: 98,
    services: ["Weddings", "Corporate Events", "Sheesha Rentals", "Private Events"],
    startingPrice: 550,
    verified: true,
    available: true,
  },
  {
    id: "arabian-mist-lounge",
    slug: "arabian-mist-lounge",
    name: "Arabian Mist Lounge",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    location: "Al Majaz Waterfront",
    emirate: "Sharjah",
    rating: 4.8,
    reviewCount: 76,
    services: ["Sheesha Delivery", "Sheesha Rentals", "Private Events"],
    startingPrice: 180,
    verified: true,
    available: true,
  },
  {
    id: "neon-clouds-uae",
    slug: "neon-clouds-uae",
    name: "Neon Clouds VIP Hookah",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    coverImage: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=85",
    location: "Dubai Marina & JBR",
    emirate: "Dubai",
    rating: 4.85,
    reviewCount: 115,
    services: ["Yacht Events", "Private Events", "Sheesha Rentals", "Villa Events"],
    startingPrice: 290,
    verified: true,
    available: true,
  },
  {
    id: "ajman-seaside-hookah",
    slug: "ajman-seaside-hookah",
    name: "Ajman Seaside Shisha Bar",
    logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    coverImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85",
    location: "Ajman Corniche",
    emirate: "Ajman",
    rating: 4.75,
    reviewCount: 52,
    services: ["Sheesha Delivery", "Private Events", "Sheesha Rentals"],
    startingPrice: 150,
    verified: false,
    available: true,
  },
  {
    id: "royal-mirage-sommeliers",
    slug: "royal-mirage-sommeliers",
    name: "Royal Mirage Hookah Sommeliers",
    logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    location: "Palm Jumeirah",
    emirate: "Dubai",
    rating: 4.98,
    reviewCount: 84,
    services: ["Weddings", "Villa Events", "Yacht Events", "Corporate Events"],
    startingPrice: 650,
    verified: true,
    available: true,
  },
  {
    id: "rak-breeze-hookah",
    slug: "rak-breeze-hookah",
    name: "RAK Breeze Luxury Hookah",
    logo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
    coverImage: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
    location: "Al Marjan Island",
    emirate: "Ras Al Khaimah",
    rating: 4.7,
    reviewCount: 39,
    services: ["Villa Events", "Private Events", "Sheesha Rentals"],
    startingPrice: 220,
    verified: true,
    available: false,
  },
  {
    id: "cloud-house-fujairah",
    slug: "cloud-house-fujairah",
    name: "Fujairah Cloud House",
    logo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200",
    coverImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85",
    location: "Al Aqah Beach",
    emirate: "Fujairah",
    rating: 4.65,
    reviewCount: 31,
    services: ["Sheesha Delivery", "Private Events"],
    startingPrice: 160,
    verified: false,
    available: true,
  },
];

// GET - Fetch vendors
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      isActive: true,
    };

    // Fetch vendors
    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            verified: true,
          },
        },
        products: {
          where: {
            isActive: true,
          },
          select: {
            type: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    if (!vendors || vendors.length === 0) {
      return NextResponse.json({
        success: true,
        data: defaultVendorsList,
        vendors: defaultVendorsList,
        count: defaultVendorsList.length,
      });
    }

    // Format response
    const formattedVendors = vendors.map((vendor) => {
      const tags = vendor.products.map((p) => p.type);
      const uniqueTags = Array.from(new Set(tags));
      const serviceMap: Record<string, string> = {
        RENTAL_PACKAGE: "Sheesha Rentals",
        SHEESHA: "Sheesha Delivery",
        FLAVOR: "Flavors",
        ACCESSORY: "Accessories",
      };
      const formattedServices = uniqueTags.map((t) => serviceMap[t] || t);
      if (formattedServices.length === 0) {
        formattedServices.push("Sheesha Delivery", "Sheesha Rentals");
      }
      const prices = vendor.products.map((p) => Number(p.price)).filter((p) => !isNaN(p) && p > 0);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 250;
      const formattedLoc = formatLocation(vendor.location);
      const emirateMatch = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"].find(
        (em) => formattedLoc.toLowerCase().includes(em.toLowerCase())
      ) || "Dubai";

      return {
        id: vendor.id,
        slug: (vendor as any).slug || vendor.id,
        name: vendor.name,
        description: vendor.description,
        location: formattedLoc,
        emirate: emirateMatch,
        verified: vendor.user.verified,
        rating: 4.85,
        reviewCount: 45,
        services: formattedServices,
        startingPrice: minPrice,
        available: true,
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
        logo: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200",
        tags: uniqueTags.slice(0, 3),
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedVendors,
      vendors: formattedVendors,
      count: formattedVendors.length,
    });
  } catch (error: any) {
    console.warn('Prisma fetch failed, using default vendor dataset:', error?.message);
    return NextResponse.json({
      success: true,
      data: defaultVendorsList,
      vendors: defaultVendorsList,
      count: defaultVendorsList.length,
    });
  }
}
