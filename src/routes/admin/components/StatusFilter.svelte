<script lang="ts">
	const statusOptions = ['all', 'active', 'completed', 'error'];
	const { statusFilter, applyStatusFilter } = $props<{
		statusFilter: string;
		applyStatusFilter: (status: string) => void;
	}>();

	let currentFilter = $state(statusFilter);

	$effect(() => {
		currentFilter = statusFilter;
	});
</script>

<div class="mb-4">
	<label for="status-filter" class="mb-1 block text-sm font-medium text-gray-700"
		>Filter by Status</label
	>
	<div class="flex items-center gap-2">
		<select
			id="status-filter"
			value={currentFilter}
			onchange={(e) => (currentFilter = (e.target as HTMLSelectElement).value)}
			class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
		>
			{#each statusOptions as option}
				<option value={option}>
					{option.charAt(0).toUpperCase() + option.slice(1)}
				</option>
			{/each}
		</select>
		<button
			onclick={() => applyStatusFilter(currentFilter)}
			class="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
		>
			Apply Filter
		</button>
	</div>
</div>
