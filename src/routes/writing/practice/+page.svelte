
<script lang="ts">
	import { onMount } from 'svelte';

	let currentTest = $state('academic'); // 'academic' or 'general'
	let currentTask = $state(1);
	let timeRemaining = $state(60 * 60); // 60 minutes in seconds
	let isTestStarted = $state(false);
	let isTestCompleted = $state(false);
	let showInstructions = $state(true);
	let answers: Record<string, string> = $state({
		'academic-task1': '',
		'academic-task2': '',
		'general-task1': '',
		'general-task2': ''
	});

	// Timer functionality
	let timer: number;
	let isActive = $state(false);

	// Academic Test Questions
	const academicQuestions = {
		task1: {
			title: 'Task 1 - Academic',
			timeLimit: '20 minutes recommended',
			wordLimit: 'At least 150 words',
			instruction: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.',
			task: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
			image: '/writing-images/ielts-writing-test-1-bar-chart.png',
			imageAlt: 'Bar chart showing percentage of households in owned and rented accommodation'
		},
		task2: {
			title: 'Task 2 - Academic',
			timeLimit: '40 minutes recommended',
			wordLimit: 'At least 250 words',
			instruction: 'Some people believe that unpaid community service should be a compulsory part of high school programmes (for example working for a charity, improving the neighbourhood or teaching sports to younger children).',
			task: 'To what extent do you agree or disagree?',
			additionalInfo: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
			image: '/writing-images/ielts-writing-test-2-agree_disagree.png',
			imageAlt: 'IELTS Writing Task 2 agree/disagree question example'
		}
	};

	const generalQuestions = {
		task1: {
			title: 'Task 1 - General Training',
			timeLimit: '20 minutes recommended',
			wordLimit: 'At least 150 words',
			instruction: 'You have recently moved to a different house.',
			task: 'Write a letter to an English-speaking friend. In your letter:',
			bulletPoints: [
				'• explain why you moved',
				'• describe your new house',
				'• invite your friend to come and visit'
			],
			additionalInfo: 'Write at least 150 words. You do NOT need to write any addresses. Begin your letter as follows: Dear...',
			image: '/writing-images/ielts-writing-test-1-general-inform.png',
			imageAlt: 'IELTS Writing Task 1 General Training letter question'
		},
		task2: {
			title: 'Task 2 - General Training',
			timeLimit: '40 minutes recommended',
			wordLimit: 'At least 250 words',
			instruction: 'Some people think that a sense of competition in children should be encouraged. Others believe that children who are taught to co-operate rather than compete become more useful adults.',
			task: 'Discuss both these views and give your own opinion.',
			additionalInfo: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
			image: '/writing-images/ielts-writing-test-2-discuss.png',
			imageAlt: 'IELTS Writing Task 2 discuss question example'
		}
	};

	function startTest() {
		isTestStarted = true;
		showInstructions = false;
		startTimer();
	}

	function startTimer() {
		isActive = true;
	}

	function pauseTimer() {
		isActive = false;
	}

	function resetTimer() {
		isActive = false;
		timeRemaining = 60 * 60;
		answers = {
			'academic-task1': '',
			'academic-task2': '',
			'general-task1': '',
			'general-task2': ''
		};
		isTestCompleted = false;
	}

	function completeTest() {
		isTestCompleted = true;
		clearInterval(timer);
	}

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	function goToTask(task: number) {
		currentTask = task;
	}

	function switchTest(testType: string) {
		currentTest = testType;
	}

	function countWords(text: string): number {
		if (!text.trim()) return 0;
		return text.trim().split(/\s+/).length;
	}

	function getAnswerKey(): string {
		return `${currentTest}-task${currentTask}`;
	}

	onMount(() => {
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
	<title>IELTS Writing Practice Test - InsideIELTS</title>
	<meta name="description" content="Complete IELTS Writing practice test with Academic and General Training options. Practice Task 1 and Task 2 with authentic test questions." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
	{#if showInstructions}
		<!-- Instructions Screen -->
		<div class="container mx-auto px-6 py-8">
			<div class="max-w-4xl mx-auto">
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
					<h1 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
						IELTS Writing Practice Test 1
					</h1>

					<div class="space-y-6 text-gray-700 dark:text-gray-300">
						<div class="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
							<h2 class="text-xl font-semibold text-teal-700 dark:text-teal-300 mb-4">Test Instructions</h2>
							<ul class="space-y-2">
								<li>• Time allowed: <strong>60 minutes</strong></li>
								<li>• Number of tasks: <strong>2</strong></li>
								<li>• <strong>Task 1</strong>: At least <strong>150 words</strong> (20 minutes recommended)</li>
								<li>• <strong>Task 2</strong>: At least <strong>250 words</strong> (40 minutes recommended)</li>
								<li>• Choose between Academic or General Training version</li>
								<li>• Your progress will be saved automatically</li>
							</ul>
						</div>

						<div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
							<h3 class="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">Test Versions</h3>
							<div class="grid md:grid-cols-2 gap-4">
								<div class="text-center">
									<div class="font-semibold">Academic</div>
									<div class="text-sm">Task 1: Describe charts/graphs/diagrams</div>
									<div class="text-sm">Task 2: Academic essay</div>
								</div>
								<div class="text-center">
									<div class="font-semibold">General Training</div>
									<div class="text-sm">Task 1: Write a letter</div>
									<div class="text-sm">Task 2: General essay</div>
								</div>
							</div>
						</div>

						<div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg">
							<h3 class="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-3">Assessment Criteria</h3>
							<ul class="space-y-1 text-sm">
								<li>• <strong>Task Achievement/Response:</strong> How well you address the task requirements</li>
								<li>• <strong>Coherence & Cohesion:</strong> Organisation and flow of your writing</li>
								<li>• <strong>Lexical Resource:</strong> Range and accuracy of vocabulary</li>
								<li>• <strong>Grammatical Range & Accuracy:</strong> Grammar variety and correctness</li>
							</ul>
						</div>
					</div>

					<div class="text-center mt-8">
						<button
							onclick={startTest}
							class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
						>
							Start Writing Test
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
						Thank you for completing the IELTS Writing practice test.
					</p>
					
					<div class="space-y-4 mb-8">
						<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
							<h3 class="font-semibold mb-2">Your Writing Summary</h3>
							<div class="grid grid-cols-2 gap-4 text-sm">
								<div>
									<strong>Task 1 ({currentTest === 'academic' ? 'Academic' : 'General'}):</strong>
									<div>{countWords(answers[getAnswerKey().replace('2', '1')])} words</div>
								</div>
								<div>
									<strong>Task 2:</strong>
									<div>{countWords(answers[getAnswerKey()])} words</div>
								</div>
							</div>
						</div>
						
						<p class="text-gray-600 dark:text-gray-400">
							For detailed feedback on your writing, consider our personalised assessment service.
						</p>
					</div>
					
					<div class="space-x-4">
						<button
							onclick={() => window.location.reload()}
							class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg"
						>
							Retake Test
						</button>
						<button
							onclick={() => window.location.href = '/writing'}
							class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
						>
							Back to Writing
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Test Interface -->
		<div class="max-w-6xl mx-auto px-4">
			<!-- Timer and Navigation Header -->
			<div class="rounded-lg shadow-md p-4 mb-6 bg-white dark:bg-gray-800">
				<!-- Timer Display -->
				<div class="text-center mb-4">
					<div class="text-2xl font-bold text-teal-600 dark:text-teal-400">
						{formatTime(timeRemaining)}
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-300">Time Remaining</div>
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

				<!-- Test Type Selection -->
				<div class="flex justify-center gap-2 mb-4">
					<button
						onclick={() => switchTest('academic')}
						class="px-4 py-2 rounded-md font-medium transition-colors {currentTest === 'academic' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
					>
						Academic
					</button>
					<button
						onclick={() => switchTest('general')}
						class="px-4 py-2 rounded-md font-medium transition-colors {currentTest === 'general' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
					>
						General Training
					</button>
				</div>

				<!-- Task Navigation Buttons -->
				<div class="flex justify-center gap-2">
					{#each [1, 2] as task}
						<button
							onclick={() => goToTask(task)}
							class="px-4 py-2 rounded-md font-medium transition-colors {currentTask === task ? 'bg-teal-600 text-white' : 'bg-teal-50 text-gray-700 hover:bg-teal-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
						>
							Task {task}
						</button>
					{/each}
				</div>
			</div>

			<!-- Main Content Area -->
			<div class="pb-8">
				{#if currentTest === 'academic'}
					{#if currentTask === 1}
						<!-- Academic Task 1 -->
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
							<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{academicQuestions.task1.title}</h2>
								<div class="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
									<div class="text-center">
										<div class="font-semibold">Time Limit</div>
										<div>{academicQuestions.task1.timeLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Word Limit</div>
										<div>{academicQuestions.task1.wordLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Current Words</div>
										<div class="{countWords(answers['academic-task1']) >= 150 ? 'text-green-600' : 'text-red-600'}">{countWords(answers['academic-task1'])}</div>
									</div>
								</div>
							</div>

							<div class="space-y-6">
								<div class="border border-white/20 rounded-lg p-6 bg-gray-50/50 dark:bg-gray-700/50">
									<p class="text-lg text-gray-800 dark:text-gray-200 mb-4">{academicQuestions.task1.instruction}</p>
									<p class="font-semibold text-gray-900 dark:text-white mb-4">{academicQuestions.task1.task}</p>
									
									<div class="flex justify-center mb-6">
										<img 
											src={academicQuestions.task1.image} 
											alt={academicQuestions.task1.imageAlt}
											class="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
										/>
									</div>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Your Answer:
									</label>
									<textarea
										bind:value={answers['academic-task1']}
										placeholder="Write your Task 1 response here..."
										class="w-full max-w-[700px] h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white resize-none"
									></textarea>
								</div>
							</div>
						</div>
					{:else}
						<!-- Academic Task 2 -->
						<div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
							<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{academicQuestions.task2.title}</h2>
								<div class="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
									<div class="text-center">
										<div class="font-semibold">Time Limit</div>
										<div>{academicQuestions.task2.timeLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Word Limit</div>
										<div>{academicQuestions.task2.wordLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Current Words</div>
										<div class="{countWords(answers['academic-task2']) >= 250 ? 'text-green-600' : 'text-red-600'}">{countWords(answers['academic-task2'])}</div>
									</div>
								</div>
							</div>

							<div class="space-y-6">
								<div class="border border-white/20 rounded-lg p-6 bg-gray-50/50 dark:bg-gray-700/50">
									<p class="text-lg text-gray-800 dark:text-gray-200 mb-4">{academicQuestions.task2.instruction}</p>
									<p class="font-semibold text-gray-900 dark:text-white mb-4">{academicQuestions.task2.task}</p>
									<p class="text-gray-700 dark:text-gray-300 mb-6">{academicQuestions.task2.additionalInfo}</p>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Your Answer:
									</label>
									<textarea
										bind:value={answers['academic-task2']}
										placeholder="Write your Task 2 essay here..."
										class="w-full max-w-[700px] h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white resize-none"
									></textarea>
								</div>
							</div>
						</div>
					{/if}
				{:else}
					{#if currentTask === 1}
						<!-- General Training Task 1 -->
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
							<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{generalQuestions.task1.title}</h2>
								<div class="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
									<div class="text-center">
										<div class="font-semibold">Time Limit</div>
										<div>{generalQuestions.task1.timeLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Word Limit</div>
										<div>{generalQuestions.task1.wordLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Current Words</div>
										<div class="{countWords(answers['general-task1']) >= 150 ? 'text-green-600' : 'text-red-600'}">{countWords(answers['general-task1'])}</div>
									</div>
								</div>
							</div>

							<div class="space-y-6">
								<div class="border border-white/20 rounded-lg p-6 bg-gray-50/50 dark:bg-gray-700/50">
									<p class="text-lg text-gray-800 dark:text-gray-200 mb-4">{generalQuestions.task1.instruction}</p>
									<p class="font-semibold text-gray-900 dark:text-white mb-2">{generalQuestions.task1.task}</p>
									<ul class="text-gray-700 dark:text-gray-300 mb-4 space-y-1">
										{#each generalQuestions.task1.bulletPoints as point}
											<li>{point}</li>
										{/each}
									</ul>
									<p class="text-gray-700 dark:text-gray-300 mb-6">{generalQuestions.task1.additionalInfo}</p>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Your Answer:
									</label>
									<textarea
										bind:value={answers['general-task1']}
										placeholder="Write your letter here..."
										class="w-full max-w-[700px] h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white resize-none"
									></textarea>
								</div>
							</div>
						</div>
					{:else}
						<!-- General Training Task 2 -->
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
							<div class="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{generalQuestions.task2.title}</h2>
								<div class="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
									<div class="text-center">
										<div class="font-semibold">Time Limit</div>
										<div>{generalQuestions.task2.timeLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Word Limit</div>
										<div>{generalQuestions.task2.wordLimit}</div>
									</div>
									<div class="text-center">
										<div class="font-semibold">Current Words</div>
										<div class="{countWords(answers['general-task2']) >= 250 ? 'text-green-600' : 'text-red-600'}">{countWords(answers['general-task2'])}</div>
									</div>
								</div>
							</div>

							<div class="space-y-6">
								<div class="border border-white/20 rounded-lg p-6 bg-gray-50/50 dark:bg-gray-700/50">
									<p class="text-lg text-gray-800 dark:text-gray-200 mb-4">{generalQuestions.task2.instruction}</p>
									<p class="font-semibold text-gray-900 dark:text-white mb-4">{generalQuestions.task2.task}</p>
									<p class="text-gray-700 dark:text-gray-300 mb-6">{generalQuestions.task2.additionalInfo}</p>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Your Answer:
									</label>
									<textarea
										bind:value={answers['general-task2']}
										placeholder="Write your essay here..."
										class="w-full max-w-[700px] h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white resize-none"
									></textarea>
								</div>
							</div>
						</div>
					{/if}
				{/if}

				<!-- Complete Test Button -->
				{#if currentTask === 2}
					<div class="mt-6 flex justify-center">
						<button
							onclick={completeTest}
							class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
						>
							Complete Writing Test
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	textarea {
		font-family: 'Arial', sans-serif;
		line-height: 1.5;
	}
	
	textarea:focus {
		box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.1);
	}
</style>
