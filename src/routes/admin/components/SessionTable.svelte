<script lang="ts">
	import SessionRow from './SessionRow.svelte';
	import type { InstructorFeedback } from './InstructorFeedbackForm.svelte';

	const {
		sessions,
		expandedSessionId,
		showRawData,
		regeneratingMap,
		instructorFeedbackMap,
		savingFeedbackMap,
		toggleSession,
		toggleRawData,
		regenerateAnalysis,
		saveInstructorFeedback,
		copyToClipboard
	} = $props<{
		sessions: any[];
		expandedSessionId: string | null;
		showRawData: string | null;
		regeneratingMap: Record<string, boolean>;
		instructorFeedbackMap: Record<string, InstructorFeedback>;
		savingFeedbackMap: Record<string, boolean>;
		toggleSession: (sessionId: string) => void;
		toggleRawData: (sessionId: string, event: MouseEvent) => void;
		regenerateAnalysis: (sessionId: string) => Promise<void>;
		saveInstructorFeedback: (analysisId: string) => Promise<void>;
		copyToClipboard: (data: any) => void;
	}>();
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					ID
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Last Updated
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Status
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Email
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Questions
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Version
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Band Score
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Instructor Score
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Actions
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200 bg-white">
			{#each sessions as session}
				<SessionRow
					{session}
					{expandedSessionId}
					{showRawData}
					{regeneratingMap}
					{toggleSession}
					{toggleRawData}
					{regenerateAnalysis}
					{instructorFeedbackMap}
					{savingFeedbackMap}
					{saveInstructorFeedback}
					{copyToClipboard}
				/>
			{/each}
		</tbody>
	</table>
</div>
