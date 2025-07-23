import { DatabaseConnector } from '$lib/db/connector';
import type { ParsedRecording } from '$lib/db/types';
import { convertAudioToMp3 } from './convertAudioToMp3';
import { pronunciationAnalysis } from './pronunciationAnalysis';
import { transcribeAudio } from './transcribeAudio';
import { getR2ObjectAsBlob, putR2ObjectAsBlob } from '$lib/utils/r2util';
import { finalAnalysis } from './finalAnalysis';
import { v4 as uuidv4 } from 'uuid';
import { ANALYSIS_VERSION } from '$lib/constants';
import postmark from 'postmark';
import { brevoEventResultEmailSent } from '$lib/utils/brevo';

// V7 was o1
// V8 was our own GPT4o-mini
// V9 current version moved to constants.ts

export async function doAnalyses(
	session_id: string,
	platform: App.Platform,
	forceEmail: boolean = false
) {
	const connector = new DatabaseConnector(platform.env.DB);

	// Grab the session
	const session = await connector.getSession(session_id);
	if (!session) {
		throw new Error('Session not found');
	}

	// Only proceed if the session has an email
	if (!session.email) {
		console.log('⚠️ Session has no email, skipping analysis');
		return null;
	}

	// Grab the recordings
	const recordings = await connector.getSessionRecordings(session.id);
	if (!recordings) {
		throw new Error('No recordings found');
	}

	// Check if this is a re-analysis by checking if last_analysis_at exists
	const isReanalysis = !!session.last_analysis_at;

	// Delete any existing analysis first
	await connector.deleteAnalysisBySessionId(session.id);

	// Create a new analysis with 'created' status
	const analysisId = uuidv4();
	await connector.createAnalysis({
		session_id: session.id,
		id: analysisId,
		analysis_json: JSON.stringify({}),
		version: ANALYSIS_VERSION,
		status: 'created',
		instructor_feedback: null
	});

	try {
		// Update status to 'analysing'
		await connector.updateAnalysisStatus(analysisId, 'analysing');

		// Process recordings
		await checkRecordings(session.id, recordings, platform, true);

		// Do the analyses
		const final_analysis = await finalAnalysis(recordings, platform.env.OPENAI_API_KEY);
		if (!final_analysis) {
			throw new Error('No final analysis found');
		}

		// Update the analysis with the results and set status to 'complete'
		await connector.updateAnalysis(analysisId, JSON.stringify(final_analysis));
		await connector.updateAnalysisStatus(analysisId, 'complete');

		// Update the session's last_analysis_at timestamp
		const currentTime = Date.now();
		await connector.updateSessionLastAnalysisAt(session.id, currentTime);

		// Send email if this is NOT a re-analysis or if forceEmail is true
		if ((!isReanalysis || forceEmail) && session.email) {
			await sendResultsEmail(session.id, session.email, platform);
		}

		// Return the updated analysis
		return await connector.getSessionAnalysis(session.id);
	} catch (error) {
		// If there's an error, update the status to 'error'
		await connector.updateAnalysisStatus(analysisId, 'error');
		throw error;
	}
}

// Function to send the results email
async function sendResultsEmail(sessionId: string, email: string, platform: App.Platform) {
	if (!platform?.env.POSTMARK_API_KEY) {
		throw new Error('Postmark API key not found');
	}

	// Create a Postmark client
	const postmarkClient = new postmark.ServerClient(platform.env.POSTMARK_API_KEY);

	// Send the results email using a different template
	await postmarkClient.sendEmailWithTemplate({
		From: 'examiner@insideielts.com',
		To: email,
		// Use the results template instead of the confirmation template
		TemplateId: 39066930, // This should be replaced with the correct template ID for results
		TemplateModel: {
			resultsUrl: `https://insideielts.com/results/${sessionId}`,
			email
		}
	});

	// Track the email sent event in Brevo
	await brevoEventResultEmailSent(platform.env.BREVO_MA_KEY, email, sessionId);

	console.log(`✅ Results email sent to ${email} for session ${sessionId}`);
}

async function checkRecordings(
	sessionId: string,
	recordings: ParsedRecording[],
	platform: App.Platform,
	fix: boolean = false
) {
	// Check if recordings are complete and fix them in parallel if needed
	await Promise.all(
		recordings.map((recording) => validateAndFixRecording(recording, sessionId, platform, fix))
	);
}

async function validateAndFixRecording(
	recording: ParsedRecording,
	sessionId: string,
	platform: App.Platform,
	fix: boolean
) {
	if (!recording.audio_object_key) {
		throw new Error('Incomplete recording: No audio object key');
	}

	// Check and optionally fix the mp3 object key
	// Fixing means it will convert the audio to mp3 and save it to R2
	if (!recording.mp3_object_key && fix) {
		console.log(`🔄 Fixing - Converting audio to mp3 for question ${recording.question_index + 1}`);
		const audio_blob = await getR2ObjectAsBlob(recording.audio_object_key, platform.env.STORAGE);
		const mp3_blob = await convertAudioToMp3(audio_blob);
		const mp3_object_key = `${sessionId}/uploads/audio_${recording.question_index + 1}.mp3`;
		await putR2ObjectAsBlob(mp3_object_key, mp3_blob, platform.env.STORAGE);
		// Also save the mp3 object key to the databse
		const connector = new DatabaseConnector(platform.env.DB);
		await connector.updateRecordingMp3ObjectKey(recording.id, mp3_object_key);
		recording.mp3_object_key = mp3_object_key;
	}

	// Check and optionally fix the transcription
	// Fixing means it will transcribe the audio and save it to the database
	if (!recording.transcription) {
		if (fix) {
			console.log('🔄 Fixing - Transcribing audio');
			// Call transcription code
			const audio_blob = await getR2ObjectAsBlob(recording.audio_object_key, platform.env.STORAGE);
			const transcription = await transcribeAudio(audio_blob, recording.question_text, platform);
			if (!transcription) {
				throw new Error('Incomplete recording: No transcription');
			}
			const connector = new DatabaseConnector(platform.env.DB);
			await connector.updateRecordingTranscription(recording.id, JSON.stringify(transcription));
			recording.transcription = transcription;
		} else {
			throw new Error('Incomplete recording: No transcription');
		}
	}

	// Check and optionally fix the pronunciation analysis
	// Fixing means it will analyze the pronunciation and save it to the database
	if (!recording.pronunciation_analysis) {
		if (fix) {
			console.log('🔄 Fixing - Pronunciation analysis');
			if (!recording.mp3_object_key) {
				throw new Error('Cannot analyze pronunciation: mp3_object_key is null');
			}
			const mp3_blob = await getR2ObjectAsBlob(recording.mp3_object_key, platform.env.STORAGE);
			const pronunciation_analysis = await pronunciationAnalysis(
				mp3_blob,
				platform.env.OPENAI_API_KEY
			);
			if (!pronunciation_analysis) {
				throw new Error('Incomplete recording: No pronunciation analysis');
			}
			const connector = new DatabaseConnector(platform.env.DB);
			await connector.updateRecordingPronunciation(recording.id, pronunciation_analysis);
			recording.pronunciation_analysis = pronunciation_analysis;
		} else {
			throw new Error('Incomplete recording: No pronunciation analysis');
		}
	}
}
