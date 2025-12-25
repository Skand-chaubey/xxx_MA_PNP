# Fix: "Error sending magic link email" - Configure OTP Template

## Problem
You're getting the error: **"Error sending magic link email"**

This means Supabase is trying to send a magic link instead of an OTP code because your email template is configured incorrectly.

## Root Cause
Supabase determines whether to send OTP or magic link based on the **email template variables**:
- `{{ .ConfirmationURL }}` = Magic Link (causes the error)
- `{{ .Token }}` = OTP Code (what we need)

## Solution: Fix Email Template in Supabase

### Step 1: Access Email Templates

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ncejoqiddhaxuetjhjrs`
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Magic Link Template for OTP

**IMPORTANT:** Supabase doesn't have a separate "OTP" template. When using `signInWithOtp`, it uses the **"Magic Link"** template. You need to edit the Magic Link template to send OTP codes.

1. Click on **"Magic link"** template (from the list you see)
2. Click to edit it
3. **CRITICAL:** Replace `{{ .ConfirmationURL }}` with `{{ .Token }}`
   - The template body MUST include:
     ```
     {{ .Token }}
     ```
   - Remove or replace:
     ```
     {{ .ConfirmationURL }}
     ```

### Step 3: Example OTP Template

**Subject:**
```
Your PowerNetPro Verification Code
```

**Body (HTML or Text):**
```
<h2>Your Verification Code</h2>
<p>Your PowerNetPro verification code is:</p>
<h1 style="font-size: 32px; letter-spacing: 4px;">{{ .Token }}</h1>
<p>This code will expire in 10 minutes.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

**Key Points:**
- ✅ Use `{{ .Token }}` to display the OTP code
- ❌ Do NOT use `{{ .ConfirmationURL }}` (this creates magic links)
- ✅ The token will be a 6-digit code

### Step 4: Verify Magic Link Template

1. The **"Magic Link"** template is what Supabase uses for OTP
2. Make sure it uses `{{ .Token }}` (not `{{ .ConfirmationURL }}`)
3. You don't need to disable it - just configure it correctly for OTP

### Step 5: Verify Settings

1. Go to **Authentication** → **Providers** → **Email**
2. Ensure:
   - ✅ **Enable Email provider:** ON
   - ❌ **Confirm email:** OFF (for direct OTP)
   - ✅ **Secure email change:** ON

### Step 6: Test

After updating the template:
1. Save the template
2. Try signing in again
3. You should receive an email with a 6-digit code (not a link)

## Quick Template Fix

**Copy this exact template:**

**Subject:**
```
PowerNetPro Verification Code
```

**Body:**
```
Your verification code is: {{ .Token }}

Enter this code in the app to complete sign in.

This code expires in 10 minutes.
```

## Verification Checklist

- [ ] Email template uses `{{ .Token }}`
- [ ] Email template does NOT use `{{ .ConfirmationURL }}`
- [ ] "Confirm email" is OFF in Email provider settings
- [ ] OTP template is active/enabled
- [ ] Template is saved

## Still Getting Magic Link Error?

1. **Check Template Variables:**
   - Open the OTP template
   - Search for `ConfirmationURL`
   - Remove it if found
   - Add `{{ .Token }}` if missing

2. **Check Template Type:**
   - Ensure you're editing the "OTP" template
   - Not the "Magic Link" template

3. **Clear Cache:**
   - Supabase may cache templates
   - Wait a few minutes after saving
   - Try again

4. **Check Logs:**
   - Go to **Logs** → **Auth Logs**
   - See what template is being used

## Code Update

The code has been updated to:
- ✅ Detect magic link errors
- ✅ Provide helpful error messages
- ✅ Guide you to fix the template

After fixing the template in Supabase Dashboard, the error should be resolved!

