<script lang="ts">
	const { isLoading } = $props<{ isLoading: boolean }>();
</script>

{#if isLoading}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<div class="flex items-center space-x-4">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"
				></div>
				<p class="text-lg font-medium">Loading data...</p>
			</div>
		</div>
	</div>
{/if}
