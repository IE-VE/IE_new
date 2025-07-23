<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll, goto } from '$app/navigation';
	import StatusFilter from './components/StatusFilter.svelte';
	import { page } from '$app/state';
	import Pagination from './components/Pagination.svelte';
	import SessionTable from './components/SessionTable.svelte';
	import LoadingOverlay from './components/LoadingOverlay.svelte';
	import EmailSearch from './components/EmailSearch.svelte';
	import type { InstructorFeedback } from './components/InstructorFeedbackForm.svelte';

	const { data }: { data: PageData } = $props();
	let sessions = $state(data.sessions);
	let totalSessions = $state(data.totalSessions || 0);
	let currentPage = $state(data.page || 1);
	let pageSize = $state(15);
	let totalPages = $derived(Math.ceil(totalSessions / pageSize));
	let statusFilter = $state<string>(data.status || 'completed');
	let emailFilter = $state<string | undefined>(data.email);
	let isLoading = $state(false);

	let expandedSessionId = $state<string | null>(null);
	let showRawData = $state<string | null>(null);
	let copySuccess = $state<boolean>(false);
	let regeneratingMap = $state<Record<string, boolean>>({});
	let savingFeedbackMap = $state<Record<string, boolean>>({});
	let instructorFeedbackMap = $state<Record<string, InstructorFeedback>>({});

	// Safety timeout reference
	let loadingTimeoutId: ReturnType<typeof setTimeout> | null = $state(null);

	// Effect to update data when URL changes
	$effect(() => {
		const urlPage = Number(page.url.searchParams.get('page')) || 1;
		const urlStatus = page.url.searchParams.get('status') || 'completed';
		const urlEmail = page.url.searchParams.get('email') || undefined;

		// Only invalidate if the parameters actually changed
		if (urlPage !== currentPage || urlStatus !== statusFilter || urlEmail !== emailFilter) {
			isLoading = true; // Set loading state when URL changes

			// Clear any existing timeout
			if (loadingTimeoutId) {
				clearTimeout(loadingTimeoutId);
			}

			// Safety timeout to reset loading state if it takes too long
			loadingTimeoutId = setTimeout(() => {
				isLoading = false;
				loadingTimeoutId = null;
			}, 10000); // 10 seconds timeout

			try {
				invalidateAll();
			} catch (error) {
				console.error('Error loading data:', error);
				isLoading = false; // Reset loading state on error
				if (loadingTimeoutId) {
					clearTimeout(loadingTimeoutId);
					loadingTimeoutId = null;
				}
			}
		}
	});

	// Effect to update local state when data changes
	$effect(() => {
		sessions = data.sessions;
		totalSessions = data.totalSessions || 0;
		currentPage = data.page || 1;
		statusFilter = data.status || 'completed';
		emailFilter = data.email;
		isLoading = false; // Reset loading state when data is received

		// Clear the safety timeout when data is loaded
		if (loadingTimeoutId) {
			clearTimeout(loadingTimeoutId);
			loadingTimeoutId = null;
		}
	});

	// Handle URL changes without full page reload
	function handleNavigation(pageNum: number, status: string, email?: string) {
		isLoading = true; // Set loading state when navigating
		const url = new URL(window.location.href);
		url.searchParams.set('page', pageNum.toString());
		url.searchParams.set('status', status);

		if (email) {
			url.searchParams.set('email', email);
		} else {
			url.searchParams.delete('email');
		}

		goto(url.toString(), { replaceState: false, noScroll: true });
	}

	// Navigate to previous page
	function goToPrevPage() {
		if (currentPage > 1) {
			handleNavigation(currentPage - 1, statusFilter, emailFilter);
		}
	}

	// Navigate to next page
	function goToNextPage() {
		if (currentPage < totalPages) {
			handleNavigation(currentPage + 1, statusFilter, emailFilter);
		}
	}

	// Change status filter
	function applyStatusFilter(status: string) {
		handleNavigation(1, status, emailFilter);
	}

	// Apply email search
	function applyEmailSearch(email: string) {
		handleNavigation(1, statusFilter, email || undefined);
	}

	function toggleSession(sessionId: string) {
		expandedSessionId = expandedSessionId === sessionId ? null : sessionId;
	}

	function toggleRawData(sessionId: string, event: MouseEvent) {
		event.stopPropagation();
		showRawData = showRawData === sessionId ? null : sessionId;
	}

	async function regenerateAnalysis(sessionId: string, forceEmail: boolean = false) {
		if (regeneratingMap[sessionId]) return;

		try {
			regeneratingMap[sessionId] = true;
			const response = await fetch('/api/regenerate-analysis', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ sessionId, forceEmail })
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(error);
			}

			// Instead of reloading the page, invalidate the data after a delay
			setTimeout(async () => {
				await invalidateAll();
				regeneratingMap[sessionId] = false;
			}, 10000);
		} catch (error) {
			console.error('Failed to regenerate analysis:', error);
			alert('Failed to regenerate analysis. Please try again.');
			regeneratingMap[sessionId] = false;
		}
	}

	async function saveInstructorFeedback(analysisId: string) {
		if (savingFeedbackMap[analysisId]) return;

		try {
			savingFeedbackMap[analysisId] = true;
			const feedback = instructorFeedbackMap[analysisId];

			// Create a FormData object
			const formData = new FormData();
			formData.append('analysisId', analysisId);
			formData.append('instructorFeedback', JSON.stringify(feedback));

			// Use the form action instead of fetch API
			const response = await fetch('?/updateInstructorFeedback', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					typeof result === 'object' && result !== null && 'message' in result
						? String(result.message)
						: 'Failed to save instructor feedback'
				);
			}

			await invalidateAll();
			savingFeedbackMap[analysisId] = false;
			alert('Instructor feedback saved successfully!');
		} catch (error) {
			console.error('Failed to save instructor feedback:', error);
			alert('Failed to save instructor feedback. Please try again.');
			savingFeedbackMap[analysisId] = false;
		}
	}

	function copyToClipboard(data: any) {
		const textToCopy = JSON.stringify(data, null, 2);
		navigator.clipboard.writeText(textToCopy).then(
			() => {
				copySuccess = true;
				setTimeout(() => {
					copySuccess = false;
				}, 2000);
			},
			(err) => {
				console.error('Could not copy text: ', err);
			}
		);
	}
</script>

<div class="container mx-auto px-6 py-8">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
		<p class="mt-2 text-sm text-gray-600">View all test sessions and their details</p>
	</div>

	<EmailSearch currentEmail={emailFilter} {applyEmailSearch} />

	<StatusFilter {statusFilter} {applyStatusFilter} />

	<SessionTable
		{sessions}
		{expandedSessionId}
		{showRawData}
		{regeneratingMap}
		{instructorFeedbackMap}
		{savingFeedbackMap}
		{toggleSession}
		{toggleRawData}
		{regenerateAnalysis}
		{saveInstructorFeedback}
		{copyToClipboard}
	/>

	<LoadingOverlay {isLoading} />

	<Pagination
		{currentPage}
		{totalPages}
		{pageSize}
		{totalSessions}
		{isLoading}
		{goToPrevPage}
		{goToNextPage}
	/>
</div>
