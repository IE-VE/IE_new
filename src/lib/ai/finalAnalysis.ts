import { GPT_INSTRUCTIONS } from './gptInstruction';
import type { ParsedRecording } from '$lib/db/types';
import { ANALYSIS_VERSION, CF_AI_GATEWAY } from '$lib/constants';

import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { createExercises, ExercisesSchema } from './createExercises';

//TODO: We can let another GPT make the exercises.
export const IELTSAnalysisSchema = z.object({
	questions: z.array(
		z.object({
			question: z.string(),
			answer: z.string(),
			correctedAnswer: z.string()
		})
	),
	feedback: z.object({
		fluencyAndCoherence: z.string(),
		lexicalResource: z.string(),
		grammaticalRangeAndAccuracy: z.string(),
		pronunciation: z.string()
	}),
	bandScores: z.object({
		fluencyAndCoherence: z.number().int(),
		lexicalResource: z.number().int(),
		grammaticalRangeAndAccuracy: z.number().int(),
		pronunciation: z.number().int()
	}),
	bandScore: z.object({
		band: z.number(),
		explanation: z.string()
	})
});

export type IELTSAnalysis = z.infer<typeof IELTSAnalysisSchema>;

export type TotalAnalysisResponse = IELTSAnalysis & {
	exercises: z.infer<typeof ExercisesSchema>['exercises'];
};

export async function finalAnalysis(
	recordings: ParsedRecording[],
	openaiApiKey: string
): Promise<TotalAnalysisResponse | null> {
	try {
		// Validate input
		if (!recordings || recordings.length === 0) {
			console.error('No recordings provided for analysis');
			return null;
		}

		if (!openaiApiKey) {
			console.error('OpenAI API key not provided');
			return null;
		}

		const openai = new OpenAI({
			apiKey: openaiApiKey,
			baseURL: CF_AI_GATEWAY.BASE_URL + '/openai'
		});

		// Format and validate Q&A pairs
		const qaPairs = recordings.map((recording, index) => {
			return {
				question: recording.question_text,
				answer: recording.transcription?.text,
				pronunciationAnalysis: recording.pronunciation_analysis
			};
		});

		console.log('Sending Q&A pairs to OpenAI:', JSON.stringify(qaPairs, null, 2));

		const result = await openai.beta.chat.completions.parse({
			model: 'ft:gpt-4o-2024-08-06:personal::B7oMnT26',
			store: true,
			//reasoning_effort: 'high',
			metadata: {
				version: ANALYSIS_VERSION.toString(),
				experiment_name: 'c13'
			},
			messages: [
				{
					role: 'developer',
					content: GPT_INSTRUCTIONS
				},
				{
					role: 'user',
					content: JSON.stringify(qaPairs)
				}
			],
			response_format: zodResponseFormat(IELTSAnalysisSchema, 'analysis')
		});

		if (!result.choices || result.choices.length === 0) {
			console.error('No response choices from OpenAI:', result);
			return null;
		}

		const analysis = result.choices[0].message.parsed;
		if (!analysis) {
			console.error('Failed to parse OpenAI response:', result.choices[0].message);
			return null;
		}

		// Validate the analysis structure
		try {
			const validated = IELTSAnalysisSchema.parse(analysis);
			console.log('Successfully validated analysis:', JSON.stringify(validated, null, 2));

			// Create exercises
			const exercises = await createExercises(recordings, validated.feedback, openaiApiKey);
			if (!exercises) {
				console.error('Failed to create exercises');
				return null;
			}

			return { ...validated, exercises };
		} catch (error) {
			console.error('Analysis failed schema validation:', error);
			console.error('Invalid analysis data:', analysis);
			return null;
		}
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			console.error('OpenAI API Error:', {
				status: error.status,
				message: error.message,
				code: error.code,
				type: error.type
			});
		} else {
			console.error('Error analyzing IELTS responses:', error);
		}
		return null;
	}
}
