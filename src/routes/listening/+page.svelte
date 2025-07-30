<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
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
			icon: '📝',
			image: '/listening-images/ielts-listening-missing-information.png'
		},
		{
			title: 'Diagram Labeling',
			description: 'Label parts of a diagram based on the audio',
			icon: '🗺️',
			image: '/listening-images/ielts-listening-diagram-labeling.png'
		},
		{
			title: 'Matching Information',
			description: 'Match speakers to statements or opinions',
			icon: '🔗',
			image: '/listening-images/ielts-listening-matching-information.png'
		},
		{
			title: 'Multiple Choice',
			description: 'Choose the correct answer from multiple options',
			icon: '✅',
			image: '/listening-images/ielts-listening-multiple-choice.png'
		},
		{
			title: 'Sentence Completion',
			description: 'Complete sentences with words from the audio',
			icon: '📋',
			image: '/listening-images/ielts-listening-sentence-completion.png'
		},
		{
			title: 'Short Answer Questions',
			description: 'Answer questions with a few words or numbers',
			icon: '❓',
			image: '/listening-images/ielts-listening-short-answer.png'
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
		'/static/listening-images/LT1 (1).png',
		'/static/listening-images/LT1 (2).png',
		'/static/listening-images/LT1 (3).png',
		'/static/listening-images/LT1 (4).png',
		'/static/listening-images/LT1 (5).png',
		'/static/listening-images/LT1 (6).png',
		'/static/listening-images/LT1 (7).png',
		'/static/listening-images/LT1 (8).png'
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

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto px-6 py-8">
		<!-- Header Section -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				IELTS LISTENING
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				The <b>IELTS</b> Listening Test is the first test that you will complete on test
				day. </p>
			<br>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				You have 30 minutes to
				listen to the recording and write your answers directly on the test
				booklet; then a further 10 minutes at the end of the test to
				transfer your answers onto the answer sheet provided.
			</p>
		</div>

		<!-- Test Overview -->
		<div class="mb-12">
			<Card variant="blue">
				<div class="text-center">
					<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
						<!-- <span class="mr-3 text-3xl">📻</span> -->
						Format
					</h2>
					<div class="grid md:grid-cols-3 gap-6 text-center">
						<div>
							<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">40 min</div>
							<div class="text-sm text-gray-600 dark:text-gray-300">Total Duration</div>
						</div>
						<div>
							<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">4</div>
							<div class="text-sm text-gray-600 dark:text-gray-300">Sections</div>
						</div>
						<div>
							<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">40</div>
							<div class="text-sm text-gray-600 dark:text-gray-300">Questions</div>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Assessment Criteria -->
		<div class="mb-12">
			<Card variant="red">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center">

					Assessment Criteria
				</h2>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Band Score Targets</h3>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 9:</span>
								<span class="font-medium text-gray-900 dark:text-white">39-40 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 8:</span>
								<span class="font-medium text-gray-900 dark:text-white">36-38 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 7:</span>
								<span class="font-medium text-gray-900 dark:text-white">30-35 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 6:</span>
								<span class="font-medium text-gray-900 dark:text-white">23-29 correct</span>
							</div>
						</div>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Key Skills Tested</h3>
						<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
							<li>• Understanding main ideas and specific details</li>
							<li>• Following conversations and monologues</li>
							<li>• Identifying speaker attitudes and opinions</li>
							<li>• Recognising factual information</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>

		<!-- Question Examples Carousel -->
		<div class="mb-12">
			<Card variant="notebook">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center">
					<!-- <span class="mr-3 text-3xl">🎧</span> -->
					Question Types
				</h2>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each questionTypes as type}
						<div class="text-center">
							<div class="text-2xl mb-3">{type.icon}</div>
							<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{type.title}</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{type.description}</p>
							<div class="mt-4">
								<Lightbox 
									src={type.image} 
									alt="{type.title} example"
									className="w-full h-auto max-h-48 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
								/>
							</div>
						</div>
					{/each}
				</div>
			</Card>
		</div>

			<!-- Call to Action -->
		<div class="text-center">
			<Card variant="teal">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
					Ready to Start Practicing?
				</h2>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					Take our complete IELTS Listening practice test with authentic questions and audio.
				</p>
				<a 
					href="/listening/practice"
					class="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
				>
					Start Practice Test Now
				</a>
			</Card>
		</div>
	</div>
</div>