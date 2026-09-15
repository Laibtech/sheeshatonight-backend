'use client';

import React from "react";
import "./how-it-works.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Search, Heart, ShoppingCart, CheckCircle2, Star, Shield, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Your Location",
    text: "Select your Emirate and area to discover verified sheesha vendors and products available near you.",
  },
  {
    number: "02",
    icon: Search,
    title: "Browse & Discover",
    text: "Explore trusted vendors, premium sheesha setups, flavors, accessories and available experiences.",
  },
  {
    number: "03",
    icon: Heart,
    title: "Choose Your Experience",
    text: "Compare ratings, prices, products and vendor details before making your choice.",
  },
  {
    number: "04",
    icon: ShoppingCart,
    title: "Book or Order",
    text: "Add your products to cart or book your preferred sheesha experience directly from the vendor.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Enjoy Your Sheesha",
    text: "Sit back and enjoy. Track your order or booking and get support whenever you need it.",
  },
];

const features = [
  {
    icon: CheckCircle2,
    title: "Verified Vendors",
    text: "Discover trusted and verified sheesha businesses across the UAE.",
  },
  {
    icon: MapPin,
    title: "Location Based",
    text: "Find products and services available in your selected area.",
  },
  {
    icon: Star,
    title: "Real Customer Reviews",
    text: "Make better decisions using ratings and customer feedback.",
  },
  {
    icon: Shield,
    title: "Secure Experience",
    text: "Your orders, bookings and account information stay protected.",
  },
];

function Hero() {
  return (
    <section className="how-hero">
      <div className="how-hero-content">
        <span className="how-eyebrow">SIMPLE. TRUSTED. CONVENIENT.</span>
        <h1>
          Your Sheesha
          <br />
          Experience,
          <span> Simplified.</span>
        </h1>
        <p>
          From finding a trusted vendor to ordering your favorite flavors or
          booking a sheesha experience, SheeshaTonight makes everything simple.
        </p>
        <div className="how-hero-buttons">
          <a href="/browse" className="how-primary">
            Explore Vendors <ArrowRight className="w-4 h-4 inline ml-1" />
          </a>
          <a href="/shop" className="how-secondary">
            Shop Products
          </a>
        </div>
      </div>
      <div className="how-hero-visual">
        <div className="hero-circle circle-one" />
        <div className="hero-circle circle-two" />
        <div className="hero-card-main">
          <div className="hero-card-top">
            <span>SheeshaTonight</span>
            <span>
              <CheckCircle2 className="w-3 h-3 inline" />
            </span>
          </div>
          <div className="hero-hookah">
            <img src="/SHEESHA-SET.webp" alt="Premium Sheesha" className="hookah-image" />
          </div>
          <div className="hero-card-info">
            <strong>Premium Sheesha</strong>
            <small>Delivered to your location</small>
          </div>
        </div>
        <div className="floating-card floating-one">
          <span>
            <CheckCircle2 className="w-4 h-4" />
          </span>
          <div>
            <strong>Verified Vendor</strong>
            <small>Trusted by customers</small>
          </div>
        </div>
        <div className="floating-card floating-two">
          <span>
            <Star className="w-4 h-4 fill-current" />
          </span>
          <div>
            <strong>4.9 Rating</strong>
            <small>328+ reviews</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="how-steps-section">
      <div className="how-section-heading">
        <span className="how-eyebrow">HOW IT WORKS</span>
        <h2>
          Sheesha Tonight,
          <span> Made Easy.</span>
        </h2>
        <p>
          Everything you need for your next sheesha experience, all in one
          place.
        </p>
      </div>
      <div className="how-steps">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div className="how-step" key={step.number}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                <IconComponent className="w-5 h-5" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {index !== steps.length - 1 && (
                <div className="step-line">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience-section">
      <div className="experience-image">
        <img src="/hos-hookah.webp" alt="Premium Hookah" className="experience-hookah-img" />
      </div>
      <div className="experience-content">
        <span className="how-eyebrow">ONE PLATFORM</span>
        <h2>
          Everything You Need
          <span> For The Perfect Night.</span>
        </h2>
        <p>
          SheeshaTonight connects customers with trusted vendors, premium
          products and memorable sheesha experiences across the UAE.
        </p>
        <div className="experience-list">
          <div>
            <span>01</span>
            <div>
              <strong>Discover</strong>
              <p>Find vendors and products near you.</p>
            </div>
          </div>
          <div>
            <span>02</span>
            <div>
              <strong>Compare</strong>
              <p>Check ratings, prices and availability.</p>
            </div>
          </div>
          <div>
            <span>03</span>
            <div>
              <strong>Order or Book</strong>
              <p>Complete your order in just a few steps.</p>
            </div>
          </div>
        </div>
        <a href="/browse" className="how-primary">
          Start Exploring <ArrowRight className="w-4 h-4 inline ml-1" />
        </a>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="features-section">
      <div className="how-section-heading">
        <span className="how-eyebrow">WHY SHEESHATONIGHT</span>
        <h2>
          Built Around
          <span> Your Experience.</span>
        </h2>
      </div>
      <div className="features-grid">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">
                <IconComponent className="w-5 h-5" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VendorCTA() {
  return (
    <section className="vendor-how-section">
      <div>
        <span className="how-eyebrow">ARE YOU A SHEESHA BUSINESS?</span>
        <h2>
          Grow Your Business
          <br />
          With <span>SheeshaTonight.</span>
        </h2>
        <p>
          Join our growing network of trusted vendors and connect with customers
          across the UAE.
        </p>
        <a href="/vendor/register" className="how-white-btn">
          Become a Vendor <ArrowRight className="w-4 h-4 inline ml-1" />
        </a>
      </div>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <div className="how-page">
      <Header />
      <Hero />
      <Steps />
      <Experience />
      <Features />
      <VendorCTA />
      <Footer />
    </div>
  );
}
