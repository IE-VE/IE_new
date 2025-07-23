<script lang="ts">
	const {
		currentPage,
		totalPages,
		pageSize,
		totalSessions,
		isLoading,
		goToPrevPage,
		goToNextPage
	} = $props<{
		currentPage: number;
		totalPages: number;
		pageSize: number;
		totalSessions: number;
		isLoading: boolean;
		goToPrevPage: () => void;
		goToNextPage: () => void;
	}>();
</script>

{#if totalPages > 1}
	<div class="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
		<div class="flex flex-1 items-center justify-between">
			<button
				onclick={() => goToPrevPage()}
				class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={currentPage === 1 || isLoading}
			>
				<svg class="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
						clip-rule="evenodd"
					/>
				</svg>
				Previous
			</button>

			<div class="mx-4 text-sm text-gray-700">
				<p>
					Page <span class="font-medium">{currentPage}</span> of
					<span class="font-medium">{totalPages}</span>
					<span class="hidden sm:inline">
						· Showing <span class="font-medium">{(currentPage - 1) * pageSize + 1}</span> to
						<span class="font-medium">{Math.min(currentPage * pageSize, totalSessions)}</span> of
						<span class="font-medium">{totalSessions}</span> results</span
					>
				</p>
			</div>

			<button
				onclick={() => goToNextPage()}
				class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={currentPage === totalPages || isLoading}
			>
				Next
				<svg class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}
