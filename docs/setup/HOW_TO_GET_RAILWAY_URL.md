# How to Get Your Railway URL

## 🎯 Quick Steps

### Step 1: Go to Your Service
1. In Railway dashboard, click on your project **"xxx_MA_PNP"**
2. You should see your service listed

### Step 2: Find the URL
The Railway URL is displayed in **two places**:

#### Option A: Service Settings (Easiest)
1. Click on your service (the card showing "xxx_MA_PNP")
2. Go to the **"Settings"** tab
3. Scroll down to **"Networking"** section
4. You'll see **"Public Domain"** - this is your URL!
5. It will look like: `https://xxx-ma-pnp-production.up.railway.app`

#### Option B: Service Overview
1. Click on your service
2. In the main overview page, look for:
   - **"Public Domain"** section, OR
   - **"Generate Domain"** button (if not generated yet)
3. Click **"Generate Domain"** if you see it
4. Your URL will appear below

---

## 📋 Step-by-Step with Screenshots Guide

### Method 1: From Service Settings

1. **Click on your service** (the "xxx_MA_PNP" card in the center)

2. **Click "Settings" tab** (top navigation)

3. **Scroll to "Networking" section**

4. **Find "Public Domain"**
   - You'll see something like:
     ```
     Public Domain
     https://xxx-ma-pnp-production.up.railway.app
     ```

5. **Copy the URL** - This is your backend API URL!

---

### Method 2: Generate Domain (If Not Generated)

If you don't see a domain yet:

1. **Click on your service**

2. **Go to "Settings" tab**

3. **Scroll to "Networking"**

4. **Click "Generate Domain"** button

5. **Wait a few seconds** - Railway will generate a domain

6. **Copy the generated URL**

---

## 🔗 What Your URL Looks Like

Railway URLs follow this pattern:
```
https://[service-name]-[environment].up.railway.app
```

Examples:
- `https://xxx-ma-pnp-production.up.railway.app`
- `https://powernetpro-backend-production.up.railway.app`
- `https://backend-abc123.up.railway.app`

---

## ✅ After Getting Your URL

### 1. Test It

Open in browser or use curl:
```bash
curl https://your-railway-url.up.railway.app/health
```

Should return:
```json
{
  "success": true,
  "message": "PowerNetPro Backend API is running"
}
```

### 2. Update Mobile App

Update `app.json` line 56:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-railway-url.up.railway.app"
    }
  }
}
```

### 3. Restart Expo

```bash
npm start -- --clear
```

---

## 🎯 Quick Reference

**Where to find:**
- ✅ Service → Settings → Networking → Public Domain
- ✅ Service Overview → Public Domain section

**What it looks like:**
- `https://xxx-ma-pnp-production.up.railway.app`

**If not visible:**
- Click "Generate Domain" button
- Wait a few seconds
- URL will appear

---

## 💡 Pro Tips

1. **Custom Domain (Optional):**
   - You can add a custom domain in Settings → Networking
   - But the Railway domain works perfectly fine!

2. **Multiple Environments:**
   - Each environment (production, staging) gets its own URL
   - Make sure you're using the correct one

3. **HTTPS:**
   - Railway automatically provides HTTPS
   - No configuration needed!

---

**Need Help?** If you can't find the URL, check Railway's documentation or support.

