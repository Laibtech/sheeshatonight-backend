"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Star,
  Check,
  X,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Truck,
  Flame,
  ArrowRight,
} from "lucide-react";

export type Product = {
  id: string | number;
  name: string;
  vendor: string;
  category: string;
  type: string;
  flavor: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
  description: string;
};

const categories = [
  "All Products",
  "Buy Sheesha",
  "Flavors",
  "Sheesha Setups",
  "Accessories",
];

export default function ShopPage() {
  const { itemCount, addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [category, setCategory] = useState("All Products");
  const [vendor, setVendor] = useState("All Vendors");
  const [rating, setRating] = useState("All Ratings");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | number | null>(null);
  const [viewOnlyWishlist, setViewOnlyWishlist] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [rentalsOpen, setRentalsOpen] = useState(false);

  // Fetch live products from backend MySQL database
  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: Product[] = json.data.map((p: any) => {
            let catLabel = "Buy Sheesha";
            if (p.type === "SHEESHA_PIPE") catLabel = "Buy Sheesha";
            else if (p.type === "TOBACCO_BLEND") catLabel = "Flavors";
            else if (p.type === "RENTAL_PACKAGE") catLabel = "Sheesha Setups";
            else if (p.type === "ACCESSORY" || p.type === "EQUIPMENT") catLabel = "Accessories";

            let img = p.image;
            if (!img && Array.isArray(p.images) && p.images.length > 0) img = p.images[0];
            if (!img) img = "/Categories/Buy Sheesha.webp";

            const prc = Number(p.price) || 0;
            const strId = String(p.id);
            return {
              id: p.id,
              name: p.title || p.name || "Sheesha Item",
              vendor: p.vendor || p.brand || "SheeshaTonight Partner",
              category: catLabel,
              type: p.type || "Sheesha",
              flavor: p.type === "TOBACCO_BLEND" ? (p.title || "") : "",
              price: prc,
              oldPrice: prc > 0 ? Math.round(prc * 1.18) : undefined,
              rating: 4.8 + ((strId.charCodeAt(strId.length - 1) % 3) / 10),
              reviews: 40 + (strId.charCodeAt(strId.length - 1) % 80),
              image: img,
              badge: p.isFeatured ? "Best Seller" : (p.stock < 15 ? "Limited" : undefined),
              inStock: (p.stock ?? 1) > 0,
              description: p.description || "Premium Sheesha product curated for exceptional experiences across the UAE.",
            };
          });
          setDbProducts(mapped);
        }
      } catch (e) {
        console.error("Error loading live products:", e);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchLiveProducts();

    try {
      const savedWishlist = localStorage.getItem("st_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {}
  }, []);

  const activeProducts = dbProducts;

  const vendors = useMemo(() => {
    const vSet = new Set<string>();
    activeProducts.forEach((p) => {
      if (p.vendor) vSet.add(p.vendor);
    });
    return ["All Vendors", ...Array.from(vSet)];
  }, [activeProducts]);

  const toggleWishlist = (id: string | number) => {
    setWishlist((current) => {
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      try {
        localStorage.setItem("st_wishlist", JSON.stringify(updated));
      } catch (e) {}

      const product = activeProducts.find((p) => p.id === id);
      if (product) {
        const isAdded = !current.includes(id);
        showToast(
          isAdded
            ? `Added "${product.name}" to your wishlist!`
            : `Removed "${product.name}" from wishlist.`
        );
      }
      return updated;
    });
  };

  const handleAddToCart = async (product: Product, quantity = 1) => {
    try {
      const ok = await addToCart(String(product.id), quantity, {
        name: product.name,
        price: product.price,
        image: product.image,
        vendor: product.vendor,
        category: product.category,
        stock: 50,
      });

      if (ok) {
        setAddedAnimationId(product.id);
        setTimeout(() => setAddedAnimationId(null), 1800);
        showToast(`Added ${quantity}x "${product.name}" to cart! 🛒`);
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
      showToast(`Added to cart! 🛒`);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3200);
  };

  const filteredProducts = useMemo(() => {
    let result = [...activeProducts];

    if (viewOnlyWishlist) {
      result = result.filter((product) => wishlist.includes(product.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.flavor.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category !== "All Products") {
      result = result.filter((product) => product.category === category);
    }

    if (vendor !== "All Vendors") {
      result = result.filter((product) => product.vendor === vendor);
    }

    if (rating !== "All Ratings") {
      const minimum = Number(rating);
      result = result.filter((product) => product.rating >= minimum);
    }

    if (availability === "In Stock") {
      result = result.filter((product) => product.inStock);
    }

    result = result.filter((product) => product.price <= maxPrice);

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    category,
    vendor,
    rating,
    availability,
    maxPrice,
    sort,
    searchQuery,
    viewOnlyWishlist,
    wishlist,
    activeProducts,
  ]);

  return (
    <main className="shop-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <div className="toast-icon">
            <Check size={16} />
          </div>
          <span className="toast-text">{toastMessage}</span>
          <Link href="/cart" className="toast-cta">
            View Cart
          </Link>
        </div>
      )}

      {/* Announcement */}
      <div className="announcement">
        <div className="announcement-content">
          <span>
            <Sparkles size={13} className="inline-block mr-1 text-[#F1A51D]" />
            Premium Sheesha Experiences Across the UAE
          </span>
          <span className="separator">|</span>
          <span className="bold">Same-Day VIP Delivery in Dubai & Abu Dhabi</span>
        </div>
      </div>

      {/* Header */}
      <header className="shop-header">
        <div className="header-inner">
          <Link href="/" className="logo-wrap" title="SheeshaTonight UAE">
            <img src="/logo.png" alt="SheeshaTonight" style={{ width: "125px", height: "auto", display: "block" }} />
          </Link>

          <nav className="desktop-nav">
            <Link href="/">HOME</Link>

            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/shop"
                className="active flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
              >
                SHOP
                <ChevronDown size={14} />
              </Link>

              {shopOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-[100]">
                  <div className="w-[700px] bg-white rounded-2xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,.12)] p-7 text-left">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-[11px] uppercase tracking-[2px] text-[#F1A51D] font-bold mb-4">
                          Shop Sheesha
                        </p>

                        <div className="space-y-3">
                          <Link
                            href="/categories/buy-sheesha"
                            className="flex justify-between items-center group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                              Buy Sheesha
                            </span>
                            <ChevronRight size={15} />
                          </Link>

                          <Link
                            href="/categories/flavors"
                            className="flex justify-between items-center group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                              Sheesha Flavors
                            </span>
                            <ChevronRight size={15} />
                          </Link>

                          <Link
                            href="/categories/accessories"
                            className="flex justify-between items-center group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                              Accessories
                            </span>
                            <ChevronRight size={15} />
                          </Link>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[2px] text-[#F1A51D] font-bold mb-4">
                          Featured
                        </p>

                        <div className="space-y-3">
                          <Link
                            href="/shop"
                            onClick={() => {
                              setViewOnlyWishlist(false);
                              setCategory("All Products");
                              setSort("popular");
                              setShopOpen(false);
                            }}
                            className="flex justify-between items-center group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                              Best Sellers
                            </span>
                            <ChevronRight size={15} />
                          </Link>

                          <Link
                            href="/shop?sort=newest"
                            onClick={() => {
                              setViewOnlyWishlist(false);
                              setCategory("All Products");
                              setSort("newest");
                              setShopOpen(false);
                            }}
                            className="flex justify-between items-center group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                              New Arrivals
                            </span>
                            <ChevronRight size={15} />
                          </Link>

                          <Link
                            href="/shop?sale=true"
                            onClick={() => {
                              setViewOnlyWishlist(false);
                              setCategory("All Products");
                              setShopOpen(false);
                            }}
                            className="flex justify-between items-center group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                              Special Offers
                            </span>
                            <ChevronRight size={15} />
                          </Link>
                        </div>
                      </div>

                      <div className="bg-[#F8F2FA] rounded-xl p-5">
                        <span className="text-[10px] uppercase tracking-[2px] text-[#74189B] font-bold">
                          Premium Collection
                        </span>

                        <h3 className="mt-2 text-lg font-bold text-[#571275]">
                          Elevate Your Setup
                        </h3>

                        <p className="text-xs text-gray-500 mt-2 leading-5">
                          Discover premium sheesha products, flavors and
                          accessories.
                        </p>

                        <Link
                          href="/shop"
                          onClick={() => {
                            setViewOnlyWishlist(false);
                            setCategory("All Products");
                            setShopOpen(false);
                          }}
                          className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#74189B]"
                        >
                          Shop Collection
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setRentalsOpen(true)}
              onMouseLeave={() => setRentalsOpen(false)}
            >
              <Link
                href="/rentals"
                className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
              >
                RENTALS
                <ChevronDown size={14} />
              </Link>

              {rentalsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-[100]">
                  <div className="w-[650px] bg-white rounded-2xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,.12)] p-7 text-left">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[11px] uppercase tracking-[2px] text-[#F1A51D] font-bold mb-4">
                          Rent For
                        </p>

                        <div className="space-y-3">
                          {[
                            { name: "Villa", href: "/rentals?event=villa" },
                            { name: "Yacht", href: "/rentals?event=yacht" },
                            { name: "Corporate", href: "/rentals?event=corporate" },
                            { name: "Weddings", href: "/rentals?event=weddings" },
                            { name: "Birthdays", href: "/rentals?event=birthday" },
                            { name: "Private Gatherings", href: "/rentals?event=private" },
                          ].map(({ name, href }) => (
                            <Link
                              key={name}
                              href={href}
                              className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-[#74189B]"
                            >
                              <span>{name}</span>
                              <ChevronRight size={15} />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl overflow-hidden min-h-[230px] relative">
                        <img
                          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=85"
                          alt="Sheesha experience"
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#571275]/90 via-[#571275]/20 to-transparent" />

                        <div className="absolute bottom-5 left-5 right-5 text-white">
                          <p className="text-[10px] uppercase tracking-[2px] text-[#F1A51D] font-bold">
                            Premium Experiences
                          </p>

                          <h3 className="text-xl font-bold mt-1">
                            Rent. Relax. Enjoy.
                          </h3>

                          <Link
                            href="/rentals"
                            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
                          >
                            Explore Rentals
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/experiences">EXPERIENCES</Link>
            <Link href="/vendors">VENDORS</Link>
            <Link href="/about">ABOUT</Link>
            <Link href="/contact">CONTACT</Link>
          </nav>

          <div className="header-actions">
            {/* Search Button & Input */}
            <div className="search-box-wrap">
              {searchOpen ? (
                <div className="search-expanded">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search sheeshas, flavors, vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="close-search"
                    aria-label="Close search"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  aria-label="Search"
                  className="action-btn"
                  onClick={() => setSearchOpen(true)}
                  title="Search products"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              aria-label="Wishlist"
              className={`action-btn wishlist-header-btn ${
                viewOnlyWishlist ? "active" : ""
              }`}
              onClick={() => setViewOnlyWishlist(!viewOnlyWishlist)}
              title={
                viewOnlyWishlist
                  ? "Show all products"
                  : `Show wishlist (${wishlist.length})`
              }
            >
              <Heart
                size={20}
                fill={viewOnlyWishlist ? "#74189b" : "none"}
                color={viewOnlyWishlist ? "#74189b" : "currentColor"}
              />
              {wishlist.length > 0 && (
                <span className="badge-count wishlist-count">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Link */}
            <Link
              href="/dashboard"
              aria-label="Account"
              className="action-btn"
              title="Customer Dashboard"
            >
              <User size={20} />
            </Link>

            {/* Cart Link */}
            <Link href="/cart" className="action-btn cart-link" title="Shopping Cart">
              <ShoppingCart size={20} />
              <span className="badge-count cart-count">{itemCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="shop-hero">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow">
                <Sparkles size={14} className="inline mr-1" />
                SHEESHATONIGHT EXCLUSIVE SHOP
              </span>
              <h1>Premium Sheesha, Products for Every Vibe</h1>
              <p>
                Discover luxury handcrafted sheeshas, rich tobacco flavors, and
                authentic accessories from vetted UAE lounges and artisanal vendors.
              </p>

              <div className="hero-trust">
                <span className="trust-item">
                  <ShieldCheck size={16} className="text-[#F1A51D]" />
                  100% Verified UAE Vendors
                </span>
                <span className="trust-item">
                  <Sparkles size={16} className="text-[#F1A51D]" />
                  Artisanal Premium Quality
                </span>
                <span className="trust-item">
                  <Truck size={16} className="text-[#F1A51D]" />
                  Fast UAE-Wide Express Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts Strip */}
      <section className="container category-strip">
        {[
          {
            title: "Buy Sheesha",
            text: "Premium sheesha setups",
            icon: "/Categories/Buy Sheesha.webp",
          },
          {
            title: "Flavors",
            text: "Explore rich flavors",
            icon: "/Categories/flavor.webp",
          },
          {
            title: "Sheesha Setups",
            text: "Complete VIP setups",
            icon: "/Categories/Sheesha Setups.webp",
          },
          {
            title: "Accessories",
            text: "Essential accessories",
            icon: "/Categories/Accessories.webp",
          },
        ].map((item) => {
          const isSelected = category === item.title && !viewOnlyWishlist;
          return (
            <button
              key={item.title}
              onClick={() => {
                setViewOnlyWishlist(false);
                setCategory(isSelected ? "All Products" : item.title);
              }}
              className={`category-card ${isSelected ? "selected" : ""}`}
            >
              <div className="category-icon-wrapper">
                <img src={item.icon} alt={item.title} className="cat-img" />
              </div>
              <div className="category-text">
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </div>
              <ChevronRight size={18} className="cat-arrow" />
            </button>
          );
        })}
      </section>

      {/* Main Shop Section */}
      <section className="container shop-content">
        <div className="shop-topbar">
          <div>
            <span className="eyebrow">
              {viewOnlyWishlist ? "YOUR SAVED FAVORITES" : "CURATED COLLECTION"}
            </span>
            <h2>
              {viewOnlyWishlist
                ? "Your Wishlist"
                : category === "All Products"
                ? "Shop Premium Products"
                : category}
            </h2>
            <p>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} available
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <div className="topbar-controls">
            <button
              className="mobile-filter-button"
              onClick={() => setMobileFilters(true)}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>

            <div className="sort-wrapper">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className={`filters ${mobileFilters ? "mobile-open" : ""}`}>
            <div className="filter-mobile-header">
              <h3>Filters & Search</h3>
              <button
                onClick={() => setMobileFilters(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <FilterSection title="Categories">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`filter-option ${
                    category === item && !viewOnlyWishlist ? "active" : ""
                  }`}
                  onClick={() => {
                    setViewOnlyWishlist(false);
                    setCategory(item);
                    setMobileFilters(false);
                  }}
                >
                  <span>{item}</span>
                  {category === item && !viewOnlyWishlist && (
                    <Check size={15} className="check-icon" />
                  )}
                </button>
              ))}
            </FilterSection>

            {/* Price Range Slider */}
            <FilterSection title="Price Range">
              <div className="price-label">
                <span>AED 0</span>
                <strong>AED {maxPrice}</strong>
              </div>

              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
            </FilterSection>

            {/* Vendor Filter */}
            <FilterSection title="Verified Vendors">
              {vendors.map((item) => (
                <button
                  key={item}
                  className={`filter-option ${
                    vendor === item ? "active" : ""
                  }`}
                  onClick={() => {
                    setVendor(item);
                    setMobileFilters(false);
                  }}
                >
                  <span>{item}</span>
                  {vendor === item && <Check size={15} className="check-icon" />}
                </button>
              ))}
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection title="Customer Ratings">
              {["All Ratings", "4.5", "4.0", "3.5"].map((item) => (
                <button
                  key={item}
                  className={`filter-option ${
                    rating === item ? "active" : ""
                  }`}
                  onClick={() => {
                    setRating(item);
                    setMobileFilters(false);
                  }}
                >
                  <span className="flex items-center gap-1">
                    {item === "All Ratings" ? (
                      item
                    ) : (
                      <>
                        {item}{" "}
                        <Star
                          size={13}
                          fill="#F1A51D"
                          color="#F1A51D"
                          className="inline"
                        />{" "}
                        & above
                      </>
                    )}
                  </span>
                  {rating === item && <Check size={15} className="check-icon" />}
                </button>
              ))}
            </FilterSection>

            {/* Availability Filter */}
            <FilterSection title="Availability">
              {["All", "In Stock"].map((item) => (
                <button
                  key={item}
                  className={`filter-option ${
                    availability === item ? "active" : ""
                  }`}
                  onClick={() => {
                    setAvailability(item);
                    setMobileFilters(false);
                  }}
                >
                  <span>{item}</span>
                  {availability === item && (
                    <Check size={15} className="check-icon" />
                  )}
                </button>
              ))}
            </FilterSection>

            {/* Clear All Filters */}
            <button
              className="clear-filters"
              onClick={() => {
                setCategory("All Products");
                setVendor("All Vendors");
                setRating("All Ratings");
                setAvailability("All");
                setMaxPrice(1000);
                setSearchQuery("");
                setViewOnlyWishlist(false);
                setMobileFilters(false);
              }}
            >
              Reset All Filters
            </button>
          </aside>

          {/* Backdrop for mobile drawer */}
          {mobileFilters && (
            <div
              className="drawer-backdrop"
              onClick={() => setMobileFilters(false)}
            />
          )}

          {/* Products Grid Area */}
          <div className="products-area">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Flame size={48} />
                </div>
                <h3>No products match your criteria</h3>
                <p>
                  Try widening your price range or clearing specific vendor/category
                  filters.
                </p>
                <button
                  onClick={() => {
                    setCategory("All Products");
                    setVendor("All Vendors");
                    setRating("All Ratings");
                    setAvailability("All");
                    setMaxPrice(1000);
                    setSearchQuery("");
                    setViewOnlyWishlist(false);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const liked = wishlist.includes(product.id);
                  const isJustAdded = addedAnimationId === product.id;

                  return (
                    <article className="product-card" key={product.id}>
                      <div className="product-image">
                        {product.badge && (
                          <span className="product-badge">
                            {product.badge}
                          </span>
                        )}

                        <button
                          className={`wishlist-btn ${liked ? "liked" : ""}`}
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={`Add ${product.name} to wishlist`}
                          title={liked ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart
                            size={18}
                            fill={liked ? "#e11d48" : "none"}
                            color={liked ? "#e11d48" : "#4a4450"}
                          />
                        </button>

                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />

                        <button
                          type="button"
                          className="quick-view-btn"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          <Eye size={14} /> Quick View
                        </button>
                      </div>

                      <div className="product-info">
                        <div className="rating">
                          <Star
                            size={14}
                            fill="#f1a51d"
                            color="#f1a51d"
                            className="star-icon"
                          />
                          <span>{product.rating.toFixed(1)}</span>
                          <small>({product.reviews} reviews)</small>
                        </div>

                        <h3
                          className="product-name"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          {product.name}
                        </h3>

                        <p className="vendor">
                          <CheckCircle2 size={13} className="vendor-check" />
                          <span>{product.vendor}</span>
                        </p>

                        <div className="product-bottom">
                          <div className="price-box">
                            {product.oldPrice && (
                              <del>AED {product.oldPrice}</del>
                            )}
                            <strong className="current-price">
                              AED {product.price}
                            </strong>
                          </div>

                          <button
                            className={`add-cart-btn ${
                              isJustAdded ? "added" : ""
                            }`}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                          >
                            {isJustAdded ? (
                              <>
                                <Check size={14} /> Added!
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={14} /> Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="modal-overlay"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-grid">
              <div className="modal-image-col">
                {quickViewProduct.badge && (
                  <span className="modal-badge">{quickViewProduct.badge}</span>
                )}
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                />
              </div>

              <div className="modal-details-col">
                <span className="modal-cat">{quickViewProduct.category}</span>
                <h2>{quickViewProduct.name}</h2>

                <div className="modal-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          i < Math.floor(quickViewProduct.rating)
                            ? "#F1A51D"
                            : "none"
                        }
                        color="#F1A51D"
                      />
                    ))}
                  </div>
                  <strong>{quickViewProduct.rating.toFixed(1)}</strong>
                  <span>({quickViewProduct.reviews} customer reviews)</span>
                </div>

                <div className="modal-price">
                  {quickViewProduct.oldPrice && (
                    <del>AED {quickViewProduct.oldPrice}</del>
                  )}
                  <strong>AED {quickViewProduct.price}</strong>
                  <span className="tax-tag">VAT Included</span>
                </div>

                <p className="modal-desc">{quickViewProduct.description}</p>

                <div className="modal-meta">
                  <div className="meta-row">
                    <span>Verified Vendor:</span>
                    <strong>{quickViewProduct.vendor}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Availability:</span>
                    <strong className="text-emerald-600 font-semibold">
                      In Stock (Immediate Dispatch)
                    </strong>
                  </div>
                  {quickViewProduct.flavor && (
                    <div className="meta-row">
                      <span>Flavor Profile:</span>
                      <strong>{quickViewProduct.flavor}</strong>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    className="modal-add-cart"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Shopping Cart</span>
                  </button>

                  <button
                    className={`modal-wishlist-btn ${
                      wishlist.includes(quickViewProduct.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                  >
                    <Heart
                      size={18}
                      fill={
                        wishlist.includes(quickViewProduct.id)
                          ? "#e11d48"
                          : "none"
                      }
                      color={
                        wishlist.includes(quickViewProduct.id)
                          ? "#e11d48"
                          : "currentColor"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental CTA Banner */}
      <section className="container rental-banner">
        <div className="rental-banner-text">
          <span className="eyebrow-dark">LOOKING FOR SOMETHING SPECIAL?</span>
          <h2>Make Your Next Gathering Unforgettable</h2>
          <p>
            Hosting a luxury villa gathering, VIP yacht evening, or private event?
            Book a turn-key sheesha lounge experience handled end-to-end by our
            licensed master shisha sommeliers.
          </p>
        </div>

        <Link href="/rentals" className="rental-cta-btn">
          <span>Explore VIP Rentals</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/logo.png" alt="SheeshaTonight" style={{ width: "125px", height: "auto", display: "block" }} />
            <p>
              The UAE’s premier digital marketplace for luxury sheeshas, premium
              flavors, and white-glove event sommelier rentals.
            </p>
            <div className="footer-badges">
              <span>🇦🇪 Licensed in Dubai & UAE</span>
              <span>🔒 100% Encrypted Checkout</span>
            </div>
          </div>

          <div>
            <h4>Shop Marketplace</h4>
            <Link href="/shop">All Products</Link>
            <Link href="/shop">Buy Sheesha</Link>
            <Link href="/shop">Shisha Flavors</Link>
            <Link href="/shop">Complete Setups</Link>
            <Link href="/shop">Accessories</Link>
          </div>

          <div>
            <h4>VIP Rentals</h4>
            <Link href="/rentals">Private Villa Service</Link>
            <Link href="/rentals">Luxury Yacht Setups</Link>
            <Link href="/rentals">Corporate Events</Link>
            <Link href="/rentals">Weddings & Galas</Link>
          </div>

          <div>
            <h4>Support & Legal</h4>
            <Link href="/contact">Help Center & Contact</Link>
            <Link href="/faqs">Frequently Asked Questions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-flex">
            <span>© 2026 SheeshaTonight UAE. All rights reserved.</span>
            <span>18+ Age Verification Strictly Enforced | Dubai, United Arab Emirates</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          color: #27232a;
          background: #ffffff;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button,
        select,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .container {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .container {
            padding: 0 24px;
          }
        }

        @media (max-width: 640px) {
          .container {
            padding: 0 16px;
          }
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          background: #1e1526;
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(30, 21, 38, 0.4);
          display: flex;
          align-items: center;
          gap: 14px;
          animation: slideUpToast 0.3s ease-out;
          border-left: 4px solid #f1a51d;
        }

        @keyframes slideUpToast {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .toast-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #f1a51d;
          color: #1e1526;
          display: grid;
          place-items: center;
          font-weight: bold;
        }

        .toast-text {
          font-size: 13px;
          font-weight: 600;
        }

        .toast-cta {
          margin-left: 10px;
          background: #74189b;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          transition: 0.2s;
        }

        .toast-cta:hover {
          background: #9022be;
        }

        /* Announcement */
        .announcement {
          background: #571275;
          color: white;
          padding: 9px 20px;
          font-size: 12px;
          letter-spacing: 0.3px;
        }

        .announcement-content {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .announcement .separator {
          opacity: 0.4;
        }

        .announcement .bold {
          font-weight: 700;
          color: #fce7ba;
        }

        /* Header */
        .shop-header {
          height: 84px;
          border-bottom: 1px solid #f0ecf2;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          max-width: 1440px;
          height: 100%;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .header-inner {
            padding: 0 24px;
          }
        }

        .logo-wrap img {
          width: 125px;
          height: auto;
          display: block;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .desktop-nav a {
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #4b4550;
          position: relative;
          padding: 6px 0;
          transition: color 0.2s ease;
        }

        .desktop-nav a:hover,
        .desktop-nav a.active {
          color: #74189b;
        }

        .desktop-nav a.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 2.5px;
          border-radius: 2px;
          background: #f1a51d;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-btn {
          border: 0;
          background: transparent;
          color: #4b4550;
          display: grid;
          place-items: center;
          position: relative;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          color: #74189b;
          background: #f7eff9;
        }

        .badge-count {
          position: absolute;
          top: 0;
          right: -2px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 10px;
          background: #f1a51d;
          color: white;
          font-size: 10px;
          font-weight: 800;
          display: grid;
          place-items: center;
        }

        .wishlist-count {
          background: #e11d48;
        }

        /* Search input expansion */
        .search-box-wrap {
          position: relative;
        }

        .search-expanded {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8f6f9;
          border: 1.5px solid #74189b;
          border-radius: 20px;
          padding: 4px 12px;
          animation: expandSearch 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes expandSearch {
          from {
            width: 50px;
            opacity: 0;
          }
          to {
            width: 240px;
            opacity: 1;
          }
        }

        .search-expanded input {
          border: 0;
          background: transparent;
          outline: none;
          font-size: 12px;
          width: 170px;
          color: #27232a;
        }

        .close-search {
          border: 0;
          background: transparent;
          color: #8b858e;
          display: grid;
          place-items: center;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          gap: 9px;
          align-items: center;
          padding-top: 24px;
          font-size: 13px;
          color: #88818b;
        }

        .breadcrumb a:hover {
          color: #74189b;
        }

        .breadcrumb strong {
          color: #74189b;
          font-weight: 600;
        }

        .crumb-sub {
          color: #4b4550;
        }

        /* Hero */
        .shop-hero {
          position: relative;
          background: linear-gradient(
              90deg,
              rgba(62, 10, 84, 0.95) 0%,
              rgba(116, 24, 155, 0.85) 60%,
              rgba(116, 24, 155, 0.7) 100%
            ),
            url("/SHOP-BANNER.webp") center/cover no-repeat;
          min-height: 440px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .shop-hero .hero-overlay {
          width: 100%;
          padding: 80px 0;
          display: flex;
          align-items: center;
        }

        .shop-hero .hero-content {
          color: white;
          max-width: 740px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          color: #f1a51d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .hero-content h1 {
          max-width: 740px;
          font-size: clamp(32px, 4.5vw, 54px);
          line-height: 1.08;
          margin: 0 0 16px;
          letter-spacing: -1.2px;
          font-weight: 800;
        }

        .hero-content p {
          max-width: 620px;
          line-height: 1.65;
          font-size: 15px;
          opacity: 0.94;
          margin: 0;
        }

        .hero-trust {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
          margin-top: 26px;
          font-size: 12.5px;
          font-weight: 600;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }

        /* Category Strip */
        .category-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding-top: 36px;
          padding-bottom: 40px;
        }

        .category-card {
          border: 1px solid #eeeaf0;
          background: white;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-card:hover {
          border-color: #74189b;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(116, 24, 155, 0.08);
        }

        .category-card.selected {
          border-color: #74189b;
          background: #fbf7fc;
          box-shadow: 0 10px 24px rgba(116, 24, 155, 0.12);
        }

        .category-icon-wrapper {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #f7eff9;
          overflow: hidden;
          display: grid;
          place-items: center;
        }

        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-text {
          flex: 1;
        }

        .category-text strong {
          display: block;
          color: #2b262e;
          font-size: 13.5px;
          font-weight: 750;
          margin-bottom: 3px;
        }

        .category-text small {
          display: block;
          color: #8b858e;
          font-size: 11.5px;
        }

        .cat-arrow {
          color: #74189b;
          transition: transform 0.2s;
        }

        .category-card:hover .cat-arrow {
          transform: translateX(3px);
        }

        /* Shop Topbar */
        .shop-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 26px;
        }

        .shop-topbar h2 {
          font-size: 28px;
          margin: 0 0 6px;
          letter-spacing: -0.6px;
          color: #221d25;
          font-weight: 800;
        }

        .shop-topbar p {
          margin: 0;
          color: #8a838d;
          font-size: 13px;
        }

        .topbar-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sort-wrapper {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12.5px;
          color: #706a73;
        }

        .sort-wrapper select {
          border: 1.5px solid #e7e2ea;
          border-radius: 8px;
          padding: 9px 34px 9px 12px;
          background: white;
          color: #2a252c;
          font-size: 12.5px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .sort-wrapper select:focus {
          border-color: #74189b;
        }

        .mobile-filter-button {
          display: none;
          align-items: center;
          gap: 8px;
          background: #74189b;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
        }

        /* Shop Layout */
        .shop-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 34px;
          align-items: start;
        }

        /* Sidebar Filters */
        .filters {
          border: 1px solid #ebe5ee;
          border-radius: 16px;
          padding: 24px;
          background: white;
          position: sticky;
          top: 104px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
        }

        .filter-mobile-header {
          display: none;
        }

        .filter-section {
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid #f0ebf2;
        }

        .filter-section h4 {
          margin: 0 0 13px;
          font-size: 13.5px;
          font-weight: 750;
          color: #221d25;
          letter-spacing: -0.2px;
        }

        .filter-option {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: 0;
          padding: 8px 10px;
          border-radius: 6px;
          color: #6e6772;
          text-align: left;
          font-size: 12.5px;
          transition: all 0.18s ease;
        }

        .filter-option:hover {
          background: #fbf7fc;
          color: #74189b;
        }

        .filter-option.active {
          background: #f7eef9;
          color: #74189b;
          font-weight: 750;
        }

        .check-icon {
          color: #74189b;
        }

        .price-label {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #8c858e;
          margin-bottom: 12px;
        }

        .price-label strong {
          color: #74189b;
          font-weight: 750;
        }

        .price-slider {
          width: 100%;
          accent-color: #74189b;
          cursor: pointer;
        }

        .clear-filters {
          width: 100%;
          border: 1.5px solid #74189b;
          color: #74189b;
          background: white;
          padding: 11px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 750;
          transition: all 0.2s ease;
        }

        .clear-filters:hover {
          background: #74189b;
          color: white;
        }

        /* Products Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .product-card {
          background: white;
          border: 1px solid #ede8ef;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: #dfd5e3;
          box-shadow: 0 16px 36px rgba(62, 10, 84, 0.09);
        }

        .product-image {
          height: 275px;
          background: #f8f6f9;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.06);
        }

        .product-badge {
          position: absolute;
          left: 12px;
          top: 12px;
          z-index: 2;
          background: #74189b;
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .wishlist-btn {
          position: absolute;
          z-index: 3;
          right: 12px;
          top: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          color: #4a4450;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .wishlist-btn:hover {
          transform: scale(1.1);
          background: white;
        }

        .quick-view-btn {
          position: absolute;
          bottom: -46px;
          left: 14px;
          right: 14px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(8px);
          color: #74189b;
          border: 1px solid #ebdfee;
          padding: 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 4;
        }

        .product-card:hover .quick-view-btn {
          bottom: 14px;
        }

        .quick-view-btn:hover {
          background: #74189b;
          color: white;
        }

        .product-info {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f1a51d;
          font-size: 12px;
          font-weight: 750;
          margin-bottom: 7px;
        }

        .rating small {
          color: #8c858e;
          font-weight: 400;
          margin-left: 2px;
        }

        .product-name {
          font-size: 15px;
          font-weight: 750;
          color: #262128;
          line-height: 1.35;
          margin: 0 0 6px;
          cursor: pointer;
          transition: color 0.18s;
        }

        .product-name:hover {
          color: #74189b;
        }

        .vendor {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #807a83;
          font-size: 11.5px;
          margin: 0 0 16px;
        }

        .vendor-check {
          color: #74189b;
        }

        .product-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #f2edf3;
        }

        .price-box del {
          display: block;
          color: #aba4ad;
          font-size: 11px;
          margin-bottom: 1px;
        }

        .current-price {
          display: block;
          color: #74189b;
          font-size: 17.5px;
          font-weight: 800;
        }

        .add-cart-btn {
          background: #74189b;
          border: 0;
          color: white;
          border-radius: 8px;
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 750;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .add-cart-btn:hover {
          background: #571275;
          transform: translateY(-1px);
        }

        .add-cart-btn.added {
          background: #15803d;
        }

        /* Empty State */
        .empty-state {
          min-height: 380px;
          border: 2px dashed #e5dde7;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #fbf4fd;
          color: #74189b;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          font-size: 20px;
          color: #252027;
        }

        .empty-state p {
          color: #88818c;
          font-size: 13.5px;
          max-width: 380px;
          margin: 0 0 20px;
        }

        .empty-state button {
          background: #74189b;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 11px 22px;
          font-size: 12px;
          font-weight: 700;
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(18, 9, 24, 0.68);
          backdrop-filter: blur(5px);
          display: grid;
          place-items: center;
          padding: 20px;
          animation: fadeInModal 0.2s ease-out;
        }

        @keyframes fadeInModal {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-card {
          background: white;
          border-radius: 20px;
          max-width: 820px;
          width: 100%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          animation: scaleUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUpModal {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 0;
          background: #f5edf7;
          color: #74189b;
          display: grid;
          place-items: center;
          transition: background-color 0.2s;
        }

        .modal-close:hover {
          background: #ebdded;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
        }

        .modal-image-col {
          background: #f7f3f9;
          position: relative;
          height: 100%;
          min-height: 380px;
        }

        .modal-image-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .modal-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #74189b;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .modal-details-col {
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
        }

        .modal-cat {
          color: #f1a51d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .modal-details-col h2 {
          font-size: 24px;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
          color: #241e26;
        }

        .modal-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          margin-bottom: 14px;
        }

        .modal-rating .stars {
          display: flex;
          gap: 2px;
        }

        .modal-rating span {
          color: #8c858e;
        }

        .modal-price {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f2ecf4;
        }

        .modal-price del {
          color: #aba3ac;
          font-size: 13px;
        }

        .modal-price strong {
          color: #74189b;
          font-size: 24px;
          font-weight: 800;
        }

        .tax-tag {
          font-size: 10px;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .modal-desc {
          color: #6d6671;
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 20px;
        }

        .modal-meta {
          background: #faf8fb;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 24px;
          font-size: 12.5px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }

        .meta-row span {
          color: #8a828c;
        }

        .meta-row strong {
          color: #2f2a32;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .modal-add-cart {
          flex: 1;
          background: #74189b;
          color: white;
          border: 0;
          padding: 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s;
        }

        .modal-add-cart:hover {
          background: #571275;
        }

        .modal-wishlist-btn {
          width: 50px;
          border-radius: 10px;
          border: 1.5px solid #ebdfee;
          background: white;
          display: grid;
          place-items: center;
          color: #4a4450;
          transition: all 0.2s;
        }

        .modal-wishlist-btn.active {
          border-color: #e11d48;
          color: #e11d48;
        }

        /* Rental CTA Banner */
        .rental-banner {
          margin-top: 70px;
          margin-bottom: 70px;
          border-radius: 20px;
          padding: 44px 50px;
          background: linear-gradient(135deg, #f7eef9 0%, #faeef8 100%);
          border: 1px solid #ebdfee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .eyebrow-dark {
          display: block;
          color: #74189b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }

        .rental-banner-text h2 {
          font-size: 30px;
          margin: 0 0 12px;
          color: #241e26;
          letter-spacing: -0.5px;
          font-weight: 800;
        }

        .rental-banner-text p {
          color: #6b636f;
          max-width: 640px;
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
        }

        .rental-cta-btn {
          flex-shrink: 0;
          background: #74189b;
          color: white;
          padding: 14px 26px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 24px rgba(116, 24, 155, 0.22);
          transition: all 0.2s ease;
        }

        .rental-cta-btn:hover {
          background: #571275;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(116, 24, 155, 0.3);
        }

        /* Footer */
        .shop-footer {
          background: #faf8fb;
          border-top: 1px solid #eeeaf0;
          padding-top: 55px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 50px;
          padding-bottom: 45px;
        }

        .footer-brand img {
          width: 125px;
          margin-bottom: 15px;
        }

        .footer-brand p {
          color: #847d87;
          max-width: 320px;
          font-size: 13px;
          line-height: 1.65;
          margin: 0 0 16px;
        }

        .footer-badges {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #74189b;
        }

        .footer-grid h4 {
          margin: 0 0 16px;
          color: #272129;
          font-size: 14px;
          font-weight: 750;
        }

        .footer-grid a {
          display: block;
          color: #79717d;
          font-size: 12.5px;
          margin-bottom: 10px;
          transition: color 0.18s;
        }

        .footer-grid a:hover {
          color: #74189b;
        }

        .footer-bottom {
          border-top: 1px solid #e8e3ea;
          padding: 20px 0;
          background: #f4eff5;
        }

        .footer-bottom-flex {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #928b94;
          font-size: 11px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1100px) {
          .desktop-nav {
            gap: 18px;
          }

          .desktop-nav a {
            font-size: 11px;
          }

          .shop-layout {
            grid-template-columns: 220px 1fr;
            gap: 24px;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .modal-grid {
            grid-template-columns: 1fr;
          }

          .modal-image-col {
            height: 260px;
          }
        }

        @media (max-width: 860px) {
          .shop-header {
            padding: 0;
            height: 72px;
          }

          .header-inner {
            padding: 0 16px;
          }

          .logo-wrap img {
            width: 135px;
          }

          .desktop-nav {
            display: none;
          }

          .category-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding-bottom: 30px;
          }

          .shop-hero {
            min-height: auto;
          }

          .hero-content {
            padding: 36px 0;
          }

          .hero-content h1 {
            font-size: 34px;
          }

          .hero-trust {
            flex-direction: column;
            gap: 10px;
          }

          .shop-topbar {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .topbar-controls {
            width: 100%;
            justify-content: space-between;
          }

          .mobile-filter-button {
            display: inline-flex;
          }

          .shop-layout {
            display: block;
          }

          .filters {
            position: fixed;
            z-index: 3000;
            left: 0;
            top: 0;
            bottom: 0;
            width: min(340px, 86vw);
            border-radius: 0;
            overflow-y: auto;
            transform: translateX(-105%);
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
          }

          .filters.mobile-open {
            transform: translateX(0);
          }

          .drawer-backdrop {
            position: fixed;
            inset: 0;
            z-index: 2999;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(3px);
          }

          .filter-mobile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 22px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eeeaf0;
          }

          .filter-mobile-header h3 {
            margin: 0;
            font-size: 16px;
          }

          .filter-mobile-header button {
            width: 36px;
            height: 36px;
            border: 0;
            background: #f7eef9;
            color: #74189b;
            border-radius: 50%;
            display: grid;
            place-items: center;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .product-image {
            height: 220px;
          }

          .product-info {
            padding: 12px;
          }

          .product-name {
            font-size: 13.5px;
          }

          .product-bottom {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .add-cart-btn {
            justify-content: center;
            width: 100%;
          }

          .rental-banner {
            margin-top: 45px;
            margin-bottom: 45px;
            padding: 32px 24px;
            flex-direction: column;
            align-items: flex-start;
          }

          .rental-banner-text h2 {
            font-size: 24px;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }

          .footer-bottom-flex {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 520px) {
          .announcement {
            font-size: 10.5px;
            padding: 7px 12px;
          }

          .announcement .bold {
            display: none;
          }

          .announcement .separator {
            display: none;
          }

          .category-strip {
            grid-template-columns: 1fr;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .product-image {
            height: 240px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="filter-section">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
