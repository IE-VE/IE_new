import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, platform, request, params }) => {
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
		const { key } = params;

		if (!key) {
			throw error(400, 'Batch key is required');
		}

		// Check if the file exists
		const fileExists = await platform.env.STORAGE.head(key);

		if (!fileExists) {
			throw error(404, 'Batch file not found');
		}

		// Delete the file from storage
		await platform.env.STORAGE.delete(key);

		// Return success response
		return json({
			success: true,
			message: `Batch file '${key}' successfully deleted`
		});
	} catch (e) {
		console.error('Error deleting batch file:', e);
		throw error(500, e instanceof Error ? e.message : 'An unknown error occurred');
	}
};
