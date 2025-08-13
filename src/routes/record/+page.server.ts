import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';
import type { ParsedRecording, Session } from '$lib/db/types';
import { QUESTIONS } from '$lib/constants';

// IELTS Questions imported from constants file

export const load = (async ({ platform, cookies, locals }) => {
	// Try if we have a session id in the cookie, we will use that one.
	// IF not, create  new one.
	const sessionId = cookies.get('sessionId') || uuidv4();

	// We do however, place a cookie on the client to store the session ID.
	cookies.set('sessionId', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});

	let session: Session | null = await locals.db.getSession(sessionId);
	let recordings: ParsedRecording[] = [];

	if (session) {
		// Update current question
		// Grab recordings
		recordings = await locals.db.getSessionRecordings(sessionId);
	} else {
		// It's ok to return a sessions as long as we are not storing it yet.
		session = {
			id: sessionId,
			current_question_index: 0,
			total_questions: QUESTIONS.length,
			current_question: QUESTIONS[0],
			created_at: 0, // Not saved to DB yet
			updated_at: 0, // Not saved to DB yet
			metadata: null,
			status: 'active',
			email: null,
			use_video: true // TypeScript needs this, but we'll ignore it in the UI until user chooses
		} as Session;
	}

	return {
		sessionId,
		session,
		recordings
	};
}) satisfies PageServerLoad;

// Add an actions that deletes the coookie
export const actions = {
	deleteCookie: async ({ cookies }) => {
		cookies.delete('sessionId', { path: '/' });
	},

	sendResults: async ({ request, platform, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const sessionId = formData.get('sessionId') as string;

		if (!email || !sessionId) {
			throw error(400, 'Email and session ID are required');
		}

		const session = await locals.db.getSession(sessionId);

		if (!session) {
			throw error(404, 'Session not found');
		}

		// Check if this email has been used before
		const existingSession = await locals.db.getSessionByEmail(email);
		if (existingSession && existingSession.id !== sessionId) {
			return {
				success: false,
				error:
					"You've already taken a test with this email. Please check your email for your previous results, which include a special offer for unlimited tests."
			};
		}

		// Update session with email
		await locals.db.updateSession({
			...session,
			email
		});

		// Queue the analysis
		if (!platform?.env.QUEUE) {
			throw error(500, 'Queue not found');
		}

		// Push the session id to the queue
		await platform.env.QUEUE.send({ sessionId, forceEmail: false });

		return { success: true };
	}
} satisfies Actions;
