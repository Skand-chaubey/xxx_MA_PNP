# Common Issues & Solutions

This document contains solutions to common problems encountered while developing or using the PowerNetPro mobile application.

## 🔐 Authentication Issues

### Issue: User Session Not Persisting

**Symptoms:**
- User gets logged out after closing the app
- Need to sign in again on every app restart

**Solution:**
✅ **FIXED** - Session persistence has been implemented. The app now:
- Restores Supabase session on startup
- Falls back to SecureStore if needed
- Persists user data across app restarts

**Files:**
- `src/store/authStore.ts` - Session restoration logic
- `App.tsx` - Session check on startup

---

### Issue: OTP Email Not Received / Only Confirmation Email

**Symptoms:**
- Receiving email confirmation instead of OTP code
- OTP code not in email body

**Solution:**
See [OTP Email Issues](OTP_EMAIL_ISSUES.md) for detailed troubleshooting.

**Quick Fix:**
1. Go to Supabase Dashboard → Authentication → Providers → Email
2. Turn **OFF** "Confirm email" toggle
3. Save changes
4. Try again

---

### Issue: "null value in column 'phone_number' violates not-null constraint"

**Symptoms:**
- Sign up fails with database constraint error
- Error mentions phone_number column

**Solution:**
Run this SQL in Supabase SQL Editor:
```sql
ALTER TABLE public.users ALTER COLUMN phone_number DROP NOT NULL;
```

This allows phone_number to be NULL for email/password signups.

---

## 📍 Location Issues

### Issue: Location Permission Denied

**Symptoms:**
- Marketplace can't find nearby sellers
- Location permission popup keeps appearing

**Solution:**
✅ **FIXED** - Default location (Pune) is now used as fallback:
- If permission denied → Uses Pune (18.5204, 73.8567)
- If GPS error → Falls back to Pune
- App works even without location permission

**File:**
- `src/screens/trading/MarketplaceScreen.tsx`

---

## 🗺️ Mapbox Issues

### Issue: Map View Not Showing

**Symptoms:**
- Map shows placeholder text
- "Map view requires Mapbox credentials" message

**Solution:**
Mapbox integration is not complete. To enable:

1. Get Mapbox access token from https://account.mapbox.com/
2. Add to `.env`:
   ```
   MAPBOX_ACCESS_TOKEN=your_token_here
   ```
3. Add to `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "mapboxAccessToken": "your_token_here"
       }
     }
   }
   ```
4. See [Implementation Plan](../development/IMPLEMENTATION_PLAN.md) for full steps

---

## 💰 Wallet Issues

### Issue: Withdraw Button Not Working

**Symptoms:**
- Withdraw button does nothing
- No screen appears

**Solution:**
✅ **FIXED** - Withdraw screen has been created:
- Navigate to Wallet → Withdraw
- Fill bank details
- Submit withdrawal request

**File:**
- `src/screens/wallet/WithdrawScreen.tsx`

---

## 🔧 Build & Runtime Issues

### Issue: Worklets Version Mismatch

**Symptoms:**
- Error: "Mismatch between JavaScript part and native part of Worklets"
- App crashes on startup

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Clear Expo cache: `npx expo start --clear`
3. Reinstall: `npm install`
4. Rebuild native code if needed

---

### Issue: TypeScript Errors

**Symptoms:**
- Type errors in IDE
- Build fails with TypeScript errors

**Solution:**
1. Run type check: `npm run type-check`
2. Fix reported errors
3. Ensure all imports are correct
4. Check `tsconfig.json` settings

---

## 📱 Development Issues

### Issue: App Not Starting

**Symptoms:**
- Expo server starts but app doesn't load
- Blank screen or error

**Solution:**
1. Clear cache: `npx expo start --clear`
2. Check environment variables in `.env`
3. Verify Supabase credentials
4. Check console for errors
5. Try on different device/emulator

---

### Issue: Hot Reload Not Working

**Symptoms:**
- Changes not reflecting
- Need to restart app manually

**Solution:**
1. Enable Fast Refresh in Expo settings
2. Check for syntax errors (prevents hot reload)
3. Restart Metro bundler: `npm start -- --reset-cache`
4. Reload app: Press `r` in terminal or shake device

---

## 🔌 API Issues

### Issue: API Calls Failing

**Symptoms:**
- Network errors
- 401/403 errors
- Data not loading

**Solution:**
1. Check `API_BASE_URL` in `.env`
2. Verify authentication token
3. Check network connectivity
4. Verify backend server is running
5. Check API endpoint URLs

---

## 📊 Data Issues

### Issue: Energy Data Not Showing

**Symptoms:**
- Dashboard shows zero values
- Charts are empty

**Solution:**
1. Check meter registration status
2. Verify energy data API endpoint
3. Check if mock data is enabled
4. See [Implementation Plan](../development/IMPLEMENTATION_PLAN.md) for mock data setup

---

## 🎨 UI Issues

### Issue: Icons Not Showing

**Symptoms:**
- Icons appear as boxes or missing
- Emoji icons instead of vector icons

**Solution:**
✅ **FIXED** - All icons upgraded to premium vector icons:
- Using `@expo/vector-icons`
- MaterialCommunityIcons and Ionicons
- No emoji icons remaining

**Files:**
- All screen files updated with premium icons

---

## 📝 Still Having Issues?

1. Check this document first
2. Check [OTP Email Issues](OTP_EMAIL_ISSUES.md) for auth problems
3. Check [Implementation Status](../development/IMPLEMENTATION_STATUS.md) for feature status
4. Check [Recent Fixes](../development/RECENT_FIXES.md) for latest changes
5. Contact development team

---

## 🔄 Document Updates

- **Last Updated**: December 2024
- **Maintained By**: Development Team
- **Update Frequency**: As issues are resolved

