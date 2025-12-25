# Fix: Edit Magic Link Template for OTP

## The Issue
You're seeing "Error sending magic link email" because Supabase is trying to send a magic link instead of an OTP code.

## Important Discovery
**Supabase doesn't have a separate "OTP" template!**

When you use `signInWithOtp()` in your code, Supabase uses the **"Magic Link"** template. You need to edit that template to send OTP codes instead of links.

## The Fix (2 Minutes)

### Step 1: Click on "Magic link" Template
1. In Supabase Dashboard → Authentication → Email Templates
2. You'll see these templates:
   - Confirm sign up
   - Invite user
   - **Magic link** ← Click this one!
   - Change email address
   - Reset password
   - Reauthentication

### Step 2: Edit the Template
1. Click on **"Magic link"** to open it
2. Look at the email body
3. Find: `{{ .ConfirmationURL }}`
4. Replace it with: `{{ .Token }}`

### Step 3: Example Template

**Subject:**
```
Your PowerNetPro Verification Code
```

**Body:**
```
Your verification code is: {{ .Token }}

Enter this 6-digit code in the app to complete sign in.

This code expires in 10 minutes.
```

### Step 4: Save and Test
1. Click **Save**
2. Try signing in again
3. You should now receive a 6-digit OTP code (not a magic link)

## Why This Works

- `{{ .ConfirmationURL }}` = Creates a clickable link (Magic Link) ❌
- `{{ .Token }}` = Shows the 6-digit OTP code ✅

When you use `signInWithOtp()` in your code, Supabase checks the Magic Link template. If it has `{{ .Token }}`, it sends OTP. If it has `{{ .ConfirmationURL }}`, it tries to send a magic link (which causes the error).

## That's It!

Just edit the "Magic link" template to use `{{ .Token }}` and your OTP will work!

