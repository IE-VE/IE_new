import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ParsedRecording } from '$lib/db/types';
import { CF_AI_GATEWAY } from '$lib/constants';

// Exercise schema definition
export const ExercisesSchema = z.object({
	exercises: z.array(
		z.object({
			title: z.string(),
			instruction: z.string(),
			examples: z.array(z.string())
		})
	)
});

export type Exercises = z.infer<typeof ExercisesSchema>['exercises'];

// Exercise-specific GPT instructions
const EXERCISE_INSTRUCTIONS = `
You are an expert IELTS speaking coach. Your task is to create personalised practice exercises 
based on a student's speaking performance.

# INPUT
You will receive:
1. The student's performance data including questions and answers
2. Feedback on their performance in four IELTS criteria:
   - Fluency and Coherence
   - Lexical Resource
   - Grammatical Range and Accuracy
   - Pronunciation

# OUTPUT
Create 4 targeted exercises that address the student's specific weaknesses.
Each exercise should:
- Have a clear title explaining the focus area
- Include detailed instructions
- Provide 2-3 examples for the student to work with
- Be challenging but achievable
- Focus on practical improvement in real-world speaking contexts

# IMPORTANT RULES
- Use Markdown to format the exercises
- Be specific and targeted - exercises should directly address identified weaknesses
- Use British English spelling
- Make exercises practical and relevant to IELTS speaking contexts
- Ensure a mix of exercise types (rewriting, vocabulary building, spoken practice, etc.)
- Remember these exercises are for self-study, so make them clearly explained
- Keep the description short and concise
- Aim for 100-150 words per exercise


# EXERCISE EXAMPLES
Below are examples of exercises. Use them as inspiration, but do not copy them verbatim.

<exercise_examples>
Example 1:
---
Exercise 1: Sentence Rewriting
Rewrite the following sentences to improve coherence and grammar:

Currently, I live in Dhaka. That is the central point of Bangladesh.
They can get proper medical treatment because all of the specialised hospital and better education systems.
---

Example 2:
---
Exercise 2: Vocabulary Expansion
Replace the repetitive phrase "various types of" in these sentences with more precise words:

I live here to get various types of opportunity.
There are various types of advantages to living in Dhaka.
---

Example 3:
---
Exercise 3: Linking Words
Fill in the blanks with appropriate linking words:

Dhaka is a convenient place to live, ______ it offers great facilities.
There are many things I like about Dhaka. ______, I appreciate the city's architecture.
---
</exercise_examples>
`;

/**
 * Creates personalised exercises based on student's recordings and feedback
 *
 * @param recordings - Array of student's parsed recordings
 * @param feedback - Feedback object with assessments in the four IELTS criteria
 * @param openaiApiKey - OpenAI API key
 * @returns Promise with array of exercises or null if generation fails
 */
export async function createExercises(
	recordings: ParsedRecording[],
	feedback: {
		fluencyAndCoherence: string;
		lexicalResource: string;
		grammaticalRangeAndAccuracy: string;
		pronunciation: string;
	},
	openaiApiKey: string
): Promise<Exercises | null> {
	try {
		// Validate input
		if (!recordings || recordings.length === 0) {
			console.error('No recordings provided for exercise creation');
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

		// Format recordings for analysis
		const qaPairs = recordings.map((recording) => {
			try {
				const transcription = JSON.parse(recording.transcription_json || '{}');
				return {
					question: recording.question_text,
					answer: transcription.text || '',
					pronunciationAnalysis: recording.pronunciation_analysis
				};
			} catch (error) {
				console.error(`Error parsing transcription:`, error);
				return {
					question: recording.question_text,
					answer: '',
					pronunciationAnalysis: null
				};
			}
		});

		// Create input data for AI
		const inputData = {
			recordings: qaPairs,
			feedback
		};

		console.log(
			'Sending data to OpenAI for exercise creation:',
			JSON.stringify(inputData, null, 2)
		);

		// Generate exercises with AI
		const result = await openai.beta.chat.completions.parse({
			model: 'o4-mini',
			store: true,
			reasoning_effort: 'medium',
			metadata: {
				version: '1',
				experiment_name: 'exercises-creation'
			},
			messages: [
				{
					role: 'developer',
					content: EXERCISE_INSTRUCTIONS
				},
				{
					role: 'user',
					content: JSON.stringify(inputData)
				}
			],
			response_format: zodResponseFormat(ExercisesSchema, 'exercises')
		});

		if (!result.choices || result.choices.length === 0) {
			console.error('No response choices from OpenAI:', result);
			return null;
		}

		const exercises = result.choices[0].message.parsed;
		if (!exercises) {
			console.error('Failed to parse OpenAI response:', result.choices[0].message);
			return null;
		}

		// Validate the exercises structure
		try {
			const validated = ExercisesSchema.parse(exercises);
			console.log('Successfully created exercises:', JSON.stringify(validated, null, 2));
			return validated.exercises;
		} catch (error) {
			console.error('Exercises failed schema validation:', error);
			console.error('Invalid exercises data:', exercises);
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
			console.error('Error creating exercises:', error);
		}
		return null;
	}
}
