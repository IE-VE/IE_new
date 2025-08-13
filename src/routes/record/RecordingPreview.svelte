<script lang="ts">
	import type { ParsedRecording } from '$lib/db/types';
	import type { WhisperTranscription } from '$lib/db/types';
	import { P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const {
		recording,
		index,
		isAdmin = false,
		improvedAnswer = null
	} = $props<{
		recording: ParsedRecording;
		index: number;
		isAdmin?: boolean;
		improvedAnswer?: string | null;
	}>();

	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleString();
	}

	function formatTime(seconds: number) {
		const pad = (n: number) => n.toString().padStart(2, '0');
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		const ms = Math.floor((seconds % 1) * 1000);
		return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${ms.toString().padStart(3, '0')}`;
	}

	function generateVTTUrl() {
		if (!browser || !recording.transcription?.segments) return null;

		const segments = recording.transcription.segments as Required<WhisperTranscription>['segments'];

		const vttContent = `WEBVTT

${segments
	.map(
		(segment) => `
${formatTime(segment.start)} --> ${formatTime(segment.end)}
${segment.text.trim()}`
	)
	.join('\n')}`;

		return URL.createObjectURL(new Blob([vttContent], { type: 'text/vtt' }));
	}

	let vttUrl = $state<string | null>(null);

	onMount(() => {
		vttUrl = generateVTTUrl();

		// Cleanup URL when component is destroyed
		return () => {
			if (vttUrl && browser) URL.revokeObjectURL(vttUrl);
		};
	});
</script>

<div
	class="w-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
>
	<div class="border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-700">
		<span class="text-sm font-semibold text-teal-600 dark:text-teal-400">Question {index + 1}</span>
		<h3 class="text-base font-bold text-gray-900 dark:text-white">{recording.question_text}</h3>
		<p class="text-xs text-gray-500 dark:text-gray-400">
			Recorded on {formatDate(recording.timestamp)}
		</p>
	</div>
	<div class="p-4">
		{#if recording.video_object_key}
			<div
				class="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700"
			>
				<video
					src={`/api/video/${recording.video_object_key}`}
					class="absolute inset-0 h-full w-full object-cover"
					controls
					preload="none"
					playsinline
				>
					{#if browser && vttUrl}
						<track kind="captions" src={vttUrl} label="English" srclang="en" default />
					{/if}
				</video>
			</div>
		{:else if recording.audio_object_key}
			<div class="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
				<div class="flex items-center space-x-3">
					<svg
						class="h-6 w-6 text-gray-400 dark:text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
					<audio
						src={`/api/video/${recording.mp3_object_key || recording.audio_object_key}`}
						class="flex-1"
						controls
						preload="none"
					></audio>
				</div>
			</div>
		{/if}
		{#if recording.transcription_json}
			<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
				<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Transcription:</p>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{recording.transcription?.text}</p>
				{#if isAdmin && recording.pronunciation_analysis}
					<div class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
						<p class="text-xs font-medium text-gray-500 dark:text-gray-400">
							Pronunciation Analysis:
						</p>
						<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
							{recording.pronunciation_analysis}
						</p>
					</div>
				{/if}
			</div>

			{#if improvedAnswer}
				<div class="mt-3 rounded-lg bg-teal-50 p-3 dark:bg-teal-900/30">
					<p class="text-xs font-medium text-teal-600 dark:text-teal-400">Improved Answer:</p>
					<p class="mt-1 text-sm text-teal-700 dark:text-teal-300">
						{improvedAnswer}
					</p>
				</div>
			{/if}
		{:else}
			<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
				<p class="text-sm text-gray-500 dark:text-gray-400">Transcription in progress...</p>
			</div>
		{/if}
	</div>
</div>
