<script lang="ts">
	import type { ParsedRecording, Session, ParsedAnalysis } from '$lib/db/types.js';
	import { tracking } from '$lib/utils/analytics';
	import RecordingPreview from '../../record/RecordingPreview.svelte';
	import Card from '$lib/components/Card.svelte';
	import UpsellCard from '$lib/components/UpsellCard.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import { Heading, P, Spinner } from 'flowbite-svelte';
	import { RefreshCcw } from 'lucide-svelte';

	const { data } = $props();
	const { session, recordings, analysis } = data as {
		session: Session;
		recordings: ParsedRecording[];
		analysis: ParsedAnalysis | null;
	};

	let showRecordings = $state(true);
	let exerciseStates = $state(new Map<number, boolean>());
	let isGeneratingExercise = $state(false);
	let showExtraExercise = $state(false);

	function toggleExampleVisibility(index: number, exerciseTitle: string) {
		const newState = !exerciseStates.get(index);
		exerciseStates = new Map(exerciseStates).set(index, newState);
		tracking.toggleExercise(session.id, exerciseTitle, newState ? 'show' : 'hide');
	}

	function isExampleVisible(index: number): boolean {
		return exerciseStates.get(index) || false;
	}

	async function generateMoreExercise() {
		isGeneratingExercise = true;

		// Simulate loading for 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));

		isGeneratingExercise = false;
		showExtraExercise = true;

		// Track this interaction
		tracking.toggleExercise(session.id, 'Generate More Exercise', 'show');
	}

	// Calculate target score (current score + 0.5)
	function getTargetScore(): number {
		if (!analysis?.analysis?.bandScore?.band) return 7.0;
		// Handle band score which might be string or number
		const currentScore =
			typeof analysis.analysis.bandScore.band === 'string'
				? parseFloat(analysis.analysis.bandScore.band)
				: analysis.analysis.bandScore.band;
		return Math.min(9.0, currentScore + 0.5);
	}

	const isAnalysisComplete = $derived(
		analysis?.analysis?.questions?.length &&
			analysis.analysis?.feedback &&
			analysis.analysis?.bandScore &&
			analysis.analysis?.exercises
	);

	function truncateText(text: string, maxLength: number): string {
		if (text.length > maxLength) {
			return text.slice(0, maxLength) + '...';
		}
		return text;
	}

	// Fix for the linter error by ensuring non-null access
	function getSafeBandScore(): string {
		if (analysis?.analysis?.bandScore?.band) {
			return typeof analysis.analysis.bandScore.band === 'string'
				? analysis.analysis.bandScore.band
				: analysis.analysis.bandScore.band.toString();
		}
		return '6.5';
	}
</script>

<div class="container mx-auto max-w-4xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12 text-center">
		<h1 class="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
			Your InsideIELTS Speaking Test Feedback
		</h1>
		{#if isAnalysisComplete}
			<Card variant="teal">
				<div class="text-center">
					<Heading tag="h4" class="mb-2">Analysis Complete!</Heading>
					<P class="text-center"
						>We've analysed your speaking performance across all IELTS criteria.</P
					>
				</div>
			</Card>

			<div class="mt-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/30">
				<div>
					<strong>A personal note:</strong>
					<br /><br />
					The IE ‘freetest’ is not actually ‘free’ for us to produce and deliver to you, so please take
					the time to . use these uniquely created, tailor-made resources for your maximum benefit and
					improvement.
					<br /><br />

					<div class="text-left">
						In the Feedback Sections below you will find:<br />
						<ul class="list-disc space-y-2 pl-4">
							<li>
								<strong>Questions and Answers review:</strong> Listen to and read your response transcripts,
								then read the Improved Answers provided. (Visualise your goal: try re-recording yourself
								saying the improved answers and listen to the difference.)
							</li>
							<li>
								<strong>Detailed IELTS Criteria Feedback</strong> on your specific language strengths
								and weaknesses.
							</li>
							<li>
								<strong>Your Overall IE Band Score</strong> with language feedback and suggestions for
								areas to focus on going forward.
							</li>
							<li>
								<strong>Unique Practice Exercises</strong> generated using your own freetest responses
								designed to specifically target and eliminate your actual speaking errors.
							</li>
						</ul>
					</div>
					<br /><br />
					<strong>All the best with your IELTS preparations - Alex</strong>
				</div>
			</div>
		{/if}
	</div>

	{#if analysis?.analysis?.questions?.length && analysis.analysis?.feedback && analysis.analysis?.bandScore && analysis.analysis?.exercises}
		<!-- Questions & Answers Review Section -->
		<div class="mb-12">
			<Heading tag="h4" class="mb-6">Questions & Answers Review</Heading>

			<div class="flex flex-col gap-6">
				{#each recordings as recording, index}
					<div id={`recording-${index}`}>
						<RecordingPreview
							{recording}
							{index}
							improvedAnswer={analysis?.analysis?.questions[index]?.correctedAnswer || null}
						/>
					</div>
				{/each}
			</div>
		</div>

		<!-- Detailed Criteria Feedback -->
		<section id="criteria-feedback" class="mb-12">
			<div class="mb-6">
				<Heading tag="h4">Detailed Criteria Feedback</Heading>
			</div>

			<div class="mb-6 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/30">
				<div class="flex items-start">
					<svg
						class="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p class="text-amber-700 dark:text-amber-300">
						<strong>Scoring insight:</strong> The InsideIELTS Test Preparation Program (IETPP) will
						give you specifc, actionable strategies to raise your level from Band {analysis.analysis
							?.bandScore?.band || '6.5'} to Band {getTargetScore()} in - 1 week -
					</p>
				</div>
			</div>

			<div class="mb-12 grid gap-4 md:grid-cols-2">
				<div class="rounded-xl bg-blue-50 p-4 shadow-sm dark:bg-blue-900/30">
					<div class="mb-2 flex items-center justify-between">
						<h4 class="font-semibold text-blue-700 dark:text-blue-300">Fluency & Coherence</h4>
						{#if analysis.analysis.bandScores.fluencyAndCoherence}
							<span class="text-xl font-bold text-blue-700 dark:text-blue-300">
								{analysis.analysis.bandScores.fluencyAndCoherence}
							</span>
						{/if}
					</div>
					<P>
						{truncateText(analysis.analysis.feedback.fluencyAndCoherence, 100)}
						<span class="mt-2 block font-medium text-blue-700 dark:text-blue-300">
							Get full detailed feedback from the IETPP
						</span>
					</P>
				</div>
				<div class="rounded-xl bg-green-50 p-4 shadow-sm dark:bg-green-900/30">
					<div class="mb-2 flex items-center justify-between">
						<h4 class="font-semibold text-green-700 dark:text-green-300">Lexical Resource</h4>
						{#if analysis.analysis.bandScores.lexicalResource}
							<span class="text-xl font-bold text-green-700 dark:text-green-300">
								{analysis.analysis.bandScores.lexicalResource}
							</span>
						{/if}
					</div>
					<P>
						{truncateText(analysis.analysis.feedback.lexicalResource, 100)}
						<span class="mt-2 block font-medium text-green-700 dark:text-green-300">
							Get full detailed feedback from the IETPP
						</span>
					</P>
				</div>
				<div class="rounded-xl bg-purple-50 p-4 shadow-sm dark:bg-purple-900/30">
					<div class="mb-2 flex items-center justify-between">
						<h4 class="font-semibold text-purple-700 dark:text-purple-300">
							Grammatical Range & Accuracy
						</h4>
						{#if analysis.analysis.bandScores.grammaticalRangeAndAccuracy}
							<span class="text-xl font-bold text-purple-700 dark:text-purple-300">
								{analysis.analysis.bandScores.grammaticalRangeAndAccuracy}
							</span>
						{/if}
					</div>
					<P>
						{truncateText(analysis.analysis.feedback.grammaticalRangeAndAccuracy, 100)}
						<span class="mt-2 block font-medium text-purple-700 dark:text-purple-300">
							Get full detailed feedback from the IETPP
						</span>
					</P>
				</div>
				<div class="rounded-xl bg-red-50 p-4 shadow-sm dark:bg-red-900/30">
					<div class="mb-2 flex items-center justify-between">
						<h4 class="font-semibold text-red-700 dark:text-red-300">Pronunciation</h4>
						{#if analysis.analysis.bandScores.pronunciation}
							<span class="text-xl font-bold text-red-700 dark:text-red-300">
								{analysis.analysis.bandScores.pronunciation}
							</span>
						{/if}
					</div>
					<P>
						{truncateText(analysis.analysis.feedback.pronunciation, 100)}
						<span class="mt-2 block font-medium text-red-700 dark:text-red-300">
							Get full detailed feedback from the IETPP
						</span>
					</P>
				</div>
			</div>
		</section>

		<!-- Band Score -->
		<div class="mb-12">
			<Heading tag="h4" class="mb-4">Overall Band Score</Heading>
			<Card variant="teal">
				<div class="flex flex-col-reverse items-center px-6 py-4 sm:flex-row sm:justify-between">
					<div class="mt-4 flex-1 text-center sm:mt-0 sm:text-left">
						<Heading tag="h5">Your IELTS Speaking Score</Heading>
						<P class="mt-1">
							{analysis?.analysis?.bandScore?.explanation ||
								'Your speaking skills have been analyzed based on IELTS criteria.'}
						</P>
					</div>
					<div class="flex-shrink-0 sm:ml-6">
						<div
							class="flex aspect-square w-24 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900"
						>
							<span class="text-3xl font-bold text-teal-700 dark:text-teal-300"
								>{getSafeBandScore()}</span
							>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Upsell Card -->
		<div class="mb-12">
			<h3 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
				Ready to Improve Your Score with Unlimited Practice?
			</h3>
			<UpsellCard
				variant="default"
				userScore={analysis?.analysis?.bandScore?.band
					? typeof analysis.analysis.bandScore.band === 'string'
						? parseFloat(analysis.analysis.bandScore.band)
						: analysis.analysis.bandScore.band
					: 7.0}
				targetScore={getTargetScore()}
				originalPrice={9.95}
				sessionId={session.id}
				email={session.email}
			/>
		</div>

		<!-- Exercises -->
		<div class="mb-12 space-y-6">
			<h3 class="text-xl font-bold text-gray-900 dark:text-white">Practice Exercises</h3>

			<div class="mb-6 rounded-lg bg-teal-50 p-4 dark:bg-teal-900/30">
				<div>
					<strong>Unique personalised study materials:</strong> The IETPP uses unique
					AI-transcription models trained using 1000s of real IELTS speaking test samples to
					generate targeted practice materials using your own Day-1 Diagnostic Test responses.
					<br /><br />

					<strong>Sample exercises preview:</strong> Try the sample exercise below, created using your
					own freetest content; then sign up to the IETPP to start achieving your target IELTS Speaking
					Band Score today.
				</div>
			</div>

			{#if analysis.analysis?.exercises && analysis.analysis.exercises.length > 0}
				<Card variant="notebook">
					<div>
						<h4 class="mb-3 text-lg font-bold text-gray-900 dark:text-amber-300">
							{analysis.analysis.exercises[0]?.title || 'Exercise 1'}
						</h4>
						<Markdown
							content={analysis.analysis.exercises[0]?.instruction ||
								'Practice this speaking skill with our recommended exercises.'}
							className="mb-4 text-gray-700 dark:text-gray-300"
						/>
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<button
									class="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
									onclick={() =>
										toggleExampleVisibility(
											0,
											analysis.analysis.exercises[0]?.title || 'Exercise 1'
										)}
								>
									{#if isExampleVisible(0)}
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
										Hide Examples
									{:else}
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
										Show Examples
									{/if}
								</button>
							</div>
							{#if isExampleVisible(0)}
								<Markdown
									content={(analysis.analysis.exercises[0]?.examples || [])
										.map((example) => `- ${example}`)
										.join('\n')}
									className="text-gray-800 dark:text-gray-300 pl-4"
								/>
							{/if}
						</div>
					</div>
				</Card>
			{/if}

			{#if showExtraExercise && analysis.analysis?.exercises && analysis.analysis.exercises.length > 1}
				<div class="mt-6">
					<Card variant="notebook">
						<div>
							<h4 class="mb-3 text-lg font-bold text-gray-900 dark:text-amber-300">
								{analysis.analysis.exercises[1]?.title || 'Exercise 2'}
							</h4>
							<Markdown
								content={analysis.analysis.exercises[1]?.instruction ||
									'Continue improving with this personalised exercise.'}
								className="mb-4 text-gray-700 dark:text-gray-300"
							/>
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<button
										class="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
										onclick={() =>
											toggleExampleVisibility(
												1,
												analysis.analysis.exercises[1]?.title || 'Exercise 2'
											)}
									>
										{#if isExampleVisible(1)}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
											Hide Examples
										{:else}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Show Examples
										{/if}
									</button>
								</div>
								{#if isExampleVisible(1)}
									<Markdown
										content={(analysis.analysis.exercises[1]?.examples || [])
											.map((example) => `- ${example}`)
											.join('\n')}
										className="text-gray-800 dark:text-gray-300 pl-4"
									/>
								{/if}
							</div>
						</div>
					</Card>
				</div>
			{/if}

			{#if analysis.analysis?.exercises && analysis.analysis.exercises.length > 1 && !showExtraExercise}
				<Card variant="greyscale">
					<div class="p-4 text-center">
						{#if isGeneratingExercise}
							<div class="flex flex-col items-center justify-center py-2">
								<div class="h-2 w-2 animate-pulse rounded-full bg-teal-500"></div>
								<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Generating...</p>
							</div>
						{:else}
							<button
								onclick={generateMoreExercise}
								class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-teal-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
							>
								<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									></path>
								</svg>
								Click here to generate 1 more personalised practice exercise
							</button>
						{/if}
					</div>
				</Card>
			{/if}

			{#if analysis.analysis?.exercises && analysis.analysis.exercises.length > 2 && showExtraExercise}
				<div class="mt-6">
					<Card variant="greyscale">
						<div class="p-4 text-center">
							<h4 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
								{analysis.analysis.exercises.length - 2} More Exercises Available
							</h4>
							<p class="mb-4 text-gray-700 dark:text-gray-300">
								Unlock all personalised exercises with our Advanced Speaking Package to target your
								specific improvement areas.
							</p>
						</div>
					</Card>
				</div>
			{/if}
		</div>
	{:else}
		<Card variant="teal">
			<div class="text-center">
				<h2 class="mb-2 text-2xl font-bold text-teal-700 dark:text-teal-300">
					Analysis in Progress ⚡
				</h2>
				<p class="text-lg text-teal-600 dark:text-teal-400">
					We're preparing your detailed feedback, exercises, and band score. This takes a few
					minutes after providing your email.
				</p>
				{#if !session.email}
					<p
						class="mt-4 inline-block rounded-lg bg-amber-50 px-4 py-2 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
					>
						⚠️ Please provide your email on the previous page to start the analysis.
					</p>
				{/if}
			</div>
		</Card>
	{/if}
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
