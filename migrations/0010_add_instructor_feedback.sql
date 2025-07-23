-- Migration: 0010_add_instructor_feedback
-- Description: Add instructor feedback fields to analysis table

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Add instructor feedback fields to analysis table
ALTER TABLE analysis ADD COLUMN instructor_feedback TEXT; 