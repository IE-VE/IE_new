import type { Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output } from '@cloudflare/workers-types';

export async function transcribeAudio(
	audioBlob: Blob,
	question: string,
	platform: App.Platform
): Promise<Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output> {
	const ai = platform.env.AI;
	if (!ai) {
		throw new Error('OpenAI API key is not set');
	}

	const audioBuffer = await audioBlob.arrayBuffer();
	const audioDataBse64 = Buffer.from(audioBuffer).toString('base64');

	try {
		const response = await ai.run('@cf/openai/whisper-large-v3-turbo', {
			audio: audioDataBse64,
			language: 'en',
			task: 'transcribe',
			initial_prompt: `The question was: "${question}"`
		});

		return response;
	} catch (error) {
		console.error('Error transcribing audio:', error);
		throw error;
	}
}
