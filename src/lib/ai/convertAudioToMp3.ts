export async function convertAudioToMp3(audioBlob: Blob) {
	const functionUrl = 'https://us-central1-insideielts-451714.cloudfunctions.net/convertToMp3';
	// Create a FormData instance and append the Blob
	const form = new FormData();
	form.append('audio', audioBlob, 'audio-input');

	// Send the request to the Cloud Function
	const response = await fetch(functionUrl, {
		method: 'POST',
		body: form
	});
	const arrayBuffer = await response.arrayBuffer();

	// Create the mp3 blob
	const mp3Blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

	return mp3Blob;
}
