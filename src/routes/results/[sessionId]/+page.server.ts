import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { sessionId } = params;

	if (!sessionId) {
		throw error(404, 'Session not found');
	}

	const session = await locals.db.getSession(sessionId);

	if (!session) {
		throw error(404, 'Session not found');
	}

	// Get recordings and analysis in parallel
	const [recordings, analysis] = await Promise.all([
		locals.db.getSessionRecordings(sessionId),
		locals.db.getSessionAnalysis(sessionId)
	]);

	return {
		session,
		recordings,
		analysis
	};
}) satisfies PageServerLoad;
