# Quick Fix: "Error sending magic link email"

## The Problem
Supabase is trying to send a magic link instead of an OTP code because your email template is wrong.

## The Fix (2 Minutes)

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select project: `ncejoqiddhaxuetjhjrs`
3. Go to: **Authentication** → **Email Templates**

### Step 2: Edit Magic Link Template (This is used for OTP!)
**IMPORTANT:** Supabase uses the "Magic Link" template for OTP emails. There is no separate "OTP" template.

1. Click on **"Magic link"** template (from the Authentication section)
2. In the email body, **replace** `{{ .ConfirmationURL }}` with `{{ .Token }}`
3. Make sure your template has:
   ```
   {{ .Token }}
   ```
4. **Remove** if you see:
   ```
   {{ .ConfirmationURL }}
   ```

### Step 3: Example Template

**Subject:** `Your PowerNetPro Verification Code`

**Body:**
```
Your verification code is: {{ .Token }}

Enter this 6-digit code in the app.
```

### Step 4: Save and Test
1. Click **Save**
2. Try signing in again
3. You should now receive OTP code (not magic link)

## That's It!

The error happens because:
- `{{ .ConfirmationURL }}` = Magic Link ❌
- `{{ .Token }}` = OTP Code ✅

Just change your template to use `{{ .Token }}` and the error will be fixed!

