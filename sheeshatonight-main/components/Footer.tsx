import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">ABOUT US</h3>
            <p className="text-sm text-slate-400">
              SheeshaTonight is your go-to UAE platform to discover, book, and enjoy the best sheesha lounges and cafes near you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-[#D4AF37] transition">About Us</Link></li>
              <li><Link href="/rentals" className="text-slate-400 hover:text-[#D4AF37] transition">Rentals (Book Sheesha)</Link></li>
              <li><Link href="/make-your-sheesha" className="text-slate-400 hover:text-[#D4AF37] transition">Make Your Sheesha</Link></li>
              <li><Link href="/blogs" className="text-slate-400 hover:text-[#D4AF37] transition">Blogs</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-[#D4AF37] transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faqs" className="text-slate-400 hover:text-[#D4AF37] transition">FAQs</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-[#D4AF37] transition">Privacy Policy</Link></li>
              <li><Link href="/help" className="text-slate-400 hover:text-[#D4AF37] transition">Help Center</Link></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="text-lg font-bold mb-4">FOR VENDORS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/signup?role=vendor" className="text-slate-400 hover:text-[#D4AF37] transition">Join as Vendor</Link></li>
              <li><Link href="/vendor-support" className="text-slate-400 hover:text-[#D4AF37] transition">Vendor Support</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">CONTACT US</h3>
            <p className="text-sm text-slate-400 mb-2">
              Have a question or want to reach out, we're always happy to connect.
            </p>
            <p className="text-sm text-slate-400 mb-1">
              <strong>Email:</strong> support@sheeshatonight.com
            </p>
            <p className="text-sm text-slate-400 mb-4">
              <strong>Phone:</strong> +971 50 123 1111
            </p>
            <p className="text-sm text-slate-400">
              <strong>Location:</strong> Dubai, United Arab Emirates
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2026 <span className="text-[#D4AF37]">SheeshaTonight</span> All rights reserved. Powered by Worldwide Marketing & Consultancy Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
