'use client';

import React, { useState } from "react";
import "./vendor.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Star, Heart, CheckCircle2, Search, Filter } from 'lucide-react';

const fallbackVendors = [
  {
    id: "sultan-shisha",
    name: "Sultan Shisha Lounge",
    location: "Downtown Dubai",
    rating: 4.9,
    reviews: 126,
    distance: "2.4 km",
    image: "/lounge-1.webp",
    tags: ["Flavors", "Rentals", "VIP"],
    verified: true,
  },
  {
    id: "royal-sheesha",
    name: "Royal Sheesha Lounge",
    location: "Dubai Marina",
    rating: 4.8,
    reviews: 98,
    distance: "3.2 km",
    image: "/lounge-2.webp",
    tags: ["Rentals", "Setups", "VIP"],
    verified: true,
  },
  {
    id: "breeze-beach",
    name: "Breeze Beach Lounge",
    location: "Palm Jumeirah",
    rating: 4.9,
    reviews: 142,
    distance: "4.1 km",
    image: "/lounge-3.webp",
    tags: ["Beachside", "Flavors", "Events"],
    verified: true,
  },
  {
    id: "linus-fox",
    name: "Linus Fox Lounge",
    location: "Business Bay",
    rating: 4.7,
    reviews: 64,
    distance: "1.8 km",
    image: "/lounge-4.webp",
    tags: ["Premium", "Rentals", "Accessories"],
    verified: true,
  },
];

function VendorsHero() {
  return (
    <section className="vendors-hero">
      <div className="vendors-hero-content">
        <span className="vendors-eyebrow">DISCOVER TRUSTED VENDORS</span>
        <h1>
          Find Premium
          <br />
          <span>Sheesha Vendors</span>
          <br />
          Near You
        </h1>
        <p>
          Explore verified sheesha lounges, rental services and product vendors
          across the UAE.
        </p>
        <div className="vendors-search-box">
          <div className="search-location-select">
            <MapPin className="w-4 h-4" />
            <select defaultValue="Dubai">
              <option>Dubai</option>
              <option>Abu Dhabi</option>
              <option>Sharjah</option>
              <option>Ajman</option>
              <option>Umm Al Quwain</option>
              <option>Ras Al Khaimah</option>
              <option>Fujairah</option>
            </select>
          </div>
          <div className="search-input-box">
            <Search className="w-5 h-5" />
            <input type="text" placeholder="Search vendors, areas, products..." />
          </div>
          <button className="search-submit-btn">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

function VendorsFilters() {
  return (
    <section className="vendors-filters">
      <div className="vendors-container">
        <div className="filters-top">
          <div>
            <h2>All Vendors</h2>
            <p>Showing 8 verified sheesha vendors</p>
          </div>
          <div className="filters-actions">
            <button className="filter-btn">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select defaultValue="recommended">
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest First</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

function VendorCard({ vendor }: { vendor: typeof fallbackVendors[0] | any }) {
  return (
    <article className="vendor-listing-card">
      <div className="vendor-card-image">
        <img src={vendor.image || "/lounge-1.webp"} alt={vendor.name} />
        <button className="vendor-wishlist-btn">
          <Heart className="w-4 h-4" />
        </button>
        {vendor.verified && (
          <span className="vendor-verified-badge">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        )}
        <span className="vendor-distance">{vendor.distance}</span>
      </div>
      <div className="vendor-card-info">
        <div className="vendor-card-header">
          <h3>{vendor.name}</h3>
          <div className="vendor-rating">
            <Star className="w-3 h-3 fill-current" />
            <span>{vendor.rating}</span>
            <small>({vendor.reviews})</small>
          </div>
        </div>
        <p className="vendor-card-location">
          <MapPin className="w-3 h-3" /> {vendor.location}
        </p>
        <div className="vendor-card-tags">
          {(vendor.tags || []).map((tag: string) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a href={`/vendor/${vendor.id}`} className="view-vendor-btn">
          View Vendor
        </a>
      </div>
    </article>
  );
}

function VendorsGrid({ vendors }: { vendors: any[] }) {
  return (
    <section className="vendors-grid-section">
      <div className="vendors-container">
        <div className="vendors-grid">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VendorsCTA() {
  return (
    <section className="vendors-cta">
      <div className="vendors-container">
        <div className="vendors-cta-content">
          <span className="vendors-eyebrow">ARE YOU A VENDOR?</span>
          <h2>
            Grow Your Business With
            <br />
            <span>SheeshaTonight</span>
          </h2>
          <p>
            Join our network of trusted vendors and connect with thousands of
            customers across the UAE.
          </p>
          <a href="/vendors" className="vendors-cta-btn">Become a Vendor</a>
        </div>
      </div>
    </section>
  );
}

export default function VendorsPage() {
  const [vendorList, setVendorList] = useState(fallbackVendors);

  React.useEffect(() => {
    fetch("/api/vendors", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.vendors;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((v: any, index: number) => ({
            id: v.id || `vendor-${index}`,
            name: v.name,
            location: v.location || "Dubai, UAE",
            rating: Number(v.rating || 4.8),
            reviews: Number(v.reviewCount || 45),
            distance: `${(index + 1) * 1.5} km`,
            image: v.coverImage || `/lounge-${(index % 4) + 1}.webp`,
            tags: v.services && v.services.length > 0 ? v.services : ["VIP", "Rentals"],
            verified: v.verified !== false,
          }));
          setVendorList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="vendors-page">
      <Header />
      <VendorsHero />
      <VendorsFilters />
      <VendorsGrid vendors={vendorList} />
      <VendorsCTA />
      <Footer />
    </div>
  );
}
