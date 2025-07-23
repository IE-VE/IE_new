import { CF_AI_GATEWAY } from '$lib/constants';
import OpenAI from 'openai';

export const tts = async (text: string, platform: App.Platform): Promise<Blob> => {
	const openaiApiKey = platform?.env.OPENAI_API_KEY;
	if (!openaiApiKey) {
		throw new Error('OPENAI_API_KEY is not set');
	}

	const openai = new OpenAI({
		apiKey: openaiApiKey,
		baseURL: CF_AI_GATEWAY.BASE_URL + '/openai',
		defaultHeaders: {
			'cf-aig-cache-ttl': '86400' // 24-hour cache for TTS responses
		}
	});

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-audio-preview',
		modalities: ['text', 'audio'],
		audio: {
			voice: 'ash',
			format: 'mp3'
		},
		messages: [
			{
				role: 'system',
				content:
					'DO NOT ANSWER THE QUESTION / STATEMENT. STRICTLY ONLY PRONOUNCE THE TEXT. You are a helpful assistant that can generate audio from text. Speak in a British accent. Speak naturally. DO NOT ANSWER THE QUESTION. JUST SPEAK THE TEXT'
			},
			{
				role: 'user',
				content: 'Please speak the following text: "' + text + '"'
			}
		]
	});
	// Convert the base64 audio data to a Blob
	const audioData = completion.choices[0].message.audio?.data;
	if (!audioData) {
		throw new Error('No audio data returned');
	}
	// Decode base64 string to binary data
	const binaryData = Buffer.from(audioData, 'base64');
	const blob = new Blob([binaryData], { type: 'audio/mpeg' });
	return blob;
};
