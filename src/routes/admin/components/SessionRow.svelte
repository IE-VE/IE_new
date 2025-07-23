<script lang="ts">
	import RecordingPreview from '../../record/RecordingPreview.svelte';
	import RawDataViewer from './RawDataViewer.svelte';
	import type { InstructorFeedback } from './InstructorFeedbackForm.svelte';

	const {
		session,
		expandedSessionId,
		showRawData,
		regeneratingMap,
		toggleSession,
		toggleRawData,
		regenerateAnalysis,
		instructorFeedbackMap,
		savingFeedbackMap,
		saveInstructorFeedback,
		copyToClipboard
	} = $props<{
		session: any;
		expandedSessionId: string | null;
		showRawData: string | null;
		regeneratingMap: Record<string, boolean>;
		toggleSession: (sessionId: string) => void;
		toggleRawData: (sessionId: string, event: MouseEvent) => void;
		regenerateAnalysis: (sessionId: string) => Promise<void>;
		instructorFeedbackMap: Record<string, InstructorFeedback>;
		savingFeedbackMap: Record<string, boolean>;
		saveInstructorFeedback: (analysisId: string) => Promise<void>;
		copyToClipboard: (data: any) => void;
	}>();

	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleString();
	}

	function formatStatus(status: string) {
		const statusClasses = {
			active: 'bg-yellow-100 text-yellow-800',
			completed: 'bg-green-100 text-green-800',
			error: 'bg-red-100 text-red-800'
		};
		return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
	}
</script>

<tr class="cursor-pointer hover:bg-gray-50" onclick={() => toggleSession(session.id)}>
	<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
		{session.id.split('-')[0]}
	</td>
	<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
		{formatDate(session.updated_at)}
	</td>
	<td class="px-6 py-4 whitespace-nowrap">
		<span
			class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {formatStatus(
				session.status
			)}"
		>
			{session.status}
		</span>
	</td>
	<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
		{session.email || '-'}
	</td>
	<td class="flex items-center gap-2 px-6 py-4 text-sm whitespace-nowrap text-gray-500">
		<span class="text-teal-600">
			{session.current_question_index + 1}/{session.total_questions}
		</span>
		<span class="text-gray-400">
			{expandedSessionId === session.id ? '▼' : '▶'}
		</span>
	</td>
	<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
		{#if session.analysis}
			{session.analysis.version || '1'}
		{:else}
			-
		{/if}
	</td>
	<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
		{#if session.analysis?.analysis?.bandScore?.band}
			<span class="font-medium text-gray-900">{session.analysis.analysis.bandScore.band}</span>
		{:else}
			-
		{/if}
	</td>
	<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
		{#if session.instructor_feedback}
			{#if JSON.parse(session.instructor_feedback)?.total}
				<span class="font-medium text-blue-600"
					>{JSON.parse(session.instructor_feedback).total}</span
				>
			{:else}
				-
			{/if}
		{:else if session.analysis?.analysis?.instructorFeedback?.total}
			<span class="font-medium text-blue-600"
				>{session.analysis.analysis.instructorFeedback.total}</span
			>
		{:else}
			-
		{/if}
	</td>
	<td class="px-6 py-4 text-sm whitespace-nowrap">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="flex gap-2" onclick={(e) => e.stopPropagation()}>
			<button
				class="cursor-pointer rounded-md bg-teal-100 px-2 py-1 text-sm text-teal-700 hover:bg-teal-200"
				onclick={() => window.open(`/results/${session.id}`, '_blank')}
			>
				View
			</button>
			<button
				onclick={() => regenerateAnalysis(session.id)}
				class="cursor-pointer rounded-md {regeneratingMap[session.id]
					? 'bg-gray-200 text-gray-500'
					: 'bg-blue-100 text-blue-700 hover:bg-blue-200'} px-2 py-1 text-sm"
				title="Regenerate analysis"
				disabled={regeneratingMap[session.id]}
			>
				{regeneratingMap[session.id] ? '⏳' : '🔄'}
			</button>
			<button
				onclick={() => regenerateAnalysis(session.id, true)}
				class="cursor-pointer rounded-md {regeneratingMap[session.id]
					? 'bg-gray-200 text-gray-500'
					: 'bg-green-100 text-green-700 hover:bg-green-200'} px-2 py-1 text-sm"
				title="Regenerate analysis and send email"
				disabled={regeneratingMap[session.id]}
			>
				{regeneratingMap[session.id] ? '⏳' : '📧'}
			</button>
			<div class="relative">
				<button
					onclick={(e) => toggleRawData(session.id, e)}
					class="cursor-pointer rounded-md bg-purple-100 px-2 py-1 text-sm text-purple-700 hover:bg-purple-200"
					title="View raw data"
				>
					📊
				</button>
				{#if showRawData === session.id}
					<RawDataViewer
						{session}
						onClose={() => toggleRawData(session.id, new MouseEvent('click'))}
						{copyToClipboard}
						{instructorFeedbackMap}
						{savingFeedbackMap}
						{saveInstructorFeedback}
					/>
				{/if}
			</div>
		</div>
	</td>
</tr>

{#if expandedSessionId === session.id}
	<tr class="bg-gray-50">
		<td colspan="9" class="px-6 py-4">
			<div class="flex flex-col gap-6">
				{#each session.recordings as recording, index}
					<RecordingPreview
						{recording}
						{index}
						isAdmin={true}
						improvedAnswer={session.analysis?.analysis?.questions?.[index]?.correctedAnswer}
					/>
				{/each}
			</div>
		</td>
	</tr>
{/if}
