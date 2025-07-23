import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processResults } from '$lib/ai/createTrainingBatch';

export const POST: RequestHandler = async ({ request, platform }) => {
	// Check if storage is available
	if (!platform?.env.STORAGE) {
		return json({ error: 'Storage not available' }, { status: 500 });
	}

	try {
		const data = (await request.json()) as { inputBatchKey: string; outputBatchKey: string };
		const { inputBatchKey, outputBatchKey } = data;

		if (!inputBatchKey || !outputBatchKey) {
			return json(
				{ message: 'Both input batch and output batch keys are required' },
				{ status: 400 }
			);
		}

		// Validate that both files exist in storage
		const inputExists = await platform.env.STORAGE.head(inputBatchKey);
		const outputExists = await platform.env.STORAGE.head(outputBatchKey);

		if (!inputExists) {
			return json({ message: `Input batch file ${inputBatchKey} not found` }, { status: 404 });
		}

		if (!outputExists) {
			return json({ message: `Output batch file ${outputBatchKey} not found` }, { status: 404 });
		}

		// Process the batches
		const result = await processResults(platform, inputBatchKey, outputBatchKey);

		return json({
			message: 'Finetuned chats file created successfully',
			finetunedChatsFilePath: result.finetunedChatsFilePath,
			totalChats: result.totalChats
		});
	} catch (error) {
		console.error('Error combining batch files:', error);
		return json(
			{
				message:
					error instanceof Error ? error.message : 'An error occurred while combining batch files'
			},
			{ status: 500 }
		);
	}
};
