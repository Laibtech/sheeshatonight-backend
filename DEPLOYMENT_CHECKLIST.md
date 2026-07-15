# 🚀 SheeshaTonight Deployment Checklist

## Status: READY TO DEPLOY
**Last Updated**: July 14, 2026

---

## ✅ COMPLETED STEPS

### Phase 1: Local Development ✅
- [x] Backend server configured and running
- [x] Frontend server configured and running
- [x] PostgreSQL database connected
- [x] All API endpoints tested
- [x] Demo data seeded
- [x] Authentication working
- [x] Notification system implemented
- [x] Admin/Vendor/Customer dashboards complete

### Phase 2: Code Repository Setup ✅
- [x] Frontend repository created: `NOTREALTODAy/sheeshatonight-main`
- [x] Frontend code pushed to GitHub (Commit: 61659f5)
- [x] Backend Git initialized
- [x] Backend code committed locally
- [x] `.gitignore` files configured

---

## ⚠️ STEP 1: CREATE BACKEND REPOSITORY (DO THIS NOW)

### Option A: Create Repository Manually (EASIEST)

1. **Go to GitHub**: https://github.com/new
2. **Fill in details**:
   - **Owner**: NOTREALTODAy
   - **Repository name**: `sheeshatonight-backend`
   - **Description**: `SheeshaTonight Backend - Express API with Prisma/PostgreSQL`
   - **Visibility**: ✅ **Private** (recommended for production)
   - **DO NOT check**: ❌ Add a README file
   - **DO NOT check**: ❌ Add .gitignore
   - **DO NOT check**: ❌ Choose a license
3. **Click**: "Create repository"

### After Creating the Repository

Open your terminal and run:

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
git push -u origin main
```

**Expected Output**:
```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (38/38), done.
Writing objects: 100% (45/45), 123.45 KiB | 1.23 MiB/s, done.
Total 45 (delta 12), reused 0 (delta 0), pack-reused 0
To https://github.com/NOTREALTODAy/sheeshatonight-backend.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 📦 STEP 2: VERIFY GIT PUSH

### Check Frontend Repository
✅ **Already Done**: https://github.com/NOTREALTODAy/sheeshatonight-main

### Check Backend Repository
⚠️ **To Do**: https://github.com/NOTREALTODAy/sheeshatonight-backend

**After pushing, verify**:
- [ ] All backend files are visible
- [ ] `src/` folder exists
- [ ] `prisma/` folder exists
- [ ] `package.json` is present
- [ ] `.env` is NOT present (should be in .gitignore)

---

## 🗄️ STEP 3: SET UP PRODUCTION DATABASE

### Recommended: Supabase (Free PostgreSQL)

1. **Go to**: https://supabase.com
2. **Sign up** with GitHub or email
3. **Create new project**:
   - **Name**: sheeshatonight-production
   - **Database Password**: (Generate strong password and save it!)
   - **Region**: Choose closest to your users
4. **Wait** for project setup (2-3 minutes)
5. **Get Connection String**:
   - Go to: **Project Settings** → **Database** → **Connection string**
   - Select: **URI** format
   - Copy the connection string (looks like):
     ```
     postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
     ```
6. **Save this** - you'll need it in the next step

### Alternative: Neon (Also Free)
- Go to: https://neon.tech
- Follow similar steps
- Get connection string

---

## 🔑 STEP 4: GENERATE PRODUCTION SECRETS

### Generate JWT Secret

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Output will look like**:
```
a1b2c3d4e5f6...64 characters long...x9y0z1
```

**SAVE THIS** - you'll need it for both backend and frontend environment variables.

---

## 🌐 STEP 5: DEPLOY BACKEND TO HOSTINGER

### 5.1 Access Hostinger hPanel

1. **Login to**: https://hpanel.hostinger.com
2. **Go to**: Websites → Add website → Deploy Web App
3. **Select**: Import Git Repository

### 5.2 Configure Backend Deployment

**Repository Settings**:
- **Authorize GitHub**: (if first time)
- **Select Repository**: `NOTREALTODAy/sheeshatonight-backend`
- **Branch**: main
- **Framework**: Other (plain Express.js)

**Build Settings**:
- **Start Command**: `node src/server.js`
- **Root Directory**: (leave empty)
- **Node Version**: 18 or higher

### 5.3 Add Environment Variables

Click "Add Environment Variable" for each:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | (From Step 3) | Supabase/Neon connection string |
| `JWT_SECRET` | (From Step 4) | Generated secret |
| `PORT` | `5000` | Backend port |
| `NODE_ENV` | `production` | Environment |
| `FRONTEND_URL` | (Add in Step 6) | Will be your frontend URL |

### 5.4 Deploy

1. **Click**: "Deploy"
2. **Wait**: 3-5 minutes for build
3. **Check Logs**: Look for any errors
4. **Note**: Backend URL (e.g., `https://backend-abc123.hostingersite.com`)

### 5.5 Run Database Migrations

**In Hostinger Shell** (if available):
```bash
npx prisma migrate deploy
npx prisma generate
node src/utils/seed.js
```

**OR from Local Machine**:
```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
$env:DATABASE_URL="your-production-database-url"
npx prisma migrate deploy
npx prisma generate
```

---

## 🎨 STEP 6: DEPLOY FRONTEND TO HOSTINGER

### 6.1 Configure Frontend Deployment

**Repository Settings**:
- **Select Repository**: `NOTREALTODAy/sheeshatonight-main`
- **Branch**: main
- **Framework**: Next.js (should auto-detect)

**Build Settings** (usually auto-detected):
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: (leave empty)

### 6.2 Add Environment Variables

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_API_URL` | (Backend URL from Step 5.4) | Full URL with https:// |
| `JWT_SECRET` | (Same as backend) | Must match! |
| `NODE_ENV` | `production` | Environment |

### 6.3 Deploy

1. **Click**: "Deploy"
2. **Wait**: 5-10 minutes for build
3. **Check Logs**: Ensure Next.js build succeeds
4. **Note**: Frontend URL (e.g., `https://frontend-xyz456.hostingersite.com`)

### 6.4 Update Backend Environment

Go back to **Backend deployment** → Environment Variables:
- **Update** `FRONTEND_URL` to your frontend URL
- **Redeploy** backend

---

## 🌍 STEP 7: CONNECT CUSTOM DOMAIN

### 7.1 Frontend Domain (Main Site)

1. **In hPanel**: Go to your frontend app
2. **Click**: "Connect Domain"
3. **Enter**: `sheeshatonight.com` (your domain)
4. **Update DNS** if domain is external:
   - **A Record**: `@` → Hostinger IP (shown in hPanel)
   - **CNAME**: `www` → your Hostinger URL

### 7.2 Backend Subdomain (API)

1. **In hPanel**: Go to your backend app
2. **Click**: "Connect Domain"
3. **Enter**: `api.sheeshatonight.com`
4. **Update DNS**:
   - **A Record**: `api` → Hostinger IP

### 7.3 Wait for SSL

- SSL certificates are issued automatically
- Takes 10-60 minutes
- Check: Green padlock in browser

### 7.4 Update Environment Variables

**Backend**:
- Update `FRONTEND_URL` to `https://sheeshatonight.com`

**Frontend**:
- Update `NEXT_PUBLIC_API_URL` to `https://api.sheeshatonight.com`

**Redeploy both** after updating.

---

## 🔒 STEP 8: PRODUCTION HARDENING

### 8.1 Update Backend CORS

Edit `backend/src/server.js`:

```javascript
// BEFORE (Development)
app.use(cors());

// AFTER (Production)
app.use(cors({
  origin: 'https://sheeshatonight.com',
  credentials: true
}));
```

**Commit and push** this change.

### 8.2 Remove/Change Demo Credentials

**Option A**: Disable auto-seeding in production

Edit `backend/src/server.js`:
```javascript
// Comment out or remove this line in production
// await seedDatabase();
```

**Option B**: Change demo passwords

Edit `backend/src/utils/seed.js`:
- Change `admin123` to a strong password
- Change `vendor123` to a strong password
- Change `customer123` to a strong password

**Document new credentials** in a secure location (NOT in Git).

### 8.3 Security Checklist

- [ ] `.env` files NOT in Git (check both repos)
- [ ] Demo passwords changed or seeding disabled
- [ ] CORS restricted to production domain
- [ ] JWT_SECRET is strong (64+ characters)
- [ ] Database password is strong
- [ ] SSL enabled on both domains
- [ ] Rate limiting enabled (check `server.js`)
- [ ] Helmet middleware active (check `server.js`)

---

## ✅ STEP 9: VERIFICATION

### 9.1 Health Check

**Backend**:
```
https://api.sheeshatonight.com/health
```
**Expected**: `{"status": "ok"}`

**Frontend**:
```
https://sheeshatonight.com
```
**Expected**: Homepage loads

### 9.2 Test Authentication

1. Go to: `https://sheeshatonight.com/auth/login`
2. Login with admin credentials
3. Check: JWT token is set
4. Navigate to: `/admin/dashboard`
5. Verify: Data loads from backend

### 9.3 Test API Integration

Open browser console on frontend:
```javascript
fetch('https://api.sheeshatonight.com/api/products')
  .then(r => r.json())
  .then(console.log)
```

**Expected**: Array of products

### 9.4 Full Flow Test

- [ ] Homepage loads
- [ ] Product listing works
- [ ] Login works (all 3 roles)
- [ ] Admin dashboard loads
- [ ] Vendor dashboard loads
- [ ] Customer dashboard loads
- [ ] Cart functionality works
- [ ] Notifications load
- [ ] SSL padlock visible

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks

- [ ] Backend health endpoint responding
- [ ] Frontend loading properly
- [ ] SSL certificates valid
- [ ] No error logs in Hostinger

### Weekly Tasks

- [ ] Check database backups (Supabase/Neon dashboard)
- [ ] Review error logs
- [ ] Monitor performance

### Monthly Tasks

- [ ] Update dependencies (`npm outdated`)
- [ ] Review security updates
- [ ] Check disk/database usage

---

## 🆘 TROUBLESHOOTING

### "Repository not found" Error
**Solution**: Create the repository on GitHub first (Step 1)

### "Permission denied" Error
**Solution**: Clear Windows Credentials
1. Windows Search → "Credential Manager"
2. Windows Credentials → Find GitHub entry
3. Remove → Try again

### Backend Won't Build on Hostinger
**Check**:
- Node version is 18+
- Start command is correct: `node src/server.js`
- All dependencies in `package.json`
- Check build logs for specific errors

### Database Connection Fails
**Check**:
- DATABASE_URL is correct
- Database is running (Supabase/Neon dashboard)
- Firewall allows Hostinger IP
- Connection string format is correct

### Frontend Can't Reach Backend
**Check**:
- NEXT_PUBLIC_API_URL is correct (with https://)
- Backend CORS allows frontend domain
- Backend is deployed and running
- No typos in environment variables

### SSL Certificate Not Issued
**Check**:
- DNS records are correct and propagated (use https://dnschecker.org)
- Domain is verified in Hostinger
- Wait 24-48 hours for DNS propagation
- Check Hostinger SSL status

---

## 📋 QUICK REFERENCE

### Repository URLs
- **Frontend**: https://github.com/NOTREALTODAy/sheeshatonight-main
- **Backend**: https://github.com/NOTREALTODAy/sheeshatonight-backend (create this!)

### Local Development
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:5000
- **Database**: localhost:5432

### Production URLs (After Deployment)
- **Frontend**: https://sheeshatonight.com
- **Backend**: https://api.sheeshatonight.com
- **Database**: Supabase/Neon hosted

### Important Commands

**Push code updates**:
```bash
git add .
git commit -m "Your message"
git push
```

**Run migrations locally**:
```bash
cd backend
npx prisma migrate deploy
```

**Generate JWT secret**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🎯 CURRENT STATUS

### Completed ✅
- [x] Local development complete
- [x] Frontend repository created and pushed
- [x] Backend code ready and committed
- [x] All features implemented
- [x] Documentation complete

### Next Steps ⚠️
1. **Create backend repository** on GitHub
2. **Push backend code** to GitHub
3. **Set up production database** (Supabase/Neon)
4. **Deploy to Hostinger**
5. **Connect custom domain**
6. **Production hardening**
7. **Final verification**

---

## 📞 SUPPORT

### Hostinger Support
- Live Chat: hpanel.hostinger.com
- Documentation: https://support.hostinger.com

### Database Support
- **Supabase**: https://supabase.com/docs
- **Neon**: https://neon.tech/docs

### Framework Docs
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com
- **Prisma**: https://prisma.io/docs

---

## ✨ YOU'RE ALMOST THERE!

**Current Progress**: 70% Complete

**Remaining Work**:
1. Create GitHub repository (2 minutes)
2. Push code (1 minute)
3. Deploy to Hostinger (30 minutes)
4. Production hardening (30 minutes)

**Total Time to Launch**: ~1 hour

---

**Last Updated**: July 14, 2026
**Document Version**: 1.0
