
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

	const testOverview = [
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

	const testSections = [
		{
			title: 'Section 1: Questions 1-10',
			description: 'Conversation between two people in everyday social context',
			questions: [
				{
					id: 1,
					type: 'form-completion',
					questionRange: '1-5',
					instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.'
				},
				{
					id: 6,
					type: 'multiple-choice',
					questionRange: '6-7',
					instruction: 'Choose the correct letter, A, B or C.'
				}
			]
		},
		{
			title: 'Section 2: Questions 11-20',
			description: 'Monologue about local facilities',
			questions: [
				{
					id: 11,
					type: 'map-labelling',
					questionRange: '11-15',
					instruction: 'Label the map below. Write the correct letter, A-H, next to questions 11-15.'
				}
			]
		},
		{
			title: 'Section 3: Questions 21-30',
			description: 'Conversation between students about assignment',
			questions: [
				{
					id: 21,
					type: 'sentence-completion',
					questionRange: '21-25',
					instruction: 'Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.'
				}
			]
		},
		{
			title: 'Section 4: Questions 31-40',
			description: 'Lecture about renewable energy',
			questions: [
				{
					id: 31,
					type: 'note-completion',
					questionRange: '31-40',
					instruction: 'Complete the notes below. Write NO MORE THAN THREE WORDS for each answer.'
				}
			]
		}
	];

	let currentSectionIndex = $state(0);
	let currentQuestionIndex = $state(0);

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

	function nextSection() {
		if (currentSectionIndex < testSections.length - 1) {
			currentSectionIndex++;
			currentQuestionIndex = 0;
		}
	}

	function prevSection() {
		if (currentSectionIndex > 0) {
			currentSectionIndex--;
			currentQuestionIndex = 0;
		}
	}

	function nextQuestion() {
		const currentSection = testSections[currentSectionIndex];
		if (currentQuestionIndex < currentSection.questions.length - 1) {
			currentQuestionIndex++;
		} else if (currentSectionIndex < testSections.length - 1) {
			nextSection();
		}
	}

	function prevQuestion() {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		} else if (currentSectionIndex > 0) {
			currentSectionIndex--;
			currentQuestionIndex = testSections[currentSectionIndex].questions.length - 1;
		}
	}

	function submitTest() {
		alert('Test submitted! In a real test, your answers would be processed here.');
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
				{#each testOverview as section}
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

					<!-- Interactive HTML Test -->
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-6 text-center">Interactive Listening Test</h3>
						
						<!-- Section Navigation -->
						<div class="mb-6">
							<div class="flex justify-center mb-4">
								<div class="flex space-x-2">
									{#each testSections as section, index}
										<button
											onclick={() => { currentSectionIndex = index; currentQuestionIndex = 0; }}
											class="px-3 py-2 rounded-lg text-sm transition-colors {currentSectionIndex === index 
												? 'bg-teal-600 text-white' 
												: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}"
										>
											Sec {index + 1}
										</button>
									{/each}
								</div>
							</div>
							
							<div class="text-center">
								<div class="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
									<h4 class="font-semibold text-teal-900 dark:text-teal-100 mb-2">
										{testSections[currentSectionIndex].title}
									</h4>
									<p class="text-sm text-teal-700 dark:text-teal-300">
										{testSections[currentSectionIndex].description}
									</p>
								</div>
							</div>
						</div>

						<!-- Current Question -->
						<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner min-h-96">
							{@const currentSection = testSections[currentSectionIndex]}
							{@const currentQuestion = currentSection.questions[currentQuestionIndex]}
							
							<div class="mb-4">
								<h4 class="font-semibold text-gray-900 dark:text-white mb-2">
									Questions {currentQuestion.questionRange}
								</h4>
								<p class="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
									{currentQuestion.instruction}
								</p>
							</div>
							
							<!-- Question Content Based on Type -->
							{#if currentQuestion.type === 'form-completion'}
								<div class="bg-white dark:bg-gray-800 p-6 rounded-lg border">
									<h4 class="font-semibold mb-4">STUDENT ACCOMMODATION FORM</h4>
									<div class="space-y-3">
										<div class="flex items-center space-x-2">
											<span class="w-32">Name:</span>
											<span class="font-medium">Sarah</span>
											<input type="text" class="border rounded px-2 py-1 w-32" placeholder="1. ________" />
										</div>
										<div class="flex items-center space-x-2">
											<span class="w-32">Phone number:</span>
											<input type="text" class="border rounded px-2 py-1 w-32" placeholder="2. ________" />
										</div>
										<div class="flex items-center space-x-2">
											<span class="w-32">Nationality:</span>
											<input type="text" class="border rounded px-2 py-1 w-32" placeholder="3. ________" />
										</div>
										<div class="flex items-center space-x-2">
											<span class="w-32">Course:</span>
											<input type="text" class="border rounded px-2 py-1 w-32" placeholder="4. ________" />
										</div>
										<div class="flex items-center space-x-2">
											<span class="w-32">Accommodation type:</span>
											<input type="text" class="border rounded px-2 py-1 w-32" placeholder="5. ________" />
										</div>
									</div>
								</div>
							{:else if currentQuestion.type === 'multiple-choice'}
								<div class="space-y-4">
									<div class="bg-white dark:bg-gray-800 p-4 rounded-lg border">
										<p class="font-medium mb-3">6. The weekly rent is</p>
										<div class="space-y-2">
											<label class="flex items-center space-x-2">
												<input type="radio" name="q6" value="A" />
												<span>A. £85</span>
											</label>
											<label class="flex items-center space-x-2">
												<input type="radio" name="q6" value="B" />
												<span>B. £95</span>
											</label>
											<label class="flex items-center space-x-2">
												<input type="radio" name="q6" value="C" />
												<span>C. £105</span>
											</label>
										</div>
									</div>
									<div class="bg-white dark:bg-gray-800 p-4 rounded-lg border">
										<p class="font-medium mb-3">7. The deposit required is</p>
										<div class="space-y-2">
											<label class="flex items-center space-x-2">
												<input type="radio" name="q7" value="A" />
												<span>A. one week's rent</span>
											</label>
											<label class="flex items-center space-x-2">
												<input type="radio" name="q7" value="B" />
												<span>B. two weeks' rent</span>
											</label>
											<label class="flex items-center space-x-2">
												<input type="radio" name="q7" value="C" />
												<span>C. three weeks' rent</span>
											</label>
										</div>
									</div>
								</div>
							{:else if currentQuestion.type === 'map-labelling'}
								<div class="bg-white dark:bg-gray-800 p-6 rounded-lg border">
									<div class="relative">
										<svg viewBox="0 0 400 300" class="w-full h-64 border rounded">
											<rect x="50" y="50" width="60" height="40" fill="#e5e7eb" stroke="#374151" />
											<text x="80" y="75" text-anchor="middle" class="text-xs">Library</text>
											<text x="80" y="45" text-anchor="middle" class="text-xs font-bold">A</text>
											
											<rect x="150" y="50" width="60" height="40" fill="#e5e7eb" stroke="#374151" />
											<text x="180" y="75" text-anchor="middle" class="text-xs">Cafeteria</text>
											<text x="180" y="45" text-anchor="middle" class="text-xs font-bold">B</text>
											
											<rect x="250" y="50" width="60" height="40" fill="#e5e7eb" stroke="#374151" />
											<text x="280" y="75" text-anchor="middle" class="text-xs">Gym</text>
											<text x="280" y="45" text-anchor="middle" class="text-xs font-bold">C</text>
											
											<rect x="50" y="150" width="60" height="40" fill="#e5e7eb" stroke="#374151" />
											<text x="80" y="175" text-anchor="middle" class="text-xs">Bookshop</text>
											<text x="80" y="145" text-anchor="middle" class="text-xs font-bold">D</text>
											
											<rect x="150" y="150" width="60" height="40" fill="#e5e7eb" stroke="#374151" />
											<text x="180" y="175" text-anchor="middle" class="text-xs">Pool</text>
											<text x="180" y="145" text-anchor="middle" class="text-xs font-bold">E</text>
											
											<rect x="250" y="150" width="60" height="40" fill="#e5e7eb" stroke="#374151" />
											<text x="280" y="175" text-anchor="middle" class="text-xs">Theatre</text>
											<text x="280" y="145" text-anchor="middle" class="text-xs font-bold">F</text>
										</svg>
									</div>
									<div class="mt-4 space-y-2">
										<div class="flex items-center space-x-4">
											<span>11. Student Services:</span>
											<input type="text" class="border rounded px-2 py-1 w-16" placeholder="___" maxlength="1" />
										</div>
										<div class="flex items-center space-x-4">
											<span>12. Computer Lab:</span>
											<input type="text" class="border rounded px-2 py-1 w-16" placeholder="___" maxlength="1" />
										</div>
										<div class="flex items-center space-x-4">
											<span>13. Medical Centre:</span>
											<input type="text" class="border rounded px-2 py-1 w-16" placeholder="___" maxlength="1" />
										</div>
										<div class="flex items-center space-x-4">
											<span>14. Art Gallery:</span>
											<input type="text" class="border rounded px-2 py-1 w-16" placeholder="___" maxlength="1" />
										</div>
										<div class="flex items-center space-x-4">
											<span>15. Language Centre:</span>
											<input type="text" class="border rounded px-2 py-1 w-16" placeholder="___" maxlength="1" />
										</div>
									</div>
								</div>
							{:else if currentQuestion.type === 'sentence-completion'}
								<div class="bg-white dark:bg-gray-800 p-6 rounded-lg border space-y-4">
									<div>
										<p>21. The assignment is about the impact of __________ on local communities.</p>
										<input type="text" class="border rounded px-2 py-1 mt-2 w-48" placeholder="Your answer" />
									</div>
									<div>
										<p>22. They need to interview at least __________ people.</p>
										<input type="text" class="border rounded px-2 py-1 mt-2 w-48" placeholder="Your answer" />
									</div>
									<div>
										<p>23. The final report should be __________ words long.</p>
										<input type="text" class="border rounded px-2 py-1 mt-2 w-48" placeholder="Your answer" />
									</div>
									<div>
										<p>24. The deadline for submission is __________ March.</p>
										<input type="text" class="border rounded px-2 py-1 mt-2 w-48" placeholder="Your answer" />
									</div>
									<div>
										<p>25. They will meet next __________ to discuss their findings.</p>
										<input type="text" class="border rounded px-2 py-1 mt-2 w-48" placeholder="Your answer" />
									</div>
								</div>
							{:else if currentQuestion.type === 'note-completion'}
								<div class="bg-white dark:bg-gray-800 p-6 rounded-lg border">
									<h4 class="font-semibold mb-4">RENEWABLE ENERGY SOURCES</h4>
									<div class="space-y-4">
										<div>
											<p class="font-medium">Solar Energy</p>
											<ul class="ml-4 space-y-2 mt-2">
												<li>• Uses 31. __________ to generate electricity</li>
												<li>• Most effective in 32. __________ climates</li>
												<li>• Installation costs are 33. __________</li>
											</ul>
										</div>
										<div>
											<p class="font-medium">Wind Energy</p>
											<ul class="ml-4 space-y-2 mt-2">
												<li>• Requires consistent 34. __________ patterns</li>
												<li>• Turbines can be installed 35. __________ or on land</li>
												<li>• Noise pollution is a 36. __________</li>
											</ul>
										</div>
										<div>
											<p class="font-medium">Hydroelectric Power</p>
											<ul class="ml-4 space-y-2 mt-2">
												<li>• Uses flowing 37. __________ to generate power</li>
												<li>• Requires construction of 38. __________</li>
												<li>• Can affect local 39. __________</li>
												<li>• Provides approximately 40. __________ of global electricity</li>
											</ul>
										</div>
									</div>
									<div class="grid grid-cols-2 gap-4 mt-6">
										{#each [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] as qNum}
											<div class="flex items-center space-x-2">
												<span class="w-8">{qNum}.</span>
												<input type="text" class="border rounded px-2 py-1 flex-1" placeholder="Your answer" />
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
						
						<!-- Navigation Controls -->
						<div class="flex justify-between items-center mt-6">
							<button
								onclick={prevQuestion}
								disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
								class="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg transition-colors"
							>
								← Previous
							</button>
							
							<div class="text-center">
								<span class="text-sm text-gray-600 dark:text-gray-400">
									Section {currentSectionIndex + 1} of {testSections.length} | 
									Question {currentQuestionIndex + 1} of {testSections[currentSectionIndex].questions.length}
								</span>
							</div>
							
							{#if currentSectionIndex === testSections.length - 1 && currentQuestionIndex === testSections[currentSectionIndex].questions.length - 1}
								<button
									onclick={submitTest}
									class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
								>
									Submit Test
								</button>
							{:else}
								<button
									onclick={nextQuestion}
									class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
								>
									Next →
								</button>
							{/if}
						</div>

						<!-- Progress Indicator -->
						<div class="mt-4">
							{@const totalQuestions = testSections.reduce((sum, section) => sum + section.questions.length, 0)}
							{@const completedQuestions = testSections.slice(0, currentSectionIndex).reduce((sum, section) => sum + section.questions.length, 0) + currentQuestionIndex}
							<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div 
									class="bg-teal-600 h-2 rounded-full transition-all duration-300"
									style="width: {(completedQuestions / totalQuestions) * 100}%"
								></div>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
								Progress: {Math.round((completedQuestions / totalQuestions) * 100)}%
							</p>
						</div>
					</div>

					<!-- Sample Answer Sheet and Actions -->
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
						<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
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
								Review your answers carefully and identify areas for improvement. Each section tests different listening skills and question types.
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
