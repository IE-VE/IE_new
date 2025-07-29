
<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { onMount } from 'svelte';

	let currentQuestionIndex = $state(0);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let audioElement: HTMLAudioElement;
	let showAnswers = $state(false);

	const questionTypes = [
		{
			title: 'Missing Information',
			description: 'Fill in the gaps with the correct information you hear',
			icon: '📝'
		},
		{
			title: 'Diagram Labeling',
			description: 'Label parts of a diagram based on the audio',
			icon: '🗺️'
		},
		{
			title: 'Matching Information',
			description: 'Match speakers to statements or opinions',
			icon: '🔗'
		},
		{
			title: 'Multiple Choice',
			description: 'Choose the correct answer from multiple options',
			icon: '✅'
		},
		{
			title: 'Sentence Completion',
			description: 'Complete sentences with words from the audio',
			icon: '📋'
		},
		{
			title: 'Short Answer Questions',
			description: 'Answer questions with a few words or numbers',
			icon: '❓'
		}
	];

	const testSections = [
		{
			section: 'Section 1',
			description: 'Conversation in everyday social context',
			questions: '1-10',
			speakers: '2 speakers'
		},
		{
			section: 'Section 2',
			description: 'Monologue in everyday social context',
			questions: '11-20',
			speakers: '1 speaker'
		},
		{
			section: 'Section 3',
			description: 'Conversation in educational/training context',
			questions: '21-30',
			speakers: '2-4 speakers'
		},
		{
			section: 'Section 4',
			description: 'Monologue on academic subject',
			questions: '31-40',
			speakers: '1 speaker'
		}
	];

	const sampleQuestions = [
		'/listening-images/LT1 (1).png',
		'/listening-images/LT1 (2).png',
		'/listening-images/LT1 (3).png',
		'/listening-images/LT1 (4).png',
		'/listening-images/LT1 (5).png',
		'/listening-images/LT1 (6).png',
		'/listening-images/LT1 (7).png',
		'/listening-images/LT1 (8).png'
	];

	function togglePlayPause() {
		if (!audioElement) return;
		
		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		isPlaying = !isPlaying;
	}

	function updateTime() {
		if (audioElement) {
			currentTime = audioElement.currentTime;
			duration = audioElement.duration || 0;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function nextQuestion() {
		if (currentQuestionIndex < sampleQuestions.length - 1) {
			currentQuestionIndex++;
		}
	}

	function prevQuestion() {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		}
	}

	onMount(() => {
		if (audioElement) {
			audioElement.addEventListener('timeupdate', updateTime);
			audioElement.addEventListener('loadedmetadata', updateTime);
			audioElement.addEventListener('ended', () => {
				isPlaying = false;
			});
		}
	});
</script>

<svelte:head>
	<title>IELTS Listening Practice - InsideIELTS</title>
	<meta name="description" content="Practice IELTS Listening with our comprehensive test materials. Improve your listening skills with authentic test questions and detailed feedback." />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto px-6 py-8">
		<!-- Header Section -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				IELTS Listening Practice
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Master the IELTS Listening test with our comprehensive practice materials and realistic test conditions.
			</p>
		</div>

		<!-- Test Overview -->
		<Card variant="teal">
			<div class="text-center">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
					📻 IELTS Listening Test Overview
				</h2>
				<div class="grid md:grid-cols-3 gap-6 text-center">
					<div>
						<div class="text-3xl font-bold text-teal-600 dark:text-teal-400">40 min</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Total Duration</div>
					</div>
					<div>
						<div class="text-3xl font-bold text-teal-600 dark:text-teal-400">4</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Sections</div>
					</div>
					<div>
						<div class="text-3xl font-bold text-teal-600 dark:text-teal-400">40</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Questions</div>
					</div>
				</div>
			</div>
		</Card>

		<!-- Test Sections -->
		<div class="mt-12">
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
				Test Structure
			</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each testSections as section}
					<Card variant="greyscale">
						<div class="text-center">
							<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{section.section}</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{section.description}</p>
							<div class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
								<div>Questions: {section.questions}</div>
								<div>Speakers: {section.speakers}</div>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Question Types -->
		<div class="mt-12">
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
				Question Types You'll Encounter
			</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each questionTypes as type}
					<Card variant="notebook">
						<div class="text-center">
							<div class="text-2xl mb-3">{type.icon}</div>
							<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{type.title}</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300">{type.description}</p>
						</div>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Assessment Guide -->
		<div class="mt-12">
			<Card variant="teal">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					🎯 Scoring Guide
				</h2>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Band Score Targets</h3>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 6.0:</span>
								<span class="font-medium text-gray-900 dark:text-white">23/40 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 7.0:</span>
								<span class="font-medium text-gray-900 dark:text-white">30/40 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 8.0:</span>
								<span class="font-medium text-gray-900 dark:text-white">35/40 correct</span>
							</div>
						</div>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Key Skills</h3>
						<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
							<li>• Understanding main ideas and details</li>
							<li>• Following conversations and monologues</li>
							<li>• Identifying specific information</li>
							<li>• Recognizing speaker attitudes and opinions</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>

		<!-- Practice Materials -->
		<div class="mt-12">
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
				🎧 Practice Materials
			</h2>
			
			<Card variant="default">
				<div class="space-y-6">
					<!-- Audio Player -->
					<div class="text-center">
						<h3 class="font-semibold text-gray-900 dark:text-white mb-4">Listening Test Audio</h3>
						<audio 
							bind:this={audioElement}
							src="/audio/ielts-listening_test1.mp3"
							class="hidden"
						></audio>
						
						<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
							<div class="flex items-center justify-center space-x-4 mb-4">
								<button
									onclick={togglePlayPause}
									class="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 transition-colors"
								>
									{#if isPlaying}
										<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
										</svg>
									{:else}
										<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
										</svg>
									{/if}
								</button>
							</div>
							
							<div class="text-sm text-gray-600 dark:text-gray-400">
								{formatTime(currentTime)} / {formatTime(duration)}
							</div>
							
							<div class="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-2">
								<div 
									class="bg-teal-600 h-2 rounded-full transition-all"
									style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
								></div>
							</div>
						</div>
					</div>

					<!-- Question Images Carousel -->
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-4 text-center">Sample Questions</h3>
						<div class="relative">
							<div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
								<img 
									src={sampleQuestions[currentQuestionIndex]} 
									alt="Listening test question {currentQuestionIndex + 1}"
									class="w-full h-auto max-h-96 object-contain mx-auto"
									loading="lazy"
								/>
							</div>
							
							<div class="flex justify-between items-center mt-4">
								<button
									onclick={prevQuestion}
									disabled={currentQuestionIndex === 0}
									class="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
								>
									← Previous
								</button>
								
								<span class="text-sm text-gray-600 dark:text-gray-400">
									{currentQuestionIndex + 1} of {sampleQuestions.length}
								</span>
								
								<button
									onclick={nextQuestion}
									disabled={currentQuestionIndex === sampleQuestions.length - 1}
									class="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
								>
									Next →
								</button>
							</div>
						</div>
					</div>

					<!-- Sample Answer Sheet and Actions -->
					<div class="grid md:grid-cols-2 gap-6">
						<div class="text-center">
							<h4 class="font-medium text-gray-900 dark:text-white mb-3">Practice Answer Sheet</h4>
							<button class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors">
								Download Answer Sheet
							</button>
						</div>
						
						<div class="text-center">
							<h4 class="font-medium text-gray-900 dark:text-white mb-3">Check Your Answers</h4>
							<button 
								onclick={() => showAnswers = !showAnswers}
								class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
							>
								{showAnswers ? 'Hide' : 'Show'} Answers
							</button>
						</div>
					</div>

					{#if showAnswers}
						<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
							<h4 class="font-medium text-amber-900 dark:text-amber-100 mb-2">Answer Key</h4>
							<p class="text-sm text-amber-800 dark:text-amber-200">
								Complete the full practice test and check your answers using our detailed answer explanations. 
								Each answer includes reasoning and tips for similar questions.
							</p>
						</div>
					{/if}
				</div>
			</Card>
		</div>

		<!-- Call to Action -->
		<div class="mt-12 text-center">
			<Card variant="teal">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
					Ready for Personalized Feedback?
				</h2>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					Take our free speaking test to get detailed AI analysis and personalized improvement recommendations.
				</p>
				<a 
					href="/freetest"
					class="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
				>
					Try Free Speaking Test
				</a>
			</Card>
		</div>
	</div>
</div>
