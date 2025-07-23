import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import type { Response as CloudflareResponse } from '@cloudflare/workers-types';
import { tts } from '$lib/ai/tts';
import { z } from 'zod';

const RequestSchema = z.object({ text: z.string() });

export const POST: RequestHandler = async ({ request, platform }) => {
	const body = await request.json();
	const { text } = RequestSchema.parse(body);

	// Hash the text
	const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	const hashString = Array.from(new Uint8Array(hash))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
	const url = new URL(request.url + '/' + hashString);

	if (!text) {
		throw error(400, 'No text provided');
	}

	const openaiApiKey = platform?.env.OPENAI_API_KEY;
	if (!openaiApiKey) {
		throw error(500, 'OpenAI API key not found');
	}

	try {
		// Check the cache first
		const cache = await platform.caches.default;
		const cachedResponse = await cache.match(url);
		if (cachedResponse) {
			console.log('cache hit');
			return cachedResponse as any as Response;
		}

		const blob = await tts(text, platform);

		// Return the audio data with appropriate headers
		const responseToCache = new Response(blob, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Content-Length': blob.size.toString()
			}
		}) as unknown as CloudflareResponse;

		const responseToReturn = new Response(blob, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Content-Length': blob.size.toString()
			}
		});

		// Add blob to cache
		platform.context.waitUntil(cache.put(url, responseToCache));
		return responseToReturn;
	} catch (err) {
		console.error('Error generating TTS:', err);
		throw error(500, 'Failed to generate speech');
	}
};
