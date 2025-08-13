<script lang="ts">
	import { onMount } from 'svelte';
	import CompletedState from './CompletedState.svelte';
	import VideoPreference from './VideoPreference.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { ParsedRecording, SessionUpdateResponse, UploadResponse } from '$lib/db/types';
	import { tracking } from '$lib/utils/analytics';
	import { Heading, P } from 'flowbite-svelte';

	const { data } = $props();
	const { sessionId, session: remoteSession, recordings: remoteRecordings } = data;

	// Preserve the session data from the backend
	let session = $state(remoteSession);
	let recordings = $state<ParsedRecording[]>(remoteRecordings || []);
	let currentQuestionIndex = $state(remoteSession?.current_question_index ?? 0);
	let hasChosenRecordingMode = $state(!!session?.created_at);
	let useVideo = $state(session?.use_video ?? true);

	// Log session data for debugging
	console.log(
		`📊 Session data - ID: ${sessionId}, UseVideo: ${useVideo}, Session UseVideo: ${session?.use_video}`
	);

	// Recording state
	let isRecording = $state(false);
	let isReviewing = $state(false);
	let isProcessing = $state(false);
	let isPreRecordingCountdown = $state(false);
	let isPlayingQuestion = $state(false);

	// Media state
	let stream: MediaStream | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let audioRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];
	let audioChunks: Blob[] = [];

	// UI elements
	let videoPreview: HTMLVideoElement | null = $state(null);
	let recordedVideoUrl: string | null = $state(null);
	let audioUrl: string | null = $state(null);
	let questionAudio: HTMLAudioElement | null = null;

	// Timers
	let countdown = $state(45); // 45 seconds per question
	let countdownInterval: number;
	let preRecordingCountdown = $state(3); // 3 second countdown before recording
	let minRecordingTime = $state(import.meta.env.DEV ? 0 : 25); // No minimum in dev mode, 25 seconds in production

	// MIME types
	let mimeType: string | null = null;
	let audioMimeType: string | null = null;

	function getSupportedVideoMimeType() {
		const candidates = [
			'video/mp4; codecs="avc1.64001F, mp4a.40.2"', // High Profile @ Level 3.1
			'video/mp4; codecs="avc1.4D401F, mp4a.40.2"', // Main Profile @ Level 3.1
			'video/mp4; codecs="avc1.4D401E, mp4a.40.2"', // Main Profile @ Level 3.0
			'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // Baseline Profile @ Level 3.0
			'video/webm; codecs="vp9,opus"', // Fallback to VP9 in WebM
			'video/webm; codecs="vp8,vorbis"' // Fallback to VP8 in WebM
		];

		for (const type of candidates) {
			if (MediaRecorder.isTypeSupported(type)) {
				return type;
			}
		}

		return null;
	}

	function getSupportedAudioMimeType() {
		const candidates = [
			'audio/mp4; codecs="mp4a.40.2"', // AAC in MP4
			'audio/webm; codecs="opus"', // Opus in WebM
			'audio/webm; codecs="vorbis"' // Vorbis in WebM
		];

		for (const type of candidates) {
			if (MediaRecorder.isTypeSupported(type)) {
				return type;
			}
		}

		return null;
	}

	async function initializeRecording() {
		try {
			// Only request video permissions if video mode is enabled
			const constraints = useVideo ? { video: true, audio: true } : { video: false, audio: true };

			stream = await navigator.mediaDevices.getUserMedia(constraints);

			if (useVideo && videoPreview) {
				videoPreview.srcObject = stream;
				await videoPreview.play();
			}

			// Initialize audio recorder
			await initializeAudioRecorder(stream);
		} catch (err) {
			console.error('Error initializing:', err);
			alert(
				useVideo
					? "Unable to access camera or microphone. Please ensure you've granted permission."
					: "Unable to access microphone. Please ensure you've granted permission."
			);
		}
	}

	async function handleVideoPreference(useVideoParam: boolean) {
		useVideo = useVideoParam;
		hasChosenRecordingMode = true;

		// Create or update the session in the database with the user's choice
		try {
			console.log(`🔧 Creating session with useVideo: ${useVideo}`);
			const response = await fetch('/api/session/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sessionId,
					use_video: useVideo
				})
			});

			if (!response.ok) {
				console.error('Failed to create/update session');
			} else {
				// Update local session object
				const result = (await response.json()) as SessionUpdateResponse;
				if (result.session) {
					session = result.session;
					console.log(
						`✅ Session created/updated successfully with useVideo: ${session.use_video}`
					);
				}
			}
		} catch (err) {
			console.error('Error creating/updating session:', err);
		}

		initializeRecording();
	}

	async function initializeAudioRecorder(stream: MediaStream) {
		try {
			const audioStream = new MediaStream(stream.getAudioTracks());
			audioRecorder = new MediaRecorder(audioStream, {
				mimeType: audioMimeType!
			});

			audioRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunks.push(event.data);
				}
			};

			audioRecorder.onstop = () => {
				// Find a format that works on all browsers
				const blob = new Blob(audioChunks, { type: audioMimeType! });
				if (audioUrl) {
					URL.revokeObjectURL(audioUrl);
				}
				audioUrl = URL.createObjectURL(blob);
			};
		} catch (err) {
			console.error('Error initializing audio recorder:', err);
		}
	}

	async function startRecording() {
		if (!stream) return;

		// Start pre-recording countdown
		isPreRecordingCountdown = true;
		preRecordingCountdown = 3;

		const preCountdownInterval = window.setInterval(() => {
			preRecordingCountdown--;
			if (preRecordingCountdown <= 0) {
				clearInterval(preCountdownInterval);
				isPreRecordingCountdown = false;
				beginRecording();
			}
		}, 1000);
	}

	function beginRecording() {
		if (!stream) return;

		if (useVideo) {
			mediaRecorder = new MediaRecorder(stream, {
				mimeType: mimeType!
			});
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				if (recordedVideoUrl) {
					URL.revokeObjectURL(recordedVideoUrl);
					recordedVideoUrl = null;
				}
				const blob = new Blob(recordedChunks, {
					type: mimeType!
				});
				recordedVideoUrl = URL.createObjectURL(blob);
				isReviewing = true;
			};

			mediaRecorder.start(100);
		}

		// Start audio recording
		if (audioRecorder) {
			audioChunks = [];
			audioRecorder.start(100);

			if (!useVideo) {
				audioRecorder.onstop = () => {
					const blob = new Blob(audioChunks, { type: audioMimeType! });
					if (audioUrl) {
						URL.revokeObjectURL(audioUrl);
						audioUrl = null;
					}
					audioUrl = URL.createObjectURL(blob);
					isReviewing = true;
				};
			}
		}

		isRecording = true;
		startCountdown();

		// Track recording start
		tracking.startRecording(currentQuestionIndex + 1, sessionId);
	}

	function startCountdown() {
		countdown = 45; // Reset to 45 seconds
		countdownInterval = window.setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				stopRecording();
			}
		}, 1000);
	}

	function stopRecording() {
		// Don't allow stopping before minimum time (except in dev mode where minRecordingTime is 0)
		const recordingTime = 45 - countdown;
		if (recordingTime < minRecordingTime) {
			console.log(
				`⏱️ Recording time (${recordingTime}s) is less than minimum (${minRecordingTime}s)`
			);
			return;
		}

		clearInterval(countdownInterval);
		if (mediaRecorder?.state === 'recording') {
			mediaRecorder.stop();
		}
		// Stop audio recording
		if (audioRecorder?.state === 'recording') {
			audioRecorder.stop();
		}
		isRecording = false;
		countdown = 45;

		// Track recording stop
		tracking.stopRecording(currentQuestionIndex + 1, sessionId);
	}

	async function confirmAndUpload() {
		if (!session) return;

		isProcessing = true;

		const formData = new FormData();
		formData.append('sessionId', sessionId);
		formData.append('questionIndex', (session.current_question_index || 0).toString());
		formData.append('useVideo', session.use_video.toString());

		if (useVideo && recordedChunks.length > 0) {
			const videoBlob = new Blob(recordedChunks, {
				type: mimeType!
			});
			formData.append('video', videoBlob);
		}

		const audioBlob =
			audioChunks.length > 0 ? new Blob(audioChunks, { type: audioMimeType! }) : null;
		if (audioBlob) {
			formData.append('audio', audioBlob);
		}

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to upload recording');
			}

			const result = (await response.json()) as UploadResponse;

			if (result.success) {
				// Track question completion
				tracking.nextQuestion(currentQuestionIndex + 1, sessionId);

				// Clean up resources
				cleanupMediaResources();

				isReviewing = false;
				isProcessing = false;

				// Update session
				session = result.session;
				recordings = result.recordings;
				currentQuestionIndex = session.current_question_index;

				// Don't reload the page, but we start a new recording for the next question.
				await initializeRecording();
			} else {
				throw new Error(result.message || 'Failed to upload recording');
			}
		} catch (err) {
			isProcessing = false;
			console.error('Error uploading recording:', err);
			alert('Failed to upload recording. Please try again.');
		}
	}

	function cleanupMediaResources() {
		// Clean up video resources
		if (recordedVideoUrl) {
			URL.revokeObjectURL(recordedVideoUrl);
			recordedVideoUrl = null;
		}
		recordedChunks = [];

		// Clean up audio resources
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
			audioUrl = null;
		}
		audioChunks = [];

		// Stop any existing tracks
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	async function reRecord() {
		cleanupMediaResources();
		isReviewing = false;
		await initializeRecording();
	}

	async function playQuestion(question: string) {
		try {
			isPlayingQuestion = true;
			const response = await fetch('/api/tts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: question })
			});

			if (!response.ok) {
				throw new Error('Failed to generate speech');
			}

			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);

			if (questionAudio) {
				questionAudio.pause();
				URL.revokeObjectURL(questionAudio.src);
			}

			questionAudio = new Audio(audioUrl);
			questionAudio.onended = () => {
				isPlayingQuestion = false;
				if (questionAudio) {
					URL.revokeObjectURL(questionAudio.src);
					questionAudio = null;
				}
			};
			await questionAudio.play();
		} catch (err) {
			console.error('Error playing question:', err);
			isPlayingQuestion = false;
		}
	}

	onMount(() => {
		// Initialize MIME types
		mimeType = getSupportedVideoMimeType();
		audioMimeType = getSupportedAudioMimeType();

		if (!navigator.mediaDevices?.getUserMedia) {
			alert(
				"Sorry, your browser doesn't support recording. Please try Chrome, Firefox, or Safari."
			);
			return;
		}

		if (!audioMimeType || (useVideo && !mimeType)) {
			alert(
				"Sorry, your browser doesn't support recording. Please try Chrome, Firefox, or Safari."
			);
			return;
		}

		// Don't initialize recording until user has chosen their mode
		if (hasChosenRecordingMode) {
			initializeRecording();
		}

		// Cleanup on component unmount
		return () => {
			cleanupMediaResources();

			if (questionAudio) {
				questionAudio.pause();
				URL.revokeObjectURL(questionAudio.src);
			}

			// Clear any active intervals
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}
		};
	});
</script>

<div class="container mx-auto max-w-4xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12 text-center">
		<P class="text-center" size="xl">
			{#if session?.status === 'completed'}
				Review your answers and get your detailed analysis.
			{:else}
				Answer the three "Part 1" questions. Try to talk for at least 30 seconds for each answer.
			{/if}
		</P>
	</div>

	{#if session?.status === 'completed' && session && recordings}
		<CompletedState {session} {recordings} />
	{:else if !hasChosenRecordingMode}
		<VideoPreference onChoice={handleVideoPreference} />
	{:else}
		<!-- Main Content -->
		<Card variant="greyscale">
			<!-- Question Display -->
			<div class="flex items-center justify-between">
				<P>
					Question {currentQuestionIndex + 1}
				</P>
				<button
					class="flex items-center space-x-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-200 disabled:opacity-50 dark:bg-teal-800 dark:text-teal-300 dark:hover:bg-teal-700"
					onclick={() => playQuestion(session?.current_question || '')}
					disabled={isPlayingQuestion || !session?.current_question}
				>
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						class:hidden={isPlayingQuestion}
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<svg
						class="h-5 w-5 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class:hidden={!isPlayingQuestion}
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span>{isPlayingQuestion ? 'Playing...' : 'Play'}</span>
				</button>
			</div>
			<Heading tag="h4" class="mt-2 mb-8">
				{session?.current_question || ''}
			</Heading>

			<!-- Video/Audio Preview -->
			{#if useVideo}
				<div
					class="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-50 sm:aspect-video dark:bg-gray-700"
				>
					{#if isReviewing && recordedVideoUrl}
						<video
							src={recordedVideoUrl}
							class="h-full w-full object-cover"
							controls
							preload="auto"
							playsinline
						></video>
					{:else}
						<video
							bind:this={videoPreview}
							class="h-full w-full object-cover"
							muted
							playsinline
							autoplay
						></video>
						{#if isPreRecordingCountdown}
							<div class="absolute inset-0 flex items-center justify-center bg-black/30">
								<div class="text-center">
									<p class="mb-2 text-xl font-medium text-white">Answer the question in</p>
									<span
										class="rounded-full bg-black/50 px-8 py-6 text-6xl font-bold text-white shadow-lg backdrop-blur-sm"
										>{preRecordingCountdown}</span
									>
								</div>
							</div>
						{:else if isRecording}
							<div
								class="absolute bottom-4 left-4 flex items-center space-x-2 rounded-full bg-red-500 px-4 py-2 text-white shadow-md"
							>
								<div class="h-2 w-2 animate-pulse rounded-full bg-white"></div>
								<span class="text-sm font-medium">Recording... {countdown}s</span>
							</div>
						{/if}
					{/if}
				</div>
			{:else}
				<!-- Audio-only mode UI -->
				<div class="mb-8 rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-700">
					{#if isPreRecordingCountdown}
						<div class="flex flex-col items-center justify-center space-y-4">
							<p class="text-xl font-medium text-gray-700 dark:text-gray-200">
								Answer the question in
							</p>
							<span
								class="rounded-full bg-gray-200 px-8 py-6 text-6xl font-bold text-gray-900 shadow-lg dark:bg-gray-600 dark:text-white"
								>{preRecordingCountdown}</span
							>
						</div>
					{:else if isRecording}
						<div class="flex flex-col items-center justify-center space-y-4">
							<div class="h-4 w-4 animate-pulse rounded-full bg-red-500"></div>
							<p class="text-lg font-medium text-gray-700 dark:text-gray-200">
								Recording... {countdown}s
							</p>
						</div>
					{:else if isReviewing && audioUrl}
						<audio src={audioUrl} controls class="w-full"></audio>
					{:else}
						<P class="text-center"
							><strong>Ready to record your answer</strong><br />
							Speak naturally and clearly. Try to give detailed answers.
						</P>
					{/if}
				</div>
			{/if}

			<!-- Controls -->
			<div class="flex justify-center space-x-4">
				{#if isReviewing}
					{#if isProcessing}
						<div class="flex items-center space-x-3">
							<div
								class="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
							></div>
							<span class="text-lg font-medium text-gray-600">Processing your answer...</span>
						</div>
					{:else}
						<button
							onclick={reRecord}
							class="transform cursor-pointer rounded-lg bg-gray-600 px-10 py-5 text-xl font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-gray-700"
						>
							Record Again
						</button>
						<button
							onclick={confirmAndUpload}
							class="transform cursor-pointer rounded-lg bg-teal-600 px-10 py-5 text-xl font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-teal-700"
						>
							{currentQuestionIndex < (session?.total_questions ?? 0) - 1
								? 'Next Question'
								: 'Finish Test'}
						</button>
					{/if}
				{:else if !isRecording}
					<button
						onclick={startRecording}
						class="transform cursor-pointer rounded-lg bg-teal-600 px-10 py-5 text-xl font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-teal-700"
					>
						{currentQuestionIndex === 0 ? 'Start Test' : 'Record Answer'}
					</button>
				{:else}
					<button
						onclick={stopRecording}
						class="transform cursor-pointer rounded-lg bg-red-600 px-10 py-5 text-xl font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-red-700 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-red-600"
						disabled={45 - countdown < minRecordingTime}
					>
						{#if 45 - countdown < minRecordingTime && minRecordingTime > 0}
							Keep going for {minRecordingTime - (45 - countdown)}s...
						{:else}
							Stop Recording
						{/if}
					</button>
				{/if}
			</div>
		</Card>
		<P class="mt-4 text-center ">
			{#if import.meta.env.DEV}
				Dev mode: No minimum recording time. Recording will automatically stop after 45 seconds.
			{:else}
				Your recording must be over {minRecordingTime} seconds long and will automatically stop after
				45 seconds.
			{/if}
		</P>
	{/if}
</div>
