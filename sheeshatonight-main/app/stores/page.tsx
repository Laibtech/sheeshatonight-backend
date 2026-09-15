"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  MapPin,
  Heart,
  X,
  CheckCircle2,
  Phone,
  Store,
  Clock,
  Map as MapIcon,
  Grid3x3,
} from "lucide-react";
import { apiNext, VendorItem } from '@/lib/api';
import './stores.css';

// Dynamically import map component (client-side only)
const StoresMap = dynamic(() => import('@/components/StoresMap'), {
  ssr: false,
  loading: () => <div className="map-loading">Loading map...</div>
});

const categories = [
  "All Stores",
  "Retail",
  "Wholesale",
  "Online",
  "Verified",
];

export default function StoresPage() {
  const [activeCategory, setActiveCategory] = useState("All Stores");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [stores, setStores] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const result = await apiNext.vendors.getVendors({
        category: 'Shop',
        limit: 50,
      });
      if (result.success) {
        setStores(result.data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores
    .filter((store) => {
      const matchesCategory =
        activeCategory === "All Stores" ||
        (activeCategory === "Verified" && store.verified) ||
        store.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()));
      
      const matchesSearch =
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.location.toLowerCase().includes(search.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "Distance") {
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        if (isNaN(distA)) return 1;
        if (isNaN(distB)) return -1;
        return distA - distB;
      }
      if (sort === "Top Rated") return b.rating - a.rating;
      if (sort === "Most Reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <>
      <Header />
      <main className="stores-page">
        {/* HERO */}
        <section className="stores-hero">
          <div className="hero-content">
            <Link href="/" className="back-link">
              ← Back to Home
            </Link>
            <span className="eyebrow">
              DISCOVER PREMIUM STORES
            </span>
            <h1>
              Find The Best <em>Sheesha Stores</em>
            </h1>
            <p>
              Browse verified sheesha shops offering premium flavors, hookahs, accessories and more across the UAE.
            </p>
            {/* SEARCH */}
            <div className="search-box">
              <Search size={19} />
              <input
                type="text"
                placeholder="Search stores, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="stores-content">
          {/* CATEGORY FILTERS */}
          <div className="category-scroll">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="toolbar">
            <div className="toolbar-left">
              <span className="result-count">
                {loading ? 'Loading...' : `${filteredStores.length} stores available`}
              </span>
              
              {/* View Toggle */}
              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  className={viewMode === 'map' ? 'active' : ''}
                  onClick={() => setViewMode('map')}
                  title="Map View"
                >
                  <MapIcon size={16} />
                </button>
              </div>
            </div>

            <div className="toolbar-actions">
              <button
                className="filter-button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>
              <div className="sort-wrapper">
                <span>Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option>Recommended</option>
                  <option>Top Rated</option>
                  <option>Most Reviews</option>
                  <option>Distance</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </div>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="filter-panel">
              <div>
                <label>Location</label>
                <select>
                  <option>All UAE</option>
                  <option>Dubai</option>
                  <option>Abu Dhabi</option>
                  <option>Sharjah</option>
                  <option>Ajman</option>
                </select>
              </div>
              <div>
                <label>Store Type</label>
                <select>
                  <option>All Types</option>
                  <option>Retail</option>
                  <option>Wholesale</option>
                  <option>Online Only</option>
                </select>
              </div>
              <div>
                <label>Rating</label>
                <select>
                  <option>Any Rating</option>
                  <option>4.5+</option>
                  <option>4.0+</option>
                  <option>3.5+</option>
                </select>
              </div>
              <button
                className="close-filter"
                onClick={() => setShowFilters(false)}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* MAP VIEW */}
          {viewMode === 'map' && !loading && (
            <div className="map-container">
              <StoresMap stores={filteredStores} />
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <>
              {loading ? (
                <div className="empty-state">
                  <h3>Loading stores...</h3>
                  <p>Please wait while we fetch verified stores.</p>
                </div>
              ) : filteredStores.length > 0 ? (
                <div className="stores-grid">
                  {filteredStores.map((store) => (
                    <Link
                      href={`/stores/${store.id}`}
                      className="store-card"
                      key={store.id}
                    >
                      {/* IMAGE */}
                      <div className="store-image">
                        <Image
                          src={store.image}
                          alt={store.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <button
                          className="favorite"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Heart size={17} />
                        </button>
                        <div className="rating-badge">
                          <Star size={12} fill="currentColor" />
                          {store.rating}
                        </div>
                        {store.verified && (
                          <div className="verified-badge">
                            <CheckCircle2 size={14} />
                            Verified
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="store-info">
                        <div className="store-header">
                          <Store size={16} className="store-icon" />
                          <h3>{store.name}</h3>
                        </div>
                        
                        <div className="reviews">
                          <Star size={12} fill="currentColor" />
                          {store.rating} ({store.reviews} reviews)
                        </div>

                        <div className="location">
                          <MapPin size={13} />
                          {store.location}
                        </div>

                        {store.distance !== "N/A" && (
                          <div className="distance">
                            <Clock size={13} />
                            {store.distance} away
                          </div>
                        )}

                        <div className="tags">
                          {store.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>

                        <div className="card-actions">
                          <button
                            className="visit-button"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            Visit Store
                          </button>
                          <button
                            className="contact-icon-button"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <Phone size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No stores found</h3>
                  <p>
                    {stores.length === 0 
                      ? 'No verified sheesha stores available yet. Check back soon!'
                      : 'Try searching for another store or location.'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA */}
        <section className="store-cta">
          <div>
            <span>OWN A SHEESHA STORE?</span>
            <h2>
              List your <em>store</em> with us
            </h2>
            <p>
              Join SheeshaTonight and reach thousands of sheesha enthusiasts across the UAE.
            </p>
          </div>
          <Link href="/vendor/register">
            Register Your Store →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
