import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Session } from '$lib/db/types';
import type { DatabaseConnector } from '$lib/db/connector';

export const load = (async ({ locals, platform, request, url }) => {
	try {
		// Get pagination parameters
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = 15;
		const status = url.searchParams.get('status') || 'completed';
		const email = url.searchParams.get('email') || undefined;

		// Get sessions with pagination and filtering
		const { sessions, totalCount } = await locals.db.getPaginatedSessions({
			page,
			pageSize,
			status: status === 'all' ? undefined : status,
			email,
			orderBy: 'updated_at',
			orderDirection: 'DESC'
		});

		const sessionsWithDetails = await Promise.all(
			sessions.map(async (session: Session) => {
				const recordings = await locals.db.getSessionRecordings(session.id);
				const analysis = await locals.db.getSessionAnalysis(session.id);
				return {
					...session,
					recordings,
					analysis,
					recordingsCount: recordings.length,
					hasAnalysis: !!analysis
				};
			})
		);

		return {
			sessions: sessionsWithDetails,
			totalSessions: totalCount,
			page,
			status,
			email
		};
	} catch (err) {
		console.error('Error loading admin page:', err);
		throw error(500, 'Failed to load sessions');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateInstructorFeedback: async ({ request, locals, platform }) => {
		try {
			const formData = await request.formData();
			const analysisId = formData.get('analysisId')?.toString();
			const feedbackData = formData.get('instructorFeedback')?.toString();

			if (!analysisId) {
				return fail(400, { success: false, message: 'No analysis ID provided' });
			}

			if (!feedbackData) {
				return fail(400, { success: false, message: 'No instructor feedback provided' });
			}

			const instructorFeedback = JSON.parse(feedbackData);
			const db = locals.db as DatabaseConnector;

			console.log('📝 Updating instructor feedback for analysis:', analysisId);

			// Get the current analysis
			const analysis = await db.getAnalysis(analysisId);
			if (!analysis) {
				return fail(404, { success: false, message: 'Analysis not found' });
			}

			// Get the session ID
			const sessionId = analysis.session_id;

			// Update the instructor feedback on the session
			await db.updateInstructorFeedback(analysisId, JSON.stringify(instructorFeedback));

			// Get the current analysis JSON
			const parsedAnalysis = JSON.parse(analysis.analysis_json);

			// Update the analysis JSON with the instructor feedback
			parsedAnalysis.instructorFeedback = instructorFeedback;

			// Update the analysis JSON
			await db.updateAnalysis(analysisId, JSON.stringify(parsedAnalysis));

			return { success: true, message: 'Instructor feedback updated successfully' };
		} catch (err) {
			console.error('Error updating instructor feedback:', err);
			return fail(500, { success: false, message: 'Failed to update instructor feedback' });
		}
	}
};
