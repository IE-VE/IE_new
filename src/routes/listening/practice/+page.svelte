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

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">IELTS Listening Test</h1>
			<p class="text-lg mb-6 text-gray-700 dark:text-gray-300">Complete practice test with all 4 sections - 40 questions total</p>
		</div>

		<!-- Test Overview Section -->
		<div class="rounded-lg shadow-md p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-blue-700 dark:text-blue-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.464-9.536a9 9 0 010 12.728M9 12h6m-6 0a3 3 0 106 0" />
					</svg>
					<h2 class="text-xl font-bold">THE LISTENING TEST</h2>
				</div>
			</div>
			
			<div class="text-gray-700 dark:text-gray-300 space-y-4">
				<p>
					The <strong>IELTS</strong> Listening Test is the first test that you will complete on test day. The test lasts for <strong>40 minutes</strong>. 
					You have 30 minutes to listen to the recording and write your answers directly on the test booklet, and then a further 10 minutes at the end 
					of the test to transfer your answers onto the answer sheet provided.
				</p>
				
				<p>The listening test is made up of <strong>40 questions</strong> in <strong>four sections</strong>:</p>
				
				<ul class="ml-6 space-y-2 list-disc">
					<li>Section 1 takes the form of a conversation between two people;</li>
					<li>Section 2 is a monologue based on social topics and situations;</li>
					<li>Section 3 of the listening test is a conversation between up to four people;</li>
					<li>Section 4 will be a monologue set in an educational context.</li>
				</ul>
			</div>
		</div>

		<!-- Assessment Section -->
		<div class="rounded-lg shadow-md p-6 mb-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-400">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-teal-600 dark:text-teal-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h2 class="text-xl font-bold">Assessment</h2>
				</div>
			</div>
			
			<div class="text-gray-700 dark:text-gray-300 space-y-4">
				<p>
					The <strong>Listening Test</strong> is graded using a scoring system that varies to a small degree with each <strong>IELTS</strong> test. 
					The exact cut-off score for each band is calculated after analysis of worldwide results on any given test week.
				</p>
				
				<p>
					Broadly speaking, you need to score at least <strong>23/40</strong> for a <strong>Band 6</strong> and at least <strong>30/40</strong> for a <strong>Band 7</strong> award in the Listening Test.
				</p>
			</div>
		</div>

		<!-- Instructions Section -->
		<div class="rounded-lg shadow-md p-6 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					<h2 class="text-xl font-bold">Important Instructions</h2>
				</div>
			</div>
			
			<div class="text-gray-700 dark:text-gray-300 space-y-4">
				<p>
					It's <u>very important</u> that you accurately follow the instructions for each set of questions.
				</p>
				
				<p>
					If the format of your answer differs from instructed, even if the correct information is included, your answer will be marked WRONG.
				</p>
			</div>
		</div>

		<!-- Materials Section -->
		<div class="rounded-lg shadow-md p-6 mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400">
			<div class="flex justify-center mb-4">
				<div class="flex items-center gap-2 text-green-700 dark:text-green-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
					</svg>
					<h2 class="text-xl font-bold">Materials</h2>
				</div>
			</div>
			
			<p class="text-sm mb-4 text-gray-600 dark:text-gray-400 text-center"><strong>Click to listen and answer the questions below.</strong></p>
			
			<div class="flex justify-center mb-4">
				<audio controls class="w-full max-w-md">
					<source src="/audio/ielts-listening_test1.mp3" type="audio/mpeg">
					Your browser does not support the audio element.
				</audio>
			</div>
			
			<div class="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
				<p>Allow yourself <strong>33 minutes</strong> to complete this test.</p>
				<p>The test has <strong>4 sections</strong> and <strong>40 questions</strong>. Each question is worth <strong>1 mark</strong>.</p>
				<p>There's a sample <strong>IELTS Listening Test</strong> answer sheet at the end of the test questions.</p>
			</div>
		</div>

		<!-- Navigation -->
		<div class="rounded-lg shadow-md p-4 mb-6 bg-white dark:bg-gray-800">
			<div class="flex flex-wrap justify-center gap-2 mb-4">
				{#each Array(4) as _, i}
					<button 
						class="px-4 py-2 rounded-md font-medium transition-colors {currentSection === i + 1 ? 'bg-teal-600 text-white' : 'bg-teal-50 text-gray-700 hover:bg-teal-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
						on:click={() => goToSection(i + 1)}
					>
						Section {i + 1}
					</button>
				{/each}
			</div>
			<div class="flex justify-between">
				<button 
					class="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={prevSection}
					disabled={currentSection === 1}
				>
					Previous
				</button>
				<span class="px-4 py-2 text-gray-600 dark:text-gray-400">
					Section {currentSection} of {totalSections}
				</span>
				<button 
					class="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={nextSection}
					disabled={currentSection === totalSections}
				>
					Next
				</button>
			</div>
		</div>

		<!-- Test Content -->
		<div class="rounded-lg shadow-md p-8 bg-white dark:bg-gray-800">
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
										<td class="border border-gray-300 px-4 py-3"><strong>5</strong> <input type="text" name="q5" class="border-b border-gray-400 px-2 py-1 w-24 focus:border-blue-500 focus:outline-none"></td>
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
					<h2 class="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">SECTION 2: Questions 11–20</h2>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 11–13</p>
						<p class="mb-4">Complete the sentences below.<br>
						Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

						<ol start="11" class="space-y-4 ml-4">
							<li><strong>11.</strong> Riverside Village was a good place to start an industry because it had water, raw materials and fuels such as <input type="text" name="q11a" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> and <input type="text" name="q11b" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none">.</li>
							<li><strong>12.</strong> The metal industry was established at Riverside Village by <input type="text" name="q12" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> who lived in the area.</li>
							<li><strong>13.</strong> There were over <input type="text" name="q13" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> water-powered mills in the area in the eighteenth century.</li>
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
							<li><strong>14.</strong> <input type="text" name="q14" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> Road</li>
							<li><strong>15.</strong> The <input type="text" name="q15" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>16.</strong> The <input type="text" name="q16" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>17.</strong> The <input type="text" name="q17" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>18.</strong> The <input type="text" name="q18" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>19.</strong> The <input type="text" name="q19" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>20.</strong> The <input type="text" name="q20" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> for the workers</li>
						</ol>
					</div>
				</section>

			{:else if currentSection === 3}
				<!-- Section 3: Questions 21-30 -->
				<section class="section">
					<h2 class="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">SECTION 3: Questions 21–30</h2>

					<div class="mb-8 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
						<p class="font-semibold text-blue-600 mb-2 dark:text-blue-400">Example</p>
						<p class="mb-2 text-blue-600 dark:text-blue-400">Melanie could not borrow any books from the library because</p>
						<p class="ml-4 text-blue-600 dark:text-blue-400">A. the librarian was out</p>
						<p class="ml-4 text-blue-600 dark:text-blue-400">B. she didn't have time to look</p>
						<p class="ml-4 font-semibold text-blue-600 dark:text-blue-400">C. the books had already been borrowed</p>
					</div>

					<div class="mb-8">
						<p class="font-semibold mb-2">Questions 21 and 22</p>
						<p class="mb-4">Choose the correct letter, A, B or C.</p>

						<ol start="21" class="space-y-6 ml-4">
							<li>
								<p class="mb-3"><strong>21.</strong> Melanie says she has not started the assignment because</p>
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
								<p class="mb-3"><strong>22.</strong> The lecturer says that reasonable excuses for extensions are</p>
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

						<div class="mb-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
							<p class="font-semibold text-blue-600 mb-2 dark:text-blue-400">Example Answer</p>
							<p class="text-blue-600 dark:text-blue-400">Anderson and Hawker: <strong>A</strong></p>
						</div>

				
						<ul class="space-y-3 ml-4">
							<li><strong>23.</strong> Jackson: <input type="text" name="q23" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>24.</strong> Roberts: <input type="text" name="q24" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>25.</strong> Morris: <input type="text" name="q25" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>26.</strong> Cooper: <input type="text" name="q26" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>27.</strong> Forster: <input type="text" name="q27" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
						</ul>
					</div>

					<div>
						<p class="font-semibold mb-2">Questions 28–30</p>
						<p class="mb-4">Label the chart below.<br>
						Choose your answers from the box below the chart and write the letters A–H next to the numbers.</p>

						<div class="text-center my-6">
							<img src="/listening-images/ielts_section3_chart.png" alt="Population studies chart showing reasons for changing accommodation with bars labeled C, E, G and numbers 28, 29, 30" class="max-w-full h-auto border border-gray-300 mx-auto">
						</div>

									<ul class="space-y-3 ml-4">
							<li><strong>28:</strong> <input type="text" name="q28" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>29:</strong> <input type="text" name="q29" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>30:</strong> <input type="text" name="q30" class="border-b border-gray-400 px-2 py-1 w-16 focus:border-blue-500 focus:outline-none"></li>
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
							<li><strong>31.</strong> Ways of planning our <input type="text" name="q31" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> better</li>
							<li><strong>32.</strong> They can make cities more or less <input type="text" name="q32" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>33.</strong> They can make inland cities more <input type="text" name="q33" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>34.</strong> Trees make local areas more <input type="text" name="q34" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>35.</strong> ... less <input type="text" name="q35" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>36.</strong> Trees evaporate water through their <input type="text" name="q36" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"></li>
							<li><strong>37.</strong> Tall buildings cause more wind at <input type="text" name="q37" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> level</li>
							<li><strong>38.</strong> Trees <input type="text" name="q38" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> the wind force</li>
							<li><strong>39.</strong> <input type="text" name="q39" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> frequency noise passes through trees</li>
							<li><strong>40.</strong> Trees require a lot of sunlight, water and <input type="text" name="q40" class="border-b border-gray-400 px-2 py-1 w-32 focus:border-blue-500 focus:outline-none"> to grow</li>
						</ol>
					</div>
				</section>
			{/if}
		</div>

		<!-- Instructions -->
		<div class="mt-8 border-l-4 border-teal-400 bg-teal-50 p-4 rounded-r-lg dark:bg-teal-900/20 dark:border-teal-500">
			<p class="text-sm text-gray-900 dark:text-gray-100">
				<strong>Instructions:</strong> Follow the word limits exactly as specified for each question type. 
				Transfer your answers to an official IELTS answer sheet when taking the real test.
			</p>
		</div>
	</div>

<style>
	input[type="text"], input[type="radio"] {
		accent-color: rgb(13 148 136); /* teal-600 */
	}

	input[type="text"]:focus {
		border-color: rgb(13 148 136); /* teal-600 */
		outline: none;
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