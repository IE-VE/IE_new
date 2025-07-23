import type { R2Bucket } from '@cloudflare/workers-types';

export async function getR2ObjectAsBlob(objectKey: string, storage: R2Bucket) {
	const object = await storage.get(objectKey);
	if (!object) {
		throw new Error('Object not found: ' + objectKey);
	}
	try {
		const arrayBuffer = await object.arrayBuffer();
		return new Blob([arrayBuffer], { type: object.httpMetadata?.contentType });
	} catch (error) {
		console.error('Error getting object as blob: ' + objectKey, error);
		throw error;
	}
}

export async function putR2ObjectAsBlob(objectKey: string, blob: Blob, storage: R2Bucket) {
	try {
		const arrayBuffer = await blob.arrayBuffer();

		// Add content type for proper metadata
		await storage.put(objectKey, arrayBuffer, {
			httpMetadata: {
				contentType: blob.type
			}
		});
	} catch (error) {
		console.error('Error putting object: ' + objectKey, error);
		throw error;
	}
}
