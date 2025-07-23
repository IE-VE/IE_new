import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { DatabaseConnector } from '$lib/db/connector';

type RequestBody = {
	sessionId: string;
	forceEmail: boolean;
};

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const { sessionId, forceEmail } = (await request.json()) as RequestBody;

	const queue = platform?.env.QUEUE;

	if (!queue) {
		throw error(500, 'Queue not found');
	}

	if (!sessionId) {
		throw error(400, 'No session ID provided');
	}

	const db = locals.db as DatabaseConnector;

	try {
		console.log('🔄 Regenerating analysis for session:', sessionId, 'with forceEmail:', forceEmail);

		// Delete the pronunciation analysis
		await db.deletePronunciationAnalysisBySessionId(sessionId);

		// Push the session id and forceEmail flag to the queue
		await queue.send({ sessionId, forceEmail });

		return json({ success: true, message: 'Analysis regenerated successfully' });
	} catch (err) {
		console.error('Error regenerating analysis:', err);
		throw error(500, 'Failed to regenerate analysis');
	}
};
