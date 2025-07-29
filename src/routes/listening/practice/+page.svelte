<script>
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';

	let audioElement;
	let currentTime = 0;
	let duration = 0;
	let isPlaying = false;
	let answers = {};

	const questions = {
		section1: [
			{ id: 1, type: 'fill', text: "Example: The woman wants to join the _______ club." },
			{ id: 2, type: 'fill', text: "1. The woman's name is _______." },
			{ id: 3, type: 'fill', text: "2. Her phone number is _______." },
			{ id: 4, type: 'fill', text: "3. She lives in _______ Street." },
			{ id: 5, type: 'fill', text: "4. Her postcode is _______." },
			{ id: 6, type: 'fill', text: "5. She heard about the club from _______." }
		],
		section2: [
			{ id: 11, type: 'multiple', text: "11. The Riverside Village Museum is located", options: ['A) by the river', 'B) in the town center', 'C) near the old mill'] },
			{ id: 12, type: 'multiple', text: "12. The museum was originally", options: ['A) a flour mill', 'B) a textile factory', 'C) a grain store'] },
			{ id: 13, type: 'multiple', text: "13. The museum is open", options: ['A) every day', 'B) Tuesday to Sunday', 'C) weekends only'] },
			{ id: 14, type: 'fill', text: "14. The museum shop sells _______." },
			{ id: 15, type: 'fill', text: "15. Visitors can see the original _______ wheel." }
		],
		section3: [
			{ id: 21, type: 'multiple', text: "21. According to the chart, reason C represents", options: ['A) Better facilities', 'B) Closer to university', 'C) Lower cost'] },
			{ id: 22, type: 'multiple', text: "22. The most common reason for changing accommodation is", options: ['A) Reason C', 'B) Reason E', 'C) Reason G'] },
			{ id: 23, type: 'fill', text: "23. _______ students chose reason E." },
			{ id: 24, type: 'fill', text: "24. The percentage for reason G is _______." },
			{ id: 25, type: 'fill', text: "25. The survey included _______ students in total." }
		],
		section4: [
			{ id: 31, type: 'fill', text: "31. The lecture topic is about _______." },
			{ id: 32, type: 'fill', text: "32. The main problem discussed is _______." },
			{ id: 33, type: 'fill', text: "33. The first solution mentioned is _______." },
			{ id: 34, type: 'fill', text: "34. The second approach involves _______." },
			{ id: 35, type: 'fill', text: "35. The speaker concludes that _______ is essential." }
		]
	};

	onMount(() => {
		if (audioElement) {
			audioElement.addEventListener('loadedmetadata', () => {
				duration = audioElement.duration;
			});
			audioElement.addEventListener('timeupdate', () => {
				currentTime = audioElement.currentTime;
			});
		}
	});

	function togglePlay() {
		if (audioElement) {
			if (isPlaying) {
				audioElement.pause();
			} else {
				audioElement.play();
			}
			isPlaying = !isPlaying;
		}
	}

	function formatTime(time) {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	function handleAnswerChange(questionId, value) {
		answers[questionId] = value;
	}
</script>

<svelte:head>
	<title>IELTS Listening Practice Test</title>
	<meta name="description" content="Practice IELTS Listening with our comprehensive test materials. Improve your listening skills with authentic test questions and detailed feedback." />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<header class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
				IELTS Listening Practice Test
			</h1>
			<p class="text-gray-600 dark:text-gray-300">
				Complete listening test with audio and questions
			</p>
		</header>

		<!-- Audio Player -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Audio Player</h2>

			<audio bind:this={audioElement} class="w-full mb-4">
				<source src="/audio/ielts-listening_test1.mp3" type="audio/mpeg">
				Your browser does not support the audio element.
			</audio>

			<div class="flex items-center justify-between mb-2">
				<button 
					on:click={togglePlay}
					class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
				>
					{isPlaying ? 'Pause' : 'Play'}
				</button>
				<span class="text-sm text-gray-600 dark:text-gray-300">
					{formatTime(currentTime)} / {formatTime(duration)}
				</span>
			</div>

			<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
				<div 
					class="bg-blue-600 h-2 rounded-full transition-all duration-300"
					style="width: {duration ? (currentTime / duration) * 100 : 0}%"
				></div>
			</div>
		</div>

		<!-- Section 1 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Section 1</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Questions 1-6: Complete the form below. Write NO MORE THAN TWO WORDS for each answer.
			</p>

			{#each questions.section1 as question}
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{question.text}
					</label>
					<input 
						type="text" 
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						on:input={(e) => handleAnswerChange(question.id, e.target.value)}
					/>
				</div>
			{/each}
		</section>

		<!-- Section 2 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Section 2</h2>

			<div class="mb-6">
				<h3 class="text-lg font-medium mb-3 text-gray-900 dark:text-white">Plan Diagram</h3>
				<div class="flex justify-center mb-4">
					<img 
						src="/listening-images/ielts_section2_plan.png"
						alt="Plan Diagram showing Riverside Village layout with River, Engine Room, Grinding Shop, and other numbered locations" 
						class="w-full h-auto max-h-96 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
						loading="lazy"
						on:error={(e) => console.error('Failed to load image:', e.target.src)}
					/>
				</div>
			</div>

			{#each questions.section2 as question}
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{question.text}
					</label>

					{#if question.type === 'multiple'}
						{#each question.options as option}
							<div class="mb-2">
								<label class="flex items-center">
									<input 
										type="radio" 
										name="question_{question.id}"
										value={option}
										class="mr-2"
										on:change={(e) => handleAnswerChange(question.id, e.target.value)}
									/>
									<span class="text-gray-700 dark:text-gray-300">{option}</span>
								</label>
							</div>
						{/each}
					{:else}
						<input 
							type="text" 
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							on:input={(e) => handleAnswerChange(question.id, e.target.value)}
						/>
					{/if}
				</div>
			{/each}
		</section>

		<!-- Section 3 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Section 3</h2>

			<!-- Example Questions -->
			<div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
				<h3 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">Example</h3>
				<p class="text-gray-700 dark:text-gray-300 mb-2">
					Melanie could not borrow any books from the library because
				</p>
				<div class="ml-4 text-gray-700 dark:text-gray-300">
					<div>A. the librarian was out</div>
					<div>B. she didn't have time to look</div>
					<div class="font-semibold text-blue-800 dark:text-blue-200">C. the books had already been borrowed</div>
				</div>
			</div>

			<div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
				<h3 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">Example Answer</h3>
				<p class="text-gray-700 dark:text-gray-300">
					Anderson and Hawker: <span class="font-semibold text-blue-800 dark:text-blue-200">A</span>
				</p>
			</div>

			<div class="mb-6">
				<h3 class="text-lg font-medium mb-3 text-gray-900 dark:text-white">Population Studies Chart</h3></div>
				<div class="flex justify-center mb-4">
					<img 
						src="/listening-images/ielts_section3_chart.png"
						alt="Population studies chart showing reasons for changing accommodation with bars labeled C, E, G and numbers 28, 29, 30" 
						class="w-full h-auto max-h-96 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
						loading="lazy"
						on:error={(e) => console.error('Failed to load image:', e.target.src)}
					/>
				</div>
			</div>

			{#each questions.section3 as question}
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{question.text}
					</label>

					{#if question.type === 'multiple'}
						{#each question.options as option}
							<div class="mb-2">
								<label class="flex items-center">
									<input 
										type="radio" 
										name="question_{question.id}"
										value={option}
										class="mr-2"
										on:change={(e) => handleAnswerChange(question.id, e.target.value)}
									/>
									<span class="text-gray-700 dark:text-gray-300">{option}</span>
								</label>
							</div>
						{/each}
					{:else}
						<input 
							type="text" 
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							on:input={(e) => handleAnswerChange(question.id, e.target.value)}
						/>
					{/if}
				</div>
			{/each}
		</section>

		<!-- Section 4 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Section 4</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Questions 31-35: Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.
			</p>

			{#each questions.section4 as question}
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{question.text}
					</label>
					<input 
						type="text" 
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						on:input={(e) => handleAnswerChange(question.id, e.target.value)}
					/>
				</div>
			{/each}
		</section>

		<!-- Submit Button -->
		<div class="text-center">
			<button class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
				Submit Answers
			</button>
		</div>

		<!-- Call to Action -->
		<div class="mt-12 text-center">
			<Card variant="teal">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
					Ready for Personalised Feedback?
				</h2>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					Take our free speaking test to get detailed AI analysis and personalised improvement recommendations.
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