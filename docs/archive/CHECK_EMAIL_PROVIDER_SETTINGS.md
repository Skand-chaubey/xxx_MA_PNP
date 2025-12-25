# Check Email Provider Settings - Critical for OTP

## The Problem
Even with the template fixed, if "Confirm email" is ON, Supabase will still try to send confirmation emails instead of OTP.

## Step-by-Step Check

### Step 1: Go to Email Provider Settings
1. In Supabase Dashboard
2. Go to **Authentication** → **Providers**
3. Click on **"Email"** (not "Email Templates", but "Providers" → "Email")

### Step 2: Check These Settings

**Look for these toggles/switches:**

1. **"Enable Email provider"**
   - Should be: ✅ **ON**

2. **"Confirm email"** ← **THIS IS THE KEY ONE!**
   - Should be: ❌ **OFF** (for OTP to work)
   - If this is ON, Supabase sends confirmation emails instead of OTP
   - **Turn this OFF and click Save**

3. **"Secure email change"**
   - Can be: ✅ ON or ❌ OFF (doesn't affect OTP)

### Step 3: After Changing Settings
1. Click **Save** (if you changed anything)
2. Wait 1-2 minutes for changes to propagate
3. Try signing in again

## Why This Matters

When "Confirm email" is ON:
- Supabase requires users to click a confirmation link first
- It uses the "Confirm sign up" template (not Magic Link template)
- OTP won't work because Supabase thinks the email needs confirmation

When "Confirm email" is OFF:
- Supabase allows direct OTP authentication
- It uses the "Magic Link" template (which you've configured with `{{ .Token }}`)
- OTP will work correctly

## Visual Guide

In the Email provider settings page, you should see something like:

```
┌─────────────────────────────────────┐
│ Email Provider Settings             │
├─────────────────────────────────────┤
│ Enable Email provider    [ON]  ✅   │
│ Confirm email            [OFF] ❌   │ ← This must be OFF!
│ Secure email change      [ON]  ✅   │
└─────────────────────────────────────┘
```

## Still Not Working?

If "Confirm email" is already OFF and you're still getting the error:

1. **Double-check the template:**
   - Go to Authentication → Email Templates → Magic link
   - Verify it has `{{ .Token }}` (not `{{ .ConfirmationURL }}`)
   - Make sure you clicked "Save changes"

2. **Check Auth Settings:**
   - Go to Settings → Auth
   - "Enable email confirmations" should be OFF

3. **Check Supabase Logs:**
   - Go to Logs → Auth Logs
   - Look for the exact error message

4. **Wait a few minutes:**
   - Supabase may cache settings
   - Try again after 2-3 minutes

