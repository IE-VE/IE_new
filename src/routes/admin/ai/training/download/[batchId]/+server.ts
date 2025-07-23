import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, platform, request, params }) => {
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
		const { batchId } = params;

		if (!batchId) {
			throw error(400, 'Batch ID is required');
		}

		// Try to fetch the file from storage
		const file = await platform.env.STORAGE.get(batchId);

		if (!file) {
			throw error(404, 'Batch file not found');
		}

		// Get file as a readable stream or text
		const fileContent = await file.text();

		// Set appropriate headers for download
		const headers = new Headers();
		headers.set('Content-Type', 'application/jsonl');
		headers.set('Content-Disposition', `attachment; filename="${batchId}"`);

		// Return the file content
		return new Response(fileContent, {
			status: 200,
			headers
		});
	} catch (e) {
		console.error('Error downloading batch file:', e);
		throw error(500, e instanceof Error ? e.message : 'An unknown error occurred');
	}
};
