"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import "./CustomerDashboard.css";


const fallbackOrders = [
  {
    id: "#ST-1024",
    date: "May 28, 2025",
    total: "AED 420",
    status: "Delivered",
    statusType: "delivered",
  },
  {
    id: "#ST-0987",
    date: "May 15, 2025",
    total: "AED 285",
    status: "Processing",
    statusType: "processing",
  },
];

export default function CustomerDashboard() {
  const { userName, userEmail } = useAuthStore();

  const [customerName, setCustomerName] = useState("Sara Ahmed");
  const [customerEmail, setCustomerEmail] = useState("sara.ahmed@email.com");
  const [orders, setOrders] = useState(fallbackOrders);
  const [products, setProducts] = useState<any[]>([]);

  // Sync customer profile
  useEffect(() => {
    if (userName && userName.trim()) {
      setCustomerName(userName);
    } else {
      const match = document.cookie.match(/(?:^|; )user_name=([^;]*)/);
      if (match && match[1]) {
        setCustomerName(decodeURIComponent(match[1]));
      }
    }

    if (userEmail && userEmail.trim()) {
      setCustomerEmail(userEmail);
    } else {
      const match = document.cookie.match(/(?:^|; )user_email=([^;]*)/);
      if (match && match[1]) {
        setCustomerEmail(decodeURIComponent(match[1]));
      }
    }
  }, [userName, userEmail]);

  // Load live vendor products from /api/products
  useEffect(() => {
    fetch("/api/products?limit=8", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.products;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item: any) => ({
            id: item.id,
            name: item.title || item.name,
            price: `AED ${Number(item.price || 0).toFixed(0)}`,
            image: item.image || (Array.isArray(item.images) && item.images[0]) || "/SHEESHA-SET.webp",
            reviews: String(Math.floor(Math.random() * 30) + 18),
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Load real orders from /api/orders
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    fetch("/api/orders", { headers, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const orderList = Array.isArray(data) ? data : data?.orders || data?.data;
        if (Array.isArray(orderList) && orderList.length > 0) {
          const mapped = orderList.slice(0, 5).map((ord: any) => ({
            id: `#${ord.orderNumber || (ord.id || "").slice(-6).toUpperCase()}`,
            date: new Date(ord.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            total: `AED ${Number(ord.totalAmount || 0).toFixed(0)}`,
            status: String(ord.status || "Pending").replace(/_/g, " "),
            statusType: String(ord.status || "").toLowerCase().includes("deliv")
              ? "delivered"
              : String(ord.status || "").toLowerCase().includes("comp")
              ? "completed"
              : "processing",
          }));
          setOrders(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="dashboard-main">
      <div className="dashboard-content">
        {/* WELCOME */}
        <section className="welcome-section">
          <h1>
            Welcome back, {customerName.split(" ")[0]} <span>👋</span>
          </h1>
          <p>Here&apos;s what&apos;s happening with your account today.</p>
        </section>

        {/* STATS */}
        <section className="stats-grid">
          <StatCard
            icon="▣"
            title="Total Orders"
            value={String(orders.length > 0 ? orders.length : 2)}
            link="View Orders"
            href="/dashboard/orders"
          />

          <StatCard
            icon="♡"
            title="Wishlist Items"
            value="12"
            link="View Wishlist"
            href="/dashboard/wishlist"
          />

          <StatCard
            icon="⌖"
            title="Saved Addresses"
            value="2"
            link="Manage Addresses"
            href="/dashboard/settings"
          />

          <StatCard
            icon="▤"
            title="Payment Methods"
            value="1"
            link="Manage Payments"
            href="/dashboard/settings"
            gold
          />
        </section>

        {/* HERO */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <span className="eyebrow">PREMIUM COLLECTION</span>

            <h2>
              Elevate Your
              <br />
              Sheesha Experience
            </h2>

            <p>
              Explore the finest sheesha products, flavors
              <br />
              and accessories — all in one place.
            </p>

            <Link href="/shop" className="primary-btn">
              Shop Now
              <span>→</span>
            </Link>
          </div>

          <div className="hero-image">
            <img
              src="/dashboard/sheesha-banner.png"
              alt="Premium Sheesha"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/SHEESHA-SET.webp";
              }}
            />
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section className="orders-section">
          <div className="section-header">
            <h2>Recent Orders</h2>

            <Link href="/dashboard/orders" className="view-link">
              View All Orders →
            </Link>
          </div>

          <div className="orders-table">
            <div className="order-row order-head">
              <span>Order #</span>
              <span>Date</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
              <span></span>
            </div>

            {orders.map((order, index) => (
              <div className="order-row" key={order.id + index}>
                <strong>{order.id}</strong>

                <span>{order.date}</span>

                <div className="order-items">
                  <div className="mini-product">♨</div>
                  <div className="mini-product">♨</div>
                  <div className="mini-product">●</div>
                  <div className="mini-product">▣</div>

                  <span className="more-items">+{index + 1}</span>
                </div>

                <strong>{order.total}</strong>

                <span>
                  <em className={`status ${order.statusType}`}>
                    {order.status}
                  </em>
                </span>

                <Link href="/dashboard/orders" className="order-arrow">
                  →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* RECOMMENDED */}
        <section className="recommended-section">
          <div className="section-header">
            <h2>Recommended For You</h2>

            <Link href="/shop" className="view-link">
              View All →
            </Link>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product.name}>
                <button type="button" className="favorite" title="Save to wishlist">
                  ♡
                </button>

                <Link href="/shop" className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/Premium Sheesha.webp";
                    }}
                  />
                </Link>

                <h3>{product.name}</h3>

                <strong className="product-price">{product.price}</strong>

                <div className="rating">
                  <span>★★★★★</span>
                  <small>({product.reviews})</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <aside className="right-panel">
        {/* PROFILE */}
        <section className="profile-card">
          <div className="profile-top">
            <img
              src="/users/sara.jpg"
              alt={customerName}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />

            <div>
              <h3>{customerName}</h3>
              <p>{customerEmail}</p>
            </div>
          </div>

          <Link href="/dashboard/settings" className="edit-profile">
            ✎ &nbsp; Edit Profile
          </Link>

          <div className="profile-links">
            <Link href="/dashboard/orders">
              <span>▣</span>
              Order History
              <b>›</b>
            </Link>

            <Link href="/dashboard/wishlist">
              <span>♡</span>
              My Wishlist
              <b>›</b>
            </Link>

            <Link href="/dashboard/settings">
              <span>⌖</span>
              Saved Addresses
              <b>›</b>
            </Link>

            <Link href="/dashboard/settings">
              <span>▤</span>
              Payment Methods
              <b>›</b>
            </Link>

            <Link href="/dashboard/settings">
              <span>⚙</span>
              Settings
              <b>›</b>
            </Link>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="support-card">
          <div className="support-icon">♧</div>

          <div>
            <h3>Need Help?</h3>

            <p>
              Our support team is here
              <br />
              for you 24/7.
            </p>

            <Link href="/contact">
              Contact Support →
            </Link>
          </div>
        </section>

        {/* VENDOR */}
        <section className="vendor-card">
          <div>
            <h2>Become a Vendor</h2>

            <p>
              Partner with us and grow
              <br />
              your business.
            </p>

            <Link href="/vendors">
              Learn More →
            </Link>
          </div>

          <img
            src="/dashboard/vendor-hookah.png"
            alt="Become a Vendor"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/SHEESHA-SET.webp";
            }}
          />
        </section>
      </aside>
    </main>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  link,
  href = "/dashboard",
  gold = false,
}: {
  icon: string;
  title: string;
  value: string;
  link: string;
  href?: string;
  gold?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${gold ? "gold" : ""}`}>{icon}</div>

      <div className="stat-info">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <Link href={href}>
        {link} →
      </Link>
    </div>
  );
}
