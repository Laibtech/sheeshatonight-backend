'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQsPage() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What areas do you serve in UAE?',
      answer: 'We deliver premium shisha services across all Emirates including Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Free delivery is included in all our packages.'
    },
    {
      question: 'How far in advance should I book?',
      answer: 'We recommend booking at least 3-7 days in advance to ensure availability, especially during weekends and public holidays. However, we can accommodate last-minute bookings subject to availability.'
    },
    {
      question: 'What is included in each package?',
      answer: 'All packages include shisha units, a professional shisha master, premium tobacco flavors, unlimited charcoal and head changes, portable burner, free delivery, and 4 hours of service plus 1 FREE extra hour.'
    },
    {
      question: 'Can I customize the flavors?',
      answer: 'Absolutely! You can choose any flavors you prefer from our extensive selection. We offer classic flavors like Double Apple, refreshing options like Lemon Mint, and fruity choices like Watermelon and Blueberry.'
    },
    {
      question: 'What happens if I need service beyond 5 hours?',
      answer: 'Each package includes 4 hours plus 1 FREE extra hour (total 5 hours). If you need additional time, you can extend the service at an hourly rate. Contact us for pricing details.'
    },
    {
      question: 'Do you provide shisha for outdoor events?',
      answer: 'Yes! We cater to all types of events including villa parties, yacht gatherings, beach events, rooftop celebrations, weddings, and corporate functions. Our portable setup works perfectly for outdoor venues.'
    },
    {
      question: 'Is a deposit required for booking?',
      answer: 'Yes, we require a 50% deposit to confirm your booking. The remaining balance can be paid on the day of the event. We accept bank transfers, credit cards, and cash payments.'
    },
    {
      question: 'What if I need to cancel or reschedule?',
      answer: 'We understand plans can change. If you need to cancel or reschedule, please notify us at least 48 hours in advance for a full refund of your deposit. Cancellations within 48 hours are subject to a 25% cancellation fee.'
    },
    {
      question: 'Are your shisha masters trained professionals?',
      answer: 'Yes, all our shisha masters are highly trained professionals with years of experience. They handle setup, maintenance, charcoal management, and ensure optimal smoke quality throughout your event.'
    },
    {
      question: 'What brands of tobacco do you use?',
      answer: 'We use only premium, authentic tobacco from trusted international brands to ensure the best flavor and smoking experience. All our products comply with UAE regulations.'
    },
    {
      question: 'Can I mix different flavors?',
      answer: 'Yes! Our shisha masters are skilled at creating custom flavor combinations. Just let us know your preferences, and we\'ll create a unique blend for you.'
    },
    {
      question: 'Do you clean and sanitize the equipment?',
      answer: 'Absolutely. We follow strict hygiene protocols. All equipment is thoroughly cleaned and sanitized before and after each event. We also provide fresh, disposable hose tips for each user.'
    },
    {
      question: 'What is your minimum order quantity?',
      answer: 'Our Silver package starts with 4 shisha units, which is perfect for smaller gatherings. This is our minimum order. For larger events, we offer Gold (6 units) and Platinum (9 units) packages.'
    },
    {
      question: 'How do I make a payment?',
      answer: 'We accept multiple payment methods including bank transfers, credit/debit cards, and cash on delivery. A 50% deposit is required to confirm your booking, with the balance payable on the event day.'
    },
    {
      question: 'Do you provide hookah equipment for purchase?',
      answer: 'Yes! Visit our "Make Your Sheesha" page where you can customize and purchase your own shisha setup with your choice of base, hose, bowl, and flavors for home use.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="SheeshaTonight" className="h-12 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-[#D4AF37] transition font-medium">Home</Link>
              <Link href="/about" className="text-slate-700 hover:text-[#D4AF37] transition font-medium">About Us</Link>
              <Link href="/rentals" className="text-slate-700 hover:text-[#D4AF37] transition font-medium">Rentals</Link>
              <Link href="/faqs" className="text-[#D4AF37] font-semibold">FAQs</Link>
              <Link href="/contact" className="text-slate-700 hover:text-[#D4AF37] transition font-medium">Contact</Link>
            </nav>

            <div className="relative">
              <button 
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8902A] transition font-medium"
              >
                Account
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl py-2 z-50">
                  <Link href="/auth/signup" className="block px-4 py-2 hover:bg-gray-50">Sign Up</Link>
                  <Link href="/auth/login" className="block px-4 py-2 hover:bg-gray-50">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#D4AF37]/10 to-[#B8902A]/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Frequently Asked <span className="text-[#D4AF37]">Questions</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Find answers to common questions about our premium shisha rental services
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-lg font-bold text-slate-900 pr-4">
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <ChevronUp className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-br from-[#D4AF37] to-[#B8902A]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-xl text-white/90 mb-8">Our team is here to help you 24/7</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white text-[#D4AF37] rounded-lg font-semibold hover:bg-slate-100 transition"
            >
              Contact Us
            </Link>
            <a 
              href="tel:+971501231111"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition"
            >
              Call: +971 50 123 1111
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ABOUT US</h3>
              <p className="text-sm text-slate-400">
                Premium shisha rental services across UAE for all your special events.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">QUICK LINKS</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-slate-400 hover:text-[#D4AF37]">About Us</Link></li>
                <li><Link href="/rentals" className="text-slate-400 hover:text-[#D4AF37]">Rentals</Link></li>
                <li><Link href="/blogs" className="text-slate-400 hover:text-[#D4AF37]">Blogs</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-[#D4AF37]">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faqs" className="text-slate-400 hover:text-[#D4AF37]">FAQs</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-[#D4AF37]">Privacy Policy</Link></li>
                <li><Link href="/help" className="text-slate-400 hover:text-[#D4AF37]">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">CONTACT</h3>
              <p className="text-sm text-slate-400 mb-2">Email: support@sheeshatonight.com</p>
              <p className="text-sm text-slate-400 mb-2">Phone: +971 50 123 1111</p>
              <p className="text-sm text-slate-400">Dubai, UAE</p>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-400">
              © 2026 <span className="text-[#D4AF37]">SheeshaTonight</span> All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
