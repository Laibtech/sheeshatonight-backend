"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  Clock,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  image: string;
  type: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
  vendorId?: string;
  vendorName?: string;
  vendorLocation?: string;
}

interface VendorStore {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  phone: string;
  tier: string;
  rating: number;
  reviews: number;
  verified: boolean;
  image: string;
  bannerImage: string;
  services: string[];
  products: Product[];
  createdAt?: string;
}

export default function VendorStorePage() {
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<VendorStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  useEffect(() => {
    if (vendorId) {
      fetchVendorStore();
    }
  }, [vendorId]);

  const fetchVendorStore = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vendors/${vendorId}`);
      const result = await res.json();

      if (result.success && result.data) {
        setVendor(result.data);
      }
    } catch (error) {
      console.error("Error fetching vendor store:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "65vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(212,175,55,0.2)", borderTopColor: "#D4AF37", animation: "spin 1s linear infinite" }}></div>
          <p style={{ marginTop: "1rem", color: "#888" }}>Loading vendor storefront...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!vendor) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", textAlign: "center", padding: "5rem 1rem" }}>
          <Building2 size={48} color="#D4AF37" style={{ marginBottom: "1rem" }} />
          <h2 style={{ color: "#fff", fontSize: "1.75rem", fontWeight: 700 }}>Vendor Store Not Found</h2>
          <p style={{ color: "#888", marginBottom: "2rem" }}>The vendor lounge or store you are trying to visit is unavailable or inactive.</p>
          <Link href="/shop" style={{ color: "#D4AF37", textDecoration: "underline", fontWeight: 600 }}>
            ← Explore Products Catalog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const defaultBanner = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200";
  const defaultLogo = "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600";
  const fallbackProductImg = "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800";

  const categories = ["ALL", ...Array.from(new Set((vendor.products || []).map((p) => p.type || p.category).filter(Boolean)))];

  const filteredProducts = activeCategory === "ALL"
    ? vendor.products || []
    : (vendor.products || []).filter((p) => (p.type || p.category) === activeCategory);

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "#0A0A0A", color: "#fff", paddingBottom: "4rem" }}>
        {/* BANNER HEADER */}
        <section style={{ position: "relative", width: "100%", height: "260px", background: "#111", overflow: "hidden" }}>
          <Image
            src={vendor.bannerImage || defaultBanner}
            alt={vendor.name}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover", filter: "brightness(0.55)" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)"
          }} />

          <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10 }}>
            <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: "20px", color: "#fff", textDecoration: "none", fontSize: "0.85rem", backdropFilter: "blur(4px)" }}>
              <ArrowLeft size={14} /> Back to Products
            </Link>
          </div>
        </section>

        {/* STORE INFO BAR */}
        <section style={{ marginTop: "-60px", position: "relative", zIndex: 20 }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{
              background: "rgba(20,20,20,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "16px",
              padding: "1.75rem",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "1.5rem",
              alignItems: "center"
            }}>
              {/* LOGO */}
              <div style={{ position: "relative", width: "90px", height: "90px", borderRadius: "14px", overflow: "hidden", border: "2px solid #D4AF37", background: "#000" }}>
                <Image
                  src={vendor.image || defaultLogo}
                  alt={vendor.name}
                  fill
                  sizes="90px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* DETAILS */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", margin: 0 }}>{vendor.name}</h1>
                  {vendor.verified !== false && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(16,185,129,0.15)", color: "#10B981", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <ShieldCheck size={12} /> Verified Partner
                    </span>
                  )}
                  {vendor.tier && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(212,175,55,0.15)", color: "#D4AF37", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <Sparkles size={12} /> {vendor.tier} Tier
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.5rem", color: "#aaa", fontSize: "0.85rem", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={14} color="#D4AF37" /> {vendor.location || "Dubai, UAE"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Phone size={14} color="#D4AF37" /> {vendor.phone || "+971 4 333 9988"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Star size={14} fill="#D4AF37" color="#D4AF37" /> {vendor.rating || 4.9} ({vendor.reviews || 48} reviews)
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div>
                <a
                  href={`tel:${vendor.phone || '+97143339988'}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#D4AF37",
                    color: "#000",
                    fontWeight: 700,
                    padding: "10px 20px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <Phone size={16} /> Contact Store
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STORE OVERVIEW & SERVICES */}
        <section style={{ padding: "2.5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
              
              {/* ABOUT VENDOR */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "1.5rem" }}>
                <h3 style={{ color: "#D4AF37", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>About The Store</h3>
                <p style={{ color: "#ccc", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  {vendor.description || "Welcome to our premium Sheesha Lounge and store. We curate top-tier hookahs, hand-crafted tobacco blends, and exclusive VIP lounge experiences across Dubai."}
                </p>

                {/* SERVICES BADGES */}
                {vendor.services && vendor.services.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h4 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem" }}>Available Store Services</h4>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {vendor.services.map((service, idx) => (
                        <span key={idx} style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "rgba(212,175,55,0.08)",
                          border: "1px solid rgba(212,175,55,0.2)",
                          color: "#D4AF37",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "0.8rem"
                        }}>
                          <CheckCircle2 size={12} /> {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* STORE STATS / TIMINGS */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "1.5rem" }}>
                <h3 style={{ color: "#D4AF37", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Store Information</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#bbb", fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Clock size={16} color="#D4AF37" />
                    <span>Open Today: 12:00 PM – 03:00 AM</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Package size={16} color="#D4AF37" />
                    <span>Catalog Products: {(vendor.products || []).length} items</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldCheck size={16} color="#D4AF37" />
                    <span>SheeshaTonight Direct Dispatch</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCTS CATALOG SECTION */}
        <section style={{ padding: "1rem 0 3rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: 0 }}>Products & Rental Menu</h2>
                <p style={{ color: "#888", fontSize: "0.85rem", margin: "4px 0 0 0" }}>Browse all active items supplied by {vendor.name}</p>
              </div>

              {/* CATEGORY TABS */}
              {categories.length > 1 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: activeCategory === cat ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                        background: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.03)",
                        color: activeCategory === cat ? "#000" : "#ccc",
                        fontWeight: activeCategory === cat ? 700 : 500,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {cat.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <ShoppingBag size={36} color="#555" style={{ marginBottom: "0.75rem" }} />
                <h3 style={{ color: "#fff", fontSize: "1.1rem" }}>No products in this category</h3>
                <p style={{ color: "#777", fontSize: "0.85rem" }}>Check back soon for new arrivals from {vendor.name}.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                {filteredProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      overflow: "hidden",
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column"
                    }}>
                      <div style={{ position: "relative", width: "100%", height: "200px", background: "#111" }}>
                        <Image
                          src={product.image || fallbackProductImg}
                          alt={product.name || product.title}
                          fill
                          sizes="300px"
                          style={{ objectFit: "cover" }}
                        />
                        {(product.type === "SHEESHA_PIPE" || product.type === "RENTAL_PACKAGE") && (
                          <span style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "rgba(212,175,55,0.9)",
                            color: "#000",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            padding: "3px 8px",
                            borderRadius: "10px"
                          }}>
                            Rent / Buy
                          </span>
                        )}
                      </div>

                      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: "#D4AF37", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>
                            {product.type?.replace(/_/g, " ") || "SHEESHA"}
                          </div>
                          <h3 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 600, margin: "0 0 8px 0", lineHeight: 1.3 }}>
                            {product.name || product.title}
                          </h3>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1.1rem" }}>
                            AED {product.price}
                          </div>
                          <span style={{
                            fontSize: "0.75rem",
                            color: "#D4AF37",
                            border: "1px solid rgba(212,175,55,0.4)",
                            padding: "4px 10px",
                            borderRadius: "6px"
                          }}>
                            View Item
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
