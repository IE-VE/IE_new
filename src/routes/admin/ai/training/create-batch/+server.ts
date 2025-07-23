import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import createTrainingBatch from '$lib/ai/createTrainingBatch';

export const POST: RequestHandler = async ({ locals, platform, request }) => {
	// Basic auth check for security
	const authHeader = request.headers.get('authorization');

	// Check if platform is available
	if (!platform) {
		throw error(500, 'Platform not available');
	}

	const expectedAuth = `Basic ${btoa(`admin:${platform.env.ADMIN_PASSWORD || ''}`)}`;

	if (!authHeader || authHeader !== expectedAuth) {
		throw error(401, 'Unauthorized access to admin API');
	}

	try {
		// Call the batch creation function
		const result = await createTrainingBatch(platform);

		// Store the batch info in the database
		// Ideally, we'd update a training_batches table with the details
		// This is commented out since the DB method might not exist yet
		/*
		await locals.db.createTrainingBatch({
			id: `batch-${Date.now()}`,
			createdAt: Date.now(),
			status: 'pending',
			totalSessions: result.totalSessions,
			phase: 'phase1',
			filePath: result.phase1BatchFilePath
		});
		*/

		return json(result);
	} catch (e) {
		console.error('Error creating training batch:', e);
		return json(
			{
				error: true,
				message: e instanceof Error ? e.message : 'An unknown error occurred'
			},
			{ status: 500 }
		);
	}
};
