# SheeshaTonight

Premium sheesha rental and marketplace platform for customers, vendors, and administrators in the UAE.

## Current Status

- Next.js frontend runs from this directory.
- MySQL database is used through Prisma.
- Authentication uses JWT sessions and role-based access.
- Customer, vendor, and admin dashboards are implemented.
- Product browsing, cart, checkout, orders, vendor management, CMS, notifications, reviews, and payouts are included.
- Demo records were removed. The database is intended to be populated through real registration, vendor onboarding, and admin workflows.
- Public registration always creates a `CUSTOMER`; admin accounts must be provisioned through a trusted admin process.
- Wishlist items are persisted in MySQL through the Prisma `Wishlist` model and survive logout/login.
- Notification creation is restricted to authenticated admins; users can only read and update their own notifications.
- The canonical product catalog is `/shop`. The old duplicate `/products` listing page has been removed. Product detail links remain available at `/products/[id]`.

## Requirements

- Node.js 18 or newer
- npm
- MySQL 8 or compatible MySQL server
- XAMPP is suitable for local MySQL development
- A database named `sheeshatonight-main` or another database configured in `DATABASE_URL`

## Project Structure

```text
sheeshatonight-main/
  app/                 Next.js App Router pages and API routes
  components/          Shared UI and dashboard layouts
  contexts/            Client contexts such as cart state
  lib/                 API clients, auth, Prisma, validation, and utilities
  prisma/              Prisma schema and migrations/runtime database definition
  public/              Images, logos, and static assets
  backend/             Optional Express backend and supporting services
  middleware.ts        Protected route and role middleware
  package.json         Frontend scripts and dependencies
```

## Installation

Open PowerShell in the frontend directory:

```powershell
cd "C:\Users\Abc\Downloads\sheeshatonight-main\sheeshatonight-main"
npm install
npx prisma generate
```

Create `.env.local` from `.env.local.example` and set real values. Never commit secrets.

Example required configuration:

```env
DATABASE_URL="mysql://root:@localhost:3306/sheeshatonight-main"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_API_URL="http://localhost:3002"
```

Use the correct MySQL username, password, host, port, and database for your environment.

## Database Setup

Start MySQL, then synchronize the Prisma schema:

```powershell
npx prisma db push
npx prisma generate
```

Useful database commands:

```powershell
npm run db:push
npm run db:studio
```

The main models include users, vendors, products, orders, order items, cart items, wishlist items, addresses, reviews, notifications, invoices, settlements, vendor documents, coupons, CMS content, and audit records. The complete source of truth is `prisma/schema.prisma`.

Do not run destructive reset or seed commands against a production database. This project currently does not require demo seeding.

## Running Locally

Start the frontend from the nested project directory:

```powershell
npm run dev -- --port 3002
```

Open:

- Website: `http://localhost:3002`
- Shop: `http://localhost:3002/shop`
- Cart: `http://localhost:3002/cart`
- Customer dashboard: `http://localhost:3002/dashboard`
- Vendor dashboard: `http://localhost:3002/vendor`
- Vendor store: `http://localhost:3002/vendor/store`
- Admin dashboard: `http://localhost:3002/admin`
- Health endpoint: `http://localhost:3002/api/health`

If port 3002 is occupied, choose another port, for example `npm run dev -- --port 3003`.

For the optional Express backend:

```powershell
npm run backend
```

The Express backend configuration and routes are under `backend/`. The Next.js API routes under `app/api/` are the primary frontend-integrated API surface.

## User Workflows

### Customer

1. Register at `/auth/signup`.
2. Sign in at `/auth/login`.
3. Browse the live catalog at `/shop`.
4. Open a product detail page at `/products/[id]`.
5. Add products to `/cart`.
6. Complete checkout at `/checkout`.
7. Track orders and bookings from `/dashboard`.
8. Manage wishlist, profile, addresses, and settings from the customer dashboard.

### Vendor

1. Register through the vendor registration flow.
2. Complete profile and approval requirements.
3. Use `/vendor` for dashboard statistics.
4. Use `/vendor/store` for the live vendor profile.
5. Use `/vendor/settings` to update business information.
6. Manage products from `/vendor/products`.
7. Process orders from `/vendor/orders`.
8. Review earnings, settlements, notifications, customers, and reviews from the vendor sidebar.

### Admin

1. Sign in with an admin account created through the approved account-management process.
2. Use `/admin` for platform overview.
3. Manage products, vendors, customers, orders, KYC, payments, payouts, coupons, reviews, notifications, and audit logs.
4. Manage homepage, banners, navigation, and pages through `/admin/cms`.
5. Use analytics, reports, admin users, and settings for platform operations.

## Main Frontend Routes

| Area | Routes |
| --- | --- |
| Public | `/`, `/about`, `/browse`, `/shop`, `/rentals`, `/stores`, `/blogs`, `/faqs`, `/help`, `/contact`, `/privacy` |
| Auth | `/auth/login`, `/auth/signup`, `/forgot-password` |
| Customer | `/dashboard`, `/dashboard/orders`, `/dashboard/bookings`, `/dashboard/browse`, `/dashboard/wishlist`, `/dashboard/settings` |
| Vendor | `/vendor`, `/vendor/store`, `/vendor/products`, `/vendor/orders`, `/vendor/customers`, `/vendor/earnings`, `/vendor/notifications`, `/vendor/settings` |
| Admin | `/admin`, `/admin/products`, `/admin/vendors`, `/admin/customers`, `/admin/orders`, `/admin/kyc`, `/admin/payments`, `/admin/payouts`, `/admin/cms`, `/admin/analytics`, `/admin/settings` |
| Commerce | `/cart`, `/checkout`, `/order-success`, `/products/[id]` |

## API Surface

Important Next.js API routes include:

- `/api/auth/register`
- `/api/auth/register/vendor`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/products`
- `/api/products/[id]`
- `/api/vendors`
- `/api/vendors/[id]`
- `/api/vendors/[id]/products`
- `/api/cart`
- `/api/cart/[itemId]`
- `/api/checkout`
- `/api/orders`
- `/api/bookings`
- `/api/wishlist`
- `/api/reviews`
- `/api/vendor/profile`
- `/api/vendor/products`
- `/api/vendor/orders`
- `/api/vendor/settlements`
- `/api/admin/*`
- `/api/cms/*`
- `/api/notifications`
- `/api/health`

Authenticated endpoints use the session/JWT token. Admin and vendor endpoints also validate the user role on the server.

## Design System

The public site and dashboards use the SheeshaTonight luxury direction:

- black and charcoal surfaces
- gold accents based on `#D4AF37`
- white and slate text for contrast
- restrained borders and rounded panels
- responsive desktop and mobile navigation

Admin, vendor, and customer dashboard shells share the same black, gold, and white visual language. Shared dashboard components are in `components/`.

## Validation and Production Checks

Run the type/build validation before handoff:

```powershell
npm run build
```

Run lint when the project lint configuration is available:

```powershell
npm run lint
```

The build may log dynamic API-route notices during static generation; authenticated request-dependent API routes are intentionally dynamic. A failed build or missing generated chunk error should be investigated before deployment.

## Common Problems

### `npm` cannot find `package.json`

The repository contains an outer folder and the actual Next.js project folder. Run commands from:

```text
C:\Users\Abc\Downloads\sheeshatonight-main\sheeshatonight-main
```

Or use an explicit prefix:

```powershell
npm --prefix "C:\Users\Abc\Downloads\sheeshatonight-main\sheeshatonight-main" run dev -- --port 3002
```

### `Cannot find module './xxxx.js'` from `.next`

This means generated Next.js chunks are stale or corrupted, commonly because `next dev` and `next build` were run at the same time. Stop the dev server, remove `.next`, and start one fresh dev process:

```powershell
Remove-Item .next -Recurse -Force
npm run dev -- --port 3002
```

Do not run production build and development server simultaneously in the same project directory.

### Database connection fails

Check that MySQL is running, the database exists, `DATABASE_URL` uses the MySQL provider, and Prisma has been generated:

```powershell
npx prisma generate
npx prisma db push
```

### Login or protected route redirects

Check that the account exists in the database, the password is valid, cookies are enabled, `JWT_SECRET` is set, and the browser is using the same port as the running frontend.

## Deployment

For a production deployment:

1. Set production environment variables in the hosting provider.
2. Use a managed MySQL database or a secured production MySQL server.
3. Run `npm install` and `npx prisma generate` during the build.
4. Apply the schema with a controlled migration/deployment process.
5. Run `npm run build`.
6. Start with `npm start` or the hosting provider's Next.js runtime.
7. Configure the backend separately if the Express backend is deployed.
8. Configure CORS, allowed origins, cookies, JWT secrets, file storage, payment credentials, email credentials, and webhook URLs for production.
9. Never deploy with local demo credentials, local database URLs, or development secrets.

## Security Notes

- Keep `.env.local` and production secrets out of version control.
- Use a long random `JWT_SECRET` in production.
- Use HTTPS in production so auth cookies are protected.
- Validate all authenticated requests on the server.
- Keep admin and vendor role checks server-side.
- Do not expose password hashes, tokens, payment secrets, or private documents in client responses.
- Use a managed/private object-storage solution for production uploads instead of relying on local filesystem persistence.

## Handoff Checklist

- [ ] MySQL is running and `DATABASE_URL` points to the intended database.
- [ ] No demo records remain unless explicitly approved.
- [ ] Real admin, vendor, and customer accounts are created securely.
- [ ] Vendor KYC and approval flow has been tested.
- [ ] Product, cart, checkout, order, and notification flows have been tested.
- [ ] Production environment variables are configured.
- [ ] `npm run build` passes.
- [ ] The deployed domain, CORS origins, cookies, payment provider, email provider, and file storage are configured.
- [ ] Database backups and monitoring are enabled.

## Source of Truth

This README is the single project documentation file. For implementation details, use the source files directly, especially `package.json`, `.env.local.example`, `prisma/schema.prisma`, `app/`, `components/`, `lib/`, and `backend/`.


