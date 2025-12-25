# Backend Quick Start - Option 2

## ✅ Backend Created!

I've created a complete Node.js backend for you in the `backend/` folder.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create .env File

Create a file named `.env` in the `backend/` folder:

```env
PORT=3000
NODE_ENV=development

# Supabase (already have these)
SUPABASE_URL=https://ncejoqiddhaxuetjhjrs.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZWpvcWlkZGhheHVldGpoanJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjA3ODQsImV4cCI6MjA4MTk5Njc4NH0.w9tsVgdxzb52_n58XUJ8i76u6Rm0cY_Pw_Q-vEc9T7I

# Razorpay (get from https://razorpay.com → Settings → API Keys)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```

**Note:** For now, you can leave Razorpay keys empty if you don't have them yet.

### Step 3: Test Locally

```bash
npm run dev
```

You should see:
```
🚀 PowerNetPro Backend API running on port 3000
📍 Health check: http://localhost:3000/health
```

Test it in browser: http://localhost:3000/health

---

## 🚢 Deploy to Railway (10 minutes)

### Step 1: Sign Up
- Go to https://railway.app
- Sign up with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect the `backend/` folder

### Step 3: Add Environment Variables
In Railway dashboard → Variables tab, add:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `RAZORPAY_KEY_ID` (optional for now)
- `RAZORPAY_KEY_SECRET` (optional for now)
- `NODE_ENV=production`

### Step 4: Get Your URL
Railway will give you a URL like:
```
https://powernetpro-backend-production.up.railway.app
```

### Step 5: Update Mobile App

Update `app.json` line 56:
```json
"apiBaseUrl": "https://your-railway-url.railway.app"
```

---

## ✅ What's Included

### API Endpoints:
- ✅ `GET /health` - Health check
- ✅ `POST /trading/search` - Search sellers
- ✅ `POST /trading/orders` - Create order
- ✅ `GET /trading/orders/:id/status` - Order status
- ✅ `GET /trading/orders/active` - Active orders
- ✅ `POST /trading/orders/:id/cancel` - Cancel order
- ✅ `POST /wallet/top-up` - Wallet top-up
- ✅ `POST /wallet/withdraw` - Withdrawal request
- ✅ `GET /wallet/withdraw/:id/status` - Withdrawal status
- ✅ `POST /payments/initiate` - Initiate payment
- ✅ `POST /payments/verify` - Verify payment
- ✅ `POST /kyc/documents` - Submit KYC
- ✅ `GET /kyc/status` - KYC status

### Features:
- ✅ Authentication with Supabase
- ✅ CORS enabled
- ✅ Error handling
- ✅ TypeScript
- ✅ Razorpay integration (when keys added)

---

## 📝 Next Steps

1. **Test locally:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Deploy to Railway:**
   - Follow steps above
   - Get your URL

3. **Update mobile app:**
   - Update `app.json` with backend URL
   - Restart Expo

4. **Get Razorpay keys** (when ready):
   - Sign up at https://razorpay.com
   - Get API keys
   - Add to `.env` and Railway variables

---

## 🎉 You're Done!

Your backend is ready! See `CUSTOM_BACKEND_SETUP.md` for detailed instructions.

