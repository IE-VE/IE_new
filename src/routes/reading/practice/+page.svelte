<script lang="ts">
	import { onMount } from 'svelte';

	let currentSection = $state(1);
	let timeRemaining = $state(60 * 60); // 60 minutes in seconds
	let isTestStarted = $state(false);
	let isTestCompleted = $state(false);
	let showInstructions = $state(true);
	let answers: Record<number | string, string> = $state({}); // Allow string keys for '21b'

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
		13: ['B'],
		14: ['C'],
		15: ['tastebuds'],
		16: ['baleen', 'the baleen whales'],
		17: ['forward, downward'],
		18: ['freshwater dolphin(s)', 'freshwater dolphins'],
		19: ['water', 'the water'],
		20: ['lower frequencies', 'the lower frequencies'],
		21: ['bowhead', 'humpback'], // Updated for separate inputs
		'21b': ['bowhead', 'humpback'], // Added separate key for the second input
		22: ['touch', 'sense of touch'],
		23: ['fresh water dolphin(s)', 'fresh water dolphins'],
		24: ['airborne flying fish'],
		25: ['clear water(s)', 'clear open water'],
		26: ['acoustic sense', 'the acoustic sense'],
		27: ['C'],
		28: ['C'],
		29: ['A'],
		30: ['C'],
		31: ['A'],
		32: ['pairs'],
		33: ['shapes'],
		34: ['sighted'],
		35: ['sighted'],
		36: ['blind'],
		37: ['similar'],
		38: ['sighted'],
		39: ['similar'],
		40: ['B']
	};

	// Results state
	let showAnswers = $state(false);
	let results = $state(null);
	let hasMarked = $state(false);
	let isMarking = $state(false);

	// Modal state for answers
	let showAnswersModal = $state(false);

	// Modal functions for answers
	function openAnswersModal() {
		showAnswersModal = true;
		document.body.style.overflow = 'hidden';
	}

	function closeAnswersModal() {
		showAnswersModal = false;
		document.body.style.overflow = 'auto';
	}

	// Existing modal functions (assuming these are for a different modal and not directly used here)
	function closeMarkingModal() {
		showMarkingModal = false;
		document.body.style.overflow = 'auto';
		// Navigate to home page
		window.location.href = '/';
	}

	function handleAnswersKeydown(event) {
		if (event.key === 'Escape' && showAnswersModal) {
			closeAnswersModal();
		}
	}

	function handleAnswersBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeAnswersModal();
		}
	}

	function handleMarkingKeydown(event) {
		// Assuming this was intended for another modal, keeping it for now
	}

	// Question data based on the original HTML file - exact wording
	const passage1Questions = {
		trueFalse: [
			{ num: 1, text: "The plight of the rainforests has largely been ignored by the media." },
			{ num: 2, text: "Children only accept opinions on rainforests that they encounter in their classrooms." },
			{ num: 3, text: "It has been suggested that children hold mistaken views about the 'pure' science that they study at school." },
			{ num: 4, text: "The fact that children's ideas about science form part of a larger framework of ideas means that it is easier to change them." },
			{ num: 5, text: "The study involved asking children a number of yes/no questions such as 'Are there any rainforests in Africa?'" },
			{ num: 6, text: "Girls are more likely than boys to hold mistaken views about the rainforests' destruction." },
			{ num: 7, text: "The study reported here follows on from a series of studies that have looked at children's understanding of rainforests." },
			{ num: 8, text: "A second study has been planned to investigate primary school children's ideas about rainforests." }
		],
		responseOptions: [
			{ label: "A", text: "There is a complicated combination of reasons for the loss of the rainforests." },
			{ label: "B", text: "The rainforests are being destroyed by the same things that are destroying the forests of Western Europe." },
			{ label: "C", text: "Rainforests are located near the Equator." },
			{ label: "D", text: "Brazil is home to the rainforests." },
			{ label: "E", text: "Without rainforests some animals would have nowhere to live." },
			{ label: "F", text: "Rainforests are important habitats for a lot of plants." },
			{ label: "G", text: "People are responsible for the loss of the rainforests." },
			{ label: "H", text: "The rainforests are a source of oxygen." },
			{ label: "I", text: "Rainforests are of consequence for a number of different reasons." },
			{ label: "J", text: "As the rainforests are destroyed, the world gets warmer." },
			{ label: "K", text: "Without rainforests there would not be enough oxygen in the air." },
			{ label: "L", text: "There are people for whom the rainforests are home." },
			{ label: "M", text: "Rainforests are found in Africa." },
			{ label: "N", text: "Rainforests are not really important to human life." },
			{ label: "O", text: "The destruction of the rainforests is the direct result of logging activity." },
			{ label: "P", text: "Humans depend on the rainforests for their continuing existence." }
		],
		responseQuestions: [
			{ num: 9, text: "What was the children's most frequent response when asked where the rainforests were?" },
			{ num: 10, text: "What was the most common response to the question about the importance of the rainforests?" },
			{ num: 11, text: "What did most children give as the reason for the loss of the rainforests?" },
			{ num: 12, text: "Why did most children think it important for the rainforests to be protected?" },
			{ num: 13, text: "Which of the responses is cited as unexpectedly uncommon, given the amount of time spent on the issue by the newspapers and television?" }
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
			{ num: 15, text: "nerves linked to their __________ are underdeveloped" },
			{ num: 16, text: "__________" },
			{ num: 17, text: "__________ and __________" },
			{ num: 18, text: "__________" },
			{ num: 19, text: "exceptional in __________ and good in air–water interface" },
			{ num: 20, text: "usually use __________; repertoire limited" },
			{ num: 21, text: "__________ whales and __________ whales" }
		],
		shortAnswer: [
			{ num: 22, text: "Which of the senses is described here as being involved in mating?" },
			{ num: 23, text: "Which species swims upside down while eating?" },
			{ num: 24, text: "What can bottlenose dolphins follow from under the water?" },
			{ num: 25, text: "Which type of habitat is related to good visual ability?" },
			{ num: 26, text: "Which of the senses is best developed in cetaceans?" }
		]
	};

	const passage3Questions = {
		multipleChoice: [
			{
				num: 27,
				text: "In the first paragraph the writer makes the point that blind people",
				options: [
					"A. may be interested in studying art.",
					"B. can draw outlines of different objects and surfaces.",
					"C. can recognise conventions such as perspective.",
					"D. can draw accurately."
				]
			},
			{
				num: 28,
				text: "The writer was surprised because the blind woman",
				options: [
					"A. drew a circle on her own initiative.",
					"B. did not understand what a wheel looked like.",
					"C. included a symbol representing movement.",
					"D. was the first person to use lines of motion."
				]
			},
			{
				num: 29,
				text: "From the experiment described in Part 1, the writer found that the blind subjects",
				options: [
					"A. had good understanding of symbols representing movement.",
					"B. could control the movement of wheels very accurately.",
					"C. worked together well as a group in solving problems.",
					"D. got better results than the sighted undergraduates."
				]
			}
		],
		matching: [
			{ num: 30, text: "30" },
			{ num: 31, text: "31" },
			{ num: 32, text: "32" }
		],
		matchingOptions: [
			"A. steady spinning",
			"B. jerky movement",
			"C. rapid spinning",
			"D. wobbling movement",
			"E. use of brakes"
		],
		summaryCompletion: [
			{ num: 33, text: "In the experiment described in Part 2, a set of word __________ was used to investigate whether blind and sighted people perceived the symbolism in abstract __________ in the same way." },
			{ num: 34, text: "Subjects were asked which word fitted best with a circle and which with a square. From the __________ volunteers, everyone thought a circle fitted 'soft' while a square fitted 'hard'." },
			{ num: 35, text: "However, only 51% of the __________ volunteers assigned a circle to __________." },
			{ num: 36, text: "When the test was later repeated with __________ volunteers, it was found that they made __________ choices." }
		],
		finalMultipleChoice: {
			num: 40,
			text: "Which of the following statements best summarises the writer's general conclusion?",
			options: [
				"A. The blind represent some aspects of reality differently from sighted people.",
				"B. The blind comprehend visual metaphors in similar ways to sighted people.",
				"C. The blind may create unusual and effective symbols to represent reality.",
				"D. The blind may be successful artists if given the right training."
			]
		}
	};

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

		// Iterate through all possible question numbers, including '21b'
		const allQuestionNumbers = new Set([
			...Object.keys(answerKey).map(Number).filter(n => !isNaN(n)),
			'21b'
		]);

		for (const questionKey of allQuestionNumbers) {
			// Handle the case where a question might not have a corresponding answerKey entry
			const correctAnswers = Array.isArray(answerKey[questionKey]) ? answerKey[questionKey] : [];
			const userAnswer = answers[questionKey]?.toString().trim().toLowerCase() || '';

			let isCorrect = false;
			if (correctAnswers.length > 0) {
				for (const correctAnswer of correctAnswers) {
					if (userAnswer === correctAnswer.toLowerCase().trim()) {
						isCorrect = true;
						break;
					}
				}
			} else if (questionKey === 21) { // Special handling for Q21 table entry which combines two inputs
				const userAnswerPart1 = answers[21]?.toString().trim().toLowerCase() || '';
				const userAnswerPart2 = answers['21b']?.toString().trim().toLowerCase() || '';
				const correctAnswersQ21 = answerKey[21];

				if (correctAnswersQ21) {
					const correctSetQ21 = new Set(correctAnswersQ21.map(ans => ans.toLowerCase().trim()));
					if (correctSetQ21.has(userAnswerPart1) && correctSetQ21.has(userAnswerPart2)) {
						isCorrect = true;
					}
				}
			}


			questionResults[questionKey] = {
				userAnswer: answers[questionKey] || '',
				correctAnswers: correctAnswers,
				isCorrect: isCorrect
			};
		}

		// Special handling for Q21 if it was not covered in the loop
		if (allQuestionNumbers.has(21) && !questionResults[21]) {
			const userAnswerPart1 = answers[21]?.toString().trim().toLowerCase() || '';
			const userAnswerPart2 = answers['21b']?.toString().trim().toLowerCase() || '';
			const correctAnswersQ21 = answerKey[21];
			let isCorrectQ21 = false;
			if (correctAnswersQ21) {
				const correctSetQ21 = new Set(correctAnswersQ21.map(ans => ans.toLowerCase().trim()));
				if (correctSetQ21.has(userAnswerPart1) && correctSetQ21.has(userAnswerPart2)) {
					isCorrectQ21 = true;
				}
			}
			questionResults[21] = {
				userAnswer: answers[21] || '', // This might need adjustment to reflect both inputs if needed
				correctAnswers: correctAnswersQ21 || [],
				isCorrect: isCorrectQ21
			};
			if (isCorrectQ21) {
				correct++;
			}
		} else if (allQuestionNumbers.has(21) && questionResults[21] && questionResults[21].isCorrect) {
			correct++;
		}

		// Ensure count for '21b' is consistent if it's a separate check
		if (allQuestionNumbers.has('21b') && !questionResults['21b']) {
			const userAnswerPart2 = answers['21b']?.toString().trim().toLowerCase() || '';
			const correctAnswersQ21b = answerKey['21b'];
			let isCorrectQ21b = false;
			if (correctAnswersQ21b) {
				const correctSetQ21b = new Set(correctAnswersQ21b.map(ans => ans.toLowerCase().trim()));
				if (correctSetQ21b.has(userAnswerPart2)) {
					isCorrectQ21b = true;
				}
			}
			questionResults['21b'] = {
				userAnswer: answers['21b'] || '',
				correctAnswers: correctAnswersQ21b || [],
				isCorrect: isCorrectQ21b
			};
			// Note: We don't increment 'correct' here for '21b' as it's part of Q21.
		} else if (allQuestionNumbers.has('21b') && questionResults['21b'] && questionResults['21b'].isCorrect) {
			// This branch might be redundant if '21b' is handled within Q21 logic.
		}


		// Recalculate total based on the number of unique question keys processed
		const actualTotalQuestions = Object.keys(questionResults).length;
		results = {
			score: correct,
			total: actualTotalQuestions, // Use the count of processed questions for total
			percentage: actualTotalQuestions > 0 ? Math.round((correct / actualTotalQuestions) * 100) : 0,
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

	function updateAnswer(questionNumber: number | string, value: string) {
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

		// Add event listener for Escape key when answer modal is open
		document.addEventListener('keydown', handleAnswersKeydown);

		return () => {
			if (timer) clearInterval(timer);
			document.removeEventListener('keydown', handleAnswersKeydown);
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
						IELTS Reading Practice Test 1
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
				{#if showAnswers}
					<!-- Title Display when showing answers -->
					<div class="text-center mb-4">
						<h1 class="text-2xl font-bold text-teal-600 dark:text-teal-400">
							Reading Test Answers & Score
						</h1>
					</div>
				{:else}
					<!-- Timer Display -->
					<div class="text-center mb-4">
						<div class="text-2xl font-bold text-teal-600 dark:text-teal-400">
							{formatTime(timeRemaining)}
						</div>
						<div class="text-sm text-gray-300 dark:text-gray-200">Time Remaining</div>
					</div>

					<!-- Timer Control Buttons -->
					<div class="flex justify-center gap-2 mb-4">
						{#if isActive}
							<button
								onclick={pauseTimer}
								class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded text-sm"
							>
								PAUSE TIMER
							</button>
						{:else}
							<button
								onclick={startTimer}
								class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-medium rounded text-sm"
							>
								START
							</button>
						{/if}
					</div>
				{/if}

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

								<div class="flex flex-col md:flex-row gap-6 items-start mb-6">
									<div class="flex-1">
										<p>Adults and children are frequently confronted with statements about the alarming rate of loss of tropical rainforests. For example, one graphic illustration to which children might readily relate is the estimate that rainforests are being destroyed at a rate equivalent to one thousand football fields every forty minutes – about the duration of a normal classroom period. In the face of the frequent and often vivid media coverage, it is likely that children will have formed ideas about rainforests – what and where they are, why they are important, what endangers them – independent of any formal tuition. It is also possible that some of these ideas will be mistaken.</p>
									</div>
									<div class="md:w-1/3 flex-shrink-0">
										<img src="/reading-images/rainforest-destruction.png" alt="Rainforest destruction showing environmental impact" class="w-full rounded-lg shadow-lg" />

									</div>
								</div>

								<p>Many studies have shown that children harbour misconceptions about 'pure', curriculum science. These misconceptions do not remain isolated but become incorporated into a multifaceted, but organised, conceptual framework, making it and the component ideas, some of which are erroneous, more robust but also accessible to modification. These ideas may be developed by children absorbing ideas through the popular media. Sometimes this information may be erroneous. It seems schools may not be providing an opportunity for children to re-express their ideas and so have them tested and refined by teachers and their peers.</p>

								<p>Despite the extensive coverage in the popular media of the destruction of rainforests, little formal information is available about children’s ideas in this area. The aim of the	present study is to start to provide such information, to help teachers design their educational strategies to build upon correct ideas and to	displace misconceptions and to	plan programmes in environmental studies in their schools.</p>

								<p>The study surveys children’s scientific knowledge and attitudes to rainforests.	Secondary school children were asked to complete a questionnaire containing five	open-form questions. The most frequent responses to the first question were descriptions which are self-evident from the term ‘rainforest’. Some children described them	as damp, wet or hot. The second question concerned the geographical location of rainforests. The commonest responses were continents or countries: Africa (given by 43%	of children), South America (30%), Brazil (25%). Some children also gave more	general locations, such as being near the Equator.</p>

								<p>Responses to question three concerned the importance of rainforests. The dominant idea, raised by 64% of the pupils, was that rainforests provide animals with habitats. Fewer students responded that rainforests provide plant habitats, and even fewer	mentioned the indigenous populations of rainforests.</p>

								<p>Similarly, but at a lower level, more girls (13%) than boys (5%) said that rainforests	provided human habitats. These observations are generally consistent with our previous studies of pupils’ views about the use and conservation of rainforests, in which							girls were shown to be more sympathetic to animals and expressed views which seem	to place an intrinsic value on non-human animal life.</p>

								<p>The fourth question concerned the causes of the destruction of rainforests. Perhaps	encouragingly, more than half of the pupils (59%) identified that it is human activities which are destroying rainforests, some personalising the responsibility by the use of terms such as ‘we are’. About 18% of the pupils referred specifically to logging activity</p>

								<p>One misconception, expressed by some 10% of the pupils, was that acid rain is	responsible for rainforest destruction; a similar proportion said that pollution is	destroying rainforests. Here, children are confusing rainforest destruction with	damage to the forests of Western Europe by these factors. While two fifths of the students provided the information that the rainforests provide oxygen, in some cases this				response also embraced the misconception that rainforest destruction would reduce atmospheric oxygen, making the atmosphere incompatible with human life on Earth.</p>

								<p>In answer to the final question about the importance of rainforest conservation, the	majority of children simply said that we need rainforests to survive. Only a few of the	pupils (6%) mentioned that rainforest destruction may contribute to global warming. This is surprising considering the high level of media coverage on this issue. Some	children expressed the idea that the conservation of rainforests is not important.</p>
						<p>The results of this study suggest that certain ideas predominate in the thinking of	children about rainforests. Pupils’ responses indicate some misconceptions in basic	scientific knowledge of rainforests’ ecosystems such as their ideas about rainforests as					habitats for animals, plants and humans and the relationship between climatic change	and destruction of rainforests.</p>

							<p>Pupils did not volunteer ideas that suggested that they appreciated the complexity of	causes of rainforest destruction. In other words, they gave no indication of an appreciation of either the range of ways in which rainforests are important or the complex social, economic and political factors which drive the activities which are destroying			the rainforests. One encouragement is that the results of similar studies about other	environmental issues suggest that older children seem to acquire the ability to appreciate, value and evaluate conflicting views. Environmental education offers an arena in	which these skills can be developed, which is essential for these children as future decision-makers.</p>							
							</div>

							<div class="space-y-6">
								<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 1-8</h3>
								<p class="text-gray-700 dark:text-gray-300">Do the following statements agree with the information given in Reading Passage 1?</p>
								<p class="text-gray-700 dark:text-gray-300">In boxes 1–8 on your answer sheet write</p>
								<div class="ml-4 text-gray-700 dark:text-gray-300">
									<p><strong>TRUE</strong> if the statement agrees with the information</p>
									<p><strong>FALSE</strong> if the statement contradicts the information</p>
									<p><strong>NOT GIVEN</strong> if there is no information on this</p>
								</div>

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

								<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 9-13</h3>
								<p class="text-gray-700 dark:text-gray-300">The box below gives a list of responses <strong>A–P</strong> to the questionnaire discussed in Reading Passage 1.</p>
								<p class="text-gray-700 dark:text-gray-300">Answer the following questions by choosing the correct responses <strong>A–P</strong>.</p>
								<p class="text-gray-700 dark:text-gray-300">Write your answers in boxes 9–13 on your answer sheet.</p>

								<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
									<h4 class="font-semibold mb-3">Response Options A–P:</h4>
									<div class="grid grid-cols-1 gap-2 text-sm">
										{#each passage1Questions.responseOptions as option}
											<div><strong>{option.label}.</strong> {option.text}</div>
										{/each}
									</div>
								</div>

								{#each passage1Questions.responseQuestions as question}
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
								You should spend about 20 minutes on Questions 15–26, which are based on Reading Passage 2 below.
							</p>
						</div>

						<div class="prose dark:prose-invert max-w-none mb-8">
							<h3 class="text-xl font-semibold mb-4">Whale Senses</h3>

							<div class="mb-6">
								<img src="/reading-images/whale-feelings.png" alt="Whale senses and sensory adaptations" class="w-full max-w-md mx-auto rounded-lg shadow-lg" />
										</div>

							<p>Some of the senses that we and other terrestrial mammals take for granted are either	reduced or absent in cetaceans or fail to function well in water. For example, it appears	from their brain structure that toothed species are unable to smell. Baleen species,	on the other hand, appear to have some related brain structures but it is not known		whether these are functional. It has been speculated that, as the blowholes evolved	and migrated to the top of the head, the neural pathways serving sense of smell may have been nearly all sacrificed. Similarly, although at least some cetaceans have taste buds, the nerves serving these have degenerated or are rudimentary.</p>

							<p>The sense of touch has sometimes been described as weak too, but this view is probably mistakent. Trainers of captive dolphins and small whales often remark on their animals’ responsiveness to being touched or rubbed, and both captive and freeranging cetacean individuals of all species (particularly adults and calves, or members of the same subgroup) appear to make frequent contact. This contact may help to				maintain order within a group, and stroking or touching are part of the courtship ritual in most species. The area around the blowhole is also particularly sensitive and	captive animals often object strongly to being touched there.</p>

							<p>The sense of vision is developed to different degrees in different species. Baleen	species studied at close quarters underwater – specifically a grey whale calf in captivity for a year, and free-ranging right whales and humpback whales studied and filmed	off Argentina and Hawaii – have obviously tracked objects with vision underwater, and				they can apparently see moderately well both in water and in air. However, the position of the eyes so restricts the field of vision in baleen whales that they probably do	not have stereoscopic vision.</p>

							<p>On the other hand, the position of the eyes in most dolphins and porpoises suggests	that they have stereoscopic vision forward and downward. Eye position in freshwater	dolphins, which often swim on their side or upside down while feeding, suggests that	what vision they have is stereoscopic forward and upward. By comparison, the bottlenose dolphin has extremely keen vision in water. Judging from the way it watches	and tracks airborne flying fish, it can apparently see fairly well through the air–water	interface as well. And although preliminary experimental evidence suggests that their	in-air vision is poor, the accuracy with which dolphins leap high to take small fish out	of a trainer’s hand provides anecdotal evidence to the contrary</p>

							<p>Such variation can no doubt be explained with reference to the habitats in which individual species have developed. For example, vision is obviously more useful to species	inhabiting clear open waters than to those living in turbid rivers and flooded plains. The					South American boutu and Chinese beiji, for instance, appear to have very limited	vision, and the Indian susus are blind, their eyes reduced to slits that probably allow	them to sense only the direction and intensity of light.</p>

							<p>Although the senses of taste and smell appear to have deteriorated, and vision in	water appears to be uncertain, such weaknesses are more than compensated for by cetaceans’ well-developed acoustic sense. Most species are highly vocal, although	they vary in the range of sounds they produce, and many forage for food using echolocation1. Large baleen whales primarily use the lower frequencies and are often limited	in their repertoire. Notable exceptions are the nearly song-like choruses of bowhead	whales in summer and the complex, haunting utterances of the humpback whales. Toothed species in general employ more of the frequency spectrum, and produce a	wider variety of sounds, than baleen species (though the sperm whale apparently produces a monotonous series of high-energy clicks and little else). Some of the more	complicated sounds are clearly communicative, although what role they may play in	the social life and ‘culture’ of cetaceans has been more the subject of wild speculation than of solid science.</p>

							<p><i>1. echolocation: the perception of objects by means of sound wave echoes</i></p>
						</div>

						<div class="space-y-6">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 15-21</h3>
							<p class="text-gray-700 dark:text-gray-300">Complete the table below.</p>
							<p class="text-gray-700 dark:text-gray-300">Choose <strong>NO MORE THAN THREE WORDS</strong> from Reading Passage 2 for each answer.</p>
							<p class="text-gray-700 dark:text-gray-300">Write your answers in boxes 15–21 on your answer sheet.</p>

							<div class="overflow-x-auto">
								<table class="w-full border-collapse border border-gray-300 dark:border-gray-600 mb-6">
									<thead>
										<tr class="bg-gray-100 dark:bg-gray-700">
											<th class="border border-gray-300 dark:border-gray-600 p-3 text-left">SENSE</th>
											<th class="border border-gray-300 dark:border-gray-600 p-3 text-left">SPECIES</th>
											<th class="border border-gray-300 dark:border-gray-600 p-3 text-left">ABILITY</th>
											<th class="border border-gray-300 dark:border-gray-600 p-3 text-left">COMMENTS</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3">Smell</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">toothed</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">no</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">evidence from brain structure</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">baleen</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">not certain</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">related brain structures are present</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3">Taste</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">some types</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">poor</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>15.</span>
													<input
														type="text"
														bind:value={answers[15]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="flex-1 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[15]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
													<span>are underdeveloped</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3">Touch</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">all</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">region around the blowhole very sensitive</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3">Vision</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>16.</span>
													<input
														type="text"
														bind:value={answers[16]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="flex-1 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[16]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
												</div>
											</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">probably do not have stereoscopic vision</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">dolphins, porpoises</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>probably have stereoscopic vision</span>
													<span>17.</span>
													<input
														type="text"
														bind:value={answers[17]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="w-20 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[17]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
													<span>and</span>
													<span>18.</span>
													<input
														type="text"
														bind:value={answers[18]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="w-20 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[18]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
												</div>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>freshwater dolphins</span>
												</div>
											</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">probably have stereoscopic vision forward and upward</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">bottlenose dolphin</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>exceptional in</span>
													<span>19.</span>
													<input
														type="text"
														bind:value={answers[19]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="w-20 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[19]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
													<span>and good in air–water interface</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">boutu and beiji</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">poor</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">have limited vision</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">Indian susus</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">no</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">probably only sense direction and intensity of light</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3">Hearing</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">most large baleen</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>usually use</span>
													<span>20.</span>
													<input
														type="text"
														bind:value={answers[20]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="w-24 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[20]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
													<span>; repertoire limited</span>
												</div>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">
												<div class="flex items-center gap-2">
													<span>21.</span>
													<input
														type="text"
														bind:value={answers[21]}
														disabled={showAnswers}
														placeholder="Your answer"
														class="w-20 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions[21]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
													<span>whales and</span>
													<input
														type="text"
														bind:value={answers['21b']}
														disabled={showAnswers}
														placeholder="Your answer"
														class="w-20 rounded border p-1 text-xs text-black dark:text-white dark:bg-gray-700 {showAnswers && results ? (results.questions['21b']?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 bg-white'}"
													/>
													<span>whales</span>
												</div>
											</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">song-like</td>
										</tr>
										<tr>
											<td class="border border-gray-300 dark:border-gray-600 p-3"></td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">toothed</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">yes</td>
											<td class="border border-gray-300 dark:border-gray-600 p-3">use more of frequency spectrum; have wider repertoire</td>
										</tr>
									</tbody>
								</table>
							</div>

							{#if showAnswers}
								{#each [15, 16, 17, 18, 19, 20, '21b'] as qNum}
									{#if results?.questions[qNum]}
										<div class="mt-2 text-sm">
											<strong>Q{qNum}:</strong>
											{#if results.questions[qNum].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[qNum].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								{/each}
							{/if}

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
								You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.
							</p>
						</div>

						<div class="prose dark:prose-invert max-w-none mb-8">
							<h3 class="text-xl font-semibold mb-4">Visual Symbols and the Blind</h3>

							<p><strong>Part 1</strong></p>
							<div class="flex flex-col md:flex-row gap-6 items-start mb-6">
								<div class="flex-1">
									<p>From a number of recent studies, it has become clear that blind people can appreciate	the use of outlines and perspectives to describe the arrangement of objects and other	surfaces in space. But pictures are more than literal representations.	This fact was drawn to my attention dramatically when a blind	woman in one of my investigations decided on her own initiative to draw a wheel as it was spinning. To show this motion, she traced a	curve inside the circle (Fig. 1). I was taken aback. Lines of motion,	such as the one she used, are a very recent invention in the history of illustration. Indeed, as art scholar David Kunzle notes, Wilhelm	Busch, a trend-setting nineteenth-century cartoonist, used virtually no motion lines in his popular figures until about 1877.</p>
								</div>
								<div class="md:w-1/3 flex-shrink-0">
									<img src="/reading-images/Fig.1.png" alt="Fig. 1 - Drawing showing a spinning wheel with motion lines" class="w-full rounded-lg shadow-lg" />
								</div>

<p>When I asked several other blind study subjects to draw a spinning wheel, one particularly clever rendition appeared repeatedly: several subjects showed the wheel’s spokes as curved lines. When asked about these curves, they all described them as metaphorical ways of suggesting motion. Majority rule would argue that this device somehow indicated motion very well. But was it a better indicator than, say, broken or wavy lines – or any other kind of line, for that matter? The answer was not clear. So
I decided to test whether various lines of motion were apt ways of showing movement or if they were merely idiosyncratic marks. Moreover, I wanted to discover whether there were differences in how the blind and the sighted interpreted lines of motion.</p>

<p>To search out these answers, I created raised-line drawings of five different wheels,	depicting spokes with lines that curved, bent, waved, dashed and extended beyond the perimeter of the wheel. I then asked eighteen blind volunteers to feel the wheels	and assign one of the following motions to each wheel: wobbling, spinning fast, spinning steadily, jerking or braking. My control group consisted of eighteen sighted	undergraduates from the University of Toronto.</p>

<p>All but one of the blind subjects assigned distinctive motions to each wheel. Most guessed that the curved spokes indicated that the wheel was spinning steadily; the wavy spokes, they thought, suggested that the wheel was wobbling; and the bent spokes were taken as a sign that the wheel was jerking. Subjects assumed that spokes extending beyond the wheel’s perimeter signified that the wheel had its brakes on and
dashed spokes indicated the wheel was spinning quickly.</p>

<p>In addition, the favoured description for the sighted was the favoured description for the blind in every instance. What is more, the consensus among the sighted was barely higher than that among the blind. Because motion devices are unfamiliar to the blind, the task I gave them involved some problem solving. Evidently, however, the blind not only figured out meanings for each line of motion, but as a group they generally came
up with the same meaning at least as frequently as did sighted subjects.</p>

								<p><strong>Part 2</strong></p>
<p>We have found that the blind understand other kinds of visual metaphors as well. One blind woman drew a picture of a child inside a heart – choosing that symbol, she said, to show that love surrounded the child. With Chang Hong Liu, a doctoral student from China, I have begun exploring how well blind people understand the symbolism behind shapes such as hearts that do not directly represent their meaning.</p>

<p>We gave a list of twenty pairs of words to sighted subjects and asked them to pick from each pair the term that best related to a circle
and the term that best related to a square. For example, we asked: What goes with soft? A circle or a square? Which shape goes with hard?</p>

<p>All our subjects deemed the circle soft and the square hard. A full 94% ascribed happy to the circle, instead of sad. But other pairs revealed less agreement: 79% matched fast to slow and weak to strong, respectively. And only 51% linked deep to circle and shallow to square. When we tested four totally blind volunteers using the same list, we found that their choices closely resembled those made by the sighted subjects. One man, who had been blind since birth, scored extremely well. He made only one match differing from the consensus, assigning ‘far’ to square and ‘near’ to circle. In fact, only a small majority of sighted subjects – 53% – had paired far and near to the opposite partners. Thus, we concluded that the blind interpret abstract shapes as sighted people do.</p>
							</div>			
					
						<div class="space-y-6">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 27-29</h3>
							<p class="text-gray-700 dark:text-gray-300">Choose the correct letter, <strong>A</strong>, <strong>B</strong>, <strong>C</strong> or <strong>D</strong>.</p>
							<p class="text-gray-700 dark:text-gray-300">Write your answers in boxes 27–29 on your answer sheet.</p>

							{#each passage3Questions.multipleChoice as question}
								<div class="question mb-6">
									<label class="mb-3 block font-medium text-gray-900 dark:text-white">
										{question.num}. {question.text}
									</label>
									<div class="space-y-2">
										{#each question.options as option}
											<label class="flex items-start">
												<input
													type="radio"
													name="q{question.num}"
													value={option.charAt(0)}
													onchange={(e) => updateAnswer(question.num, e.target.value)}
													disabled={showAnswers}
													class="mr-2 mt-1 {showAnswers && results ? (results.questions[question.num]?.userAnswer === option.charAt(0) ? (results.questions[question.num]?.isCorrect ? 'accent-green-500' : 'accent-red-500') : '') : ''}"
												/>
												<span class="text-gray-700 dark:text-gray-300">{option}</span>
											</label>
										{/each}
									</div>
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

							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 30-32</h3>
							<p class="text-gray-700 dark:text-gray-300">Look at the following diagrams (Questions 30–32), and the list of types of movement below.</p>
							<p class="text-gray-700 dark:text-gray-300">Match each diagram to the type of movement <strong>A–E</strong> generally assigned to it in the experiment.</p>
							<p class="text-gray-700 dark:text-gray-300">Choose the correct letter <strong>A–E</strong> and write them in boxes 30–32 on your answer sheet.</p>

							<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
								<h4 class="font-semibold mb-3">Movement Types:</h4>
								<div class="grid grid-cols-1 gap-2 text-sm">
									{#each passage3Questions.matchingOptions as option}
										<div>{option}</div>
									{/each}
								</div>
							</div>

							{#each passage3Questions.matching as question}
								<div class="question mb-4">
									<label class="mb-2 block font-medium text-gray-900 dark:text-white">
										{question.num}. {question.text}
									</label>
									<select
										bind:value={answers[question.num]}
										disabled={showAnswers}
										class="w-full rounded-lg border p-2 text-black {showAnswers && results ? (results.questions[question.num]?.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}"
									>
										<option value="">Select movement type</option>
										{#each ['A', 'B', 'C', 'D', 'E'] as option}
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

							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 33-39</h3>
							<p class="text-gray-700 dark:text-gray-300">Complete the summary below using words from the box.</p>
							<p class="text-gray-700 dark:text-gray-300">Write your answers in boxes 33–39 on your answer sheet.</p>
							<p class="text-gray-700 dark:text-gray-300"><strong>NB</strong> You may use any word more than once.</p>

							<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
								<h4 class="font-semibold mb-3">Word Box:</h4>
								<div class="grid grid-cols-4 gap-2 text-sm">
									<div>blind</div>
									<div>deep</div>
									<div>pairs</div>
									<div>shapes</div>
									<div>sighted</div>
									<div>similar</div>
								</div>
							</div>

							<div class="space-y-4">
								<p class="text-gray-700 dark:text-gray-300">
									In the experiment described in Part 2, a set of word 
									<input
										type="text"
										bind:value={answers[33]}
										disabled={showAnswers}
										placeholder="33"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[33]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									was used to investigate whether blind and sighted people perceived the symbolism in abstract
									<input
										type="text"
										bind:value={answers[34]}
										disabled={showAnswers}
										placeholder="34"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[34]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									in the same way.
								</p>

								<p class="text-gray-700 dark:text-gray-300">
									Subjects were asked which word fitted best with a circle and which with a square. From the
									<input
										type="text"
										bind:value={answers[35]}
										disabled={showAnswers}
										placeholder="35"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[35]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									volunteers, everyone thought a circle fitted 'soft' while a square fitted 'hard'. However, only 51% of the
									<input
										type="text"
										bind:value={answers[36]}
										disabled={showAnswers}
										placeholder="36"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[36]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									volunteers assigned a circle to
									<input
										type="text"
										bind:value={answers[37]}
										disabled={showAnswers}
										placeholder="37"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[37]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									. When the test was later repeated with
									<input
										type="text"
										bind:value={answers[38]}
										disabled={showAnswers}
										placeholder="38"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[38]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									volunteers, it was found that they made
									<input
										type="text"
										bind:value={answers[39]}
										disabled={showAnswers}
										placeholder="39"
										class="w-16 mx-1 rounded border p-1 text-black {showAnswers && results ? (results.questions[39]?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'}"
									/>
									choices.
								</p>
							</div>

							{#if showAnswers}
								{#each [33, 34, 35, 36, 37, 38, 39] as qNum}
									{#if results?.questions[qNum]}
										<div class="mt-2 text-sm">
											<strong>Q{qNum}:</strong>
											{#if results.questions[qNum].isCorrect}
												<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
											{:else}
												<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
												<span class="text-gray-600 dark:text-gray-300">
													Correct answer: {results.questions[qNum].correctAnswers.join(' or ')}
												</span>
											{/if}
										</div>
									{/if}
								{/each}
							{/if}

							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Question 40</h3>
							<p class="text-gray-700 dark:text-gray-300">Choose the correct letter, <strong>A</strong>, <strong>B</strong>, <strong>C</strong> or <strong>D</strong>.</p>
							<p class="text-gray-700 dark:text-gray-300">Write your answer in box 40 on your answer sheet.</p>

							<div class="question mb-6">
								<label class="mb-3 block font-medium text-gray-900 dark:text-white">
									{passage3Questions.finalMultipleChoice.num}. {passage3Questions.finalMultipleChoice.text}
								</label>
								<div class="space-y-2">
									{#each passage3Questions.finalMultipleChoice.options as option}
										<label class="flex items-start">
											<input
												type="radio"
												name="q{passage3Questions.finalMultipleChoice.num}"
												value={option.charAt(0)}
												onchange={(e) => updateAnswer(passage3Questions.finalMultipleChoice.num, e.target.value)}
												disabled={showAnswers}
												class="mr-2 mt-1 {showAnswers && results ? (results.questions[passage3Questions.finalMultipleChoice.num]?.userAnswer === option.charAt(0) ? (results.questions[passage3Questions.finalMultipleChoice.num]?.isCorrect ? 'accent-green-500' : 'accent-red-500') : '') : ''}"
											/>
											<span class="text-gray-700 dark:text-gray-300">{option}</span>
										</label>
									{/each}
								</div>
								{#if showAnswers && results?.questions[passage3Questions.finalMultipleChoice.num]}
									<div class="mt-2 text-sm">
										{#if results.questions[passage3Questions.finalMultipleChoice.num].isCorrect}
											<span class="text-green-600 dark:text-green-400">✓ Correct!</span>
										{:else}
											<span class="text-red-600 dark:text-red-400">✗ Incorrect.</span>
											<span class="text-gray-600 dark:text-gray-300">
												Correct answer: {results.questions[passage3Questions.finalMultipleChoice.num].correctAnswers.join(' or ')}
											</span>
										{/if}
									</div>
								{/if}
							</div>

							<!-- End of Test Section - only show when not viewing answers -->
							{#if !showAnswers}
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
										<button
											onclick={openAnswersModal}
											class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline mt-2"
										>
											Download official Answer sheet
										</button>
									</p>
								</div>
							{/if}
						</div>
					</div>

							<!-- Action Button - only show if not marked yet -->
							{#if !hasMarked}
								<div class="mt-6 flex flex-col gap-4 items-center">
									<button
										type="button"
										onclick={() => { if (!hasMarked && !isMarking) markTest(); }}
										disabled={isMarking}
										class="inline-flex items-center justify-center px-8 py-4 bg-green-800 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
								<div class="mt-12 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto">
									<!-- Centered Test Results title -->
									<h3 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white text-center"><u>Test Results</u></h3>

									<!-- Centered Query button and help text -->
									<div class="text-center mb-8">
										<button
											onclick={() => window.open('#', '_blank')}
											class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
										>
											Query my Results
										</button>
										<div class="text-sm text-white dark:text-gray-400 mt-1">
											If you are unclear about any answers - just ask!
										</div>
									</div>

									<div class="mb-6 text-center">
										<div class="text-3xl font-bold text-teal-600 dark:text-teal-400">
											{results.score}/40
										</div>
										<div class="text-sm text-white dark:text-gray-300">
											{results.percentage}% Correct
										</div>
									</div>

									<!-- Band Score Estimate -->
									<div class="text-center mb-8">
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

									<!-- Bottom buttons -->
									<div class="flex justify-between items-center gap-1">
										<button
											onclick={openAnswersModal}
											class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
										>
											View Answer Key
										</button>
										<button
											onclick={() => window.location.href = '/'}
											class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
										>
											Close
										</button>
									</div>
								</div>
							{/if}
			


	<!-- Answer Key Modal -->
	{#if showAnswersModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 dark:bg-opacity-80"
			onclick={handleAnswersBackdropClick}
			role="dialog"
			aria-modal="true"
		>
			<div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 my-8">
				<div class="p-6">
					<div class="flex justify-between items-center mb-5">

						<!-- <button
							onclick={closeAnswersModal}
							class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
						</button> -->
					</div>
					<div class="max-w-none overflow-y-auto max-h-[70vh]">
						<h3 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">Reading Test 1 - Answer Key</h3>
						<div class="grid grid-cols-3 gap-6 text-sm text-gray-900 dark:text-white">
							<!-- Section 1: Questions 1-14 -->
							<div>
								<h4 class="font-semibold mb-3 text-teal-600 dark:text-teal-400 text-center">Section 1 (Q1-14)</h4>
								{#each Object.entries(answerKey).slice(0, 14) as [questionNum, answersArray]}
									<div class="mb-2">
										<span class="font-medium">{questionNum}.</span>
										<span>{answersArray.join(' / ')}</span>
									</div>
								{/each}
							</div>

							<!-- Section 2: Questions 15-26 -->
							<div>
								<h4 class="font-semibold mb-3 text-teal-600 dark:text-teal-400 text-center">Section 2 (Q15-26)</h4>
								{#each Object.entries(answerKey).slice(14, 26) as [questionNum, answersArray]}
									<div class="mb-2">
										<span class="font-medium">{questionNum}.</span>
										<span>{answersArray.join(' / ')}</span>
									</div>
								{/each}
							</div>

							<!-- Section 3: Questions 27-40 -->
							<div>
								<h4 class="font-semibold mb-3 text-teal-600 dark:text-teal-400 text-center">Section 3 (Q27-40)</h4>
								{#each Object.entries(answerKey).slice(26, 40) as [questionNum, answersArray]}
									<div class="mb-2">
										<span class="font-medium">{questionNum}.</span>
										<span>{answersArray.join(' / ')}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Modal Footer -->
					<div class="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 mt-6">
						<button
							onclick={closeAnswersModal}
							class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
						>
							Close
						</button>
					</div>
				</div>
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

	/* Disabled input text color (after marking) should be black in light mode, white in dark mode */
	input[type="text"]:disabled, select:disabled {
		color: black !important;
	}

	:global(.dark) input[type="text"]:disabled, :global(.dark) select:disabled {
		color: white !important;
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