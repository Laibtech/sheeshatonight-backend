# 🌙 SheeshaTonight

**Premium Luxury Sheesha Rental & Tobacco Marketplace** for UAE & UK

---

## ✅ **PRODUCTION READY - Market Launch Version**

Complete premium sheesha rental & tobacco marketplace with:
- ✅ Professional admin dashboard with oversight queues
- ✅ Customer portal with booking & wishlist
- ✅ Vendor management portal  
- ✅ Demo authentication (no backend required)
- ✅ Gold luxury theme throughout
- ✅ Fully responsive design
- ✅ Real-time operation monitoring
- ✅ KYC & compliance tracking

---

## 🚀 Quick Start

```bash
# Navigate to project
cd sheeshatonight-main

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit: **http://localhost:3000**

---

## 🎨 Design System

### Theme: Premium Luxury Light with Gold Accents

**Colors:**
- Primary: `#D4AF37` (Gold)
- Background: `#F8FAFC` (Light Slate)
- Cards: `#FFFFFF` (White)
- Text: `#0F172A` (Dark Slate)

**Logo:** `public/logo.png` - used in sidebar, auth pages, mobile menu

**Layout:**
- Fixed 72px navbar
- Collapsible sidebar (desktop)
- White cards with soft shadows
- Gold primary buttons
- Consistent spacing throughout

---

## 🔐 Authentication

**Email/Password Login (Demo Mode - No Backend Required):**
- Email and password authentication
- JWT token storage
- Role-based routing

**Demo Credentials:**
```
Customer: customer@test.com / password
Vendor:   vendor@test.com / password
Admin:    admin@test.com / password
```

**Roles:**
- **Customer** → `/dashboard`
- **Vendor** → `/vendor`
- **Admin** → `/admin`

---

## 📱 Features

### Customer Dashboard
- Active bookings & orders tracking
- Browse sheesha lounges
- Nearby locations with ratings
- Order history & reordering
- Booking management
- Wishlist - Save favorite items
- Account settings

### Pages Implemented
- ✅ Email/Password Login
- ✅ Sign Up with validation
- ✅ Customer Dashboard
- ✅ Browse Sheesha Lounges
- ✅ My Orders
- ✅ Bookings
- ✅ Wishlist
- ✅ Settings (Profile, Notifications, Security, Payments)

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)

**Authentication:**
- JWT Tokens
- OTP Verification
- Session Cookies
- Protected Routes (Middleware)

**UI Components:**
- Lucide Icons
- Unified Dashboard Layout
- Responsive Design (Mobile-First)

---

## 📂 Project Structure

```
sheeshatonight-main/
├── app/
│   ├── auth/
│   │   ├── login/          # OTP login page
│   │   └── verify/         # OTP verification
│   ├── dashboard/          # Customer dashboard
│   │   ├── browse/         # Browse lounges
│   │   ├── orders/         # Order history
│   │   ├── bookings/       # Booking management
│   │   └── settings/       # Account settings
│   ├── vendor/             # Vendor dashboard
│   └── admin/              # Admin dashboard
├── components/
│   ├── UnifiedDashboardLayout.tsx  # Main layout
│   ├── ProtectedRoute.tsx          # Auth guard
│   └── Logo.tsx                    # Logo component
├── lib/
│   ├── auth-client.ts      # Auth utilities
│   ├── store.ts            # Zustand store
│   └── session.ts          # Session management
├── middleware.ts           # Route protection
└── public/
    └── logo.png           # Brand logo
```

---

## 🎯 Key Features

✅ **Unified Design System** - Gold/light theme throughout  
✅ **Role-Based Access** - Customer/Vendor/Admin routing  
✅ **OTP Authentication** - Secure login flow  
✅ **Responsive Layout** - Mobile, tablet, desktop  
✅ **Protected Routes** - Middleware + client guards  
✅ **Consistent UI** - Same cards, buttons, spacing everywhere  

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎨 Component Patterns

### Primary Button (Gold)
```tsx
<button className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-white font-semibold rounded-lg">
  Button Text
</button>
```

### Card
```tsx
<div className="bg-white rounded-xl p-6 border border-slate-200">
  Content
</div>
```

### Input
```tsx
<input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37]" />
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Sidebar collapses to overlay on mobile/tablet.

---

## 🚦 Routes

**Public:**
- `/` - Auto-redirect to dashboard or login
- `/auth/login` - Email/Password login
- `/auth/signup` - New user registration

**Protected (Customer):**
- `/dashboard` - Main dashboard
- `/dashboard/browse` - Browse lounges
- `/dashboard/orders` - Order history
- `/dashboard/bookings` - Bookings
- `/dashboard/wishlist` - Saved items
- `/dashboard/settings` - Settings

**Protected (Vendor):**
- `/vendor` - Vendor dashboard

**Protected (Admin):**
- `/admin` - Admin dashboard

---

## ✨ Design Principles

1. **Light Theme Only** - No dark mode
2. **Gold Primary Color** - #D4AF37
3. **Consistent Layout** - Same structure everywhere
4. **White Cards** - Clean, premium feel
5. **Logo Everywhere** - Sidebar, auth, mobile menu
6. **Premium Luxury** - UAE marketplace aesthetic

---

## 📄 License

Private - SheeshaTonight © 2026

---

**Status:** ✅ Design System Complete - Gold/Light Theme Implemented  
**Last Updated:** June 11, 2026
