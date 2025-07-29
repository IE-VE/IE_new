
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
			{ id: 1, type: 'fill', text: "1. Visit places which have good _______." },
			{ id: 2, type: 'fill', text: "2. Visit places which have _______." },
			{ id: 3, type: 'fill', text: "3. Note: special trips organised for groups of _______ people." },
			{ id: 4, type: 'fill', text: "4. To reserve a seat: sign name on the _______ 3 days in advance." },
			{ id: 5, type: 'fill', text: "5. The woman's name is _______." },
			{ id: 6, type: 'fill', text: "6. Her phone number is _______." },
			{ id: 7, type: 'fill', text: "7. She lives in _______ Street." },
			{ id: 8, type: 'fill', text: "8. Her postcode is _______." },
			{ id: 9, type: 'fill', text: "9. She heard about the club from _______." },
			{ id: 10, type: 'fill', text: "10. Additional information: _______." }
		],
		section2: [
			{ id: 11, type: 'fill', text: "11. Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer." },
			{ id: 12, type: 'fill', text: "12. The museum was originally _______." },
			{ id: 13, type: 'fill', text: "13. The museum is open _______." },
			{ id: 14, type: 'fill', text: "14. _______ Road" },
			{ id: 15, type: 'fill', text: "15. The _______" },
			{ id: 16, type: 'fill', text: "16. The _______" },
			{ id: 17, type: 'fill', text: "17. The _______" },
			{ id: 18, type: 'fill', text: "18. The _______" },
			{ id: 19, type: 'fill', text: "19. The _______" },
			{ id: 20, type: 'fill', text: "20. The _______ for the workers" }
		],
		section3: [
			{ id: 21, type: 'fill', text: "21. Complete the chart below. Choose your answers from the box and write the letters A–H next to the numbers." },
			{ id: 22, type: 'fill', text: "22. What is Anderson and Hawker's first concern about their accommodation?" },
			{ id: 23, type: 'fill', text: "23. _______ students chose reason E." },
			{ id: 24, type: 'fill', text: "24. The percentage for reason G is _______." },
			{ id: 25, type: 'fill', text: "25. The survey included _______ students in total." },
			{ id: 26, type: 'fill', text: "26. Complete the notes below. Write NO MORE THAN THREE WORDS for each answer." },
			{ id: 27, type: 'fill', text: "27. Additional data shows _______." },
			{ id: 28, type: 'fill', text: "28. _______" },
			{ id: 29, type: 'fill', text: "29. _______" },
			{ id: 30, type: 'fill', text: "30. _______" }
		],
		section4: [
			{ id: 31, type: 'fill', text: "31. Complete the notes below. Write NO MORE THAN TWO WORDS for each answer." },
			{ id: 32, type: 'fill', text: "32. In order to set up an archaeological project, it is important to have _______." },
			{ id: 33, type: 'fill', text: "33. The number of field schools is _______." },
			{ id: 34, type: 'fill', text: "34. People are interested in archaeology because they want to work _______." },
			{ id: 35, type: 'fill', text: "35. The application process takes _______." },
			{ id: 36, type: 'fill', text: "36. Differences in _______ affect the price of field schools." },
			{ id: 37, type: 'fill', text: "37. How to reduce costs: _______." },
			{ id: 38, type: 'fill', text: "38. Students must arrange their own _______." },
			{ id: 39, type: 'fill', text: "39. Equipment is provided for _______." },
			{ id: 40, type: 'fill', text: "40. An extra _______ is charged for some courses." }
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
				Complete listening test with audio and questions - 40 questions in 4 sections
			</p>
			<p class="text-gray-600 dark:text-gray-300 mt-2">
				Allow yourself <strong>33 minutes</strong> to complete this test.
			</p>
		</header>

		<!-- Audio Player -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Audio Player</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-4">
				<strong>Click to listen and answer the questions below.</strong>
			</p>

			<div class="flex justify-center mb-4">
				<audio bind:this={audioElement} controls class="w-full max-w-md">
					<source src="/audio/ielts-listening_test1.mp3" type="audio/mpeg">
					Your browser does not support the audio element.
				</audio>
			</div>
		</div>

		<!-- Section 1 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Section 1</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Questions 1-10: Complete the notes below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.
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
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Questions 11-20: Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.
			</p>

			<div class="mb-6">
				<h3 class="text-lg font-medium mb-3 text-gray-900 dark:text-white">Riverside Village Plan</h3>
				<div class="flex justify-center mb-4">
					<img 
						src="/listening-images/ielts_section2_plan.png"
						alt="Riverside Village Plan showing River, Engine Room, Grinding Shop, and other numbered locations" 
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
					<input 
						type="text" 
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						on:input={(e) => handleAnswerChange(question.id, e.target.value)}
					/>
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

			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Questions 21-30: Complete the chart below and answer the questions.
			</p>

			<div class="mb-6">
				<h3 class="text-lg font-medium mb-3 text-gray-900 dark:text-white">Reasons for changing accommodation</h3>
				<div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Choose your answers from the box:</p>
					<div class="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
						<div>A. uncooperative landlord</div>
						<div>B. environment</div>
						<div>C. space</div>
						<div>D. noisy neighbours</div>
						<div>E. near city</div>
						<div>F. work location</div>
						<div>G. transport</div>
						<div>H. rent</div>
					</div>
				</div>
				<div class="flex justify-center mb-4">
					<img 
						src="/listening-images/ielts_section3_chart.png"
						alt="Chart showing reasons for changing accommodation with bars labeled C, E, G and numbers 28, 29, 30" 
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
					<input 
						type="text" 
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						on:input={(e) => handleAnswerChange(question.id, e.target.value)}
					/>
				</div>
			{/each}
		</section>

		<!-- Section 4 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Section 4</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Questions 31-40: Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.
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

		<!-- Transfer Instructions -->
		<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-8">
			<h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Transfer Time</h3>
			<p class="text-yellow-700 dark:text-yellow-300">
				<strong>Now take 10 minutes to transfer your answers to the answer sheet, double-check for spelling errors, and make absolutely sure you've followed all instructions correctly.</strong>
			</p>
		</div>

		<!-- Submit Button -->
		<div class="text-center mb-8">
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
