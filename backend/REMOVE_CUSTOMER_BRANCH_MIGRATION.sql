-- Migration: Remove branch relationship from customers table
-- Date: 2026-05-25
-- Purpose: Make customers shared across all branches instead of branch-specific

-- WARNING: Backup your data before running this migration!

USE billiards_management;

-- Step 1: Drop foreign key constraint
ALTER TABLE customers 
DROP FOREIGN KEY customers_ibfk_1;

-- Step 2: Drop branch_id column
ALTER TABLE customers 
DROP COLUMN branch_id;

-- Verification query (should return 0 results if successful)
-- SELECT * FROM information_schema.COLUMNS 
-- WHERE TABLE_SCHEMA = 'billiards_management' 
-- AND TABLE_NAME = 'customers' 
-- AND COLUMN_NAME = 'branch_id';

-- NOTE: After this migration:
-- 1. Customers are now system-wide, not branch-specific
-- 2. Face recognition will search ALL customers across all branches
-- 3. Customer email and phone must be unique system-wide
-- 4. No need to select branch when creating/editing customers
