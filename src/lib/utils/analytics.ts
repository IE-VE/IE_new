interface GAEventParams {
	eventCategory?: string;
	eventAction?: string;
	eventLabel?: string;
	sessionId?: string;
	questionNumber?: number;
	emailProvided?: string;
	[key: string]: any;
}

/**
 * Safely pushes events to the dataLayer
 * @param eventName - The name of the event to track
 * @param params - Additional parameters for the event
 */
export function trackEvent(eventName: string, params: GAEventParams = {}) {
	// Check if we're in a browser environment
	if (typeof window === 'undefined') return;

	// Initialize dataLayer if it doesn't exist
	window.dataLayer = window.dataLayer || [];

	// Construct the event object
	const eventObject = {
		event: eventName,
		eventCategory: 'IELTS_Speaking',
		...params
	};

	// Push to dataLayer
	window.dataLayer.push(eventObject);
}

// Predefined events based on our tagging plan
export const tracking = {
	// Landing page CTA
	startTest: () =>
		trackEvent('cta_click', {
			eventAction: 'click',
			eventLabel: 'Start Test - Landing'
		}),

	// Recording flow
	startRecording: (questionNumber: number, sessionId: string) =>
		trackEvent('start_recording', {
			eventAction: 'start',
			questionNumber,
			sessionId
		}),

	stopRecording: (questionNumber: number, sessionId: string) =>
		trackEvent('stop_recording', {
			eventAction: 'stop',
			questionNumber,
			sessionId
		}),

	// Question progress
	nextQuestion: (questionNumber: number, sessionId: string) =>
		trackEvent('next_question', {
			eventAction: 'answered',
			eventLabel: `Question ${questionNumber}`,
			questionNumber,
			sessionId
		}),

	// Test completion
	testCompleted: (sessionId: string) =>
		trackEvent('test_completed', {
			eventAction: 'complete',
			eventLabel: 'All Questions Answered',
			sessionId
		}),

	// Email collection
	emailSubmit: (email: string, sessionId: string) =>
		trackEvent('email_submit', {
			eventAction: 'form_submit',
			eventLabel: 'Results Request',
			emailProvided: email,
			sessionId
		}),

	// Start new test (from completion page)
	startNewTest: (sessionId: string) =>
		trackEvent('cta_click', {
			eventAction: 'click',
			eventLabel: 'Start New Test',
			sessionId
		}),

	// Coaching conversion
	bookCoaching: (sessionId: string) =>
		trackEvent('coaching_cta_click', {
			eventAction: 'click',
			eventLabel: 'Book Coaching',
			sessionId
		}),

	// Exercise interactions
	toggleExercise: (sessionId: string, exerciseTitle: string, action: 'show' | 'hide') =>
		trackEvent('exercise_interaction', {
			eventAction: action,
			eventLabel: exerciseTitle,
			sessionId
		}),

	// Upsell 6-day plan CTA
	upsellCta: (
		sessionId: string,
		currentScore: number,
		targetScore: number,
		discountedPrice: number
	) =>
		trackEvent('upsell_cta_click', {
			eventAction: 'click',
			eventLabel: 'Start 6-Day Plan',
			sessionId,
			currentScore,
			targetScore,
			discountedPrice
		})
};

// Type declaration for window.dataLayer
declare global {
	interface Window {
		dataLayer: any[];
	}
}

export function shouldLoadAnalytics(path: string): boolean {
	return !path.startsWith('/admin');
}
