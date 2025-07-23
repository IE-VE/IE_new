export async function transcribeAudioV2(
	object_key: string,
	question: string,
	platform: App.Platform
) {
	// We use the assembly API
	// The assembly API expects a link to a file though.
	// We have the audio in R2, so we need to get a link to it.
	// We can have an endpoint already to grab the mp3 file, lets use that.
	// Now we can use the assembly API to transcribe the audio.

	// Construct the URL to our audio file endpoint
	const audioUrl = `https://insideielts.com/api/video/${object_key}`;

	// Make the request to AssemblyAI
	const response = await fetch('https://api.assemblyai.com/v2/transcript', {
		method: 'POST',
		headers: {
			Authorization: platform.env.ASSEMBLY_API_KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			audio_url: audioUrl,
			language_code: 'en_us',
			disfluencies: true
		})
	});

	if (!response.ok) {
		throw new Error('Failed to submit audio for transcription');
	}

	return await response.json();
}
