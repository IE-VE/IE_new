import { sequence } from '@sveltejs/kit/hooks';
import { DatabaseConnector } from '$lib/db/connector';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = sequence(async ({ event, resolve }) => {
	// Initialize the database connector with the D1 instance from platform context
	if (event.platform?.env.DB) {
		const db = new DatabaseConnector(event.platform?.env.DB);

		// Make the database connector available throughout the app
		event.locals.db = db;
	}

	// Check if this is the admin route
	if (event.url.pathname.startsWith('/admin')) {
		const authHeader = event.request.headers.get('authorization');
		const expectedAuth = `Basic ${btoa(`admin:${event.platform?.env.ADMIN_PASSWORD || ''}`)}`;

		if (!authHeader || authHeader !== expectedAuth) {
			return new Response('Unauthorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Access"'
				}
			});
		}
	}

	const response = await resolve(event);
	return response;
});
