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
    <div className="vertical-marquee">
      <div className="vertical-marquee-track">
        <span>DISCOVER</span>
        <span>PREMIUM</span>
        <span>SHEESHA</span>
        <span>EXPERIENCE</span>
        <span>DUBAI</span>
        <span>TONIGHT</span>
        <span>FLAVORS</span>
        <span>LOUNGES</span>
        <span>DELIVERY</span>
        {/* Duplicate for seamless loop */}
        <span>DISCOVER</span>
        <span>PREMIUM</span>
        <span>SHEESHA</span>
        <span>EXPERIENCE</span>
        <span>DUBAI</span>
        <span>TONIGHT</span>
        <span>FLAVORS</span>
        <span>LOUNGES</span>
        <span>DELIVERY</span>
      </div>
    </div>
  );
}

