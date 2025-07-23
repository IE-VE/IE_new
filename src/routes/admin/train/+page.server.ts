import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, platform, request, url }) => {
	// Basic auth check

	try {
		// Load batches with prefix list from storage
		const batchResponse = await platform?.env.STORAGE.list({
			prefix: 'batch-requests-phase1-'
		});

		// Load output files (batch_*_output.jsonl)
		const outputResponse = await platform?.env.STORAGE.list({
			prefix: 'batch'
		});

		// Load finetuned chats files
		const finetunedResponse = await platform?.env.STORAGE.list({
			prefix: 'finetuned-chats-'
		});

		// Extract only the serializable properties from each R2 object for batches
		const batches = batchResponse?.objects
			? batchResponse.objects.map((object) => ({
					key: object.key,
					size: object.size,
					etag: object.etag,
					httpEtag: object.httpEtag,
					uploaded: object.uploaded ? object.uploaded.getTime() : null
				}))
			: [];

		// Extract serializable properties for output files
		const outputFiles = outputResponse?.objects
			? outputResponse.objects
					.filter((object) => object.key.endsWith('_output.jsonl'))
					.map((object) => ({
						key: object.key,
						size: object.size,
						etag: object.etag,
						httpEtag: object.httpEtag,
						uploaded: object.uploaded ? object.uploaded.getTime() : null
					}))
			: [];

		// Extract serializable properties for finetuned chat files
		const finetunedFiles = finetunedResponse?.objects
			? finetunedResponse.objects.map((object) => ({
					key: object.key,
					size: object.size,
					etag: object.etag,
					httpEtag: object.httpEtag,
					uploaded: object.uploaded ? object.uploaded.getTime() : null
				}))
			: [];

		return {
			batches,
			outputFiles,
			finetunedFiles
		};
	} catch (e) {
		console.error('Error loading training batches:', e);
		throw error(500, 'Failed to load training batches');
	}
}) satisfies PageServerLoad;
