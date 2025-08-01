
<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head>
	<title>IELTS Reading Practice Test - InsideIELTS</title>
	<meta name="description" content="Take a complete IELTS Reading practice test with authentic passages and detailed feedback." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto px-6 py-8">
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				IELTS Reading Practice Test
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300">
				Complete practice test with three passages and 40 questions
			</p>
		</div>

		<Card variant="secondary">
			<div class="text-center py-12">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
					Coming Soon
				</h2>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					We're preparing comprehensive Reading practice tests for you. 
					This section will include authentic IELTS passages with all question types.
				</p>
				<a 
					href="/reading"
					class="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
				>
					← Back to Reading Overview
				</a>
			</div>
		</Card>
	</div>
</div>
