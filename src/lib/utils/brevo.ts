export async function brevoEventResultEmailSent(apiKey: string, email: string, sessionId: string) {
	console.log('📤 Sending Brevo event for:', email, 'with sessionId:', sessionId);

	try {
		const requestBody = {
			email,
			event: 'free_test_result_email_sent',
			properties: {
				sessionId
			}
		};

		console.log('🔍 Request payload:', JSON.stringify(requestBody));

		const response = await fetch('https://in-automate.brevo.com/api/v2/trackEvent', {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				'ma-key': apiKey
			},
			body: JSON.stringify(requestBody)
		});

		const responseData = await response.json().catch(() => null);

		if (!response.ok) {
			console.error('❌ Failed to send Brevo event result email', response.status, responseData);
			throw new Error(`Failed to send Brevo event result email: ${response.status}`);
		}

		console.log('✅ Successfully sent Brevo event');
		return responseData;
	} catch (error) {
		console.error('❌ Error sending Brevo event:', error);
		throw error;
	}
}
