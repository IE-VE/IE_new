
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
				Master the IELTS Listening test with our comprehensive practice materials and accurate test format.
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
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{type.description}</p>
							<div class="mt-4">
								<img 
									src={type.image} 
									alt="{type.title} example"
									class="w-full h-auto max-h-48 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
									loading="lazy"
								/>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Assessment Guide -->
		<div class="mt-12">
			<Card variant="teal">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Scoring Guide
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
							<li>• Recognising speaker attitudes and opinions</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>

		<!-- Practice Materials -->
		<div class="mt-12">
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
				🎧 Interactive Practice Test
			</h2>
			
			<Card variant="default">
				<div class="space-y-6">
					<!-- Instructions -->
					<div class="text-center bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Test Instructions</h3>
						<p class="text-gray-700 dark:text-gray-300 mb-4">
							Allow yourself <strong>33 minutes</strong> to complete this test. The test has <strong>4 sections</strong> and <strong>40 questions</strong>. Each question is worth <strong>1 mark</strong>.
						</p>
						
						<!-- Audio Player -->
						<div class="mb-4">
							<audio 
								bind:this={audioElement}
								src="/audio/ielts-listening_test1.mp3"
								class="hidden"
							></audio>
							
							<div class="bg-white dark:bg-gray-800 rounded-lg p-4 inline-block">
								<div class="flex items-center space-x-4">
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
									
									<div class="text-sm text-gray-600 dark:text-gray-400">
										{formatTime(currentTime)} / {formatTime(duration)}
									</div>
								</div>
								
								<div class="w-64 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-3">
									<div 
										class="bg-teal-600 h-2 rounded-full transition-all"
										style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
									></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Interactive Test Content -->
					<div class="bg-white dark:bg-gray-800 rounded-lg p-6">
						<div class="listening-test-content">
							<!-- Section 1 -->
							<section class="mb-12">
								<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-teal-600">SECTION 1: Questions 1–10</h2>

								<div class="mb-6">
									<p class="font-medium mb-2"><strong>Questions 1–4</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Complete the notes below.<br>Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

									<ul class="space-y-2 ml-4">
										<li>Visit places which have:
											<ul class="ml-6 mt-2 space-y-1">
												<li>• historical interest</li>
												<li>• good <input type="text" name="q1" placeholder="Answer 1" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-48 dark:bg-gray-700 dark:text-white"></li>
												<li>• <input type="text" name="q2" placeholder="Answer 2" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-48 dark:bg-gray-700 dark:text-white"></li>
											</ul>
										</li>
										<li class="mt-2">Cost: between £5.00 and £15.00 per person</li>
										<li>Note: special trips organised for groups of <input type="text" name="q3" placeholder="Answer 3" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> people</li>
										<li>Time: departure – 8.30 a.m., return – 6.00 p.m.</li>
										<li>To reserve a seat: sign name on the <input type="text" name="q4" placeholder="Answer 4" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"> 3 days in advance</li>
									</ul>
								</div>

								<hr class="my-6 border-gray-300 dark:border-gray-600">

								<div>
									<p class="font-medium mb-2"><strong>Questions 5–10</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Complete the table below.<br>Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

									<div class="overflow-x-auto">
										<table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
											<thead>
												<tr class="bg-gray-50 dark:bg-gray-700">
													<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Place</th>
													<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Date</th>
													<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Number of Seats</th>
													<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Optional Extra</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">St Ives</td>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">5 <input type="text" name="q5" placeholder="Answer 5" class="border border-gray-300 dark:border-gray-600 rounded px-1 py-1 w-20 dark:bg-gray-700 dark:text-white"></td>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">16</td>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Hepworth Museum</td>
												</tr>
												<tr>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">London</td>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">16th February</td>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">45</td>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"><input type="text" name="q6" placeholder="Answer 6" class="border border-gray-300 dark:border-gray-600 rounded px-1 py-1 w-24 dark:bg-gray-700 dark:text-white"></td>
												</tr>
												<tr>
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"><input type="text" name="q7" placeholder="Answer 7" class="border border-gray-300 dark:border-gray-600 rounded px-1 py-1 w-24 dark:bg-gray-700 dark:text-white"></td>
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
													<td class="border border-gray-300 dark:border-gray-600 px-4 py-2"><input type="text" name="q8" placeholder="Answer 8" class="border border-gray-300 dark:border-gray-600 rounded px-1 py-1 w-24 dark:bg-gray-700 dark:text-white"></td>
												</tr>
											</tbody>
										</table>
									</div>

									<p class="mt-4">For further information:<br>
									Read the <input type="text" name="q9" placeholder="Answer 9" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"> or see Social Assistant: Jane <input type="text" name="q10" placeholder="Answer 10" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"></p>
								</div>
							</section>

							<!-- Section 2 -->
							<section class="mb-12">
								<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-teal-600">SECTION 2: Questions 11–20</h2>

								<div class="mb-6">
									<p class="font-medium mb-2"><strong>Questions 11–13</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Complete the sentences below.<br>Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</p>

									<ol start="11" class="space-y-3">
										<li>Riverside Village was a good place to start an industry because it had water, raw materials and fuels such as <input type="text" name="q11a" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> and <input type="text" name="q11b" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white">.</li>
										<li>The metal industry was established at Riverside Village by <input type="text" name="q12" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"> who lived in the area.</li>
										<li>There were over <input type="text" name="q13" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> water-powered mills in the area in the eighteenth century.</li>
									</ol>
								</div>

								<div>
									<p class="font-medium mb-2"><strong>Questions 14–20</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Label the plan below.<br>Write NO MORE THAN TWO WORDS for each answer.</p>

									<ol start="14" class="space-y-2">
										<li><input type="text" name="q14" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"> Road</li>
										<li>The <input type="text" name="q15" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"></li>
										<li>The <input type="text" name="q16" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"></li>
										<li>The <input type="text" name="q17" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"></li>
										<li>The <input type="text" name="q18" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"></li>
										<li>The <input type="text" name="q19" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"></li>
										<li>The <input type="text" name="q20" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-32 dark:bg-gray-700 dark:text-white"> for the workers</li>
									</ol>
								</div>
							</section>

							<!-- Section 3 -->
							<section class="mb-12">
								<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-teal-600">SECTION 3: Questions 21–30</h2>

								<div class="mb-6">
									<p class="font-medium mb-2"><strong>Questions 21–22</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose the correct letter, A, B or C.</p>
									<ol start="21" class="space-y-4">
										<li class="space-y-2">
											<div>21. Why hasn't Sarah done the homework for today?</div>
											<div class="ml-4 space-y-1">
												<label class="flex items-center space-x-2">
													<input type="radio" name="q21" value="A" class="text-teal-600">
													<span>A. she was doing work for another course.</span>
												</label>
												<label class="flex items-center space-x-2">
													<input type="radio" name="q21" value="B" class="text-teal-600">
													<span>B. it was a really big assignment.</span>
												</label>
												<label class="flex items-center space-x-2">
													<input type="radio" name="q21" value="C" class="text-teal-600">
													<span>C. she hasn't spent time in the library.</span>
												</label>
											</div>
										</li>
										<li class="space-y-2">
											<div>22. What does Sarah say about extensions?</div>
											<div class="ml-4 space-y-1">
												<label class="flex items-center space-x-2">
													<input type="radio" name="q22" value="A" class="text-teal-600">
													<span>A. planning problems.</span>
												</label>
												<label class="flex items-center space-x-2">
													<input type="radio" name="q22" value="B" class="text-teal-600">
													<span>B. problems with assignment deadlines.</span>
												</label>
												<label class="flex items-center space-x-2">
													<input type="radio" name="q22" value="C" class="text-teal-600">
													<span>C. personal illness or accident.</span>
												</label>
											</div>
										</li>
									</ol>
								</div>

								<div class="mb-6">
									<p class="font-medium mb-2"><strong>Questions 23–27</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Write the correct letter A–G next to the name.</p>
									<ul class="space-y-2">
										<li>Jackson: <input type="text" name="q23" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
										<li>Roberts: <input type="text" name="q24" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
										<li>Morris: <input type="text" name="q25" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
										<li>Cooper: <input type="text" name="q26" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
										<li>Forster: <input type="text" name="q27" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
									</ul>
								</div>

								<div>
									<p class="font-medium mb-2"><strong>Questions 28–30</strong></p>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Label the chart. Write the correct letter A–H next to the number.</p>
									<ul class="space-y-2">
										<li>28: <input type="text" name="q28" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
										<li>29: <input type="text" name="q29" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
										<li>30: <input type="text" name="q30" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-white"></li>
									</ul>
								</div>
							</section>

							<!-- Section 4 -->
							<section class="mb-12">
								<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-teal-600">SECTION 4: Questions 31–40</h2>

								<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Complete the notes below.<br>Write NO MORE THAN TWO WORDS for each answer.</p>

								<ol start="31" class="space-y-2">
									<li>Ways of planning our <input type="text" name="q31" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> better</li>
									<li>They can make cities more or less <input type="text" name="q32" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"></li>
									<li>They can make inland cities more <input type="text" name="q33" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"></li>
									<li>Trees make local areas more <input type="text" name="q34" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"></li>
									<li>... less <input type="text" name="q35" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"></li>
									<li>Trees evaporate water through their <input type="text" name="q36" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"></li>
									<li>Tall buildings cause more wind at <input type="text" name="q37" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> level</li>
									<li>Trees <input type="text" name="q38" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> the wind force</li>
									<li><input type="text" name="q39" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> frequency noise passes through trees</li>
									<li>Trees require a lot of sunlight, water and <input type="text" name="q40" class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-24 dark:bg-gray-700 dark:text-white"> to grow</li>
								</ol>
							</section>
						</div>

						<!-- Test Actions -->
						<div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
							<div class="grid md:grid-cols-2 gap-6">
								<div class="text-center">
									<h4 class="font-medium text-gray-900 dark:text-white mb-3">Practice Answer Sheet</h4>
									<a 
										href="/listening-images/ielts-listening-answer-sheet.jpg"
										download="ielts-listening-answer-sheet.jpg"
										class="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
									>
										Download Answer Sheet
									</a>
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
								<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
									<h4 class="font-medium text-amber-900 dark:text-amber-100 mb-4">Answer Key</h4>
									<div class="text-center mb-4">
										<img 
											src="/listening-images/ielts-listening-test-1-answers.png" 
											alt="IELTS Listening Test 1 Answer Key"
											class="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
											loading="lazy"
										/>
									</div>
									<p class="text-sm text-amber-800 dark:text-amber-200">
										<strong>Transfer Time:</strong> Now take 10 minutes to transfer your answers to the answer sheet, double-check for spelling errors, and make absolutely sure you've followed all instructions correctly.
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</Card>
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
