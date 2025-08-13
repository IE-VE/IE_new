<script lang="ts">
	import type { ParsedRecording, Session } from '$lib/db/types';
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { tracking } from '$lib/utils/analytics';
	import { onMount } from 'svelte';
	import RecordingPreview from './RecordingPreview.svelte';
	import Card from '$lib/components/Card.svelte';

	const { session, recordings } = $props<{ session: Session; recordings: ParsedRecording[] }>();

	let email = $state('');
	let emailSent = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	onMount(() => {
		tracking.testCompleted(session.id);
	});
</script>

<div class="space-y-8">
	<!-- Results Collection Section using Card component -->
	<Card>
		<div class="mt-4 flex items-start space-x-4">
			<!-- Star Icon -->
			<div class="hidden sm:block">
				<div class="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-indigo-600 dark:text-indigo-300"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
						/>
					</svg>
				</div>
			</div>

			<div class="flex-1">
				<!-- Title with mobile emoji -->
				<h3 class="mb-4 text-xl font-bold text-indigo-900 dark:text-indigo-300">
					Your Results will be ready soon!
				</h3>

				<!-- Card Content -->
				{#if emailSent}
					<div class="text-center" in:fly={{ y: 20, duration: 600 }} out:fade>
						<div class="mb-4">
							<svg
								class="mx-auto h-12 w-12 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<p class="text-lg text-gray-700 dark:text-gray-300">
							Success! Your analysis has started.
						</p>
						<p class="mt-2 text-gray-600 dark:text-gray-400">
							Your results will be emailed to <span class="font-medium">{email}</span> as soon as the
							analysis is complete. Feel free to check the results page as well.
						</p>
					</div>
				{:else}
					<div class="mb-4 grid gap-4 md:grid-cols-2">
						<div>
							<div class="mb-3 text-gray-700 dark:text-gray-300">
								<p class="mb-3">We're ready to analyse your speaking test:</p>
								<ul class="space-y-2">
									<li class="flex items-start">
										<svg
											class="mr-2 h-5 w-5 text-indigo-500"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span>Your IE Band Score Rating</span>
									</li>
									<li class="flex items-start">
										<svg
											class="mr-2 h-5 w-5 text-indigo-500"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span>Detailed performance feedback</span>
									</li>
									<li class="flex items-start">
										<svg
											class="mr-2 h-5 w-5 text-indigo-500"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span>Tailored practice exercises</span>
									</li>
								</ul>
							</div>
						</div>

						<form
							method="POST"
							action="?/sendResults"
							class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-md"
							use:enhance={() => {
								isSubmitting = true;
								errorMessage = '';
								return async ({ result }) => {
									if (result.type === 'success' && result.data) {
										const data = result.data as { success: boolean; error?: string };
										if (data.success) {
											emailSent = true;
											tracking.emailSubmit(email, session.id);
										} else if (data.error) {
											errorMessage = data.error;
										}
									}
									isSubmitting = false;
								};
							}}
						>
							<div class="mb-3">
								<label
									for="email"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>Enter your email to start the analysis</label
								>
								<input
									type="email"
									id="email"
									name="email"
									bind:value={email}
									placeholder="your-email@example.com"
									class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
									required
									disabled={isSubmitting}
								/>
								{#if errorMessage}
									<div class="mt-3 rounded-md bg-amber-50 p-4 dark:bg-amber-900/30">
										<div class="flex">
											<div class="flex-shrink-0">
												<svg
													class="h-5 w-5 text-amber-600 dark:text-amber-400"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fill-rule="evenodd"
														d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
														clip-rule="evenodd"
													/>
												</svg>
											</div>
											<div class="ml-3">
												<p class="text-sm text-amber-700 dark:text-amber-300">{errorMessage}</p>
											</div>
										</div>
									</div>
								{/if}
							</div>
							<input type="hidden" name="sessionId" value={session.id} />
							<button
								type="submit"
								class="w-full transform rounded-lg bg-indigo-600 px-4 py-2 text-base font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50"
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<span class="inline-flex items-center">
										<svg
											class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									</span>
								{:else}
									Send Results
								{/if}
							</button>
							<p class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
								🔒 Results will be emailed when ready
							</p>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</Card>

	<!-- Video Summary using Card with greyscale variant -->
	<Card variant="greyscale">
		<!-- Title without icon or emoji -->
		<h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Your Responses</h3>

		<!-- Card Content -->
		<div class="flex flex-col gap-6">
			{#each recordings as recording, index}
				<RecordingPreview {recording} {index} />
			{/each}
		</div>
	</Card>

	<!-- Start New Test Button -->
	<div class="text-center">
		<form
			action="?/deleteCookie"
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						tracking.startNewTest(session.id);
						window.location.reload();
					}
				};
			}}
		>
			<button
				type="submit"
				class="transform rounded-lg bg-gray-600 px-4 py-2 text-base font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-gray-700 sm:px-8 sm:py-4 sm:text-lg"
			>
				Start New Test 🔄
			</button>
		</form>
		<p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
			Want to practice more? Start a new test session.
		</p>
	</div>
</div>
