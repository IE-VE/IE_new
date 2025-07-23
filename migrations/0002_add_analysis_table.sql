-- Migration: 0002_add_analysis
-- Description: Add analysis table for storing final IELTS results

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Analysis table for storing final IELTS results
CREATE TABLE analysis (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    analysis_json TEXT NOT NULL,  -- Stores the complete IELTSAnalysis JSON
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Create index for quick lookups
CREATE INDEX idx_analysis_session_id ON analysis(session_id);