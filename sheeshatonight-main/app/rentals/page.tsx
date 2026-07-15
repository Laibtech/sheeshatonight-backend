'use client';

import Link from 'next/link';
import { Check, Award } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function RentalsPage() {
  const packages = [
    {
      name: 'Silver Sheesha Setup',
      price: 'AED 999',
      description: 'Perfect for smaller home gatherings and private celebrations',
      image: '/silver.webp',
      features: [
        '4 Sheesha units',
        '1 professional Sheesha master',
        '4 premium flavors',
        'Unlimited charcoal and head changes',
        'Portable burner',
        'Free Delivery',
        '4 hours of service plus 1 FREE extra hour'
      ],
      popular: false
    },
    {
      name: 'Gold Sheesha Setup',
      price: 'AED 1,299',
      description: 'Our most popular package for villa party Sheesha setup and birthday events',
      image: '/gold.webp',
      features: [
        '6x Shisha of your choice',
        '1x experienced shisha master',
        'Choose any 6 tobacco flavors',
        'Unlimited Charcoal & Head changes',
        'Portable burner',
        'Free Delivery',
        '4x hours of smoking + 1 FREE extra hour'
      ],
      popular: true
    },
    {
      name: 'Platinum Sheesha Setup',
      price: 'AED 1,999',
      description: 'Designed for large events and premium occasions',
      image: '/platinum.webp',
      features: [
        '9x Shisha of your choice',
        '1x experienced shisha master',
        'Choose any 9 tobacco flavors',
        'Unlimited Charcoal & Head changes',
        'Portable burner',
        'Free Delivery',
        '4x hours of smoking + 1 FREE extra hour'
      ],
      popular: false
    }
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#D4AF37]/10 to-[#B8902A]/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Our Premium <span className="text-[#D4AF37]">Packages</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the perfect Sheesha setup for your event. All packages include professional service, 
            premium equipment, and expert support.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition transform hover:scale-105 ${
                  pkg.popular ? 'ring-4 ring-[#D4AF37]' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-[#D4AF37] text-white text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="overflow-hidden h-56 bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-[#D4AF37]">{pkg.price}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="/auth/signup?role=customer"
                    className={`block text-center py-3 rounded-lg font-semibold transition ${
                      pkg.popular 
                        ? 'bg-[#D4AF37] text-white hover:bg-[#B8902A]' 
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">What's Included in Every Package</h3>
            <div className="grid md:grid-cols-2 gap-6 text-slate-600">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Professional Setup</p>
                  <p className="text-sm">Expert installation and arrangement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Premium Flavors</p>
                  <p className="text-sm">Authentic tobacco from trusted brands</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">On-Site Support</p>
                  <p className="text-sm">Dedicated master throughout event</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Quality Assurance</p>
                  <p className="text-sm">Premium equipment maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
