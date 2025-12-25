# Fix: "null value in column phone_number violates not-null constraint"

## The Problem
When signing up, you're getting this error:
```
null value in column "phone_number" of relation "users" violates not-null constraint
```

This happens because the `phone_number` column in your `users` table is set to `NOT NULL`, but the signup form doesn't require a phone number.

## Solution: Make phone_number Nullable

### Option 1: Fix via SQL (Recommended)

1. **Go to Supabase SQL Editor:**
   - Visit: https://supabase.com/dashboard
   - Select project: `ncejoqiddhaxuetjhjrs`
   - Click **SQL Editor** → **New query**

2. **Run this SQL command:**
   ```sql
   ALTER TABLE public.users 
   ALTER COLUMN phone_number DROP NOT NULL;
   ```

3. **Verify the change:**
   ```sql
   SELECT 
       column_name, 
       is_nullable, 
       data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users' 
   AND column_name = 'phone_number';
   ```
   - `is_nullable` should show `YES`

### Option 2: Fix via Supabase Dashboard

1. **Go to Table Editor:**
   - Click **Table Editor** → **users** table

2. **Edit the phone_number column:**
   - Find `phone_number` column
   - Click the settings/gear icon
   - Uncheck **"Is Nullable"** or set it to allow NULL
   - Save changes

### Option 3: Update Code (Already Done)

The code has been updated to explicitly set `phone_number: null` when creating users. However, if the database column is still NOT NULL, you'll still get the error.

## Why This Happened

The database schema likely has `phone_number` as a required field, but:
- The signup form doesn't collect phone numbers
- Phone numbers should be optional (can be added later)
- The TypeScript type already has `phoneNumber?: string` (optional)

## After Fixing

1. **Test signup again:**
   - Try creating a new account
   - It should work without requiring a phone number

2. **Users can add phone number later:**
   - In profile settings
   - During KYC verification
   - Or any other time

## Code Changes Made

The `getOrCreateUserProfile` method now explicitly sets:
```typescript
phone_number: null, // Set to null if not provided
```

But you still need to make the database column nullable using the SQL command above.

## Quick Fix Command

Run this in Supabase SQL Editor:
```sql
ALTER TABLE public.users ALTER COLUMN phone_number DROP NOT NULL;
```

That's it! After running this, signup should work without phone numbers.

