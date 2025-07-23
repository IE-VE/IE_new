import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { QUESTIONS } from '$lib/constants';

// IELTS Questions - imported from constants file
// Type definition for the request payload
interface SessionUpdatePayload {
	sessionId: string;
	use_video?: boolean;
}

export const POST = (async ({ request, locals }) => {
	const { sessionId, use_video } = (await request.json()) as SessionUpdatePayload;

	if (!sessionId) {
		return json({ error: 'Session ID is required' }, { status: 400 });
	}

	// Get the existing session
	let session = await locals.db.getSession(sessionId);
	const useVideo = !!use_video; // Ensure it's a boolean

	if (!session) {
		// Create a new session if it doesn't exist
		console.log(`📝 Creating new session: ${sessionId} with useVideo: ${useVideo}`);
		session = await locals.db.createSession({
			id: sessionId,
			current_question_index: 0,
			total_questions: QUESTIONS.length,
			current_question: QUESTIONS[0],
			metadata: null,
			status: 'active',
			email: null,
			use_video: useVideo,
			instructor_feedback: null,
			last_analysis_at: null
		});
	} else if (session.use_video !== useVideo) {
		// Update the session with the new use_video value if it's different
		console.log(`🔄 Updating session use_video from ${session.use_video} to ${useVideo}`);
		session = await locals.db.updateSession({
			...session,
			use_video: useVideo
		});
	}

	// Return the session
	return json({
		success: true,
		session
	});
}) satisfies RequestHandler;
