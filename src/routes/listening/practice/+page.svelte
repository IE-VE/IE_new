<script>
	import { onMount } from 'svelte';

	let currentSection = 1;
	let totalSections = 4;

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
</script>

<svelte:head>
	<title>IELTS Listening Practice Test - InsideIELTS</title>
	<meta name="description" content="Complete IELTS Listening practice test with all 4 sections and 40 questions. Free practice material for IELTS preparation." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold mb-4" style="color: var(--color-text)">IELTS Listening Practice Test</h1>
			<p class="text-lg mb-6" style="color: var(--color-text-secondary)">Complete practice test with all 4 sections - 40 questions total</p>

			<!-- Audio Player -->
			<div class="p-6 rounded-lg shadow-md mb-6" style="background-color: var(--color-surface)">
				<p class="text-sm mb-4" style="color: var(--color-text-secondary)">Click to listen and answer the questions below.</p>
				<audio controls class="w-full max-w-md mx-auto">
					<source src="/audio/ielts-listening_test1.mp3" type="audio/mpeg">
					Your browser does not support the audio element.
				</audio>
				<p class="text-sm mt-2" style="color: var(--color-text-tertiary)">Allow yourself <strong>33 minutes</strong> to complete this test.</p>
			</div>
		</div>

		<!-- Navigation -->
		<div class="rounded-lg shadow-md p-4 mb-6" style="background-color: var(--color-surface)">
			<div class="flex flex-wrap justify-center gap-2 mb-4">
				{#each Array(4) as _, i}
					<button 
						class="px-4 py-2 rounded-md font-medium transition-colors {currentSection === i + 1 ? 'text-white' : 'hover:opacity-80'}"
						style={currentSection === i + 1 ? 'background-color: var(--color-accent); color: white;' : 'background-color: var(--color-surface-hover); color: var(--color-text);'}
						on:click={() => goToSection(i + 1)}
					>
						Section {i + 1}
					</button>
				{/each}
			</div>
			<div class="flex justify-between">
				<button 
					class="px-4 py-2 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white"
					style="background-color: var(--color-neutral-500)"
					on:click={prevSection}
					disabled={currentSection === 1}
				>
					Previous
				</button>
				<span class="px-4 py-2" style="color: var(--color-text-secondary)">
					Section {currentSection} of {totalSections}
				</span>
				<button 
					class="px-4 py-2 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white"
					style="background-color: var(--color-accent)"
					on:click={nextSection}
					disabled={currentSection === totalSections}
				>
					Next
				</button>
			</div>
		</div>

		<!-- Test Content -->
		<div class="rounded-lg shadow-md p-8" style="background-color: var(--color-surface)">
			{#if currentSection === 1}
				<!-- Section 1: Questions 1-10 -->
				<section class="ielts-section">
					<h2 class="text-2xl font-bold mb-6" style="color: var(--color-accent)">SECTION 1: Questions 1–10</h2>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 1–4</p>
						<p class="mb-4">Complete the notes below.<br>
						Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

						<ul class="space-y-2 ml-4">
							<li>Visit places which have:
								<ul class="ml-6 mt-2 space-y-1">
									<li>• historical interest</li>
									<li>• good <strong>1</strong> <input type="text" name="q1" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none"></li>
									<li>• <strong>2</strong> <input type="text" name="q2" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none"></li>
								</ul>
							</li>
							<li class="mt-4">Cost: between £5.00 and £15.00 per person</li>
							<li>Note: special trips organised for groups of <strong>3</strong> <input type="text" name="q3" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none"> people</li>
							<li>Time: departure – 8.30 a.m., return – 6.00 p.m.</li>
							<li>To reserve a seat: sign name on the <strong>4</strong> <input type="text" name="q4" class="border-b border-gray-400 px-2 py-1 w-48 focus:border-blue-500 focus:outline-none"> 3 days in advance</li>
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
									<tr class="bg-gray-50">
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Place</th>
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Date</th>
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Number of Seats</th>
										<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Optional Extra</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="border border-gray-300 px-4 py-3">St Ives</td>
										<td class="border border-gray-300 px-4 py-3">5 <strong>5</strong> <input type="text" name="q5" class="border-b border-gray-400 px-2 py-1 w-24 focus:border-blue-500 focus:outline-none"></td>
										<td class="border border-gray-300 px-4 py-3">16</td>
										<td class="border border-gray-300 px-4 py-3">Hepworth Museum</td>
									</tr>
									<tr class="bg-gray-50">
										<td class="border border-gray-300 px-4 py-3">London</td>
										<td class="border border-gray-300 px-4 py-3">16th February</td>
										<td class="border border-gray-300 px-4 py-3">45</td>
										<td class="border border-gray-300 px-4 py-3"><strong>6</strong> <input type="text" name="q6" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></td>
									</tr>
									<tr>
										<td class="border border-gray-300 px-4 py-3"><strong>7</strong> <input type="text" name="q7" class="border-b border-gray-400 px-2 py-1 w-24 focus:border-blue-500 focus:outline-none"></td>
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
										<td class="border border-gray-300 px-4 py-3"><strong>8</strong> <input type="text" name="q8" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></td>
									</tr>
								</tbody>
							</table>
						</div>

						<p class="mt-6">For further information:<br>
						Read the <strong>9</strong> <input type="text" name="q9" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> or see Social Assistant: Jane <strong>10</strong> <input type="text" name="q10" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></p>
					</div>
				</section>

			{:else if currentSection === 2}
				<!-- Section 2: Questions 11-20 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6" style="color: var(--color-accent)">SECTION 2: Questions 11–20</h2>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 11–13</p>
						<p class="mb-4">Complete the sentences below.<br>
						Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

						<ol start="11" class="space-y-4 ml-4">
							<li>11. Riverside Village was a good place to start an industry because it had water, raw materials and fuels such as <input type="text" name="q11a" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> and <input type="text" name="q11b" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none">.</li>
							<li>12. The metal industry was established at Riverside Village by <input type="text" name="q12" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> who lived in the area.</li>
							<li>13. There were over <input type="text" name="q13" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> water-powered mills in the area in the eighteenth century.</li>
						</ol>
					</div>

					<div>
						<p class="font-semibold mb-2">Questions 14–20</p>
						<p class="mb-4">Label the plan below.<br>
						Write NO MORE THAN TWO WORDS for each answer.</p>

						<div class="text-center my-6">
							<img src="/listening-images/ielts_section2_plan.png" alt="Plan Diagram showing Riverside Village layout with River, Engine Room, Grinding Shop, and other numbered locations" class="max-w-full h-auto border border-gray-300 mx-auto">
						</div>

						<ol start="14" class="space-y-2 ml-4">
							<li>14. <input type="text" name="q14" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> Road</li>
							<li>15. The <input type="text" name="q15" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>16. The <input type="text" name="q16" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>17. The <input type="text" name="q17" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>18. The <input type="text" name="q18" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>19. The <input type="text" name="q19" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>20. The <input type="text" name="q20" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> for the workers</li>
						</ol>
					</div>
				</section>

			{:else if currentSection === 3}
				<!-- Section 3: Questions 21-30 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6" style="color: var(--color-accent)">SECTION 3: Questions 21–30</h2>

					<div class="mb-8 p-4 bg-blue-50 rounded-lg">
						<p class="font-semibold text-blue-800 mb-2">Example</p>
						<p class="mb-2">Melanie could not borrow any books from the library because</p>
						<p class="ml-4">A. the librarian was out</p>
						<p class="ml-4">B. she didn't have time to look</p>
						<p class="ml-4 font-semibold text-blue-800">C. the books had already been borrowed</p>
					</div>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 21 and 22</p>
						<p class="mb-4">Choose the correct letter, A, B or C.</p>

						<ol start="21" class="space-y-6 ml-4">
							<li>
								<p class="mb-3">21. Melanie says she has not started the assignment because</p>
								<div class="ml-4 space-y-2">
									<label class="flex items-center space-x-2">
										<input type="radio" name="q21" value="A" class="text-blue-600">
										<span>A. she was doing work for another course.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q21" value="B" class="text-blue-600">
										<span>B. it was a really big assignment.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q21" value="C" class="text-blue-600">
										<span>C. she hasn't spent time in the library.</span>
									</label>
								</div>
							</li>
							<li>
								<p class="mb-3">22. The lecturer says that reasonable excuses for extensions are</p>
								<div class="ml-4 space-y-2">
									<label class="flex items-center space-x-2">
										<input type="radio" name="q22" value="A" class="text-blue-600">
										<span>A. planning problems.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q22" value="B" class="text-blue-600">
										<span>B. problems with assignment deadlines.</span>
									</label>
									<label class="flex items-center space-x-2">
										<input type="radio" name="q22" value="C" class="text-blue-600">
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

						<div class="mb-4 p-4 bg-blue-50 rounded-lg">
							<p class="font-semibold text-blue-800 mb-2">Example Answer</p>
							<p>Anderson and Hawker: <strong>A</strong></p>
						</div>

						<div class="mb-4 p-4 bg-gray-50 rounded-lg">
							<p class="font-semibold mb-2">Options:</p>
							<div class="grid grid-cols-2 gap-2 text-sm">
								<p>A. must read</p>
								<p>B. useful</p>
								<p>C. limited value</p>
								<p>D. read first section</p>
								<p>E. read research methods</p>
								<p>F. read conclusion</p>
								<p>G. don't read</p>
							</div>
						</div>

						<ul class="space-y-3 ml-4">
							<li>23. Jackson: <input type="text" name="q23" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li>24. Roberts: <input type="text" name="q24" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li>25. Morris: <input type="text" name="q25" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li>26. Cooper: <input type="text" name="q26" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li>27. Forster: <input type="text" name="q27" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
						</ul>
					</div>

					<div>
						<p class="font-semibold mb-2">Questions 28–30</p>
						<p class="mb-4">Label the chart below.<br>
						Choose your answers from the box below the chart and write the letters A–H next to the numbers.</p>

						<div class="text-center my-6">
							<img src="/listening-images/ielts_section3_chart.png" alt="Population studies chart showing reasons for changing accommodation with bars labeled C, E, G and numbers 28, 29, 30" class="max-w-full h-auto border border-gray-300 mx-auto">
						</div>

						<div class="mb-4 p-4 bg-gray-50 rounded-lg">
							<p class="font-semibold mb-2">Options:</p>
							<div class="grid grid-cols-2 gap-2 text-sm">
								<p>A. uncooperative landlord</p>
								<p>B. environment</p>
								<p>C. space</p>
								<p>D. noisy neighbours</p>
								<p>E. near city</p>
								<p>F. work location</p>
								<p>G. transport</p>
								<p>H. rent</p>
							</div>
						</div>

						<ul class="space-y-3 ml-4">
							<li>28: <input type="text" name="q28" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li>29: <input type="text" name="q29" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li>30: <input type="text" name="q30" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
						</ul>
					</div>
				</section>

			{:else if currentSection === 4}
				<!-- Section 4: Questions 31-40 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6" style="color: var(--color-accent)">SECTION 4: Questions 31–40</h2>

					<div>
						<p class="mb-4">Complete the notes below.<br>
						Write NO MORE THAN TWO WORDS for each answer.</p>

						<ol start="31" class="space-y-3 ml-4">
							<li>31. Ways of planning our <input type="text" name="q31" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> better</li>
							<li>32. They can make cities more or less <input type="text" name="q32" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>33. They can make inland cities more <input type="text" name="q33" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>34. Trees make local areas more <input type="text" name="q34" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>35. ... less <input type="text" name="q35" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>36. Trees evaporate water through their <input type="text" name="q36" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li>37. Tall buildings cause more wind at <input type="text" name="q37" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> level</li>
							<li>38. Trees <input type="text" name="q38" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> the wind force</li>
							<li>39. <input type="text" name="q39" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> frequency noise passes through trees</li>
							<li>40. Trees require a lot of sunlight, water and <input type="text" name="q40" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> to grow</li>
						</ol>
					</div>
				</section>
			{/if}
		</div>

		<!-- Instructions -->
		<div class="mt-8 border-l-4 p-4 rounded-r-lg" style="background-color: var(--color-primary-50); border-color: var(--color-primary-400)">
			<p class="text-sm" style="color: var(--color-text)">
				<strong>Instructions:</strong> Follow the word limits exactly as specified for each question type. 
				Transfer your answers to an official IELTS answer sheet when taking the real test.
			</p>
		</div>
	</div>
</div>

<style>
	input[type="text"], input[type="radio"] {
		accent-color: var(--color-accent);
	}

	.ielts-section h2 {
		color: var(--color-accent);
	}

	table {
		font-family: Arial, sans-serif;
		color: var(--color-text);
	}

	ol li, ul li, p {
		color: var(--color-text);
		margin-bottom: 0.75rem;
	}

	ul li {
		margin-bottom: 0.5rem;
	}

	/* Ensure all text elements use theme colors */
	* {
		color: var(--color-text);
	}

	/* Table styling to match theme */
	table th, table td {
		border-color: var(--color-border);
		background-color: var(--color-surface);
	}

	table th {
		background-color: var(--color-surface-hover);
	}

	table tr:nth-child(even) td {
		background-color: var(--color-surface-hover);
	}
</style>