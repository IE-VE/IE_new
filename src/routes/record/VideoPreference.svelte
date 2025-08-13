<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	const { onChoice }: { onChoice: (useVideo: boolean) => void } = $props();

	function handleChoice(useVideo: boolean) {
		onChoice(useVideo);
	}
</script>

<div class="mx-auto max-w-2xl text-center">
	<Card variant="greyscale">
		<div>
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
				Choose Your Recording Mode
			</h2>

			<p class="mb-6 text-lg text-gray-700 dark:text-gray-300">
				Using video provides a better simulation of a real-life IELTS speaking test interview,
				helping you:
			</p>
			<ul class="mb-8 space-y-3 text-left text-gray-600 dark:text-gray-400">
				<li class="flex items-start">
					<span class="mr-2 text-teal-600 dark:text-teal-400">✓</span>
					Practice maintaining eye contact and manner
				</li>
				<li class="flex items-start">
					<span class="mr-2 text-teal-600 dark:text-teal-400">✓</span>
					Develop natural gestures and facial expressions
				</li>
				<li class="flex items-start">
					<span class="mr-2 text-teal-600 dark:text-teal-400">✓</span>
					Get a more authentic exam experience
				</li>
			</ul>

			<div class="mb-10 flex justify-center space-x-4">
				<button
					onclick={() => handleChoice(true)}
					class="transform rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-teal-700"
				>
					Use Video (Recommended)
				</button>
				<button
					onclick={() => handleChoice(false)}
					class="transform rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-gray-700"
				>
					Audio Only
				</button>
			</div>

			<!-- IELTS Assessment Criteria -->
			<div class="border-t border-gray-100 pt-6 dark:border-gray-700">
				<h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
					Before you start the test please take a moment to think about the 4 IELTS speaking
					assessment criteria:
				</h3>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-xl bg-blue-50 p-4 shadow-sm dark:bg-blue-900/30">
						<h4 class="font-semibold text-blue-700 dark:text-blue-300">Fluency & Coherence</h4>
						<p class="text-blue-600 dark:text-blue-400">
							You need to show willingness to give an extended response, with minimal hesitation and
							repetition.
						</p>
					</div>

					<div class="rounded-xl bg-green-50 p-4 shadow-sm dark:bg-green-900/30">
						<h4 class="font-semibold text-green-700 dark:text-green-300">Lexical Resource</h4>
						<p class="text-green-600 dark:text-green-400">
							You are being assessed on the flexibility and range of your language. — Show us what
							you know!
						</p>
					</div>

					<div class="rounded-xl bg-purple-50 p-4 shadow-sm dark:bg-purple-900/30">
						<h4 class="font-semibold text-purple-700 dark:text-purple-300">
							Grammatical Range & Accuracy
						</h4>
						<p class="text-purple-600 dark:text-purple-400">
							Make use of complex (long) sentences and try to minimise your errors.
						</p>
					</div>

					<div class="rounded-xl bg-red-50 p-4 shadow-sm dark:bg-red-900/30">
						<h4 class="font-semibold text-red-700 dark:text-red-300">Pronunciation</h4>
						<p class="text-red-600 dark:text-red-400">
							Focus on speaking clearly and using proper intonation, stress and rhythm.
						</p>
					</div>
				</div>
			</div>
		</div>
	</Card>
</div>
