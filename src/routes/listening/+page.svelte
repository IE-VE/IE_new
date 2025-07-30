
<script>
	import { onMount } from 'svelte';

	let currentExample = 0;
	const examples = [
		{
			title: 'Multiple Choice Questions',
			image: '/listening-images/ielts-listening-multiple-choice.png',
			description: 'Choose the correct answer from three options A, B, or C.'
		},
		{
			title: 'Gap Filling / Form Completion',
			image: '/listening-images/ielts-listening-missing-information.png',
			description: 'Complete forms, notes, or sentences with missing information.'
		},
		{
			title: 'Matching Information',
			image: '/listening-images/ielts-listening-matching-information.png',
			description: 'Match items from a list to corresponding categories or descriptions.'
		},
		{
			title: 'Diagram Labeling',
			image: '/listening-images/ielts-listening-diagram-labeling.png',
			description: 'Label parts of a diagram, map, or plan based on the audio.'
		},
		{
			title: 'Sentence Completion',
			image: '/listening-images/ielts-listening-sentence-completion.png',
			description: 'Complete sentences with words from the listening passage.'
		},
		{
			title: 'Short Answer Questions',
			image: '/listening-images/ielts-listening-short-answer.png',
			description: 'Answer questions with a few words or numbers from the audio.'
		}
	];

	function nextExample() {
		currentExample = (currentExample + 1) % examples.length;
	}

	function prevExample() {
		currentExample = (currentExample - 1 + examples.length) % examples.length;
	}

	onMount(() => {
		const interval = setInterval(() => {
			nextExample();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>IELTS Listening Practice - InsideIELTS</title>
	<meta name="description" content="Complete IELTS Listening practice materials, test formats, and preparation tips. Master all 4 sections with expert guidance." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">IELTS Listening Practice</h1>
			<p class="text-lg mb-6 text-gray-700 dark:text-gray-300">Master the IELTS Listening test with comprehensive practice materials and expert tips</p>
			
			<!-- CTA Button -->
			<div class="mb-8">
				<a href="/listening/practice" class="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-lg">
					Start Practice Test
				</a>
			</div>
		</div>

		<!-- Test Overview Section -->
		<div class="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 rounded shadow-md dark:bg-blue-900/20">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-blue-700 dark:text-blue-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h2 class="text-2xl font-bold">Test Overview</h2>
				</div>
			</div>
			<div class="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
				<div>
					<h3 class="font-semibold mb-2 text-blue-700 dark:text-blue-400">Test Structure</h3>
					<ul class="space-y-1">
						<li>• 4 sections, 40 questions total</li>
						<li>• 30 minutes listening + 10 minutes transfer time</li>
						<li>• Each section played only once</li>
						<li>• Increasing difficulty from Section 1 to 4</li>
					</ul>
				</div>
				<div>
					<h3 class="font-semibold mb-2 text-blue-700 dark:text-blue-400">Question Types</h3>
					<ul class="space-y-1">
						<li>• Multiple choice</li>
						<li>• Form completion</li>
						<li>• Note completion</li>
						<li>• Table completion</li>
						<li>• Diagram labeling</li>
						<li>• Sentence completion</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Assessment Section -->
		<div class="bg-teal-50 border-l-4 border-teal-400 p-6 mb-6 rounded shadow-md dark:bg-teal-900/20">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-teal-600 dark:text-teal-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
					<h2 class="text-2xl font-bold">Assessment Criteria</h2>
				</div>
			</div>
			<div class="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
				<div>
					<h3 class="font-semibold mb-2 text-teal-600 dark:text-teal-400">Band Score Range</h3>
					<ul class="space-y-1">
						<li>• Band 9: 39-40 correct answers</li>
						<li>• Band 8: 37-38 correct answers</li>
						<li>• Band 7: 32-36 correct answers</li>
						<li>• Band 6: 26-31 correct answers</li>
						<li>• Band 5: 18-25 correct answers</li>
					</ul>
				</div>
				<div>
					<h3 class="font-semibold mb-2 text-teal-600 dark:text-teal-400">Key Skills Tested</h3>
					<ul class="space-y-1">
						<li>• Understanding main ideas</li>
						<li>• Identifying specific details</li>
						<li>• Following instructions</li>
						<li>• Recognizing attitudes and opinions</li>
						<li>• Understanding purpose and function</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Instructions Section -->
		<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded shadow-md dark:bg-yellow-900/20">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					<h2 class="text-2xl font-bold">Test Instructions</h2>
				</div>
			</div>
			<div class="text-gray-700 dark:text-gray-300">
				<h3 class="font-semibold mb-3 text-yellow-700 dark:text-yellow-400">Important Guidelines:</h3>
				<ul class="space-y-2">
					<li>• Read all instructions carefully before each section</li>
					<li>• Check word limits for each question type (e.g., "NO MORE THAN TWO WORDS")</li>
					<li>• Use the preparation time to read questions ahead</li>
					<li>• Write your answers clearly on the answer sheet</li>
					<li>• Spelling and grammar must be correct</li>
					<li>• Use capital letters where appropriate</li>
					<li>• Don't leave any answers blank - guess if necessary</li>
				</ul>
			</div>
		</div>

		<!-- Question Types Section -->
		<div class="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6 rounded shadow-md dark:bg-purple-900/20">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-purple-700 dark:text-purple-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h2 class="text-2xl font-bold">Question Types Overview</h2>
				</div>
			</div>
			<div class="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
				<div>
					<h3 class="font-semibold mb-2 text-purple-700 dark:text-purple-400">Sections 1 & 2 (Social Context)</h3>
					<ul class="space-y-1">
						<li>• Form completion</li>
						<li>• Note completion</li>
						<li>• Table completion</li>
						<li>• Summary completion</li>
						<li>• Multiple choice</li>
						<li>• Plan/map labeling</li>
					</ul>
				</div>
				<div>
					<h3 class="font-semibold mb-2 text-purple-700 dark:text-purple-400">Sections 3 & 4 (Academic Context)</h3>
					<ul class="space-y-1">
						<li>• Multiple choice</li>
						<li>• Matching information</li>
						<li>• Sentence completion</li>
						<li>• Summary completion</li>
						<li>• Note completion</li>
						<li>• Table completion</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Question Examples Carousel -->
		<div class="bg-indigo-50 border-l-4 border-indigo-400 p-6 mb-6 rounded shadow-md dark:bg-indigo-900/20">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<h2 class="text-2xl font-bold">Question Examples</h2>
				</div>
			</div>
			
			<div class="relative">
				<div class="text-center mb-4">
					<h3 class="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400">{examples[currentExample].title}</h3>
					<p class="text-gray-600 dark:text-gray-400">{examples[currentExample].description}</p>
				</div>
				
				<div class="flex justify-center mb-6">
					<img 
						src={examples[currentExample].image} 
						alt={examples[currentExample].title}
						class="max-w-full h-auto border border-gray-300 rounded shadow-lg"
					>
				</div>
				
				<div class="flex justify-between items-center">
					<button 
						on:click={prevExample}
						class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
					>
						Previous
					</button>
					
					<div class="flex space-x-2">
						{#each examples as _, index}
							<button
								on:click={() => currentExample = index}
								class="w-3 h-3 rounded-full {currentExample === index ? 'bg-indigo-600' : 'bg-gray-300'} transition-colors"
							></button>
						{/each}
					</div>
					
					<button 
						on:click={nextExample}
						class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
					>
						Next
					</button>
				</div>
			</div>
		</div>

		<!-- Materials Section -->
		<div class="bg-green-50 border-l-4 border-green-400 p-6 mb-6 rounded shadow-md dark:bg-green-900/20">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-green-700 dark:text-green-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
					<h2 class="text-2xl font-bold">Study Materials</h2>
				</div>
			</div>
			<div class="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
				<div>
					<h3 class="font-semibold mb-3 text-green-700 dark:text-green-400">Practice Resources</h3>
					<ul class="space-y-2">
						<li>• <a href="/listening/practice" class="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">Complete Practice Tests</a></li>
						<li>• Section-specific exercises</li>
						<li>• Audio materials with transcripts</li>
						<li>• Vocabulary building exercises</li>
						<li>• Note-taking practice</li>
					</ul>
				</div>
				<div>
					<h3 class="font-semibold mb-3 text-green-700 dark:text-green-400">Study Tips</h3>
					<ul class="space-y-2">
						<li>• Practice active listening daily</li>
						<li>• Improve prediction skills</li>
						<li>• Master different accents</li>
						<li>• Learn common IELTS vocabulary</li>
						<li>• Time management strategies</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Call to Action -->
		<div class="text-center">
			<a href="/listening/practice" class="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-lg">
				Start Your Practice Test Now
			</a>
			<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
				Complete practice test with instant feedback and detailed explanations
			</p>
		</div>
	</div>
</div>

<style>
	/* Smooth transitions for carousel */
	.relative img {
		transition: opacity 0.3s ease-in-out;
	}
</style>
