'use client';

import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { Target, Eye, Award, Users, Clock, Shield, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageLayout>
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://sheeshatonight.com/frontend/assets/images/brand/image.png')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-[#D4AF37]">SheeshaTonight</span>
            </h1>
            <p className="text-xl leading-relaxed">
              UAE's premier sheesha rental service bringing luxury and elegance to your doorstep since 2024.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-[#b88f1e]">
                Book a Sheesha
              </Link>
              <Link href="/rentals" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Explore Rentals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f8f3e9]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Born from a passion for premium hospitality, SheeshaTonight transforms every celebration into a signature luxury experience.
                </p>
                <p>
                  Whether it’s an intimate villa gathering, a yacht party, or a high end corporate event, we deliver elegant sheesha setups that elevate the atmosphere.
                </p>
                <p>
                  Every detail is carefully curated from premium equipment and top tier flavors to polished service and seamless delivery so your guests feel cared for from the first inhale to the last glow.
                </p>
                <p>
                  We partner with event planners, venues, and hosts to create tailored packages that suit every occasion, from relaxed social nights to elegant VIP affairs.
                </p>
                <p>
                  With meticulous attention to detail, dependable service, and a commitment to excellence, we have become the trusted choice for discerning guests across the UAE.
                </p>
              </div>
            </div>
            <div className="relative h-[520px] max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/hos-hookah.webp"
                alt="Premium Sheesha Setup"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-8 flex flex-col justify-end text-white">
                <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37] mb-2">Luxury sheesha rental</p>
                <h3 className="text-3xl font-bold leading-tight">Elevated sheesha styling for every premium event.</h3>
                <p className="mt-4 max-w-xs text-sm text-slate-200">
                  Crafted for unforgettable moments, our setups blend modern elegance with authentic ambience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8902A] p-10 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <Target className="w-12 h-12" />
                <h3 className="text-3xl font-bold">Our Mission</h3>
              </div>
              <p className="text-lg leading-relaxed">
                To deliver premium sheesha experiences that elevate every celebration, making luxury accessible and memorable for everyone.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-10 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <Eye className="w-12 h-12" />
                <h3 className="text-3xl font-bold">Our Vision</h3>
              </div>
              <p className="text-lg leading-relaxed">
                To become the Middle East's most trusted sheesha rental platform, known for innovation, quality, and exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f8f3e9] text-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Why Choose SheeshaTonight?</h2>
            <p className="mt-4 max-w-3xl mx-auto text-slate-600">
              We deliver premium sheesha experiences with elegant styling, flawless execution, and a hospitality-first mindset.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl transition hover:-translate-y-2 hover:border-slate-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#D4AF37]/15 text-[#D4AF37]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">Premium Quality</h3>
              <p className="mt-4 text-slate-600">
                Luxury sheesha brands, curated accessories, and setups designed to impress.
              </p>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl transition hover:-translate-y-2 hover:border-slate-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#8b5cf6]/15 text-[#8b5cf6]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">Trusted Service</h3>
              <p className="mt-4 text-slate-600">
                Professional support, timely delivery, and safe handling across every venue.
              </p>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl transition hover:-translate-y-2 hover:border-slate-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0ea5e9]/15 text-[#0ea5e9]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">Customer Focused</h3>
              <p className="mt-4 text-slate-600">
                Personalized event packages, flexible booking, and white-glove support from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white text-slate-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#f8f3e9] px-4 py-2 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
                <Zap className="w-4 h-4" /> Elevated Service
              </span>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Experience the Difference with SheeshaTonight</h2>
              <p className="max-w-2xl text-slate-700 leading-relaxed">
                We merge luxury, culture, and flawless service to create sheesha moments that feel effortless and unforgettable. Every event is carefully tailored to match your ambience, whether it's an intimate gathering or a grand celebration.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-[28px] bg-[#f8f3e9] p-6 shadow-2xl border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900">Tailored Packages</h3>
                  <p className="mt-3 text-slate-600">
                    Choose from exclusive rental packages, curated flavors, and premium services to suit your event theme.
                  </p>
                </div>
                <div className="rounded-[28px] bg-[#f8f3e9] p-6 shadow-2xl border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900">Expert Setup</h3>
                  <p className="mt-3 text-slate-600">
                    Our team delivers polished installations, fast service, and attentive care while maintaining a refined guest experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 shadow-2xl">
              <img
                src="https://sheeshatonight.com/frontend/assets/images/product/hos-hookah.png"
                alt="Sheesha event setup"
                className="h-[560px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent p-10 flex flex-col justify-end">
                <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Premium Experience</p>
                <h3 className="mt-4 text-3xl font-bold text-slate-900">Seamless setup for every event.</h3>
                <p className="mt-4 max-w-md text-slate-700">
                  Our team arrives prepared, installs with precision, and ensures the atmosphere stays inviting throughout the night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
