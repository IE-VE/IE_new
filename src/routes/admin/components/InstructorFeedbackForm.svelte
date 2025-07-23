<script lang="ts">
	export type InstructorFeedback = {
		fluencyAndCoherence?: number;
		lexicalResource?: number;
		grammaticalRangeAndAccuracy?: number;
		pronunciation?: number;
		total?: number;
		feedback?: string;
	};

	const { analysisId, feedback, isSaving, saveFeedback } = $props<{
		analysisId: string;
		feedback: InstructorFeedback;
		isSaving: boolean;
		saveFeedback: (analysisId: string) => Promise<void>;
	}>();

	let currentFeedback = $state<InstructorFeedback>({
		fluencyAndCoherence: feedback?.fluencyAndCoherence,
		lexicalResource: feedback?.lexicalResource,
		grammaticalRangeAndAccuracy: feedback?.grammaticalRangeAndAccuracy,
		pronunciation: feedback?.pronunciation,
		total: feedback?.total,
		feedback: feedback?.feedback || ''
	});

	$effect(() => {
		// Update parent's feedback object when currentFeedback changes
		feedback.fluencyAndCoherence = currentFeedback.fluencyAndCoherence;
		feedback.lexicalResource = currentFeedback.lexicalResource;
		feedback.grammaticalRangeAndAccuracy = currentFeedback.grammaticalRangeAndAccuracy;
		feedback.pronunciation = currentFeedback.pronunciation;
		feedback.total = currentFeedback.total;
		feedback.feedback = currentFeedback.feedback;
	});
</script>

<div class="space-y-4 p-2">
	<h4 class="font-bold text-white">Instructor Feedback</h4>
	<div class="space-y-2">
		<div>
			<label class="mb-1 block text-xs text-gray-300">Fluency & Coherence (1-9)</label>
			<input
				type="number"
				min="1"
				max="9"
				class="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white"
				onchange={(e) => {
					currentFeedback.fluencyAndCoherence =
						parseInt((e.target as HTMLInputElement).value) || undefined;
				}}
				value={currentFeedback.fluencyAndCoherence}
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs text-gray-300">Lexical Resource (1-9)</label>
			<input
				type="number"
				min="1"
				max="9"
				class="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white"
				onchange={(e) => {
					currentFeedback.lexicalResource =
						parseInt((e.target as HTMLInputElement).value) || undefined;
				}}
				value={currentFeedback.lexicalResource}
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs text-gray-300">Grammatical Range & Accuracy (1-9)</label>
			<input
				type="number"
				min="1"
				max="9"
				class="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white"
				onchange={(e) => {
					currentFeedback.grammaticalRangeAndAccuracy =
						parseInt((e.target as HTMLInputElement).value) || undefined;
				}}
				value={currentFeedback.grammaticalRangeAndAccuracy}
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs text-gray-300">Pronunciation (1-9)</label>
			<input
				type="number"
				min="1"
				max="9"
				class="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white"
				onchange={(e) => {
					currentFeedback.pronunciation =
						parseInt((e.target as HTMLInputElement).value) || undefined;
				}}
				value={currentFeedback.pronunciation}
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs text-gray-300">Total (1-9)</label>
			<input
				type="number"
				step="0.1"
				min="1"
				max="9"
				class="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white"
				onchange={(e) => {
					currentFeedback.total = parseFloat((e.target as HTMLInputElement).value) || undefined;
				}}
				value={currentFeedback.total}
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs text-gray-300">Feedback</label>
			<textarea
				class="h-24 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white"
				onchange={(e) => {
					currentFeedback.feedback = (e.target as HTMLTextAreaElement).value;
				}}
				value={currentFeedback.feedback || ''}
			></textarea>
		</div>
		<button
			onclick={() => saveFeedback(analysisId)}
			class="mt-2 w-full rounded bg-teal-600 px-3 py-1 text-white hover:bg-teal-700 {isSaving
				? 'cursor-not-allowed opacity-50'
				: ''}"
			disabled={isSaving}
		>
			{isSaving ? 'Saving...' : 'Save Feedback'}
		</button>
	</div>
</div>
