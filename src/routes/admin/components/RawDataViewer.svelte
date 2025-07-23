<script lang="ts">
	import type { InstructorFeedback } from './InstructorFeedbackForm.svelte';
	import InstructorFeedbackForm from './InstructorFeedbackForm.svelte';

	export type DisplayTab = 'session' | 'recordings' | 'feedback';

	const {
		session,
		onClose,
		copyToClipboard,
		instructorFeedbackMap,
		savingFeedbackMap,
		saveInstructorFeedback
	} = $props<{
		session: any;
		onClose: () => void;
		copyToClipboard: (data: any) => void;
		instructorFeedbackMap: Record<string, InstructorFeedback>;
		savingFeedbackMap: Record<string, boolean>;
		saveInstructorFeedback: (analysisId: string) => Promise<void>;
	}>();

	let activeTab = $state<DisplayTab>('session');
	let copySuccess = $state(false);
</script>

<div
	class="absolute right-0 z-50 mt-2 max-h-96 w-96 overflow-auto rounded-md bg-gray-900 p-4 text-xs text-white shadow-lg"
>
	<div class="mb-2 flex justify-between">
		<h4 class="font-bold">Raw Data</h4>
		<div class="flex items-center gap-2">
			<button
				onclick={(e) => {
					e.stopPropagation();
					copyToClipboard(activeTab === 'session' ? session : session.recordings);
				}}
				class="text-gray-400 hover:text-white"
				title="Copy to clipboard"
			>
				{copySuccess ? '✓' : '📋'}
			</button>
			<button
				onclick={(e) => {
					e.stopPropagation();
					onClose();
				}}
				class="text-gray-400 hover:text-white"
			>
				✕
			</button>
		</div>
	</div>
	<div class="mb-3 flex border-b border-gray-700">
		<div class="flex items-center gap-2">
			<button
				onclick={(e) => {
					e.stopPropagation();
					activeTab = 'session';
				}}
				class="cursor-pointer rounded-md px-2 py-1 text-xs {activeTab === 'session'
					? 'bg-gray-700 text-white'
					: 'bg-gray-800 text-gray-400 hover:text-white'}"
			>
				Session
			</button>
			<button
				onclick={(e) => {
					e.stopPropagation();
					activeTab = 'recordings';
				}}
				class="cursor-pointer rounded-md px-2 py-1 text-xs {activeTab === 'recordings'
					? 'bg-gray-700 text-white'
					: 'bg-gray-800 text-gray-400 hover:text-white'}"
			>
				Recordings
			</button>
			{#if session.analysis}
				<button
					onclick={(e) => {
						e.stopPropagation();
						activeTab = 'feedback';
						// Initialize feedback form with existing data if available
						const analysisId = session.analysis?.id;
						if (analysisId && !instructorFeedbackMap[analysisId]) {
							// First check if feedback exists in the session
							let existingFeedback = null;
							if (session.instructor_feedback) {
								try {
									existingFeedback = JSON.parse(session.instructor_feedback);
								} catch (e) {
									console.error('Error parsing instructor feedback:', e);
								}
							}
							// Fallback to analysis if needed
							if (!existingFeedback && session.analysis?.analysis.instructorFeedback) {
								existingFeedback = session.analysis.analysis.instructorFeedback;
							}

							instructorFeedbackMap[analysisId] = existingFeedback || {
								fluencyAndCoherence: undefined,
								lexicalResource: undefined,
								grammaticalRangeAndAccuracy: undefined,
								pronunciation: undefined,
								total: undefined,
								feedback: ''
							};
						}
					}}
					class="cursor-pointer rounded-md px-2 py-1 text-xs {activeTab === 'feedback'
						? 'bg-gray-700 text-white'
						: 'bg-gray-800 text-gray-400 hover:text-white'}"
				>
					Feedback
				</button>
			{/if}
		</div>
	</div>
	{#if activeTab === 'session'}
		<pre>{JSON.stringify(session, null, 2)}</pre>
	{:else if activeTab === 'recordings'}
		<pre>{JSON.stringify(session.recordings, null, 2)}</pre>
	{:else if activeTab === 'feedback' && session.analysis}
		<InstructorFeedbackForm
			analysisId={session.analysis.id}
			feedback={instructorFeedbackMap[session.analysis.id]}
			isSaving={savingFeedbackMap[session.analysis.id]}
			saveFeedback={saveInstructorFeedback}
		/>
	{/if}
</div>
