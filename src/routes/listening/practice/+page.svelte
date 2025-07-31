<script>
	import { onMount } from 'svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let currentSection = $state(1);
	let totalSections = 4;
	let showAnswersModal = $state(false);
	let showMarkingModal = $state(false);
	let userAnswers = $state({});
	let markingResults = $state({});

	// Correct answers for the test
	const correctAnswers = {
		q1: ['shopping', 'variety of shopping'],
		q2: ['guided tours'],
		q3: ['more than 12', 'over 12'],
		q4: ['notice board'],
		q5: ['13th February'],
		q6: ['Tower of London'],
		q7: ['Bristol'],
		q8: ['American Museum'],
		q9: ['student newspaper'],
		q10: ['Yentob'],
		q11: ['coal', 'firewood'], // Both answers required for 1 mark
		q12: ['local craftsmen'],
		q13: ['160'],
		q14: ['Woodside'],
		q15: ['Ticket Office'],
		q16: ['Gift Shop'],
		q17: ['(main) Workshop', 'main Workshop', 'Workshop'],
		q18: ['Showroom'],
		q19: ['Cafe'],
		q20: ['cottages'],
		q21: ['A'],
		q22: ['C'],
		q23: ['E'],
		q24: ['B'],
		q25: ['G'],
		q26: ['F'],
		q27: ['C'],
		q28: ['D'],
		q29: ['A'],
		q30: ['B'],
		q31: ['cities', 'environment'],
		q32: ['windy'],
		q33: ['humid'],
		q34: ['shady', 'shaded'],
		q35: ['dangerous'],
		q36: ['leaves'],
		q37: ['ground'],
		q38: ['considerably reduce', 'decrease', 'filter'],
		q39: ['low'],
		q40: ['space', 'room']
	};

	function collectUserAnswers() {
		// Use the userAnswers state that's already being populated by handleInputChange
		const answers = { ...userAnswers };

		// Handle question 11 special case - combine q11a and q11b into q11 array
		if (answers.q11a || answers.q11b) {
			const q11Array = [];
			if (answers.q11a && answers.q11a.trim()) {
				q11Array.push(answers.q11a.trim());
			}
			if (answers.q11b && answers.q11b.trim()) {
				q11Array.push(answers.q11b.trim());
			}
			if (q11Array.length > 0) {
				answers.q11 = q11Array;
			}
			// Remove the individual q11a and q11b entries
			delete answers.q11a;
			delete answers.q11b;
		}

		console.log('Final collected answers:', answers);
		return answers;
	}

	function markAnswers() {
		const answers = collectUserAnswers();
		console.log('Collected answers:', answers); // Debug log
		userAnswers = answers;
		const results = {};
		let totalCorrect = 0;

		Object.keys(correctAnswers).forEach(key => {
			const userAnswer = answers[key] || '';
			const correctOptions = correctAnswers[key];

			let isCorrect = false;

			if (key === 'q11') {
				// Special handling for question 11 - both answers required
				const userAnswers11 = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
				const userAnswersLower = userAnswers11.map(ans => ans.toLowerCase()).filter(ans => ans);

				// Check if both required answers are present (in any order)
				isCorrect = correctOptions.every(correct => 
					userAnswersLower.includes(correct.toLowerCase())
				) && userAnswersLower.length === correctOptions.length;
			} else {
				// Regular checking for other questions
				isCorrect = correctOptions.some(correct => 
					userAnswer.toLowerCase() === correct.toLowerCase()
				);
			}

			results[key] = {
				userAnswer: key === 'q11' && Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer,
				correctAnswers: correctOptions,
				isCorrect
			};

			if (isCorrect) totalCorrect++;
		});

		markingResults = { ...results, totalCorrect, totalQuestions: Object.keys(correctAnswers).length };
		showMarkingModal = true;
		document.body.style.overflow = 'hidden';
	}

	function closeMarkingModal() {
		showMarkingModal = false;
		document.body.style.overflow = 'auto';
	}

	function handleMarkingKeydown(event) {
		if (event.key === 'Escape' && showMarkingModal) {
			closeMarkingModal();
		}
	}

	function handleMarkingBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeMarkingModal();
		}
	}

	function getBandScore(score) {
		if (score >= 39) return 9;
		if (score >= 36) return 8;
		if (score >= 30) return 7;
		if (score >= 23) return 6;
		if (score >= 16) return 5;
		if (score >= 11) return 4;
		if (score >= 6) return 3;
		if (score >= 3) return 2;
		return 1;
	}

	function nextSection() {
		if (currentSection < totalSections) {
			currentSection++;
		}
	}

	function prevSection() {
		if (currentSection > 1) {
			currentSection--;
		}
	}

	function goToSection(section) {
		currentSection = section;
	}

	function openAnswersModal() {
		showAnswersModal = true;
		document.body.style.overflow = 'hidden';
	}

	function closeAnswersModal() {
		showAnswersModal = false;
		document.body.style.overflow = 'auto';
	}

	function handleKeydown(event) {
		if (event.key === 'Escape' && showAnswersModal) {
			closeAnswersModal();
		}
		if (event.key === 'Escape' && showMarkingModal) {
			closeMarkingModal();
		}
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeAnswersModal();
		}
	}

  function handleInputChange(event) {
    const { name, value } = event.target;
    userAnswers = { ...userAnswers, [name]: value };
    console.log('Current user answers:', userAnswers);
  }

	onMount(() => {
		return () => {
			document.body.style.overflow = 'auto';
		};
	});
</script>

<svelte:head>
	<title>IELTS Listening Practice Test - InsideIELTS</title>
	<meta name="description" content="Complete IELTS Listening practice test with all 4 sections and 40 questions. Free practice material for IELTS preparation." />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">IELTS Listening Practice Test 1</h1>
			<p class="text-lg mb-6 text-gray-700 dark:text-gray-300">Complete practice test with all 4 sections - 40 questions total</p>

			<!-- Audio Player -->
			<div class="p-6 rounded-lg shadow-md mb-6 bg-white dark:bg-gray-800">
				<p class="text-sm mb-4 text-gray-600 dark:text-gray-400">Click to listen and answer the questions below.</p>
				<audio controls class="w-full max-w-md mx-auto">
					<source src="/audio/ielts-listening_test1.mp3" type="audio/mpeg">
					Your browser does not support the audio element.
				</audio>
				<p class="text-sm mt-2 text-gray-500 dark:text-gray-400">Allow yourself <strong>33 minutes</strong> to complete this test.</p>
			</div>
		</div>

		<!-- Navigation -->
		<div class="rounded-lg shadow-md p-4 mb-6 bg-white dark:bg-gray-800">
			<div class="flex flex-wrap justify-center gap-2 mb-4">
				{#each Array(4) as _, i}
					<button 
						class="px-4 py-2 rounded-md font-medium transition-colors {currentSection === i + 1 ? 'bg-teal-600 text-white' : 'bg-teal-50 text-gray-700 hover:bg-teal-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
						onclick={() => goToSection(i + 1)}
					>
						Section {i + 1}
					</button>
				{/each}
			</div>
			<div class="flex justify-between">
				<button 
					class="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={prevSection}
					disabled={currentSection === 1}
				>
					Previous
				</button>
				<span class="px-4 py-2 text-gray-600 dark:text-gray-400">
					Section {currentSection} of {totalSections}
				</span>
				<button 
					class="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={nextSection}
					disabled={currentSection === totalSections}
				>
					Next
				</button>
			</div>
		</div>

		<!-- Test Content -->
		<form class="rounded-lg shadow-md p-8 bg-white dark:bg-gray-800">
			{#if currentSection === 1}
				<!-- Section 1: Questions 1-10 -->
				<section class="ielts-section">
					<h2 class="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">SECTION 1: Questions 1–10</h2>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 1–4</p>
						<p class="mb-4">Complete the notes below.<br>
						Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

						<ul class="space-y-2 ml-4">
							<li>Visit places which have:
								<ul class="ml-6 mt-2 space-y-1">
									<li>• historical interest</li>
									<li>• good <strong>1</strong> <input type="text" name="q1" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
									<li>• <strong>2</strong> <input type="text" name="q2" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
								</ul>
							</li>
							<li class="mt-4">Cost: between £5.00 and £15.00 per person</li>
							<li>Note: special trips organised for groups of <strong>3</strong> <input type="text" name="q3" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> people</li>
							<li>Time: departure – 8.30 a.m., return – 6.00 p.m.</li>
							<li>To reserve a seat: sign name on the <strong>4</strong> <input type="text" name="q4" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> 3 days in advance</li>
						</ul>
					</div>

					<hr class="my-8">

					<div>
						<p class="font-semibold mb-2">Questions 5–10</p>
						<p class="mb-4">Complete the table below.<br>
						Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

						<div class="overflow-x-auto">
							<table class="w-full border-collapse border border-gray-300 mt-4">
								<thead>
									<tr class="bg-teal-50 dark:bg-teal-900/20">
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Place</th>
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Date</th>
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Number of Seats</th>
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Optional Extra</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="border border-gray-300 px-4 py-3">St Ives</td>
										<td class="border border-gray-300 px-4 py-3"><strong>5</strong> <input type="text" name="q5" class="border-b border-gray-400 px-2 py-1 w-24 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></td>
										<td class="border border-gray-300 px-4 py-3">16</td>
										<td class="border border-gray-300 px-4 py-3">Hepworth Museum</td>
									</tr>
									<tr class="bg-gray-50">
										<td class="border border-gray-300 px-4 py-3">London</td>
										<td class="border border-gray-300 px-4 py-3">16th February</td>
										<td class="border border-gray-300 px-4 py-3">45</td>
										<td class="border border-gray-300 px-4 py-3"><strong>6</strong> <input type="text" name="q6" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></td>
									</tr>
									<tr>
										<td class="border border-gray-300 px-4 py-3"><strong>7</strong> <input type="text" name="q7" class="border-b border-gray-400 px-2 py-1 w-24 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></td>
										<td class="border border-gray-300 px-4 py-3">3rd March</td>
										<td class="border border-gray-300 px-4 py-3">18</td>
										<td class="border border-gray-300 px-4 py-3">S.S. Great Britain</td>
									</tr>
									<tr class="bg-gray-50">
										<td class="border border-gray-300 px-4 py-3">Salisbury</td>
										<td class="border border-gray-300 px-4 py-3">18th March</td>
										<td class="border border-gray-300 px-4 py-3">50</td>
										<td class="border border-gray-300 px-4 py-3">Stonehenge</td>
									</tr>
									<tr>
										<td class="border border-gray-300 px-4 py-3">Bath</td>
										<td class="border border-gray-300 px-4 py-3">23rd March</td>
										<td class="border border-gray-300 px-4 py-3">16</td>
										<td class="border border-gray-300 px-4 py-3"><strong>8</strong> <input type="text" name="q8" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></td>
									</tr>
								</tbody>
							</table>
						</div>

						<p class="mt-6">For further information:<br>
						Read the <strong>9</strong> <input type="text" name="q9" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> or see Social Assistant: Jane <strong>10</strong> <input type="text" name="q10" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></p>
					</div>
				</section>

			{:else if currentSection === 2}
				<!-- Section 2: Questions 11-20 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">SECTION 2: Questions 11–20</h2>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 11–13</p>
						<p class="mb-4">Complete the sentences below.<br>
						Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

						<ol start="11" class="space-y-4 ml-4">
							<li><strong>11.</strong> Riverside Village was a good place to start an industry because it had water, raw materials and fuels such as <input type="text" name="q11a" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> and <input type="text" name="q11b" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}>.</li>

							<li><strong>12.</strong> The metal industry was established at Riverside Village by <input type="text" name="q12" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> who lived in the area.</li>
							<li><strong>13.</strong> There were over <input type="text" name="q13" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> water-powered mills in the area in the eighteenth century.</li>
						</ol>
					</div>

					<div>
						<p class="font-semibold mb-2">Questions 14–20</p>
						<p class="mb-4">Label the plan below.<br>
						Write NO MORE THAN TWO WORDS for each answer.</p>

						<div class="text-center my-6">
							<Lightbox 
								src="/listening-images/ielts_section2_plan.png" 
								alt="Plan Diagram showing Riverside Village layout with River, Engine Room, Grinding Shop, and other numbered locations" 
								className="max-w-full h-auto border border-gray-300 mx-auto"
							/>
						</div>

						<ol start="14" class="space-y-2 ml-4">
							<li><strong>14.</strong> <input type="text" name="q14" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> Road</li>
							<li><strong>15.</strong> The <input type="text" name="q15" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>16.</strong> The <input type="text" name="q16" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>17.</strong> The <input type="text" name="q17" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>18.</strong> The <input type="text" name="q18" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>19.</strong> The <input type="text" name="q19" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>20.</strong> The <input type="text" name="q20" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> for the workers</li>
						</ol>
					</div>
				</section>

			{:else if currentSection === 3}
				<!-- Section 3: Questions 21-30 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">SECTION 3: Questions 21–30</h2>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 21 and 22</p>
						<p class="mb-4">Choose the correct letter, A, B or C.</p>

						<ol start="21" class="space-y-6 ml-4">
							<li>
								<p class="mb-3"><strong>21.</strong> Melanie says she has not started the assignment because</p>
								<div class="ml-4 space-y-2">
									<label class="flex items-center space-x-2">
										<input type="radio" name="q21" value="A" class="text-blue-600" onchange={handleInputChange}>
										<span>A. she was doing work for another course.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q21" value="B" class="text-blue-600" onchange={handleInputChange}>
										<span>B. it was a really big assignment.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q21" value="C" class="text-blue-600" onchange={handleInputChange}>
										<span>C. she hasn't spent time in the library.</span>
									</label>
								</div>
							</li>
							<li>
								<p class="mb-3"><strong>22.</strong> The lecturer says that reasonable excuses for extensions are</p>
								<div class="ml-4 space-y-2">
									<label class="flex items-center space-x-2">
										<input type="radio" name="q22" value="A" class="text-blue-600" onchange={handleInputChange}>
										<span>A. planning problems.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q22" value="B" class="text-blue-600" onchange={handleInputChange}>
										<span>B. problems with assignment deadlines.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q22" value="C" class="text-blue-600" onchange={handleInputChange}>
										<span>C. personal illness or accident.</span>
									</label>
								</div>
							</li>
						</ol>
					</div>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 23–27</p>
						<p class="mb-4">What recommendations does Dr Johnson make about the journal articles?<br>
						Choose your answers from the box and write the letters A–G next to the names.</p>


						<ul class="space-y-3 ml-4">
							<li><strong>23.</strong> Jackson: <input type="text" name="q23" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>24.</strong> Roberts: <input type="text" name="q24" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>25.</strong> Morris: <input type="text" name="q25" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>26.</strong> Cooper: <input type="text" name="q26" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>27.</strong> Forster: <input type="text" name="q27" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
						</ul>
					</div>

					<div>
						<p class="font-semibold mb-2">Questions 28–30</p>
						<p class="mb-4">Label the chart below.<br>
						Choose your answers from the box below the chart and write the letters A–H next to the numbers.</p>

						<div class="text-center my-6">
							<Lightbox 
								src="/listening-images/ielts_section3_chart.png" 
								alt="Population studies chart showing reasons for changing accommodation with bars labeled C, E, G and numbers 28, 29, 30" 
								className="max-w-full h-auto border border-gray-300 mx-auto"
							/>
						</div>

						<ul class="space-y-3 ml-4">
							<li><strong>28:</strong> <input type="text" name="q28" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>29:</strong> <input type="text" name="q29" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>30:</strong> <input type="text" name="q30" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
						</ul>
					</div>
				</section>

			{:else if currentSection === 4}
				<!-- Section 4: Questions 31-40 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">SECTION 4: Questions 31–40</h2>

					<div>
						<p class="mb-4">Complete the notes below.<br>
						Write NO MORE THAN TWO WORDS for each answer.</p>

						<ol start="31" class="space-y-3 ml-4">
							<li><strong>31.</strong> Ways of planning our <input type="text" name="q31" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> better</li>
							<li><strong>32.</strong> They can make cities more or less <input type="text" name="q32" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>33.</strong> They can make inland cities more <input type="text" name="q33" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>34.</strong> Trees make local areas more <input type="text" name="q34" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>35.</strong> ... less <input type="text" name="q35" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>36.</strong> Trees evaporate water through their <input type="text" name="q36" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}></li>
							<li><strong>37.</strong> Tall buildings cause more wind at <input type="text" name="q37" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> level</li>
							<li><strong>38.</strong> Trees <input type="text" name="q38" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> the wind force</li>
							<li><strong>39.</strong> <input type="text" name="q39" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> frequency noise passes through trees</li>
							<li><strong>40.</strong> Trees require a lot of sunlight, water and <input type="text" name="q40" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none" oninput={handleInputChange}> to grow</li>
						</ol>
					</div>


				</section>
			{/if}
		</form>

		<!-- Instructions -->
		<div class="mt-8 border-l-4 border-teal-400 bg-teal-50 p-4 rounded-r-lg dark:bg-teal-900/20 dark:border-teal-500">
			{#if currentSection === 4}
				<center><p class="text-sm text-gray-900 dark:text-gray-100">
					<strong>END OF TEST</strong> 
				</p></center>	
				<p class="text-sm text-gray-900 dark:text-gray-100">
					In the real IELTS Listening Test you would now have 10 minutes to transfer your answers to the official answer sheet.
				</p>
				<p class="text-sm text-gray-900 dark:text-gray-100 mt-2">
					<a 
						href="/listening-images/ielts-listening-answer-sheet.jpg"
						download="IELTS-Listening-Answer-Sheet.jpg"
						class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
					>
						Download official answer sheet
					</a>
				</p>
			{:else}
				<center><p class="text-sm text-gray-900 dark:text-gray-100">
					<strong>End of Section {currentSection}</strong> 
				</p>
				<p class="text-sm text-gray-900 dark:text-gray-100">
					Use any remaining time to check your answers and then move to the next section.
				</p></center>	
			{/if}
		</div>

		<!-- Action Buttons - only show on Section 4 -->
		{#if currentSection === 4}
			<div class="mt-6 flex flex-col gap-4 items-center">
				<button
					type="button"
					onclick={openAnswersModal}
					class="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-lg"
				>
					✅ View Answers & Mark my Test
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- Answers Modal -->
{#if showAnswersModal}
	<div 
		class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="answers-modal-title"
	>
		<div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mb-8">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<h2 id="answers-modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">
					IELTS Listening Test 1 – Answer Key
				</h2>
				<button 
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
					onclick={closeAnswersModal}
					aria-label="Close answers modal"
				>
					×
				</button>
			</div>

			<!-- Modal Content -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
				<div class="grid md:grid-cols-2 gap-4 text-sm">
					<div class="space-y-2">
						<p><strong>1.</strong> shopping / variety of shopping</p>
						<p><strong>2.</strong> guided tours</p>
						<p><strong>3.</strong> more than 12 / over 12</p>
						<p><strong>4.</strong> notice board</p>
						<p><strong>5.</strong> 13th February</p>
						<p><strong>6.</strong> Tower of London</p>
						<p><strong>7.</strong> Bristol</p>
						<p><strong>8.</strong> American Museum</p>
						<p><strong>9.</strong> student newspaper</p>
						<p><strong>10.</strong> Yentob</p>
						<p><strong>11.</strong> coal and firewood</p>
						<p><strong>12.</strong> local craftsmen</p>
						<p><strong>13.</strong> 160</p>
						<p><strong>14.</strong> Woodside</p>
						<p><strong>15.</strong> Ticket Office</p>
						<p><strong>16.</strong> Gift Shop</p>
						<p><strong>17.</strong> (main) Workshop</p>
						<p><strong>18.</strong> Showroom</p>
						<p><strong>19.</strong> Cafe</p>
						<p><strong>20.</strong> cottages</p>
					</div>
					<div class="space-y-2">
						<p><strong>21.</strong> A</p>
						<p><strong>22.</strong> C</p>
						<p><strong>23.</strong> E</p>
						<p><strong>24.</strong> B</p>
						<p><strong>25.</strong> G</p>
						<p><strong>26.</strong> F</p>
						<p><strong>27.</strong> C</p>
						<p><strong>28.</strong> D</p>
						<p><strong>29.</strong> A</p>
						<p><strong>30.</strong> B</p>
						<p><strong>31.</strong> cities / environment</p>
						<p><strong>32.</strong> windy</p>
						<p><strong>33.</strong> humid</p>
						<p><strong>34.</strong> shady / shaded</p>
						<p><strong>35.</strong> dangerous</p>
						<p><strong>36.</strong> leaves</p>
						<p><strong>37.</strong> ground</p>
						<p><strong>38.</strong> considerably reduce / decrease / filter</p>
						<p><strong>39.</strong> low</p>
						<p><strong>40.</strong> space / room</p>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="flex justify-between p-6 pb-8 border-t border-gray-200 dark:border-gray-700">
				<button
					type="button"
					onclick={markAnswers}
					class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
				>
					📝 MARK my TEST
				</button>
				<button 
					class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
					onclick={closeAnswersModal}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Marking Results Modal -->
{#if showMarkingModal}
	<div 
		class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
		onclick={handleMarkingBackdropClick}
		onkeydown={handleMarkingKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="marking-modal-title"
	>
		<div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden mb-8">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div>
					<h2 id="marking-modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">
						Your Test Results
					</h2>
					<p class="text-lg mt-2">
						Score: <span class="font-bold text-green-600">{markingResults.totalCorrect || 0}</span>/<span class="font-bold">{markingResults.totalQuestions || 40}</span> 
						| Band Score: <span class="font-bold text-blue-600">{getBandScore(markingResults.totalCorrect || 0)}</span>
					</p>
				</div>
				<button 
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
					onclick={closeMarkingModal}
					aria-label="Close marking results modal"
				>
					×
				</button>
			</div>

			<!-- Modal Content -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
				<div class="grid md:grid-cols-2 gap-6 text-sm">
					<!-- Left Column: Sections 1 & 2 -->
					<div class="space-y-6">
						<!-- Section 1 -->
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Section 1 (Questions 1-10)</h3>
							<div class="space-y-2">
								{#each Object.entries(markingResults).filter(([key]) => key.startsWith('q') && parseInt(key.substring(1).replace(/[ab]$/, '')) <= 10) as [questionKey, result]}
									<div class="flex items-center justify-between p-3 rounded-lg border {result.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}">
										<div class="flex-1">
											<div class="font-medium">
												{questionKey.replace('q', 'Q').replace('a', 'A').replace('b', 'B')}: 
												<span class="text-gray-600 dark:text-gray-300">"{result.userAnswer || '(blank)'}"</span>
											</div>
											<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
												Correct: {result.correctAnswers.join(' / ')}
											</div>
										</div>
										<div class="ml-4">
											{#if result.isCorrect}
												<span class="text-green-600 text-xl">✓</span>
											{:else}
												<span class="text-red-600 text-xl">✗</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Section 2 -->
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Section 2 (Questions 11-20)</h3>
							<div class="space-y-2">
								{#each Object.entries(markingResults).filter(([key]) => key.startsWith('q') && parseInt(key.substring(1).replace(/[ab]$/, '')) >= 11 && parseInt(key.substring(1).replace(/[ab]$/, '')) <= 20) as [questionKey, result]}
									<div class="flex items-center justify-between p-3 rounded-lg border {result.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}">
										<div class="flex-1">
											<div class="font-medium">
												{questionKey.replace('q', 'Q').replace('a', 'A').replace('b', 'B')}: 
												<span class="text-gray-600 dark:text-gray-300">"{result.userAnswer || '(blank)'}"</span>
											</div>
											<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
												Correct: {result.correctAnswers.join(' / ')}
											</div>
										</div>
										<div class="ml-4">
											{#if result.isCorrect}
												<span class="text-green-600 text-xl">✓</span>
											{:else}
												<span class="text-red-600 text-xl">✗</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Right Column: Sections 3 & 4 -->
					<div class="space-y-6">
						<!-- Section 3 -->
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Section 3 (Questions 21-30)</h3>
							<div class="space-y-2">
								{#each Object.entries(markingResults).filter(([key]) => key.startsWith('q') && parseInt(key.substring(1).replace(/[ab]$/, '')) >= 21 && parseInt(key.substring(1).replace(/[ab]$/, '')) <= 30) as [questionKey, result]}
									<div class="flex items-center justify-between p-3 rounded-lg border {result.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}">
										<div class="flex-1">
											<div class="font-medium">
												{questionKey.replace('q', 'Q').replace('a', 'A').replace('b', 'B')}: 
												<span class="text-gray-600 dark:text-gray-300">"{result.userAnswer || '(blank)'}"</span>
											</div>
											<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
												Correct: {result.correctAnswers.join(' / ')}
											</div>
										</div>
										<div class="ml-4">
											{#if result.isCorrect}
												<span class="text-green-600 text-xl">✓</span>
											{:else}
												<span class="text-red-600 text-xl">✗</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Section 4 -->
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Section 4 (Questions 31-40)</h3>
							<div class="space-y-2">
								{#each Object.entries(markingResults).filter(([key]) => key.startsWith('q') && parseInt(key.substring(1).replace(/[ab]$/, '')) >= 31 && parseInt(key.substring(1).replace(/[ab]$/, '')) <= 40) as [questionKey, result]}
									<div class="flex items-center justify-between p-3 rounded-lg border {result.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}">
										<div class="flex-1">
											<div class="font-medium">
												{questionKey.replace('q', 'Q').replace('a', 'A').replace('b', 'B')}: 
												<span class="text-gray-600 dark:text-gray-300">"{result.userAnswer || '(blank)'}"</span>
											</div>
											<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
												Correct: {result.correctAnswers.join(' / ')}
											</div>
										</div>
										<div class="ml-4">
											{#if result.isCorrect}
												<span class="text-green-600 text-xl">✓</span>
											{:else}
												<span class="text-red-600 text-xl">✗</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Band Score Information -->
				<div class="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
					<h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">IELTS Band Score Guide</h3>
					<div class="grid md:grid-cols-2 gap-4 text-sm">
						<div class="space-y-2">
							<div class="flex justify-between">
								<span>Band 9:</span>
								<span class="font-medium">39-40 correct</span>
							</div>
							<div class="flex justify-between">
								<span>Band 8:</span>
								<span class="font-medium">36-38 correct</span>
							</div>
							<div class="flex justify-between">
								<span>Band 7:</span>
								<span class="font-medium">30-35 correct</span>
							</div>
							<div class="flex justify-between">
								<span>Band 6:</span>
								<span class="font-medium">23-29 correct</span>
							</div>
						</div>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span>Band 5:</span>
								<span class="font-medium">16-22 correct</span>
							</div>
							<div class="flex justify-between">
								<span>Band 4:</span>
								<span class="font-medium">11-15 correct</span>
							</div>
							<div class="flex justify-between">
								<span>Band 3:</span>
								<span class="font-medium">6-10 correct</span>
							</div>
							<div class="flex justify-between">
								<span>Band 2:</span>
								<span class="font-medium">3-5 correct</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="flex justify-between p-6 pb-8 border-t border-gray-200 dark:border-gray-700">
				<button 
					class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
					onclick={openAnswersModal}
				>
					Query my Results
				</button>
				<button 
					class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
					onclick={closeMarkingModal}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	input[type="text"], input[type="radio"] {
		accent-color: rgb(13 148 136); /* teal-600 */
		color: rgb(17 24 39); /* gray-900 - dark text */
		background-color: white;
	}

	input[type="text"]:focus {
		border-color: rgb(13 148 136); /* teal-600 */
		outline: none;
		color: rgb(17 24 39); /* gray-900 - dark text */
		background-color: white;
	}

	table {
		font-family: Arial, sans-serif;
	}

	ol li, ul li, p {
		margin-bottom: 0.75rem;
	}

	ul li {
		margin-bottom: 0.5rem;
	}

	/* Table styling to match theme */
	table th, table td {
		border-color: rgb(209 213 219); /* gray-300 */
		background-color: white;
	}

	table th {
		background-color: rgb(240 253 250); /* teal-50 */
	}

	table tr:nth-child(even) td {
		background-color: rgb(249 250 251); /* gray-50 */
	}

	:global(.dark) table th, :global(.dark) table td {
		border-color: rgb(75 85 99); /* gray-600 */
		background-color: rgb(31 41 55); /* gray-800 */
	}

	:global(.dark) table th {
		background-color: rgb(13 148 136 / 0.2); /* teal-600/20 */
	}

	:global(.dark) table tr:nth-child(even) td {
		background-color: rgb(55 65 81); /* gray-700 */
	}
</style>