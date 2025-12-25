-- Fix: Make phone_number column nullable in users table
-- This allows users to sign up without providing a phone number

-- Option 1: Make phone_number nullable (Recommended)
ALTER TABLE public.users 
ALTER COLUMN phone_number DROP NOT NULL;

-- Option 2: If the above doesn't work, you might need to:
-- 1. First, set all existing NULL values to empty string (if any)
-- UPDATE public.users SET phone_number = '' WHERE phone_number IS NULL;
-- 
-- 2. Then make it nullable
-- ALTER TABLE public.users ALTER COLUMN phone_number DROP NOT NULL;

-- Verify the change
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'phone_number';

-- Expected result: is_nullable should be 'YES'

