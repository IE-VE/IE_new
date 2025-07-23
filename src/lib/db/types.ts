import type { Exercises } from '$lib/ai/createExercises';
import type { IELTSAnalysis } from '$lib/ai/finalAnalysis';
import type { Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output } from '@cloudflare/workers-types';

// Database Types for D1

export type SessionStatus = 'active' | 'completed' | 'error';
export type RecordingStatus = 'processing' | 'ready' | 'error';
export type AnalysisStatus = 'created' | 'analysing' | 'complete' | 'error';

// API Response Interfaces
export interface ApiResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export interface SessionUpdateResponse extends ApiResponse {
	session: Session;
}

export interface UploadResponse extends ApiResponse {
	session: Session;
	recordings: ParsedRecording[];
	message: string;
}

export interface Session {
	id: string;
	created_at: number;
	updated_at: number;
	status: SessionStatus;
	metadata: string | null; // JSON string
	current_question_index: number;
	total_questions: number;
	current_question: string | null;
	email: string | null;
	use_video: boolean;
	instructor_feedback: string | null; // JSON string for instructor feedback
	last_analysis_at: number | null; // Timestamp of the last analysis
}

export interface Recording {
	id: string;
	session_id: string;
	timestamp: number;
	question_text: string;
	question_index: number;
	video_object_key: string | null;
	audio_object_key: string | null;
	mp3_object_key: string | null;
	mime_type: string;
	duration_ms: number | null;
	status: RecordingStatus;
	error_message: string | null;
	transcription_json: string | null; // JSON string from Whisper
	analysis_json: string | null; // JSON string for analysis
	pronunciation_analysis: string | null; // Text analysis of pronunciation
}

// Recording but with transcription and analysis parsed
export interface ParsedRecording extends Recording {
	transcription: Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output | null;
	analysis: any | null;
}

export interface Result {
	id: string;
	session_id: string;
	recording_id: string;
	created_at: number;
	transcription: string | null;
	analysis_json: string; // JSON string
}

// Parsed types (after JSON.parse)
export interface SessionMetadata {
	userAgent?: string;
	browser?: string;
	platform?: string;
	[key: string]: unknown;
}

export interface WhisperTranscription {
	text: string;
	segments?: Array<{
		id: number;
		start: number;
		end: number;
		text: string;
		tokens: number[];
		temperature?: number;
		avg_logprob?: number;
		compression_ratio?: number;
		no_speech_prob?: number;
	}>;
	language?: string;
}

export interface Analysis {
	id: string;
	session_id: string;
	created_at?: number;
	analysis_json: string; // Stores the complete IELTSAnalysis JSON
	version: number;
	status: AnalysisStatus;
	instructor_feedback: string | null; // JSON string for instructor feedback
}

export type NewAnalysis = Omit<Analysis, 'created_at' | 'instructor_feedback'> & {
	created_at?: number;
	instructor_feedback?: string | null;
};

export interface ParsedAnalysis extends Analysis {
	analysis: IELTSAnalysis & { exercises: Exercises };
}

// Helper type for inserting new records (omitting auto-generated fields)
export type NewSession = Omit<Session, 'created_at' | 'updated_at'> & {
	created_at?: number;
	updated_at?: number;
	instructor_feedback?: string | null;
	last_analysis_at?: number | null;
};

export type NewRecording = Omit<Recording, 'timestamp'> & {
	timestamp?: number;
};

export type NewResult = Omit<Result, 'created_at'> & {
	created_at?: number;
};
