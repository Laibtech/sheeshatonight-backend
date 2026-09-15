'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerticalMarquee() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR rendering of marquee to avoid static build leakage on dashboard routes
  if (!mounted || !pathname) {
    return null;
  }

  // Hide marquee strip on all dashboard routes (/dashboard, /admin, /vendor)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/vendor')
  ) {
    return null;
  }

  return (
    <div className="vertical-marquee" title="SheeshaTonight Luxury Highlights">
      <div className="vertical-marquee-track">
        <span>PREMIUM SHEESHA</span>
        <span>LUXURY RENTALS</span>
        <span>VIP EXPERIENCE</span>
        <span>DUBAI TONIGHT</span>
        <span>EXPRESS DELIVERY</span>
        <span>ARTISAN FLAVORS</span>
        <span>EXCLUSIVE LOUNGES</span>
        <span>VERIFIED MASTERS</span>

        <span>PREMIUM SHEESHA</span>
        <span>LUXURY RENTALS</span>
        <span>VIP EXPERIENCE</span>
        <span>DUBAI TONIGHT</span>
        <span>EXPRESS DELIVERY</span>
        <span>ARTISAN FLAVORS</span>
        <span>EXCLUSIVE LOUNGES</span>
        <span>VERIFIED MASTERS</span>

        <span>PREMIUM SHEESHA</span>
        <span>LUXURY RENTALS</span>
        <span>VIP EXPERIENCE</span>
        <span>DUBAI TONIGHT</span>
        <span>EXPRESS DELIVERY</span>
        <span>ARTISAN FLAVORS</span>
        <span>EXCLUSIVE LOUNGES</span>
        <span>VERIFIED MASTERS</span>

        <span>PREMIUM SHEESHA</span>
        <span>LUXURY RENTALS</span>
        <span>VIP EXPERIENCE</span>
        <span>DUBAI TONIGHT</span>
        <span>EXPRESS DELIVERY</span>
        <span>ARTISAN FLAVORS</span>
        <span>EXCLUSIVE LOUNGES</span>
        <span>VERIFIED MASTERS</span>
      </div>
    </div>
  );
}

