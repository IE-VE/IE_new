-- Migration: 0011_move_instructor_feedback_to_sessions
-- Description: Move instructor feedback from analysis table to sessions table

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Add instructor_feedback column to sessions table
ALTER TABLE sessions ADD COLUMN instructor_feedback TEXT;

-- Copy instructor feedback data from analysis to sessions table
UPDATE sessions 
SET instructor_feedback = (
    SELECT a.instructor_feedback 
    FROM analysis a 
    WHERE a.session_id = sessions.id
);

-- We'll keep the instructor_feedback column in the analysis table for now
-- to ensure backwards compatibility during the transition.
-- It will be removed in a future migration once all code is updated. 