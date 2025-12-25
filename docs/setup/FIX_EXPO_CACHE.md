# Fix Expo Cache - Update Backend URL

## ⚠️ Issue

The Expo manifest is still showing the old Supabase URL instead of your Railway backend URL.

**Current (Wrong):**
```json
"apiBaseUrl": "https://ncejoqiddhaxuetjhjrs.supabase.co/rest/v1"
```

**Should be:**
```json
"apiBaseUrl": "https://xxxmapnp-production.up.railway.app"
```

---

## ✅ Solution: Clear Expo Cache

### Step 1: Stop Expo

Press `Ctrl+C` in the terminal where Expo is running.

### Step 2: Clear Cache and Restart

```bash
npm start -- --clear
```

Or if that doesn't work:

```bash
npx expo start --clear
```

### Step 3: Alternative - Full Clean

If the above doesn't work:

```bash
# Clear Expo cache
npx expo start -c

# Or delete cache manually
rm -rf .expo
rm -rf node_modules/.cache
npm start -- --clear
```

---

## 🔍 Verify the Fix

After restarting, check the manifest again. The `apiBaseUrl` should now show:

```json
"apiBaseUrl": "https://xxxmapnp-production.up.railway.app"
```

---

## 📝 Important Notes

1. **Port 8081** is the Expo dev server (for development)
2. **Port 3000** (or Railway's port) is your backend API
3. The `apiBaseUrl` should point to your Railway backend, not Expo

---

## ✅ After Fixing

1. Restart Expo with `--clear`
2. Reload the app
3. Test API calls (place order, withdraw, etc.)
4. Check that requests go to Railway backend

---

**If still not working:** Try deleting `.expo` folder and restarting.

