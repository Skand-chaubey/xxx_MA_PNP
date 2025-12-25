-- ⚠️ WARNING: These commands will DELETE ALL USERS from your Supabase database
-- Make sure you have a backup before running these commands
-- Run these in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Step 1: Delete all users from your application's users table (public.users)
-- This removes user profiles and related data
DELETE FROM public.users;

-- Step 2: Delete all users from Supabase Auth (auth.users)
-- This removes authentication records
-- Note: This requires admin privileges and may need to be run from Supabase Dashboard
DELETE FROM auth.users;

-- Alternative: If you want to keep the structure but just clear data, you can use:
-- TRUNCATE TABLE public.users CASCADE;
-- TRUNCATE TABLE auth.users CASCADE;

-- ⚠️ IMPORTANT NOTES:
-- 1. This will delete ALL users - there's no undo!
-- 2. Make sure you're connected to the correct project
-- 3. Consider backing up your data first
-- 4. If you have foreign key constraints, you may need to delete related data first
-- 5. Some tables might have CASCADE deletes, so related data in other tables may also be deleted

-- To check how many users you have before deleting:
-- SELECT COUNT(*) FROM public.users;
-- SELECT COUNT(*) FROM auth.users;

