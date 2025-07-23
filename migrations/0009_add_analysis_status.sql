-- Migration: 0009_add_analysis_status
-- Description: Add status column to analysis table with enum-like constraint

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Add status column to analysis table with default value 'complete' for existing records
-- and a CHECK constraint to enforce valid status values
ALTER TABLE analysis ADD COLUMN status TEXT NOT NULL DEFAULT 'complete' 
CHECK (status IN ('created', 'analysing', 'complete', 'error')); 