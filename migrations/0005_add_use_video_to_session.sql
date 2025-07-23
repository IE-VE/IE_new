-- Add useVideo column to sessions table
ALTER TABLE sessions ADD COLUMN use_video BOOLEAN NOT NULL DEFAULT true; 