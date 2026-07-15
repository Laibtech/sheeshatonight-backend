# 🚀 SheeshaTonight - Vercel Deployment Guide

**Complete guide to deploy your application on Vercel (Better for Next.js!)**

---

## Why Vercel?

✅ **Perfect for Next.js** - Built by the Next.js team  
✅ **Free tier available** - Good for starting out  
✅ **Automatic HTTPS** - SSL certificates included  
✅ **Git integration** - Auto-deploy on push  
✅ **Fast global CDN** - Lightning-fast performance  
✅ **Serverless functions** - No server management  

---

## 📋 Quick Overview

**What we'll deploy:**
- Frontend (Next.js) → Vercel
- Backend (Express API) → Vercel (as serverless functions)
- Database (PostgreSQL) → Supabase/Neon (free)

**Total time:** ~1 hour

---

## 🚨 STEP 1: Push Backend to GitHub (3 minutes)

**You need to do this first!**

1. Go to: https://github.com/new
2. Create repository:
   - Name: `sheeshatonight-backend`
   - Private
   - No README, .gitignore, or license
3. Click "Create repository"
4. Push code:
   ```bash
   cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
   git push -u origin main
   ```

✅ **Verify**: https://github.com/NOTREALTODAy/sheeshatonight-backend

---

## 🗄️ STEP 2: Set Up Production Database (15 minutes)

### Option A: Supabase (Recommended)

1. **Sign up**: https://supabase.com
2. **Create new project**:
   - Name: `sheeshatonight-prod`
   - Database Password: **(Generate & Save!)**
   - Region: Choose closest to your users
3. **Wait** for setup (2-3 minutes)
4. **Get connection string**:
   - Go to: Project Settings → Database
   - Copy **Connection string** (URI format)
   - Replace `[YOUR-PASSWORD]` with your password

**Save this URL** - Example:
```
postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Option B: Neon (Alternative)

1. Sign up: https://neon.tech
2. Create project
3. Get connection string

---

## 🔑 STEP 3: Generate JWT Secret

Run this command:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Copy the output** - it will look like:
```
a1b2c3d4e5f6789...very long string...x9y0z1
```

**Save this** - you'll need it for both frontend and backend.

---

## 🎨 STEP 4: Deploy Frontend to Vercel (20 minutes)

### 4.1: Prepare Frontend

First, let's make sure your frontend is ready for Vercel:

**Check package.json** (should already have these):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 4.2: Create Vercel Account

1. Go to: https://vercel.com/signup
2. **Sign up with GitHub** (easiest)
3. Authorize Vercel to access your GitHub

### 4.3: Import Frontend Project

1. **Click**: "Add New..." → "Project"
2. **Import** your frontend repository:
   - Select: `NOTREALTODAy/sheeshatonight-main`
3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (keep default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

### 4.4: Add Environment Variables

**Before deploying, add these:**

Click **"Environment Variables"** and add:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `YOUR_BACKEND_URL` | We'll get this in Step 5 |
| `JWT_SECRET` | (from Step 3) | Your generated secret |
| `NODE_ENV` | `production` | Environment |

**Note**: Leave `NEXT_PUBLIC_API_URL` empty for now - we'll update it after deploying the backend.

### 4.5: Deploy Frontend

1. **Click**: "Deploy"
2. **Wait**: 2-5 minutes for build
3. **Note the URL**: e.g., `https://sheeshatonight-main.vercel.app`

✅ **Your frontend is live!** (But backend not connected yet)

---

## 🔧 STEP 5: Deploy Backend to Vercel (30 minutes)

### 5.1: Prepare Backend for Vercel

Vercel uses serverless functions, so we need to adapt the Express app.

**Create `vercel.json` in backend folder:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Create `api/index.js` (Vercel entry point):**

```javascript
// api/index.js
const app = require('../src/server');

module.exports = app;
```

**Update `src/server.js`** to export the app:

Add at the end of the file:
```javascript
// Export for Vercel
module.exports = app;
```

Let me create these files for you now.

### 5.2: Import Backend Project

1. **Go to Vercel dashboard**: https://vercel.com/dashboard
2. **Click**: "Add New..." → "Project"
3. **Import**: `NOTREALTODAy/sheeshatonight-backend`
4. **Configure**:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 5.3: Add Backend Environment Variables

Add these **before deploying**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | (from Step 2 - Supabase connection string) |
| `JWT_SECRET` | (from Step 3 - same as frontend) |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://sheeshatonight-main.vercel.app` |

### 5.4: Deploy Backend

1. **Click**: "Deploy"
2. **Wait**: 2-5 minutes
3. **Note the URL**: e.g., `https://sheeshatonight-backend.vercel.app`

### 5.5: Run Database Migrations

You need to run Prisma migrations. Do this from your local machine:

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend

# Set the production database URL
$env:DATABASE_URL="your-supabase-connection-string"

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Seed database (optional - demo data)
node src/utils/seed.js
```

---

## 🔄 STEP 6: Connect Frontend to Backend (5 minutes)

### 6.1: Update Frontend Environment Variables

1. Go to: **Vercel Dashboard** → Your frontend project
2. **Settings** → **Environment Variables**
3. **Edit** `NEXT_PUBLIC_API_URL`:
   - Change to: `https://sheeshatonight-backend.vercel.app`
4. **Save**

### 6.2: Redeploy Frontend

1. Go to: **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment (~2 minutes)

---

## 🔒 STEP 7: Update CORS Settings (5 minutes)

Update backend CORS to allow your frontend:

**Edit `backend/src/server.js`:**

Find:
```javascript
app.use(cors());
```

Replace with:
```javascript
app.use(cors({
  origin: [
    'https://sheeshatonight-main.vercel.app',
    'http://localhost:3002', // For local development
  ],
  credentials: true
}));
```

**Commit and push:**
```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
git add .
git commit -m "Update CORS for Vercel deployment"
git push
```

**Vercel will auto-redeploy** the backend (takes ~2 minutes).

---

## 🌐 STEP 8: Add Custom Domain (Optional, 15 minutes)

### 8.1: Add Domain to Frontend

1. **Vercel Dashboard** → Your frontend project
2. **Settings** → **Domains**
3. **Add** your domain: `sheeshatonight.com`
4. **Follow DNS instructions** provided by Vercel
5. Wait for SSL (usually < 5 minutes)

### 8.2: Add Subdomain for Backend

1. **Vercel Dashboard** → Your backend project
2. **Settings** → **Domains**
3. **Add**: `api.sheeshatonight.com`
4. **Follow DNS instructions**
5. Wait for SSL

### 8.3: Update Environment Variables

**Frontend** (`NEXT_PUBLIC_API_URL`):
- Change to: `https://api.sheeshatonight.com`

**Backend** (`FRONTEND_URL`):
- Change to: `https://sheeshatonight.com`

**Backend CORS** (src/server.js):
```javascript
app.use(cors({
  origin: [
    'https://sheeshatonight.com',
    'http://localhost:3002',
  ],
  credentials: true
}));
```

**Commit and push** - Vercel will auto-deploy.

---

## ✅ STEP 9: Production Hardening

### 9.1: Update Demo Credentials

**Option A**: Change passwords in `backend/src/utils/seed.js`

**Option B**: Disable auto-seeding

Edit `backend/src/server.js`, comment out:
```javascript
// await seedDatabase(); // Disable in production
```

### 9.2: Security Checklist

- [ ] `.env` files not in Git
- [ ] Demo passwords changed or disabled
- [ ] CORS restricted to production domain
- [ ] JWT_SECRET is strong (64+ characters)
- [ ] Database password is strong
- [ ] Rate limiting enabled

### 9.3: Environment Variables Check

**Frontend (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://api.sheeshatonight.com (or .vercel.app URL)
JWT_SECRET=<your-secret>
NODE_ENV=production
```

**Backend (Vercel)**:
```
DATABASE_URL=<supabase-connection-string>
JWT_SECRET=<same-as-frontend>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://sheeshatonight.com (or .vercel.app URL)
```

---

## 🧪 STEP 10: Testing & Verification

### 10.1: Backend Health Check

Visit: `https://sheeshatonight-backend.vercel.app/health`

**Expected response**:
```json
{"status": "ok"}
```

### 10.2: Frontend Test

Visit: `https://sheeshatonight-main.vercel.app`

**Check**:
- [ ] Homepage loads
- [ ] No console errors
- [ ] Images display
- [ ] Navigation works

### 10.3: Authentication Test

1. Go to: `/auth/login`
2. Login with admin credentials:
   - Email: `admin@sheeshatonight.com`
   - Password: `admin123` (or new password)
3. Should redirect to: `/admin/dashboard`
4. Check: Dashboard data loads

### 10.4: Full System Test

- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can view cart
- [ ] Admin dashboard loads
- [ ] Vendor dashboard loads
- [ ] Customer dashboard loads
- [ ] Notifications work
- [ ] KYC page loads

---

## 🔧 Troubleshooting

### Frontend Build Fails

**Check**:
1. Vercel build logs for errors
2. TypeScript errors
3. Missing environment variables
4. Package.json scripts

**Fix**:
- Fix errors locally first
- Test with `npm run build`
- Push to GitHub
- Vercel auto-redeploys

### Backend Not Responding

**Check**:
1. Vercel function logs
2. Database connection (DATABASE_URL correct?)
3. Environment variables set
4. CORS configuration

**Fix**:
- Check Vercel function logs
- Verify DATABASE_URL in Supabase dashboard
- Ensure all env vars are set

### Database Connection Fails

**Check**:
1. Supabase dashboard (is database running?)
2. Connection string format
3. Password correct in connection string
4. IP allowlist (Supabase allows all by default)

**Fix**:
- Verify connection string
- Test connection locally with same URL
- Check Supabase project status

### CORS Errors

**Symptoms**: "CORS policy" error in browser console

**Fix**:
1. Check backend CORS config
2. Ensure frontend URL is in allowed origins
3. Redeploy backend after changes
4. Clear browser cache

### 500 Internal Server Error

**Check Vercel function logs**:
1. Go to Vercel Dashboard → Backend project
2. Click on deployment
3. View **Function logs**
4. Look for error messages

---

## 🎯 Deployment Checklist

### Phase 1: Preparation
- [x] Backend repository created ⚠️ (do this first!)
- [x] Backend code pushed to GitHub
- [ ] Database created (Supabase/Neon)
- [ ] JWT secret generated

### Phase 2: Vercel Setup
- [ ] Vercel account created
- [ ] Frontend imported to Vercel
- [ ] Frontend environment variables set
- [ ] Frontend deployed

### Phase 3: Backend
- [ ] Backend files modified for Vercel
- [ ] Backend imported to Vercel
- [ ] Backend environment variables set
- [ ] Backend deployed
- [ ] Database migrations run

### Phase 4: Integration
- [ ] Frontend connected to backend
- [ ] CORS configured
- [ ] Both apps redeployed
- [ ] Testing complete

### Phase 5: Production
- [ ] Custom domain added (optional)
- [ ] SSL verified
- [ ] Demo credentials changed
- [ ] Security hardening complete

---

## 🚀 Quick Commands Reference

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Run Migrations (Local to Production DB)
```bash
cd backend
$env:DATABASE_URL="your-production-url"
npx prisma migrate deploy
npx prisma generate
node src/utils/seed.js
```

### Push Code Updates
```bash
git add .
git commit -m "Your message"
git push
# Vercel auto-deploys!
```

### View Logs
- Vercel Dashboard → Project → Deployments → Click deployment → View logs

---

## 💰 Pricing

### Vercel Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Git integration
- ✅ Serverless functions (limited)

**Good for**: Development, small projects, demos

### Supabase Free Tier:
- ✅ 500 MB database
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users

**Good for**: Starting out, testing

**Upgrade when**: You get traffic and need more resources

---

## 🔄 Automatic Deployments

Once set up, Vercel auto-deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Added new feature"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Deploys to production
# 4. Updates your domain
# All in ~2 minutes!
```

---

## 📊 Monitoring

### Vercel Dashboard

**Check regularly**:
- Deployment status
- Function logs
- Bandwidth usage
- Error rates

### Supabase Dashboard

**Monitor**:
- Database size
- Connection count
- Query performance
- Backups

---

## 🆘 Need Help?

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Twitter: @vercel

### Supabase Support
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Support: support@supabase.io

---

## ✨ You're Done!

Once all steps are complete:

✅ **Frontend live** on Vercel  
✅ **Backend live** on Vercel  
✅ **Database** on Supabase  
✅ **Auto-deploy** on Git push  
✅ **Free SSL** included  
✅ **Global CDN** for speed  

**Your app is production-ready!** 🎉

---

**Last Updated**: July 14, 2026  
**Document Version**: 1.0  
**Platform**: Vercel + Supabase  
**Estimated Time**: 1-2 hours
