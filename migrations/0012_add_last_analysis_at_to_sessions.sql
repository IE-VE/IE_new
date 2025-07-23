-- Migration: 0012_add_last_analysis_at_to_sessions
-- Description: Add last_analysis_at timestamp to track when a session was last analysed

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Add last_analysis_at column to sessions table
ALTER TABLE sessions ADD COLUMN last_analysis_at INTEGER; 