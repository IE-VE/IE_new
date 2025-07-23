-- Migration: 0001_init
-- Description: Initial schema for IELTS speaking test application

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Sessions table
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'error')) DEFAULT 'active',
    metadata TEXT, -- JSON field for flexible metadata storage
    current_question_index INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 3,
    current_question TEXT
);

-- Recordings table (includes transcription and analysis)
CREATE TABLE recordings (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
    question_text TEXT NOT NULL,
    question_index INTEGER NOT NULL,
    object_key TEXT NOT NULL UNIQUE,     -- Reference to R2 storage, must be unique
    audio_object_key TEXT NOT NULL UNIQUE, -- Audio file in R2, must be unique
    mime_type TEXT NOT NULL,
    duration_ms INTEGER,
    status TEXT NOT NULL CHECK (status IN ('processing', 'ready', 'error')) DEFAULT 'processing',
    error_message TEXT,
    transcription_json TEXT,  -- JSON field for Whisper transcription
    analysis_json TEXT,       -- JSON field for analysis results
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_recordings_session_id ON recordings(session_id);
CREATE INDEX idx_recordings_status ON recordings(status);
CREATE INDEX idx_recordings_question_index ON recordings(question_index); 