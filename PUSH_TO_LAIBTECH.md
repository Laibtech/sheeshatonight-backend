# 🚀 Push to Laibtech Account - Step by Step

**You need to clear Windows credentials and use Laibtech credentials**

---

## 🔑 STEP 1: Clear Saved GitHub Credentials

### Method A: Using Credential Manager (Easiest)

1. Press **Windows key**
2. Type: **Credential Manager**
3. Click: **Credential Manager** app
4. Click: **Windows Credentials**
5. Find any entries for **git:https://github.com**
6. Click on each → **Remove**
7. Close Credential Manager

### Method B: Using Git Command

```bash
git credential-manager-core erase
host=github.com
protocol=https

```
*(Press Enter twice after typing the last line)*

---

## 🔑 STEP 2: Create Backend Repository

1. Go to: **https://github.com/new**
2. Make sure **Owner** is: **Laibtech** (not NOTREALTODAy)
3. **Repository name**: `sheeshatonight-backend`
4. **Description**: `SheeshaTonight Backend - Express API`
5. **Private**: ✅ Yes
6. **DO NOT** check: Add README, .gitignore, or license
7. Click: **"Create repository"**

---

## 📦 STEP 3: Push Frontend

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\sheeshatonight-main
git remote set-url origin https://github.com/Laibtech/sheeshatonight-main.git
git push -u origin main
```

**When prompted**:
- **Username**: `Laibtech`
- **Password**: Your **Personal Access Token** for Laibtech account

### Don't Have a Token?

1. Go to: **https://github.com/settings/tokens**
2. Make sure you're logged in as **Laibtech**
3. Click: **"Generate new token (classic)"**
4. Name: `SheeshaTonight Deploy`
5. Check: ✅ **repo** (full access)
6. Click: **"Generate token"**
7. **COPY THE TOKEN** (you can't see it again!)
8. Use this token as the password

---

## 📦 STEP 4: Push Backend

```bash
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
git remote set-url origin https://github.com/Laibtech/sheeshatonight-backend.git
git push -u origin main
```

**When prompted**:
- **Username**: `Laibtech`
- **Password**: Same token from above

---

## ✅ STEP 5: Verify

### Check Frontend
Go to: **https://github.com/Laibtech/sheeshatonight-main**

Should see all your frontend files.

### Check Backend
Go to: **https://github.com/Laibtech/sheeshatonight-backend**

Should see all your backend files.

---

## 🚀 STEP 6: Deploy to Vercel

Once both repositories are pushed:

1. Open: **DEPLOY_TO_VERCEL_NOW.md**
2. Follow the 8 steps
3. When importing from GitHub, select repositories from **Laibtech** account
4. Deploy!

---

## ⚠️ Troubleshooting

### "Permission denied" Error

**Cause**: Git is using wrong credentials

**Fix**:
1. Clear credentials (Step 1)
2. Try push again
3. Enter Laibtech username and token when prompted

### "Repository not found" Error

**Cause**: Repository doesn't exist

**Fix**:
1. Go to: https://github.com/Laibtech
2. Check if repository exists
3. If not, create it (Step 2)

### "Invalid username or password" Error

**Cause**: Wrong credentials or expired token

**Fix**:
1. Generate new Personal Access Token
2. Make sure it has `repo` scope
3. Use token (not your GitHub password) when pushing

---

## 📋 Quick Commands Summary

```bash
# Clear credentials (if needed)
# Use Credential Manager GUI (easier)

# Push Frontend
cd c:\Users\Abc\Downloads\sheeshatonight-main\sheeshatonight-main
git remote set-url origin https://github.com/Laibtech/sheeshatonight-main.git
git push -u origin main

# Push Backend
cd c:\Users\Abc\Downloads\sheeshatonight-main\backend
git remote set-url origin https://github.com/Laibtech/sheeshatonight-backend.git
git push -u origin main
```

---

## 🎯 After Pushing

Both repositories will be at:
- **Frontend**: https://github.com/Laibtech/sheeshatonight-main
- **Backend**: https://github.com/Laibtech/sheeshatonight-backend

Then follow: **DEPLOY_TO_VERCEL_NOW.md** for deployment.

---

**Last Updated**: July 14, 2026  
**Account**: Laibtech  
**Next**: Deploy to Vercel
