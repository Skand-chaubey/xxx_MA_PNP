# Delete All Users from Supabase

## ⚠️ WARNING
**These commands will permanently delete ALL users from your database. This action cannot be undone!**

## Steps to Delete All Users

### Option 1: Using Supabase SQL Editor (Recommended)

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `ncejoqiddhaxuetjhjrs`

2. **Open SQL Editor:**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Run the SQL commands:**
   ```sql
   -- First, delete from your application's users table
   DELETE FROM public.users;
   
   -- Then, delete from Supabase Auth
   DELETE FROM auth.users;
   ```

4. **Click "Run"** to execute the commands

### Option 2: Delete via Supabase Dashboard

1. **Delete from Application Table:**
   - Go to **Table Editor** → **users** table
   - Select all rows (or use the checkbox)
   - Click **Delete** button

2. **Delete from Auth:**
   - Go to **Authentication** → **Users**
   - Select all users
   - Click **Delete** button

## SQL Commands

### Quick Delete (All Users)
```sql
-- Delete from application users table
DELETE FROM public.users;

-- Delete from auth users
DELETE FROM auth.users;
```

### Check Before Deleting
```sql
-- Count users in application table
SELECT COUNT(*) as app_users FROM public.users;

-- Count users in auth table
SELECT COUNT(*) as auth_users FROM auth.users;

-- List all users
SELECT id, email, created_at FROM public.users;
SELECT id, email, created_at FROM auth.users;
```

### Delete with Related Data (If you have foreign keys)
```sql
-- If you have foreign key constraints, delete related data first
-- Example: If you have transactions, orders, etc. linked to users

-- Delete related data first (adjust table names as needed)
DELETE FROM public.transactions WHERE user_id IN (SELECT id FROM public.users);
DELETE FROM public.orders WHERE user_id IN (SELECT id FROM public.users);
-- ... add other related tables

-- Then delete users
DELETE FROM public.users;
DELETE FROM auth.users;
```

### Reset Auto-increment (If using auto-increment IDs)
```sql
-- After deleting, reset the sequence (if needed)
-- This is usually not needed for UUID-based IDs
ALTER SEQUENCE public.users_id_seq RESTART WITH 1;
```

## Alternative: Truncate (Faster, but more dangerous)
```sql
-- TrUNCATE is faster but cannot be rolled back
-- Use with extreme caution!

TRUNCATE TABLE public.users CASCADE;
-- Note: auth.users cannot be truncated directly
DELETE FROM auth.users;
```

## Safety Checklist

Before running delete commands:

- [ ] **Backup your database** (if you might need the data later)
- [ ] **Verify you're in the correct project** (check project name)
- [ ] **Check user count** (run SELECT COUNT(*) first)
- [ ] **Review related tables** (check if other tables reference users)
- [ ] **Test in development first** (if you have a dev environment)

## After Deletion

1. **Verify deletion:**
   ```sql
   SELECT COUNT(*) FROM public.users;  -- Should return 0
   SELECT COUNT(*) FROM auth.users;    -- Should return 0
   ```

2. **Test your app:**
   - Try signing up a new user
   - Verify the user appears in both tables

## Project-Specific Command

For your project (`ncejoqiddhaxuetjhjrs`), run this in SQL Editor:

```sql
-- Delete all users
DELETE FROM public.users;
DELETE FROM auth.users;
```

## Need Help?

If you encounter errors:
- **Foreign key constraint errors:** Delete related data first
- **Permission errors:** Make sure you're using the SQL Editor (has admin access)
- **"Cannot delete from auth.users":** Use Supabase Dashboard → Authentication → Users to delete manually

