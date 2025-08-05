<script lang="ts">
	import { onMount } from 'svelte';

	let currentSection = $state(1);
	let timeRemaining = $state(60 * 60); // 60 minutes in seconds
	let isTestStarted = $state(false);
	let isTestCompleted = $state(false);
	let showInstructions = $state(true);
	let answers: Record<number, string> = $state({});

	// Timer functionality
	let timer: number;
	let isActive = $state(false); // Added for timer control

	// Answer key for Reading Test 1
	const answerKey = {
		1: ['FALSE'],
		2: ['FALSE'],
		3: ['TRUE'],
		4: ['TRUE'],
		5: ['FALSE'],
		6: ['NOT GIVEN'],
		7: ['TRUE'],
		8: ['NOT GIVEN'],
		9: ['M'],
		10: ['E'],
		11: ['G'],
		12: ['P'],
		13: ['J'],
		14: ['B'],
		15: ['tastebuds'],
		16: ['baleen', 'the baleen whales'],
		17: ['forward, downward'],
		18: ['freshwater dolphin(s)', 'freshwater dolphins'],
		19: ['water', 'the water'],
		20: ['lower frequencies', 'the lower frequencies'],
		21: ['bowhead, humpback'],
		22: ['touch', 'sense of touch'],
		23: ['fresh water dolphin(s)', 'fresh water dolphins'],
		24: ['airborne flying fish'],
		25: ['clear water(s)', 'clear open water'],
		26: ['acoustic sense', 'the acoustic sense'],
		27: ['C'],
		28: ['C'],
		29: ['A'],
		30: ['E'],
		31: ['C'],
		32: ['A'],
		33: ['pairs'],
		34: ['shapes'],
		35: ['sighted'],
		36: ['sighted'],
		37: ['deep'],
		38: ['blind'],
		39: ['similar'],
		40: ['B']
	};

	// Results state
	let showAnswers = $state(false);
	let results = $state(null);
	let hasMarked = $state(false);
	let isMarking = $state(false);


	// Question data based on the HTML file
	const passage1Questions = {
		trueFalse: [
			{ num: 1, text: "The research findings suggest that children hold mistaken views about rainforests' locations." },
			{ num: 2, text: "The fact that children's ideas about rainforests do not match scientific findings is predictable." },
			{ num: 3, text: "The study involved children from different countries." },
			{ num: 4, text: "The children gave more information than was requested in the questionnaire." },
			{ num: 5, text: "The children were asked to rate different methods of collecting information." },
			{ num: 6, text: "The information collected from the first group was more detailed than that from the second." },
			{ num: 7, text: "Primary school children were more likely than secondary school children to hold inaccurate views about rainforests." },
			{ num: 8, text: "The study reported here follows on from a series of studies that has looked at children's understanding of rainforests." }
		],
		completion: [
			{ num: 9, text: "Zoos have changed a lot since they were first established." },
			{ num: 10, text: "It is easier for teachers to teach about animals through visits to zoos." },
			{ num: 11, text: "It is difficult to establish what children actually know about zoos." },
			{ num: 12, text: "Zoo staff are more involved in animal conservation now than they used to be." },
			{ num: 13, text: "Zoos can teach children about the conservation of animals." },
			{ num: 14, text: "It is easier for teachers to teach about animals through visits to zoos." }
		],
		multipleChoice: {
			num: 14,
			text: "Which of the following is the most suitable title for Reading Passage 1?",
			options: [
				"A. The development of a programme in environmental studies within a science curriculum",
				"B. Children's ideas about the rainforests and the implications for course design",
				"C. The extent to which children have been misled by the media concerning the rainforests",
				"D. How to collect, collate and describe the ideas of secondary school children",
				"E. The importance of the rainforests and the reasons for their destruction"
			]
		}
	};

	const passage2Questions = {
		tableCompletion: [
			{ num: 15, text: "Whales have a sensory organ equivalent to human __________" },
			{ num: 16, text: "The toothed whales are able to use __________ to find their food." },
			{ num: 17, text: "The vision of __________ whales is not stereoscopic." },
			{ num: 18, text: "Some species of whales have __________ directional hearing than dolphins." },
			{ num: 19, text: "Baleen whales can communicate over __________ distances." },
			{ num: 20, text: "Toothed whales have a broader __________ than other marine mammals." },
			{ num: 21, text: "The hearing range of baleen whales includes __________." }
		],
		shortAnswer: [
			{ num: 22, text: "Which of the senses is described as being involved in mating?" },
			{ num: 23, text: "Which species swims upside down while eating?" },
			{ num: 24, text: "What can bottlenose dolphins follow from under the water?" },
			{ num: 25, text: "Which type of habitat is related to good visual ability?" },
			{ num: 26, text: "Which of the senses is best developed in cetaceans?" }
		]
	};

	const passage3Questions = {
		matchingHeadings: [
			{ num: 27, text: "Paragraph A" },
			{ num: 28, text: "Paragraph B" },
			{ num: 29, text: "Paragraph C" },
			{ num: 30, text: "Paragraph D" },
			{ num: 31, text: "Paragraph E" },
			{ num: 32, text: "Paragraph F" }
		],
		completion: [
			{ num: 33, text: "Monocultures are described as __________ disasters." },
			{ num: 34, text: "The spread of pests and diseases is __________ in monocultures." },
			{ num: 35, text: "Genetic uniformity increases the __________ of crop failure." },
			{ num: 36, text: "Traditional farming maintains __________ diversity." },
			{ num: 37, text: "Crop rotation helps to maintain soil __________." },
			{ num: 38, text: "Industrial agriculture focuses on __________ yields." },
			{ num: 39, text: "Sustainable farming considers __________ impact." },
			{ num: 40, text: "Biodiversity is essential for __________ security." }
		]
	};

	const headingOptions = [
		"i. The problems with monoculture farming",
		"ii. Traditional farming methods",
		"iii. The benefits of crop rotation",
		"iv. Environmental concerns in agriculture",
		"v. The future of sustainable farming",
		"vi. Economic factors in food production",
		"vii. The role of technology in farming",
		"viii. Government policies on agriculture",
		"ix. International trade in agricultural products"
	];

	function startTest() {
		isTestStarted = true;
		showInstructions = false;
		startTimer();
	}

	// Timer functions
	function startTimer() {
		isActive = true;
	}

	function pauseTimer() {
		isActive = false;
	}

	function resetTimer() {
		isActive = false;
		timeRemaining = 60 * 60; // Reset to 60 minutes
		currentTime = 0;
		answers = {}; // Clear answers
		isTestCompleted = false; // Reset completion status
		showAnswers = false; // Hide answers
		hasMarked = false; // Reset marked status
	}

	// Marking functions
	async function markTest() {
		isMarking = true;
		
		// Show loading for 3 seconds
		await new Promise(resolve => setTimeout(resolve, 3000));
		
		let correct = 0;
		let questionResults = {};

		for (let i = 1; i <= 40; i++) {
			const userAnswer = answers[i]?.toString().trim().toLowerCase() || '';
			const correctAnswers = answerKey[i] || [];

			let isCorrect = false;
			for (const correctAnswer of correctAnswers) {
				if (userAnswer === correctAnswer.toLowerCase().trim()) {
					isCorrect = true;
					break;
				}
			}

			if (isCorrect) {
				correct++;
			}

			questionResults[i] = {
				userAnswer: answers[i] || '',
				correctAnswers: correctAnswers,
				isCorrect: isCorrect
			};
		}

		results = {
			score: correct,
			total: 40,
			percentage: Math.round((correct / 40) * 100),
			questions: questionResults
		};

		hasMarked = true;
		showAnswers = true;
		isMarking = false;
	}

	function viewAnswers() {
		if (!hasMarked) {
			markTest();
		}
		showAnswers = true;
	}

	function hideAnswers() {
		showAnswers = false;
	}

	function completeTest() {
		isTestCompleted = true;
		clearInterval(timer);
		// Optionally call markTest() here if you want results immediately upon completion
		// markTest();
	}

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	function goToSection(section: number) {
		currentSection = section;
	}

	function updateAnswer(questionNumber: number, value: string) {
		answers[questionNumber] = value;
	}

	onMount(() => {
		// Update timer every second if the test is active
		timer = setInterval(() => {
			if (isActive && timeRemaining > 0) {
				timeRemaining--;
			} else if (timeRemaining <= 0) {
				completeTest();
				clearInterval(timer);
			}
		}, 1000);

		return () => {
			if (timer) clearInterval(timer);
		};
	});
</script>

<svelte:head>
	<title>IELTS Reading Practice Test - InsideIELTS</title>
	<meta name="description" content="Complete IELTS Reading practice test with authentic passages and detailed feedback." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
	{#if showInstructions}
		<!-- Instructions Screen -->
		<div class="container mx-auto px-6 py-8">
			<div class="max-w-4xl mx-auto">
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
					<h1 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
						IELTS Reading Test
					</h1>

					<div class="space-y-6 text-gray-700 dark:text-gray-300">
						<div class="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
							<h2 class="text-xl font-semibold text-teal-700 dark:text-teal-300 mb-4">Test Instructions</h2>
							<ul class="space-y-2">
								<li>• Time allowed: <strong>60 minutes</strong></li>
								<li>• Number of questions: <strong>40</strong></li>
								<li>• There are 3 reading passages with a variety of questions</li>
								<li>• Answer all questions - there is no penalty for incorrect answers</li>
								<li>• You can navigate between sections during the test</li>
								<li>• Your progress will be saved automatically</li>
							</ul>
						</div>

						<div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
							<h3 class="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">Reading Passages</h3>
							<div class="grid md:grid-cols-3 gap-4">
								<div class="text-center">
									<div class="font-semibold">Passage 1</div>
									<div class="text-sm">Questions 1-14</div>
									<div class="text-sm text-gray-600 dark:text-gray-400">20 minutes recommended</div>
								</div>
								<div class="text-center">
									<div class="font-semibold">Passage 2</div>
									<div class="text-sm">Questions 15-26</div>
									<div class="text-sm text-gray-600 dark:text-gray-400">20 minutes recommended</div>
								</div>
								<div class="text-center">
									<div class="font-semibold">Passage 3</div>
									<div class="text-sm">Questions 27-40</div>
									<div class="text-sm text-gray-600 dark:text-gray-400">20 minutes recommended</div>
								</div>
							</div>
						</div>
					</div>

					<div class="text-center mt-8">
						<button
							onclick={startTest}
							class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
						>
							Start Reading Test
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else if isTestCompleted}
		<!-- Results Screen -->
		<div class="container mx-auto px-6 py-8">
			<div class="max-w-4xl mx-auto">
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Test Completed!</h1>
					<p class="text-lg text-gray-700 dark:text-gray-300 mb-8">
						Thank you for completing the IELTS Reading practice test.
					</p>
					<div class="space-y-4">
						<p class="text-gray-600 dark:text-gray-400">
							Answers submitted: {Object.keys(answers).length} out of 40
						</p>
						<button
							onclick={() => window.location.reload()}
							class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg"
						>
							Retake Test
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Test Interface -->
		<div class="max-w-4xl mx-auto px-4">
			<!-- Timer and Navigation Header -->
			<div class="rounded-lg shadow-md p-4 mb-6 bg-white dark:bg-gray-800">
				<!-- Timer Display -->
				<div class="text-center mb-4">
					<div class="text-2xl font-bold text-teal-600 dark:text-teal-400">
						{formatTime(timeRemaining)}
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Time Remaining</div>
				</div>

				<!-- Timer Control Buttons -->
				<div class="flex justify-center gap-3 mb-4">
					{#if isActive}
						<button
							onclick={pauseTimer}
							class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg"
						>
							PAUSE TIMER
						</button>
					{:else}
						<button
							onclick={startTimer}
							class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
						>
							START
						</button>
					{/if}
				</div>

				<!-- Navigation Buttons -->
				<div class="flex flex-wrap justify-center gap-2">
					{#each [1, 2, 3] as section}
						<button
							onclick={() => goToSection(section)}
							class="px-4 py-2 rounded-md font-medium transition-colors {currentSection === section ? 'bg-teal-600 text-white' : 'bg-teal-50 text-gray-700 hover:bg-teal-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
						>
							Passage {section}
						</button>
					{/each}
				</div>
			</div>

			<!-- Main Content Area -->
			<div class="pb-8">
				{#if currentSection === 1}
					<!-- Reading Passage 1 -->
					<div class="max-w-4xl mx-auto">
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
							<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reading Passage 1</h2>
							<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
								<p class="mb-4 text-gray-700 dark:text-gray-300">
									You should spend about 20 minutes on Questions 1–14, which are based on Reading Passage 1 below.
								</p>
							</div>

							<div class="prose dark:prose-invert max-w-none mb-8">
								<h3 class="text-xl font-semibold mb-4">Children's Ideas About Rainforests</h3>

								<p>Adults and children are frequently confronted with statements about the alarming rate of loss of tropical rainforests. For example, one graphic illustration to which children might readily relate is the estimate that rainforests are being destroyed at a rate equivalent to one thousand football fields every forty minutes – about the duration of a normal classroom period. In the face of the frequent and often vivid media coverage, it is likely that children will have formed ideas about rainforests – what and where they are, why they are important, what endangers them – independent of any formal tuition. It is also possible that some of these ideas will be mistaken.</p>

								<p>Many studies have shown that children harbour misconceptions about 'pure', curriculum science. These misconceptions do not remain isolated but become incorporated into a multifaceted, but organised, conceptual framework, making it and the component ideas, some of which are erroneous, more robust but also accessible to modification. These ideas may be developed by children absorbing ideas through the popular media. Sometimes this information may be erroneous. It seems schools may not be providing an opportunity for children to re-express their ideas and so have them tested and refined by teachers and their peers.</p>

								<p>Despite the extensive coverage in the popular media of the destruction of rainforests, little formal information is available about children's ideas in this area. The aim of the research was to elicit children's scientific thinking about rainforests and to examine the ideas they have about them. A secondary aim was to investigate the possibility of promoting conceptual change.</p>

								<p>The study involved 96 children aged 9 to 16 from a middle-class suburban primary school. Children were grouped according to their age: 9-10 years (n=32), 11-12 years (n=32), and 13-16 years (n=32). All children were individually interviewed about their ideas about rainforests. The interviews were tape-recorded and transcribed.</p>
							</div>

							<div class="space-y-6">
								<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 1-8</h3>
								<p class="text-gray-700 dark:text-gray-300">Do the following statements agree with the information given in Reading Passage 1? Write <strong>TRUE</strong> if the statement agrees with the information, <strong>FALSE</strong> if the statement contradicts the information, or <strong>NOT GIVEN</strong> if there is no information on this.</p>

								{#each passage1Questions.trueFalse as question}
									<div class="question mb-4">
										<label class="mb-2 block font-medium text-gray-900 dark:text-white">
											{question.num}. {question.text}
										</label>
										<select
											bind:value={answers[question.num]}
											disabled={showAnswers}
											class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
										>
											<option value="">Select answer</option>
											<option value="TRUE">TRUE</option>
											<option value="FALSE">FALSE</option>
											<option value="NOT GIVEN">NOT GIVEN</option>
										</select>
										{#if showAnswers && results?.questions[question.num]}
											<div class="mt-2 text-sm">
												{#if results.questions[question.num].isCorrect}
													<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
												{:else}
													<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
													<span class="text-gray-600 dark:text-gray-300">
														Correct answer: {results.questions[question.num].correctAnswers.join(' or ')}
													</span>
												{/if}
											</div>
										{/if}
									</div>
								{/each}

								<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 9-14</h3>
								<p class="text-gray-700 dark:text-gray-300">Complete the sentences below. Choose <strong>NO MORE THAN THREE WORDS</strong> from the passage for each answer.</p>

								{#each passage1Questions.completion as question}
									<div class="question mb-4">
										<label class="mb-2 block font-medium text-gray-900 dark:text-white">
											{question.num}. {question.text}
										</label>
										<select
											bind:value={answers[question.num]}
											disabled={showAnswers}
											class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
										>
											<option value="">Select answer</option>
											{#each ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] as option}
												<option value={option}>{option}</option>
											{/each}
										</select>
										{#if showAnswers && results?.questions[question.num]}
											<div class="mt-2 text-sm">
												{#if results.questions[question.num].isCorrect}
													<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
												{:else}
													<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
													<span class="text-gray-600 dark:text-gray-300">
														Correct answer: {results.questions[question.num].correctAnswers.join(' or ')}
													</span>
												{/if}
											</div>
										{/if}
									</div>
								{/each}

								<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Question 14</h3>
								<p class="text-gray-700 dark:text-gray-300">Choose the correct letter, <strong>A-E</strong>.</p>

								<div class="question mb-4">
									<label class="mb-2 block font-medium text-gray-900 dark:text-white">
										{passage1Questions.multipleChoice.num}. {passage1Questions.multipleChoice.text}
									</label>
									<div class="space-y-2">
										{#each passage1Questions.multipleChoice.options as option}
											<label class="flex items-center">
												<input
													type="radio"
													name="q{passage1Questions.multipleChoice.num}"
													value={option.charAt(0)}
													onchange={(e) => updateAnswer(passage1Questions.multipleChoice.num, e.target.value)}
													disabled={showAnswers}
													class="mr-2 {showAnswers && results ? (results.questions[passage1Questions.multipleChoice.num]?.userAnswer === option.charAt(0) ? (results.questions[passage1Questions.multipleChoice.num]?.isCorrect ? 'accent-green-500' : 'accent-red-500') : '') : ''}"
												/>
												<span class="text-gray-700 dark:text-gray-300">{option}</span>
											</label>
										{/each}
									</div>
									{#if showAnswers && results?.questions[passage1Questions.multipleChoice.num]}
										<div class="mt-2 text-sm">
											{#if results.questions[passage1Questions.multipleChoice.num].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[passage1Questions.multipleChoice.num].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{:else if currentSection === 2}
					<!-- Reading Passage 2 -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reading Passage 2</h2>
						<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
							<p class="mb-4 text-gray-700 dark:text-gray-300">
								You should spend about 20 minutes on Questions 15-26, which are based on Reading Passage 2 below.
							</p>
						</div>

						<div class="prose dark:prose-invert max-w-none mb-8">
							<h3 class="text-xl font-semibold mb-4">Whale Senses</h3>

							<p>Whales and dolphins, collectively known as cetaceans, have evolved remarkable sensory adaptations for life in the ocean. Their sensory capabilities differ significantly from those of terrestrial mammals, reflecting their aquatic environment.</p>

							<p>The sense of smell in toothed whales appears to be absent, with no evidence from brain structure to support its existence. In baleen whales, the situation is not certain, although related brain structures are present. Taste capabilities vary among species, with some types having poor development of the nerves linked to taste sensations.</p>

							<p>Touch is well-developed in all cetaceans, with the region around the blowhole being particularly sensitive. Vision varies considerably among species. Most baleen whales probably do not have stereoscopic vision, while dolphins and porpoises likely possess this ability. Bottlenose dolphins can even follow objects from underwater.</p>

							<p>Hearing is by far the best-developed sense in cetaceans. Toothed whales can hear a much wider range of the frequency spectrum than other marine mammals and have a more extensive vocal repertoire. They use echolocation for navigation and hunting. Baleen whales can communicate over vast distances using low-frequency calls.</p>
						</div>

						<div class="space-y-6">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 15-21</h3>
							<p class="text-gray-700 dark:text-gray-300">Complete the table below. Choose <strong>NO MORE THAN THREE WORDS</strong> from Reading Passage 2 for each answer.</p>

							{#each passage2Questions.tableCompletion as question}
								<div class="question mb-4">
									<label class="mb-2 block font-medium text-gray-900 dark:text-white">
										{question.num}. {question.text}
									</label>
									<input
										type="text"
										bind:value={answers[question.num]}
										disabled={showAnswers}
										placeholder="Your answer..."
										class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
									/>
									{#if showAnswers && results?.questions[question.num]}
										<div class="mt-2 text-sm">
											{#if results.questions[question.num].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[question.num].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								</div>
							{/each}

							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 22-26</h3>
							<p class="text-gray-700 dark:text-gray-300">Answer the questions below using <strong>NO MORE THAN THREE WORDS</strong> from the passage for each answer.</p>

							{#each passage2Questions.shortAnswer as question}
								<div class="question mb-4">
									<label class="mb-2 block font-medium text-gray-900 dark:text-white">
										{question.num}. {question.text}
									</label>
									<input
										type="text"
										bind:value={answers[question.num]}
										disabled={showAnswers}
										placeholder="Your answer..."
										class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
									/>
									{#if showAnswers && results?.questions[question.num]}
										<div class="mt-2 text-sm">
											{#if results.questions[question.num].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[question.num].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>

				{:else if currentSection === 3}
					<!-- Reading Passage 3 -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reading Passage 3</h2>
						<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
							<p class="mb-4 text-gray-700 dark:text-gray-300">
								You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.
							</p>
						</div>

						<div class="prose dark:prose-invert max-w-none mb-8">
							<h3 class="text-xl font-semibold mb-4">Sustainable Agriculture and Food Security</h3>

							<div class="mb-4"><strong>A</strong> Modern agriculture faces unprecedented challenges in feeding a growing global population while maintaining environmental sustainability. The industrial approach to farming, characterized by monocultures and heavy chemical inputs, has increased yields but created new problems.</div>

							<div class="mb-4"><strong>B</strong> Monoculture farming, where large areas are planted with a single crop variety, presents significant risks. These agricultural disasters make crops vulnerable to pests and diseases, which can spread rapidly through genetically uniform populations.</div>

							<div class="mb-4"><strong>C</strong> Traditional farming methods maintained crop diversity through practices like crop rotation and intercropping. These techniques not only preserved genetic diversity but also helped maintain soil fertility and reduce pest problems naturally.</div>

							<div class="mb-4"><strong>D</strong> The environmental impact of industrial agriculture extends beyond the farm. Excessive use of fertilizers and pesticides contaminates water sources and destroys beneficial insects and soil organisms essential for ecosystem health.</div>

							<div class="mb-4"><strong>E</strong> Sustainable farming practices offer solutions that balance productivity with environmental protection. These approaches focus on long-term soil health, biodiversity conservation, and reduced chemical inputs while maintaining economic viability.</div>

							<div class="mb-4"><strong>F</strong> Food security depends not only on quantity but also on the resilience of agricultural systems. Biodiversity is essential for developing crops that can withstand climate change, diseases, and changing environmental conditions.</div>
						</div>

						<div class="space-y-6">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 27-32</h3>
							<p class="text-gray-700 dark:text-gray-300">Match each paragraph with the correct heading. There are more headings than paragraphs.</p>

							<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
								<h4 class="font-semibold mb-2">List of Headings:</h4>
								<ol class="list-none space-y-1 text-sm">
									{#each headingOptions as heading}
										<li>{heading}</li>
									{/each}
								</ol>
							</div>

							{#each passage3Questions.matchingHeadings as question}
								<div class="question mb-4">
									<label class="mb-2 block font-medium text-gray-900 dark:text-white">
										{question.num}. {question.text}
									</label>
									<select
										id="q{question.num}"
										bind:value={answers[question.num]}
										disabled={showAnswers}
										class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
									>
										<option value="">Select a heading</option>
										{#each ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'] as heading}
											<option value={heading}>{heading}</option>
										{/each}
									</select>
									{#if showAnswers && results?.questions[question.num]}
										<div class="mt-2 text-sm">
											{#if results.questions[question.num].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[question.num].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								</div>
							{/each}

							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 33-40</h3>
							<p class="text-gray-700 dark:text-gray-300">Complete the sentences below. Choose <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>

							{#each passage3Questions.completion as question}
								<div class="question mb-4">
									<label class="mb-2 block font-medium text-gray-900 dark:text-white">
										{question.num}. {question.text}
									</label>
									<input
										id="q{question.num}"
										type="text"
										bind:value={answers[question.num]}
										disabled={showAnswers}
										placeholder="Your answer"
										class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
									/>
									{#if showAnswers && results?.questions[question.num]}
										<div class="mt-2 text-sm">
											{#if results.questions[question.num].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[question.num].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								</div>
							{/each}

							<!-- End of Test Section -->
							<div class="mt-8 border-l-4 border-teal-400 bg-teal-50 p-4 rounded-r-lg dark:bg-teal-900/20 dark:border-teal-500">
								<center>
									<p class="text-sm text-gray-900 dark:text-gray-100 mb-2">
										<strong>END OF TEST</strong>
									</p>
								</center>
								<p class="text-sm text-gray-900 dark:text-gray-100">
									Use any remaining time to check your answers and then click the button below to view your results.
								</p>
								<p class="text-sm text-gray-900 dark:text-gray-100 mt-2">
									<a
										href="/reading-images/ielts-reading-answer-sheet.jpg"
										download="IELTS-Reading-Answer-Sheet.jpg"
										class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline mt-2"
									>
										Download official answer sheet
									</a>
								</p>
							</div>

							<!-- Action Button - only show if not marked yet -->
							{#if !hasMarked}
								<div class="mt-6 flex flex-col gap-4 items-center">
									<button
										type="button"
										onclick={() => { if (!hasMarked && !isMarking) markTest(); }}
										disabled={isMarking}
										class="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{#if isMarking}
											<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Processing Test...
										{:else}
											✅ Mark my Test
										{/if}
									</button>
								</div>
							{/if}

							<!-- Results Display -->
							{#if results && showAnswers}
								<div class="mt-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700 max-w-md mx-auto">
									<h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white text-center">Test Results</h3>
									<div class="mb-4 text-center">
										<div class="text-3xl font-bold text-teal-600 dark:text-teal-400">
											{results.score}/40
										</div>
										<div class="text-sm text-gray-600 dark:text-gray-300">
											{results.percentage}% Correct
										</div>
									</div>

									<!-- Band Score Estimate -->
									<div class="text-center">
										<div class="text-lg font-semibold text-gray-900 dark:text-white">
											Estimated Band Score:
											<span class="text-teal-600 dark:text-teal-400">
												{#if results.score >= 37}7.5-9.0
												{:else if results.score >= 33}7.0
												{:else if results.score >= 30}6.5
												{:else if results.score >= 27}6.0
												{:else if results.score >= 23}5.5
												{:else if results.score >= 19}5.0
												{:else if results.score >= 15}4.5
												{:else if results.score >= 11}4.0
												{:else if results.score >= 8}3.5
												{:else if results.score >= 5}3.0
												{:else}2.5-3.5{/if}
											</span>
										</div>
									</div>

									<!-- Action buttons matching listening test format -->
									<div class="mt-6 flex flex-col sm:flex-row justify-between gap-3">
										<button
											onclick={() => window.open('#', '_blank')}
											class="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
										>
											Query my Results
										</button>
										<button
											onclick={() => window.location.reload()}
											class="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
										>
											Close
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>

				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Custom styles for the reading test interface */
	.prose {
		line-height: 1.7;
	}

	.prose p, .prose div {
		margin-bottom: 1rem;
	}

	/* Ensure proper spacing for questions */
	input[type="text"], select {
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		color: black !important;
	}

	/* Dark mode input text color */
	:global(.dark) input[type="text"], :global(.dark) select {
		color: white !important;
	}

	/* Disabled input text color (after marking) should be black */
	input[type="text"]:disabled, select:disabled {
		color: black !important;
	}

	input[type="text"]:focus, select:focus {
		box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.1);
	}
	/* Style for radio buttons */
	input[type="radio"] {
		transform: scale(1.1);
		margin-right: 0.5rem;
	}
	/* Style for accent color on checked radio buttons */
	input[type="radio"]:checked {
		accent-color: #0d9488; /* teal-600 */
	}
	/* Adjustments for feedback styling */
	.border-green-500 { border-color: #10b981; } /* green-500 */
	.bg-green-50 { background-color: #f0fdf4; } /* green-50 */
	.dark .bg-green-900\/20 { background-color: rgba(16, 185, 129, 0.2); } /* dark green-900/20 */

	.border-red-500 { border-color: #ef4444; } /* red-500 */
	.bg-red-50 { background-color: #fef2f2; } /* red-50 */
	.dark .bg-red-900\/20 { background-color: rgba(239, 68, 68, 0.2); } /* dark red-900/20 */

	.text-green-600 { color: #047857; } /* green-600 */
	.dark .text-green-400 { color: #84cc13; } /* dark green-400 */
	.text-red-600 { color: #b91c1c; } /* red-600 */
	.dark .text-gray-400 { color: #d1d5db; } /* dark gray-300 for better visibility */
	.text-gray-600 { color: #4b5563; } /* gray-600 */
	.dark .text-gray-300 { color: #d1d5db; } /* dark gray-300 for better visibility */

	/* Tailwind Button Classes (for clarity, assuming these are available or defined elsewhere) */
	.bg-primary { background-color: #0d9488; } /* teal-600 */
	.hover\:bg-primary-700:hover { background-color: #0f766e; } /* teal-700 */
	.bg-light { background-color: #f3f4f6; } /* gray-100 */
	.hover\:bg-gray-200:hover { background-color: #e5e7eb; } /* gray-200 */
	.text-gray-800 { color: #1f2937; } /* gray-800 */
	.bg-alternative { background-color: #3b82f6; } /* blue-500 */
	.hover\:bg-blue-700:hover { background-color: #1d4ed8; } /* blue-700 */
</style>