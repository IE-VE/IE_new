// IELTS Questions for speaking practice
export const QUESTIONS = [
	'Tell me about your hometown.',
	'What do you like to do in your free time?',
	'What are your plans for the future?'
] as const;

// Version information for analysis (integer format as used in doAnalyses)
export const ANALYSIS_VERSION = 19;

export const CF_AI_GATEWAY = {
	BASE_URL: `https://gateway.ai.cloudflare.com/v1/2d7fc4e0856cf0f4eda5d763d6759322/ielts`
} as const;
