@echo off
echo ============================================
echo SheeshaTonight - Database Setup
echo ============================================
echo.
echo STEP 1: Get your Supabase connection string
echo.
echo 1. Go to Supabase Dashboard
echo 2. Click: Project Settings (gear icon)
echo 3. Click: Database
echo 4. Copy: Connection string (URI format)
echo 5. Replace [YOUR-PASSWORD] with your actual password
echo.
echo Example:
echo postgresql://postgres.xxxxx:yourpassword@aws-0-us-east-1.pooler.supabase.com:5432/postgres
echo.
echo ============================================
echo.
set /p DATABASE_URL="Paste your Supabase connection string here: "
echo.
echo ============================================
echo STEP 2: Running database migrations...
echo ============================================
echo.

set DATABASE_URL=%DATABASE_URL%
npx prisma migrate deploy

echo.
echo ============================================
echo STEP 3: Generating Prisma Client...
echo ============================================
echo.

npx prisma generate

echo.
echo ============================================
echo STEP 4: Seeding demo data...
echo ============================================
echo.

node src/utils/seed.js

echo.
echo ============================================
echo Database setup complete!
echo ============================================
echo.
echo Next: Deploy your backend to Vercel
echo.
pause
