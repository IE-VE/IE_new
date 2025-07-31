<script lang="ts">
	// Force dark mode always
	$effect(() => {
		if (typeof document !== 'undefined') {
			// Always set dark mode
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	});
</script>

<!-- Removed toggle button - dark mode is always on -->