# Troubleshoot: "Error sending magic link email" Still Appearing

## If you're still getting this error after updating the template:

### Step 1: Verify Template Was Saved
1. Go back to **Authentication** → **Email Templates** → **Magic link**
2. Make sure you clicked **"Save changes"** (green button)
3. Verify the template body shows `{{ .Token }}` (not `{{ .ConfirmationURL }}`)
4. Check the Preview tab to see how it looks

### Step 2: Check Email Provider Settings (CRITICAL!)
1. Go to **Authentication** → **Providers** → **Email**
2. **VERIFY these settings:**
   - ✅ **Enable Email provider:** ON
   - ❌ **"Confirm email":** MUST be **OFF** (this is critical!)
   - ✅ **Secure email change:** ON (optional)
3. If "Confirm email" is ON, Supabase will send confirmation emails instead of OTP
4. Click **Save** if you made changes

### Step 3: Check Auth Settings
1. Go to **Settings** → **Auth** (or **Authentication** → **Settings**)
2. Verify:
   - ✅ **Enable email signups:** ON
   - ❌ **Enable email confirmations:** OFF (for OTP flow)
   - ✅ **Enable email change confirmations:** ON (optional)

### Step 4: Check SMTP Settings
1. Go to **Authentication** → **Email Templates** → **SMTP Settings** tab
2. If using custom SMTP, verify all settings are correct
3. **Try switching to Supabase's built-in SMTP** temporarily to test
4. Some SMTP providers cause issues with OTP emails

### Step 5: Clear Cache and Wait
1. Supabase may cache templates for a few minutes
2. Wait 2-3 minutes after saving the template
3. Try again

### Step 6: Check Supabase Logs
1. Go to **Logs** → **Auth Logs**
2. Look for the `signInWithOtp` request
3. Check for any error messages
4. Look for clues about what's failing

### Step 7: Verify Code Update
The code has been updated to explicitly set `emailRedirectTo: undefined`. Make sure you have the latest code:
- `src/services/supabase/authService.ts` should have `emailRedirectTo: undefined` in the options

### Step 8: Test with Different Email
1. Try with a different email address
2. Some email providers may block or delay emails
3. Check spam folder

### Step 9: Alternative: Use Resend API Directly
If Supabase continues to have issues, you could:
1. Use Resend API directly to send OTP emails
2. Store OTP codes in your database
3. Verify OTP manually

## Most Common Causes:

1. **"Confirm email" is ON** → Turn it OFF
2. **Template not saved** → Click Save changes
3. **SMTP configuration issue** → Check SMTP settings
4. **Template caching** → Wait a few minutes

## Still Not Working?

1. **Check Supabase Status:** https://status.supabase.com
2. **Check your email provider:** Some providers block automated emails
3. **Try Supabase Support:** Contact Supabase support with your project ID
4. **Check project limits:** Free tier has email sending limits

## Quick Checklist:

- [ ] Magic Link template uses `{{ .Token }}` (not `{{ .ConfirmationURL }}`)
- [ ] Template is saved
- [ ] "Confirm email" is OFF in Email provider settings
- [ ] "Enable email confirmations" is OFF in Auth settings
- [ ] SMTP settings are correct
- [ ] Waited 2-3 minutes after saving
- [ ] Checked Supabase logs for errors
- [ ] Code has `emailRedirectTo: undefined` in options

