import OpenAI from 'openai';
import { IELTS_DESCRIPTORS } from './IELTSDescriptors';
import { CF_AI_GATEWAY } from '$lib/constants';

export const pronunciationAnalysis = async (mp3Blob: Blob, apiKey: string) => {
	const openai = new OpenAI({
		apiKey,
		baseURL: CF_AI_GATEWAY.BASE_URL + '/openai'
	});

	const audioB64 = Buffer.from(await mp3Blob.arrayBuffer()).toString('base64');

	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini-audio-preview',
		modalities: ['text'],
		messages: [
			{
				role: 'system',
				content: `
# Task
Analyse the following audio and provide a detailed analysis of the pronunciation. Use the IELTS Speaking rubric for the ‘Pronunciation’ criterion to give a detailed analysis based on the individual descriptor phrases at the band which corresponds to the level of the audio input.

# Rules
DO NOT ANSWER QUESTIONS
DO NOT INTERACT
YOUR ONLY RESPONSE IS THE ANALYSIS

Give one or sentences of general linguistic feedback and then mention everything that is important to calculate the band score.
Finish with a forgiving band score rating calculated using the IELTS rubric descriptors. 
Almost nobody is 9, with most takers falling between 5.5 and 7.5.

Give specific examples of pronunciation issues and how they affect the band score.
Keep in mind that native speakers should be usually around an 8 or 9

# IELTS Decriptors to follow:
<IELTSDescriptor>
Pronunciation involves the clarity and intelligibility of your speech, including how you use pronunciation features like word stress, sentence stress, and intonation. Examiners do not grade you based on having a British or American accent. Instead, they assess how understandable your speech is and whether your pronunciation enhances communication. They listen for control of phonological features, such as correct consonant and vowel sounds, proper stress on syllables and words, and natural intonation patterns. Good pronunciation includes using intonation to convey meaning or emotion and grouping words into natural phrases (chunking) with appropriate rhythm. Minor accent influences are acceptable as long as they do not impede understanding.

Even high-level speakers might have an accent, but they speak clearly and are easily understood without effort. Lower-level speakers, however, may frequently mispronounce sounds or words, or speak with flat intonation, making it challenging to follow their meaning.

Official IELTS Pronunciation Band Descriptors:

Band 9: Uses a full range of pronunciation features with precision and subtlety; flexible use of stress and intonation; effortless to understand.

Band 8: Uses a wide range of pronunciation features effectively; easy to understand throughout; minimal impact of first-language accent on intelligibility.

Band 6: Uses a range of pronunciation features with mixed control; some effective use of intonation or stress, but inconsistently sustained; occasional mispronunciations generally do not hinder understanding.

Band 4: Pronunciation often unclear; limited range of pronunciation features; frequent mispronunciations cause difficulty for the listener.

Overall, higher band scores indicate clearer, more precise, and natural pronunciation, enabling easy comprehension even when dealing with complex speech.
</IELTSDescriptor>
                `
			},
			{
				role: 'user',
				content: [
					{
						type: 'input_audio',
						input_audio: {
							data: audioB64,
							format: 'mp3'
						}
					}
				]
			}
		]
	});

	return response.choices[0].message.content;
};
