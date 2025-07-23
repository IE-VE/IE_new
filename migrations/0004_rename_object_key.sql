-- Create a new table with the desired structure
CREATE TABLE recordings_new (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
    question_text TEXT NOT NULL,
    question_index INTEGER NOT NULL,
    video_object_key TEXT,
    audio_object_key TEXT,
    mime_type TEXT NOT NULL,
    duration_ms INTEGER,
    status TEXT NOT NULL,
    error_message TEXT,
    transcription_json TEXT,
    analysis_json TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Copy the data from the old table to the new one
INSERT INTO recordings_new 
SELECT 
    id,
    session_id,
    timestamp,
    question_text,
    question_index,
    object_key as video_object_key,
    audio_object_key,
    mime_type,
    duration_ms,
    status,
    error_message,
    transcription_json,
    analysis_json
FROM recordings;

-- Drop the old table
DROP TABLE recordings;

-- Rename the new table to the original name
ALTER TABLE recordings_new RENAME TO recordings; 