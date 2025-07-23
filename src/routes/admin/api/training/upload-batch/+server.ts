import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	// Check if storage is available
	if (!platform?.env.STORAGE) {
		return json({ error: 'Storage not available' }, { status: 500 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ message: 'No file provided' }, { status: 400 });
		}

		// Validate file name format
		if (!file.name.match(/batch_.*_output\.jsonl$/)) {
			return json(
				{
					message: 'Invalid file format. File name must match pattern: batch_*_output.jsonl'
				},
				{ status: 400 }
			);
		}

		// Get file content as text
		const fileContent = await file.text();

		// Validate file content (simple check that it's valid JSONL)
		try {
			const lines = fileContent.trim().split('\n');
			if (lines.length === 0) {
				return json({ message: 'File is empty' }, { status: 400 });
			}

			// Check that each line is valid JSON
			for (const line of lines) {
				JSON.parse(line);
			}
		} catch (error) {
			return json(
				{
					message: 'Invalid JSONL format. Each line must be a valid JSON object.'
				},
				{ status: 400 }
			);
		}

		// Store the file in R2 storage
		const key = file.name;
		await platform.env.STORAGE.put(key, fileContent);

		return json({
			message: `File ${file.name} uploaded successfully (${(file.size / 1024).toFixed(2)} KB)`
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return json(
			{
				message:
					error instanceof Error ? error.message : 'An error occurred while uploading the file'
			},
			{ status: 500 }
		);
	}
};
