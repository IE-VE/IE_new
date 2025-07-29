
<script>
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';

	let audioElement;
	let currentTime = 0;
	let duration = 0;
	let isPlaying = false;
	let answers = {};

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
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">SECTION 1: Questions 1–10</h2>

			<div class="mb-8">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 1–4</strong><br>
					Complete the notes below.<br>
					Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.
				</p>

				<ul class="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
					<li>Visit places which have:
						<ul class="list-disc ml-6 mt-2 space-y-1">
							<li>• historical interest</li>
							<li>• good <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q1', e.target.value)}></li>
							<li>• <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q2', e.target.value)}></li>
						</ul>
					</li>
					<li>Cost: between £5.00 and £15.00 per person</li>
					<li>Note: special trips organised for groups of <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q3', e.target.value)}> people</li>
					<li>Time: departure – 8.30 a.m., return – 6.00 p.m.</li>
					<li>To reserve a seat: sign name on the <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q4', e.target.value)}> 3 days in advance</li>
				</ul>
			</div>

			<hr class="my-6 border-gray-300 dark:border-gray-600">

			<div class="mb-6">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 5–10</strong><br>
					Complete the table below.<br>
					Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.
				</p>

				<div class="overflow-x-auto">
					<table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
						<thead>
							<tr class="bg-gray-100 dark:bg-gray-700">
								<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Place</th>
								<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Date</th>
								<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Number of Seats</th>
								<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Optional Extra</th>
							</tr>
						</thead>
						<tbody class="text-gray-700 dark:text-gray-300">
							<tr>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">St Ives</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">5 <input type="text" class="inline-block w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q5', e.target.value)}></td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">16</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Hepworth Museum</td>
							</tr>
							<tr>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">London</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">16th February</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">45</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"><input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q6', e.target.value)}></td>
							</tr>
							<tr>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"><input type="text" class="inline-block w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q7', e.target.value)}></td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">3rd March</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">18</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">S.S. Great Britain</td>
							</tr>
							<tr>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Salisbury</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">18th March</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">50</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Stonehenge</td>
							</tr>
							<tr>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Bath</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">23rd March</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">16</td>
								<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"><input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q8', e.target.value)}></td>
							</tr>
						</tbody>
					</table>
				</div>

				<p class="text-gray-700 dark:text-gray-300 mt-4">
					For further information:<br>
					Read the <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q9', e.target.value)}> or see Social Assistant: Jane <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q10', e.target.value)}>
				</p>
			</div>
		</section>

		<!-- Section 2 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">SECTION 2: Questions 11–20</h2>

			<div class="mb-8">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 11–13</strong><br>
					Complete the sentences below.<br>
					Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.
				</p>

				<ol start="11" class="space-y-4 text-gray-700 dark:text-gray-300">
					<li>Riverside Village was a good place to start an industry because it had water, raw materials and fuels such as <input type="text" class="inline-block w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q11a', e.target.value)}> and <input type="text" class="inline-block w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q11b', e.target.value)}>.</li>
					<li>The metal industry was established at Riverside Village by <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q12', e.target.value)}> who lived in the area.</li>
					<li>There were over <input type="text" class="inline-block w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q13', e.target.value)}> water-powered mills in the area in the eighteenth century.</li>
				</ol>
			</div>

			<div class="mb-6">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 14–20</strong><br>
					Label the plan below.<br>
					Write NO MORE THAN TWO WORDS for each answer.
				</p>

				<div class="flex justify-center mb-6">
					<img 
						src="/listening-images/ielts_section2_plan.png"
						alt="Plan Diagram" 
						class="w-full h-auto max-h-96 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
						loading="lazy"
					/>
				</div>

				<ol start="14" class="space-y-2 text-gray-700 dark:text-gray-300">
					<li><input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q14', e.target.value)}> Road</li>
					<li>The <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q15', e.target.value)}></li>
					<li>The <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q16', e.target.value)}></li>
					<li>The <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q17', e.target.value)}></li>
					<li>The <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q18', e.target.value)}></li>
					<li>The <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q19', e.target.value)}></li>
					<li>The <input type="text" class="inline-block w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q20', e.target.value)}> for the workers</li>
				</ol>
			</div>
		</section>

		<!-- Section 3 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">SECTION 3: Questions 21–30</h2>

			<!-- Example -->
			<div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
				<p class="text-blue-800 dark:text-blue-200">
					<strong>Example</strong><br>
					Melanie could not borrow any books from the library because<br>
					A. the librarian was out<br>
					B. she didn't have time to look<br>
					<strong>C. the books had already been borrowed</strong>
				</p>
			</div>

			<!-- Questions 21-22 -->
			<div class="mb-8">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 21 and 22</strong><br>
					Choose the correct letter, A, B or C.
				</p>

				<ol start="21" class="space-y-4 text-gray-700 dark:text-gray-300">
					<li>
						Melanie says she has not started the assignment because<br>
						<label class="block mt-2"><input type="radio" name="q21" value="A" class="mr-2"> A. she was doing work for another course.</label>
						<label class="block"><input type="radio" name="q21" value="B" class="mr-2"> B. it was a really big assignment.</label>
						<label class="block"><input type="radio" name="q21" value="C" class="mr-2"> C. she hasn't spent time in the library.</label>
					</li>
					<li>
						The lecturer says that reasonable excuses for extensions are<br>
						<label class="block mt-2"><input type="radio" name="q22" value="A" class="mr-2"> A. planning problems.</label>
						<label class="block"><input type="radio" name="q22" value="B" class="mr-2"> B. problems with assignment deadlines.</label>
						<label class="block"><input type="radio" name="q22" value="C" class="mr-2"> C. personal illness or accident.</label>
					</li>
				</ol>
			</div>

			<!-- Questions 23-27 -->
			<div class="mb-8">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 23–27</strong><br>
					What recommendations does Dr Johnson make about the journal articles?<br>
					Choose your answers from the box and write the letters A–G next to the names.
				</p>

				<div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
					<p class="text-blue-800 dark:text-blue-200">
						<strong>Example Answer</strong><br>
						Anderson and Hawker: <strong>A</strong>
					</p>
				</div>

				<div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Options:</strong></p>
					<div class="grid grid-cols-1 gap-1 text-sm text-gray-700 dark:text-gray-300">
						<div>A. must read</div>
						<div>B. useful</div>
						<div>C. limited value</div>
						<div>D. read first section</div>
						<div>E. read research methods</div>
						<div>F. read conclusion</div>
						<div>G. don't read</div>
					</div>
				</div>

				<ul class="space-y-2 text-gray-700 dark:text-gray-300">
					<li>Jackson: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q23', e.target.value)}></li>
					<li>Roberts: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q24', e.target.value)}></li>
					<li>Morris: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q25', e.target.value)}></li>
					<li>Cooper: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q26', e.target.value)}></li>
					<li>Forster: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q27', e.target.value)}></li>
				</ul>
			</div>

			<!-- Questions 28-30 -->
			<div class="mb-6">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					<strong>Questions 28–30</strong><br>
					Label the chart below.<br>
					Choose your answers from the box below the chart and write the letters A–H next to the numbers.
				</p>

				<div class="flex justify-center mb-4">
					<img 
						src="/listening-images/ielts_section3_chart.png"
						alt="Chart Diagram" 
						class="w-full h-auto max-h-96 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
						loading="lazy"
					/>
				</div>

				<div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Options:</strong></p>
					<div class="grid grid-cols-2 gap-1 text-sm text-gray-700 dark:text-gray-300">
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

				<ul class="space-y-2 text-gray-700 dark:text-gray-300">
					<li>28: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q28', e.target.value)}></li>
					<li>29: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q29', e.target.value)}></li>
					<li>30: <input type="text" class="inline-block w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q30', e.target.value)}></li>
				</ul>
			</div>
		</section>

		<!-- Section 4 -->
		<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">SECTION 4: Questions 31–40</h2>

			<div class="mb-6">
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Complete the notes below.<br>
					Write NO MORE THAN TWO WORDS for each answer.
				</p>

				<ol start="31" class="space-y-2 text-gray-700 dark:text-gray-300">
					<li>Ways of planning our <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q31', e.target.value)}> better</li>
					<li>They can make cities more or less <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q32', e.target.value)}></li>
					<li>They can make inland cities more <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q33', e.target.value)}></li>
					<li>Trees make local areas more <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q34', e.target.value)}></li>
					<li>... less <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q35', e.target.value)}></li>
					<li>Trees evaporate water through their <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q36', e.target.value)}></li>
					<li>Tall buildings cause more wind at <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q37', e.target.value)}> level</li>
					<li>Trees <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q38', e.target.value)}> the wind force</li>
					<li><input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q39', e.target.value)}> frequency noise passes through trees</li>
					<li>Trees require a lot of sunlight, water and <input type="text" class="inline-block w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" on:input={(e) => handleAnswerChange('q40', e.target.value)}> to grow</li>
				</ol>
			</div>
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
