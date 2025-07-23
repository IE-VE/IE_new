-- Migration: Add mp3_object_key to recordings table
ALTER TABLE recordings ADD COLUMN mp3_object_key TEXT; 