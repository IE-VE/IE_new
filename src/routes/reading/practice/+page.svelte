
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
	
	function startTest() {
		isTestStarted = true;
		showInstructions = false;
		startTimer();
	}
	
	function startTimer() {
		timer = setInterval(() => {
			timeRemaining--;
			if (timeRemaining <= 0) {
				completeTest();
			}
		}, 1000);
	}
	
	function completeTest() {
		isTestCompleted = true;
		clearInterval(timer);
		// Calculate and show results
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
									<div class="text-sm">Questions 1-13</div>
									<div class="text-sm text-gray-600 dark:text-gray-400">20 minutes recommended</div>
								</div>
								<div class="text-center">
									<div class="font-semibold">Passage 2</div>
									<div class="text-sm">Questions 14-26</div>
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
		<div class="flex h-screen">
			<!-- Timer and Navigation Sidebar -->
			<div class="w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
				<div class="text-center mb-6">
					<div class="text-2xl font-bold text-teal-600 dark:text-teal-400">
						{formatTime(timeRemaining)}
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Time Remaining</div>
				</div>
				
				<div class="space-y-4">
					<h3 class="font-semibold text-gray-900 dark:text-white">Sections</h3>
					<div class="space-y-2">
						{#each [1, 2, 3] as section}
							<button 
								onclick={() => goToSection(section)}
								class="w-full text-left p-3 rounded-lg transition-colors {currentSection === section ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
							>
								<div class="font-medium">Passage {section}</div>
								<div class="text-sm text-gray-600 dark:text-gray-400">
									{section === 1 ? 'Questions 1-13' : section === 2 ? 'Questions 14-26' : 'Questions 27-40'}
								</div>
							</button>
						{/each}
					</div>
				</div>
				
				<button 
					onclick={completeTest}
					class="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
				>
					Submit Test
				</button>
			</div>
			
			<!-- Main Content Area -->
			<div class="flex-1 overflow-y-auto">
				<div class="container mx-auto px-6 py-8">
					{#if currentSection === 1}
						<!-- Reading Passage 1 -->
						<div class="max-w-4xl mx-auto">
							<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reading Passage 1</h2>
								<p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
									You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.
								</p>
								
								<div class="prose dark:prose-invert max-w-none mb-8">
									<h3 class="text-xl font-semibold mb-4">Children's Ideas About Rainforests</h3>
									
									<p>Adults and children are frequently confronted with statements about the alarming rate of loss of tropical rainforests. For example, one graphic illustration to which children might readily relate is the estimate that rainforests are being destroyed at a rate equivalent to one thousand football fields every forty minutes – about the duration of a normal classroom period. In the face of the frequent and often vivid media coverage, it is likely that children will have formed ideas about rainforests – what and where they are, why they are important, what endangers them – independent of any formal tuition. It is also possible that some of these ideas will be mistaken.</p>
									
									<p>Many studies have shown that children harbour misconceptions about 'pure', curriculum science. These misconceptions do not remain isolated but become incorporated into a multifaceted, but organised, conceptual framework, making it and the component ideas, some of which are erroneous, more robust but also accessible to modification. These ideas may be developed by children absorbing ideas through the popular media. Sometimes this information may be erroneous. It seems schools may not be providing an opportunity for children to re-express their ideas and so have them tested and refined by teachers and their peers.</p>
									
									<p>Despite the extensive coverage in the popular media of the destruction of rainforests, little formal information is available about children's ideas in this area. The aim of the research was to elicit children's scientific thinking about rainforests and to examine the ideas they have about them. A secondary aim was to investigate the possibility of promoting conceptual change.</p>
									
									<p>The study involved 96 children aged 9 to 16 from a middle-class suburban primary school. Children were grouped according to their age: 9-10 years (n=32), 11-12 years (n=32), and 13-16 years (n=32). All children were individually interviewed about their ideas about rainforests. The interviews were tape-recorded and transcribed.</p>
								</div>
								
								<div class="space-y-6">
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 1-8</h3>
									<p class="text-gray-700 dark:text-gray-300">Complete the sentences below. Choose <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>
									
									{#each Array(8) as _, i}
										<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
											<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{i + 1}. Rainforests are being destroyed at the same rate as __________ football fields every forty minutes.
											</label>
											<input 
												type="text" 
												bind:value={answers[i + 1]}
												onchange={(e) => updateAnswer(i + 1, e.target.value)}
												class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
												placeholder="Your answer"
											/>
										</div>
									{/each}
									
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 9-13</h3>
									<p class="text-gray-700 dark:text-gray-300">Do the following statements agree with the information given in Reading Passage 1? Write:</p>
									<ul class="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
										<li><strong>TRUE</strong> if the statement agrees with the information</li>
										<li><strong>FALSE</strong> if the statement contradicts the information</li>
										<li><strong>NOT GIVEN</strong> if there is no information on this</li>
									</ul>
									
									{#each Array(5) as _, i}
										<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
											<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{i + 9}. Children only learn about rainforests at school.
											</label>
											<select 
												bind:value={answers[i + 9]}
												onchange={(e) => updateAnswer(i + 9, e.target.value)}
												class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
											>
												<option value="">Select an answer</option>
												<option value="TRUE">TRUE</option>
												<option value="FALSE">FALSE</option>
												<option value="NOT GIVEN">NOT GIVEN</option>
											</select>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else if currentSection === 2}
						<!-- Reading Passage 2 -->
						<div class="max-w-4xl mx-auto">
							<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reading Passage 2</h2>
								<p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
									You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.
								</p>
								
								<div class="prose dark:prose-invert max-w-none mb-8">
									<h3 class="text-xl font-semibold mb-4">The Development of Museums</h3>
									
									<p>The word 'museum' comes from the Greek word 'mouseion', meaning a shrine to the nine Muses, the ancient Greek goddesses of the arts and sciences. Museums have existed in some form since ancient times, but the modern concept of the museum developed during the Renaissance when wealthy individuals began collecting objects of art, natural history, and scientific interest.</p>
									
									<p>In the 18th and 19th centuries, museums began to take on their modern form as public institutions dedicated to education and research. The British Museum, founded in 1753, was one of the first national museums open to the public. The Industrial Revolution and colonial expansion led to an explosion in museum collections as explorers and collectors brought back artifacts from around the world.</p>
									
									<p>Today's museums serve multiple functions: they preserve cultural heritage, conduct research, and educate the public. Modern museum practice emphasizes accessibility and community engagement, with many institutions developing interactive exhibits and digital resources to reach broader audiences.</p>
								</div>
								
								<div class="space-y-6">
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 14-20</h3>
									<p class="text-gray-700 dark:text-gray-300">Choose the correct letter, <strong>A, B, C or D</strong>.</p>
									
									{#each Array(7) as _, i}
										<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
											<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
												{i + 14}. The word 'museum' originally meant:
											</label>
											<div class="space-y-2">
												{#each ['A. a collection of objects', 'B. a shrine to the Muses', 'C. a place of learning', 'D. a public building'] as option}
													<label class="flex items-center">
														<input 
															type="radio" 
															name="q{i + 14}" 
															value={option.charAt(0)}
															onchange={(e) => updateAnswer(i + 14, e.target.value)}
															class="mr-2"
														/>
														<span class="text-gray-700 dark:text-gray-300">{option}</span>
													</label>
												{/each}
											</div>
										</div>
									{/each}
									
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 21-26</h3>
									<p class="text-gray-700 dark:text-gray-300">Complete the summary below. Choose <strong>NO MORE THAN THREE WORDS</strong> from the passage for each answer.</p>
									
									{#each Array(6) as _, i}
										<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
											<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{i + 21}. Museums began as private collections during the __________. 
											</label>
											<input 
												type="text" 
												bind:value={answers[i + 21]}
												onchange={(e) => updateAnswer(i + 21, e.target.value)}
												class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
												placeholder="Your answer"
											/>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else if currentSection === 3}
						<!-- Reading Passage 3 -->
						<div class="max-w-4xl mx-auto">
							<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
								<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reading Passage 3</h2>
								<p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
									You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.
								</p>
								
								<div class="prose dark:prose-invert max-w-none mb-8">
									<h3 class="text-xl font-semibold mb-4">The Impact of Artificial Intelligence</h3>
									
									<p>Artificial Intelligence (AI) has emerged as one of the most transformative technologies of the 21st century. From its humble beginnings in academic research laboratories, AI has rapidly evolved to become an integral part of many aspects of modern life, revolutionizing industries and changing the way we work, communicate, and solve problems.</p>
									
									<p>The current surge in AI development can be attributed to several factors: the exponential growth in computing power, the availability of vast amounts of data, and significant advances in machine learning algorithms. These developments have enabled AI systems to achieve remarkable performance in tasks that were once thought to be the exclusive domain of human intelligence.</p>
									
									<p>However, the rapid advancement of AI technology also raises important questions about its societal impact. While AI has the potential to solve many global challenges, it also presents risks that need to be carefully managed through appropriate governance and ethical frameworks.</p>
								</div>
								
								<div class="space-y-6">
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Questions 27-33</h3>
									<p class="text-gray-700 dark:text-gray-300">Match each heading with the correct paragraph. There are more headings than paragraphs.</p>
									
									<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
										<h4 class="font-semibold mb-2">List of Headings:</h4>
										<ol class="list-[upper-roman] list-inside space-y-1 text-sm">
											<li>The origins of AI technology</li>
											<li>Factors driving AI development</li>
											<li>Challenges and concerns</li>
											<li>Future predictions</li>
											<li>Economic implications</li>
											<li>Educational applications</li>
											<li>Healthcare innovations</li>
										</ol>
									</div>
									
									{#each Array(3) as _, i}
										<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
											<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{i + 27}. Paragraph {i + 1}
											</label>
											<select 
												bind:value={answers[i + 27]}
												onchange={(e) => updateAnswer(i + 27, e.target.value)}
												class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
											>
												<option value="">Select a heading</option>
												{#each ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as heading}
													<option value={heading}>{heading}</option>
												{/each}
											</select>
										</div>
									{/each}
									
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8">Questions 34-40</h3>
									<p class="text-gray-700 dark:text-gray-300">Answer the questions below. Choose <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> from the passage for each answer.</p>
									
									{#each Array(7) as _, i}
										<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
											<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{i + 34}. In which century has AI become most transformative?
											</label>
											<input 
												type="text" 
												bind:value={answers[i + 34]}
												onchange={(e) => updateAnswer(i + 34, e.target.value)}
												class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
												placeholder="Your answer"
											/>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
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
	
	.prose p {
		margin-bottom: 1rem;
	}
	
	/* Ensure proper spacing for questions */
	input[type="text"], select {
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	}
	
	input[type="text"]:focus, select:focus {
		box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.1);
	}
</style>
