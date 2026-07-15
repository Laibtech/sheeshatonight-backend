# 🚀 Deploy to Vercel - Quick Start

**Follow these steps in order. Total time: ~1 hour**

---

## ✅ STEP 1: Push Backend to GitHub (5 minutes)

### 1.1: Commit the new Vercel files

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
git add .
git commit -m "Add Vercel configuration"
```

### 1.2: Push to GitHub

If repository exists:
```bash
git push origin main
```

If repository doesn't exist yet:
1. Go to: https://github.com/new
2. Create: `sheeshatonight-backend` (private, no README)
3. Then run:
```bash
git push -u origin main
```

✅ **Verify**: https://github.com/NOTREALTODAy/sheeshatonight-backend

---

## ✅ STEP 2: Create Database (15 minutes)

### 2.1: Sign up for Supabase

1. Go to: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (easiest)

### 2.2: Create Project

1. Click **"New project"**
2. Fill in:
   - **Name**: `sheeshatonight-prod`
   - **Database Password**: Click "Generate a password" → **SAVE IT!**
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

### 2.3: Get Connection String

1. In your project, go to: **Project Settings** (gear icon, bottom left)
2. Click: **Database** (left sidebar)
3. Scroll to: **Connection string** section
4. Copy the **URI** format connection string
5. **Replace** `[YOUR-PASSWORD]` with your actual password

**Save this URL!** Example:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

---

## ✅ STEP 3: Generate JWT Secret (1 minute)

Run this command:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Copy the output** (very long string like: `a1b2c3d4...xyz`)

**Save it!** You'll need this for both frontend and backend.

---

## ✅ STEP 4: Deploy Backend to Vercel (15 minutes)

### 4.1: Sign up for Vercel

1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel

### 4.2: Import Backend Project

1. Click: **"Add New..."** → **"Project"**
2. Find and click: `sheeshatonight-backend`
3. Click: **"Import"**

### 4.3: Configure Project

**Leave these as default**:
- Framework Preset: Other
- Root Directory: `./`
- Build Command: (empty)
- Output Directory: (empty)
- Install Command: `npm install`

### 4.4: Add Environment Variables

Click **"Environment Variables"**, add these **5 variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste your Supabase connection string |
| `JWT_SECRET` | Paste your generated secret |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `http://localhost:3002` (we'll update this) |

**Make sure all 5 are added before deploying!**

### 4.5: Deploy

1. Click: **"Deploy"**
2. Wait 3-5 minutes
3. When done, you'll see: ✅ **"Congratulations!"**
4. **Copy your backend URL**, looks like:
   ```
   https://sheeshatonight-backend-xxxx.vercel.app
   ```

### 4.6: Test Backend

Open in browser: `https://your-backend-url.vercel.app/health`

**Should see**:
```json
{"status":"OK","timestamp":"..."}
```

✅ **Backend is live!**

---

## ✅ STEP 5: Run Database Migrations (5 minutes)

From your local machine:

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend

# Set the production database URL (use your Supabase URL)
$env:DATABASE_URL="postgresql://postgres.xxxx:yourpassword@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database with demo data (optional)
node src/utils/seed.js
```

**Expected output**: "Migration complete" messages

---

## ✅ STEP 6: Deploy Frontend to Vercel (15 minutes)

### 6.1: Go to Vercel Dashboard

Go to: https://vercel.com/dashboard

### 6.2: Import Frontend

1. Click: **"Add New..."** → **"Project"**
2. Find: `sheeshatonight-main`
3. Click: **"Import"**

### 6.3: Configure

**Should auto-detect**:
- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`

### 6.4: Add Environment Variables

Add these **3 variables**:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | Your backend URL from Step 4.5 |
| `JWT_SECRET` | Same JWT secret from Step 3 |
| `NODE_ENV` | `production` |

Example `NEXT_PUBLIC_API_URL`:
```
https://sheeshatonight-backend-xxxx.vercel.app
```

### 6.5: Deploy

1. Click: **"Deploy"**
2. Wait 3-5 minutes
3. **Copy your frontend URL**, looks like:
   ```
   https://sheeshatonight-main-xxxx.vercel.app
   ```

---

## ✅ STEP 7: Update Backend CORS (10 minutes)

### 7.1: Update FRONTEND_URL

1. **Vercel Dashboard** → Backend project
2. **Settings** → **Environment Variables**
3. Find `FRONTEND_URL`
4. Click **Edit** → Change to your frontend URL from Step 6.5
5. Click **Save**

### 7.2: Update Code for CORS

Edit `backend/src/server.js`:

Find this section:
```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'];
```

Replace with:
```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://127.0.0.1:3000', 
      'http://127.0.0.1:3001', 
      'http://127.0.0.1:3002',
      process.env.FRONTEND_URL,
      'https://sheeshatonight-main.vercel.app', // Add your frontend URL
      'https://sheeshatonight-main-xxxx.vercel.app' // Your actual deployment URL
    ].filter(Boolean);
```

**OR** add an environment variable:

Add to Backend on Vercel:
```
ALLOWED_ORIGINS=https://sheeshatonight-main-xxxx.vercel.app,http://localhost:3002
```

### 7.3: Commit and Push

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
git add .
git commit -m "Update CORS for Vercel frontend"
git push
```

**Vercel will auto-redeploy** (2-3 minutes)

---

## ✅ STEP 8: Test Everything (10 minutes)

### 8.1: Test Backend

Visit: `https://your-backend-url.vercel.app/health`

✅ Should see: `{"status":"OK"}`

### 8.2: Test Frontend

Visit: `https://your-frontend-url.vercel.app`

✅ Should see: Homepage loads

### 8.3: Test Login

1. Go to: `https://your-frontend-url.vercel.app/auth/login`
2. Login with:
   - **Email**: `admin@sheeshatonight.com`
   - **Password**: `admin123`
3. Should redirect to admin dashboard
4. Check: Data loads from backend

### 8.4: Open Browser Console

**Check for errors**:
- ❌ No CORS errors
- ❌ No 404 errors
- ❌ No authentication errors

If you see errors, see Troubleshooting below.

---

## 🎉 SUCCESS!

Your app is now live on:

- **Frontend**: https://your-frontend-url.vercel.app
- **Backend**: https://your-backend-url.vercel.app
- **Database**: Supabase

### What You Can Do Now:

1. **Share the link** with others
2. **Add custom domain** (optional)
3. **Change demo passwords** for security
4. **Monitor** via Vercel dashboard

---

## 🔧 Troubleshooting

### CORS Errors

**Symptom**: "CORS policy" error in console

**Fix**:
1. Check backend environment variable `ALLOWED_ORIGINS`
2. Make sure it includes your frontend URL
3. Redeploy backend

### Database Connection Fails

**Symptom**: 500 errors, "Database connection failed"

**Fix**:
1. Check `DATABASE_URL` in Vercel backend env vars
2. Verify password in connection string
3. Test connection string locally:
   ```bash
   $env:DATABASE_URL="your-url"
   npx prisma db pull
   ```

### Frontend Can't Reach Backend

**Symptom**: Network errors, API calls fail

**Fix**:
1. Check `NEXT_PUBLIC_API_URL` in frontend env vars
2. Make sure it's the full URL: `https://...vercel.app`
3. No trailing slash
4. Redeploy frontend

### Build Fails

**Frontend Build Fails**:
1. Check Vercel build logs
2. Fix TypeScript errors locally first
3. Test: `npm run build` locally
4. Push fix to GitHub

**Backend Deploy Fails**:
1. Check Vercel function logs
2. Verify `vercel.json` exists
3. Check `package.json` for scripts

---

## 📊 Monitoring

### Check Vercel Dashboard

**Frontend Project**:
- Deployments → See build status
- Analytics → See traffic
- Logs → See runtime logs

**Backend Project**:
- Deployments → See deploy status
- Functions → See API logs
- Logs → See errors

### Check Supabase Dashboard

- **Database** → See size, connections
- **Table Editor** → View data
- **API** → Test queries
- **Settings** → Backups

---

## 🔄 Making Updates

### Code Changes

```bash
# Make your changes
git add .
git commit -m "Describe your changes"
git push

# Vercel automatically:
# - Detects push
# - Builds
# - Deploys
# - Updates live site
# All in ~2 minutes!
```

### Environment Variable Changes

1. Vercel Dashboard → Project → Settings
2. Environment Variables → Edit
3. Save
4. Redeploy: Deployments → ⋯ → Redeploy

---

## 🌐 Custom Domain (Optional)

### Add Your Domain

1. **Vercel** → Frontend Project → **Settings** → **Domains**
2. Add: `sheeshatonight.com`
3. Follow DNS instructions
4. Wait for SSL (~5-10 minutes)

### Add API Subdomain

1. **Vercel** → Backend Project → **Settings** → **Domains**
2. Add: `api.sheeshatonight.com`
3. Follow DNS instructions

### Update Environment Variables

**Frontend**: Change `NEXT_PUBLIC_API_URL` to `https://api.sheeshatonight.com`

**Backend**: Update CORS to allow `https://sheeshatonight.com`

---

## ✅ Deployment Complete!

**You now have**:
- ✅ Live frontend on Vercel
- ✅ Live backend on Vercel
- ✅ PostgreSQL database on Supabase
- ✅ Auto-deploy on Git push
- ✅ Free SSL certificates
- ✅ Global CDN delivery

**Total Cost**: $0 (Free tier)

---

## 📞 Need Help?

**Review the full guide**: `VERCEL_DEPLOYMENT_GUIDE.md`

**Common Issues**: See Troubleshooting section above

**Still stuck?**: Check Vercel/Supabase docs or Discord

---

**Last Updated**: July 14, 2026  
**Estimated Time**: 1 hour  
**Difficulty**: Easy  
**Cost**: Free
