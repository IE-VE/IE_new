-- Migration: 0008_add_analysis_version
-- Description: Add version column to analysis table

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Add version column to analysis table with default value 1 for existing records
ALTER TABLE analysis ADD COLUMN version INTEGER NOT NULL DEFAULT 1; 