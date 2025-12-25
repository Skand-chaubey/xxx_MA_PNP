# Force Manifest Update - Complete Solution

## ⚠️ Problem

Expo manifest still shows old URL even after:
- ✅ `app.json` is updated
- ✅ Cache cleared
- ✅ Expo restarted

**This is likely Expo Go device cache!**

---

## ✅ Complete Fix

### Step 1: Clear Device Cache in Expo Go

**On your device:**
1. Open **Expo Go** app
2. Go to **Profile** tab (bottom right)
3. Scroll down to **Settings**
4. Tap **Clear Cache** or **Clear All Data**
5. Close Expo Go completely

### Step 2: Clear All Local Caches

**On your computer:**

```powershell
# Stop all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Delete all caches
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Clear Metro bundler cache
Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\react-* -ErrorAction SilentlyContinue
```

### Step 3: Verify app.json

Make sure line 56 has:
```json
"apiBaseUrl": "https://xxxmapnp-production.up.railway.app"
```

### Step 4: Restart Everything

```powershell
# Start Expo fresh
npm start -- --clear

# Or force tunnel mode (sometimes helps)
npx expo start --clear --tunnel
```

### Step 5: Reconnect Device

1. **Close Expo Go completely** on device
2. **Reopen Expo Go**
3. **Scan QR code again** (don't use saved connection)
4. **Wait for full reload**

---

## 🔍 Alternative: Check Runtime URL

Add this to verify what URL is actually being used:

**In `src/services/api/client.ts`, add at the top:**

```typescript
import Constants from 'expo-constants';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || 
  process.env.API_BASE_URL || 
  'https://api.powernetpro.com';

// Add this to debug
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('📋 Config:', Constants.expoConfig?.extra);
```

**Then check console logs** when app runs. This will show what URL is actually being used.

---

## 💡 Why This Happens

1. **Expo Go caches manifest** on device
2. **Metro bundler caches** on computer
3. **Expo CDN caches** manifest
4. **Device browser cache** (if using web)

---

## ✅ Verify Fix

After all steps:

1. **Check manifest** - Should show Railway URL
2. **Check console logs** - Should show Railway URL
3. **Test API call** - Should go to Railway backend
4. **Check Railway logs** - Should see requests coming in

---

## 🚀 Nuclear Option

If nothing works:

1. **Uninstall Expo Go** from device
2. **Reinstall Expo Go**
3. **Clear all caches** (Step 2 above)
4. **Restart Expo** with `--clear`
5. **Scan QR code fresh**

---

## 📝 Quick Checklist

- [ ] Cleared Expo Go cache on device
- [ ] Cleared .expo folder
- [ ] Cleared node_modules cache
- [ ] Verified app.json has Railway URL
- [ ] Restarted Expo with --clear
- [ ] Reconnected device (fresh scan)
- [ ] Checked console logs for actual URL

---

**Try clearing Expo Go cache on device first - that's usually the culprit!**

