<script lang="ts">
	const { currentEmail, applyEmailSearch } = $props<{
		currentEmail: string | undefined;
		applyEmailSearch: (email: string) => void;
	}>();

	let searchInput = $state(currentEmail || '');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		applyEmailSearch(searchInput);
	}

	function clearSearch() {
		searchInput = '';
		applyEmailSearch('');
	}
</script>

<div class="mb-6 rounded-lg bg-white p-4 shadow-sm">
	<form onsubmit={handleSubmit} class="flex items-end gap-3">
		<div class="flex-1">
			<label for="email-search" class="mb-1 block text-sm font-medium text-gray-700">
				Search by Email
			</label>
			<input
				type="text"
				id="email-search"
				placeholder="Enter email address..."
				class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				bind:value={searchInput}
			/>
		</div>
		<div class="flex gap-2">
			<button
				type="submit"
				class="rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
			>
				Search
			</button>
			{#if searchInput}
				<button
					type="button"
					onclick={clearSearch}
					class="rounded-lg bg-gray-200 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-300 focus:ring-4 focus:ring-gray-200"
				>
					Clear
				</button>
			{/if}
		</div>
	</form>
</div>
