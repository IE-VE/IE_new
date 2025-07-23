-- Migration: 0006_add_pronunciation_analysis
-- Description: Add pronunciation_analysis column to recordings table

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Add pronunciation_analysis column to recordings table
ALTER TABLE recordings ADD COLUMN pronunciation_analysis TEXT; 