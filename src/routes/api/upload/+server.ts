import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v4 as uuidv4 } from 'uuid';
import type { NewRecording } from '$lib/db/types';
import { doAnalyses } from '$lib/ai/doAnalyses';
import { transcribeAudio } from '$lib/ai/transcribeAudio';
import { getR2ObjectAsBlob, putR2ObjectAsBlob } from '$lib/utils/r2util';
import { QUESTIONS, ANALYSIS_VERSION } from '$lib/constants';

// IELTS Questions imported from constants file

export const POST = (async ({ request, platform, locals }) => {
	console.log('📤 Starting upload process');
	const formData = await request.formData();
	const sessionId = formData.get('sessionId') as string;
	const questionIndex = parseInt(formData.get('questionIndex') as string);
	const videoBlob = formData.get('video') as Blob | null;
	const audioBlob = formData.get('audio') as Blob;
	const useVideo = formData.get('useVideo') === 'true';

	console.log(
		`🔍 Upload request details - SessionID: ${sessionId}, QuestionIndex: ${questionIndex}, UseVideo: ${useVideo}`
	);

	// Validate inputs
	if (!platform?.env.STORAGE) throw error(500, 'Storage bucket not found');
	if (!platform?.env.AI) throw error(500, 'AI not found');
	if (!platform?.env.OPENAI_API_KEY) throw error(500, 'OpenAI API key not found');
	if (!sessionId) throw error(400, 'No session ID found');
	if (!audioBlob) throw error(400, 'No audio provided');
	if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= QUESTIONS.length) {
		throw error(400, 'Invalid question index');
	}

	// Get session - it should already exist at this point
	const session = await locals.db.getSession(sessionId);
	if (!session) {
		throw error(404, 'Session not found. Please refresh the page and try again.');
	}

	// Verify that the session's use_video matches the request
	if (session.use_video !== useVideo) {
		console.log(
			`⚠️ Warning: Session use_video (${session.use_video}) doesn't match request (${useVideo})`
		);
		// We'll trust the session's value over the request
		console.log(`🔄 Using session's use_video value: ${session.use_video}`);
	}

	// Use the session's use_video value for consistency
	const sessionUseVideo = session.use_video;

	// Validate video blob based on session's use_video value
	if (sessionUseVideo && !videoBlob) {
		throw error(400, 'Video mode selected in session but no video provided');
	}

	// Get existing recordings
	const recordings = await locals.db.getSessionRecordings(session.id);

	// Create object keys
	const videoObjectKey = sessionUseVideo
		? `${sessionId}/uploads/video_${questionIndex + 1}.webm`
		: null;
	const audioObjectKey = `${sessionId}/uploads/audio_${questionIndex + 1}.webm`;

	// Initial transcription
	const transcriptionResponse = await transcribeAudio(
		audioBlob,
		QUESTIONS[questionIndex],
		platform as App.Platform
	);

	if (!transcriptionResponse) {
		console.error('❌ Transcription response is null or undefined');
		throw error(500, 'Failed to get transcription response');
	}

	console.log(`✍️ Transcription completed for question ${questionIndex + 1}`);

	// Update session state
	if (questionIndex < QUESTIONS.length - 1) {
		session.current_question_index = questionIndex + 1;
		session.current_question = QUESTIONS[session.current_question_index];
	} else {
		session.status = 'completed';
	}

	// Upload media files in background
	const uploadPromises: Promise<void>[] = [];
	if (sessionUseVideo && videoBlob) {
		console.log('🎥 Queueing video upload');
		uploadPromises.push(putR2ObjectAsBlob(videoObjectKey!, videoBlob, platform.env.STORAGE));
	}
	console.log('🎤 Queueing audio upload');
	uploadPromises.push(putR2ObjectAsBlob(audioObjectKey, audioBlob, platform.env.STORAGE));

	// Create initial recording entry
	const newRecordingPayload: NewRecording = {
		id: uuidv4(),
		session_id: sessionId,
		video_object_key: videoObjectKey,
		audio_object_key: audioObjectKey,
		mp3_object_key: null,
		mime_type: sessionUseVideo ? videoBlob!.type : audioBlob.type,
		status: 'processing',
		duration_ms: null,
		question_text: QUESTIONS[questionIndex],
		question_index: questionIndex,
		error_message: null,
		transcription_json: JSON.stringify(transcriptionResponse),
		analysis_json: '{}',
		pronunciation_analysis: null
	};

	// Process the rest in background
	async function processRest() {
		try {
			console.log('🔄 Starting background processing');

			// Wait for media uploads to complete with better error handling
			try {
				await Promise.all(uploadPromises);
				console.log('📁 Media uploads completed');
			} catch (uploadErr) {
				console.error('⚠️ Media upload error:', uploadErr);
				// Continue with processing even if upload fails
				// In development, we'll have placeholders
			}

			// Create the recording in database
			await locals.db.createRecording(newRecordingPayload as NewRecording);

			// Update session state
			await locals.db.updateSession(session!);
		} catch (err: unknown) {
			console.error('❌ Background processing error:', err);
			// Update recording status to error
			try {
				await locals.db.updateRecordingStatus(
					newRecordingPayload.id!,
					'error',
					err instanceof Error ? err.message : 'Unknown error'
				);
			} catch (dbErr) {
				console.error('❌ Error updating recording status:', dbErr);
			}
		}
	}

	// Start background processing
	platform.context.waitUntil(processRest());

	// We no longer trigger analysis automatically when questions are completed
	// Instead, we'll trigger it only after the user provides their email

	return json({
		success: true,
		session,
		recordings: [...recordings, newRecordingPayload],
		message: `Recording ${questionIndex + 1} uploaded successfully`
	});
}) satisfies RequestHandler;
