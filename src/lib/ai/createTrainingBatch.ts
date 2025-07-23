// The steps to create a training batch are:

import { CF_AI_GATEWAY } from '$lib/constants';
import { DatabaseConnector } from '$lib/db/connector';
import OpenAI from 'openai';
import { GPT_INSTRUCTIONS } from './gptInstruction';
import type {
	ChatCompletion,
	ChatCompletionMessageParam,
	ChatCompletionCreateParams,
	ChatCompletionReasoningEffort
} from 'openai/resources/index.mjs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { ParsedAnalysis, ParsedRecording } from '$lib/db/types';
import type { InstructorFeedback } from '../../routes/admin/components/InstructorFeedbackForm.svelte';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { IELTSAnalysisSchema } from './finalAnalysis';

// Grab all the sessions + analysis that have an instructor score.
// Create a GPT prompot for each session, asking to make the analysis (without giving the instructor score)
// Then, when the response comes in, check if the analysis deviates from the instructor score.
// If it does, we need to re-ask the GPT to make the analysis again, but with the correct instructor score.
// we then alter the "Chat" with the new analysis. We basically replace the first message with the new analysis.
// If it does not deviate, we can keep the whole "Chat" as is.

// This way we created a training batch that is as close to the instructor score as possible.

const createTrainingBatch = async (platform: App.Platform) => {
	const db = new DatabaseConnector(platform.env.DB);
	const sessions = await db.getSessionsWithInstructorScore();

	// Phase 1: Prepare initial batch of requests (without instructor scores)
	const batch: ChatCompletionCreateParams[] = [];

	// Create initial batch requests for all sessions
	for (const session of sessions) {
		console.log(`Processing session: ${session.session.id}`);
		const recordings = session.recordings;
		// Access the instructor score from the session object
		const instructorScore = session.session.instructor_feedback;
		let instructorScoreParsed: InstructorFeedback;

		if (!instructorScore) {
			// Fallback to analysis for backward compatibility
			const analysisInstructorScore = session.analysis.instructor_feedback;
			if (!analysisInstructorScore) {
				console.log(`Skipping session without instructor score: ${session.session.id}`);
				continue;
			}
			instructorScoreParsed = JSON.parse(analysisInstructorScore) as InstructorFeedback;
		} else {
			instructorScoreParsed = JSON.parse(instructorScore) as InstructorFeedback;
		}

		if (instructorScoreParsed.total === undefined || instructorScoreParsed.total === null) {
			console.log(`Skipping session without instructor score: ${session.session.id}`);
			continue;
		}

		const qaPairs = recordings.map((recording, index) => {
			try {
				return {
					question: recording.question_text,
					answer: recording.transcription?.text,
					pronunciationAnalysis: recording.pronunciation_analysis
				};
			} catch (error) {
				console.error(`Error parsing transcription for recording ${index}:`, error);
				console.error('Recording data:', recording);
				throw new Error(`Failed to parse transcription for recording ${index}`);
			}
		});

		const userContent = JSON.stringify(qaPairs);
		const initialMessages: ChatCompletionMessageParam[] = [
			{
				role: 'developer',
				content: GPT_INSTRUCTIONS
			},
			{
				role: 'developer',
				content: `
                This message is for training purposes. 
                A human instructor already gave a calibrated score for this test. 
                Ensure that the outcome of the band scores are exactly what the instructor gave.
                Also base your feedback on the band score that the instructor gave. 
                The instructor score is: <score> ${instructorScore} </score>
            `
			},
			{
				role: 'user',
				content: userContent
			}
		];

		batch.push({
			model: 'gpt-4o',
			store: true,
			metadata: {
				session_id: session.session.id,
				analysis_id: session.analysis.id,
				instructorScore: JSON.stringify(instructorScoreParsed.total)
			},
			messages: initialMessages,
			response_format: zodResponseFormat(IELTSAnalysisSchema, 'analysis')
		});
	}

	// Save Phase 1 batch request to a JSONL file
	const phase1BatchFilePath = `batch-requests-phase1-${Date.now()}.jsonl`;
	const phase1JsonLines = batch
		.map((request) =>
			JSON.stringify({
				custom_id: request.metadata!.session_id!,
				method: 'POST',
				url: '/v1/chat/completions',
				body: request
			})
		)
		.join('\n');

	await platform.env.STORAGE.put(phase1BatchFilePath, phase1JsonLines);

	console.log(`Phase 1 batch requests created and saved to ${phase1BatchFilePath}`);
	console.log(
		`Submit this file to OpenAI batch processing using: \`openai api batch -i ${phase1BatchFilePath} -o phase1-results.jsonl\``
	);

	// Return the expected result object that matches what the API expects
	return {
		phase1BatchFilePath,
		totalSessions: batch.length,
		message:
			'🚀 Batch file created successfully! Download it and submit to OpenAI for batch processing.'
	};
};

// Phase 2: Process the results
export const processResults = async (
	platform: App.Platform,
	object_key_in: string,
	object_key_out: string
) => {
	const db = new DatabaseConnector(platform.env.DB);
	const batch_in_obj = await platform.env.STORAGE.get(object_key_in);
	const batch_out_obj = await platform.env.STORAGE.get(object_key_out);

	// Convert R2 response to text
	const jsonl_in = batch_in_obj ? await batch_in_obj.text() : null;
	const jsonl_out = batch_out_obj ? await batch_out_obj.text() : null;

	if (!jsonl_in || !jsonl_out) {
		throw new Error('JSONL file not found');
	}

	const lines_in = jsonl_in.split('\n').filter((line) => line.trim() !== '');
	const lines_out = jsonl_out.split('\n').filter((line) => line.trim() !== '');

	if (lines_in.length === 0 || lines_out.length === 0) {
		throw new Error('One or both JSONL files are empty');
	}

	console.log(`Processing ${lines_in.length} input lines and ${lines_out.length} output lines`);

	const objs_in = lines_in.map(
		(line) => JSON.parse(line) as { custom_id: string; body: ChatCompletionCreateParams }
	);
	const objs_out = lines_out.map(
		(line) => JSON.parse(line) as { custom_id: string; response: { body: ChatCompletion } }
	);

	const finetunedChats = [];

	// Create a map for quick lookup of output objects by custom_id
	const outputMap = new Map();
	for (const obj_out of objs_out) {
		if (obj_out.custom_id) {
			outputMap.set(obj_out.custom_id, obj_out);
		}
	}

	// Now loop through input objects and find matching output objects by custom_id
	for (const obj_in of objs_in) {
		try {
			const custom_id = obj_in.custom_id;
			if (!custom_id) {
				console.warn('Input object missing custom_id, skipping');
				continue;
			}

			const obj_out = outputMap.get(custom_id);
			if (!obj_out) {
				console.warn(`No matching output found for custom_id: ${custom_id}`);
				continue;
			}

			// For OpenAI fine-tuning, each example must be a chat completion
			// with a list of messages with role and content fields
			finetunedChats.push({
				messages: [
					{
						role: 'system',
						content: GPT_INSTRUCTIONS
					},
					{
						role: 'user',
						content: (obj_in.body?.messages?.[2]?.content as string) || ''
					},
					{
						role: 'assistant',
						content: obj_out.response.body.choices[0].message.content || ''
					}
				]
			});
		} catch (error) {
			console.error(`Error processing entry for custom_id ${obj_in.custom_id}:`, error);
		}
	}

	if (finetunedChats.length === 0) {
		throw new Error('No valid chat entries could be created from the input and output files');
	}

	// Save the chats to a JSONL file
	const finetunedChatsFilePath = `finetuned-chats-${Date.now()}.jsonl`;
	const jsonlContent = finetunedChats.map((chat) => JSON.stringify(chat)).join('\n');

	await platform.env.STORAGE.put(finetunedChatsFilePath, jsonlContent);

	console.log(`Chats saved to ${finetunedChatsFilePath}`);

	return {
		finetunedChatsFilePath,
		totalChats: finetunedChats.length,
		message: `✅ Successfully created finetuned chats file with ${finetunedChats.length} chats`
	};
};

export default createTrainingBatch;
