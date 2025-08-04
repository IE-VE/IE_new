<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	const questionTypes = [
		{
			title: 'Matching Headings',
			description: 'Match headings to paragraphs or section',
			icon: '📋',
			image: '/reading-images/ielts-reading-headings.png'
		},
		{
			title: 'Matching Paragraph Information',
			description: 'Match information to specific paragraphs',
			icon: '🔗',
			image: '/reading-images/ielts-reading-matching.png'
		},
		{
			title: 'Matching Features',
			description: 'Match statements to people, theories, or events',
			icon: '🎯',
			image: '/reading-images/ielts-reading-features.png'
		},
		{
			title: 'Matching Sentence Endings',
			description: 'Complete sentences by choosing correct endings',
			icon: '🔚',
			image: '/reading-images/ielts-reading-endings.png'
		},
		{
			title: 'True False Not Given or Yes No Not Given',
			description: 'Identify if statements are true, false, or not given',
			icon: '🔍',
			image: '/reading-images/ielts-reading-true-false.png'
		},
		{
			title: 'Multiple Choice',
			description: 'Choose the correct answer from several options',
			icon: '✅',
			image: '/reading-images/ielts-reading-multiple-choice.png'
		},
		{
			title: 'List of Options',
			description: 'Select multiple correct answers from a list',
			icon: '📝',
			image: '/reading-images/ielts-reading-list-options.png'
		},
		{
			title: 'Choose a Title',
			description: 'Select the most appropriate title for the passage',
			icon: '🏷️',
			image: '/reading-images/ielts-reading-title.png'
		},
		{
			title: 'Short Answers',
			description: 'Answer questions with words from the text',
			icon: '❓',
			image: '/reading-images/ielts-reading-short-answer.png'
		},
		{
			title: 'Sentence/Summary Completion',
			description: 'Complete sentences or summaries with words from the text',
			icon: '📄',
			image: '/reading-images/ielts-reading-completion.png'
		},
		{
			title: 'Table Completion',
			description: 'Fill in missing information in tables',
			icon: '📊',
			image: '/reading-images/ielts-reading-table.png'
		},
		{
			title: 'Flow Chart/Diagram Completion',
			description: 'Complete flow charts or diagrams with information from the text',
			icon: '🗺️',
			image: '/reading-images/ielts-reading-diagram.png'
		}
	];

	const testSections = [
		{
			section: 'Passage 1',
			description: 'General interest topic with everyday language',
			questions: '13-14 questions',
			difficulty: 'Easier'
		},
		{
			section: 'Passage 2',
			description: 'Work-related or general academic topic',
			questions: '13-14 questions',
			difficulty: 'Medium'
		},
		{
			section: 'Passage 3',
			description: 'Academic topic with complex language',
			questions: '13-14 questions',
			difficulty: 'Harder'
		}
	];
</script>

<svelte:head>
	<title>IELTS Reading Practice - InsideIELTS</title>
	<meta name="description" content="Practice IELTS Reading with our comprehensive test materials. Improve your reading skills with authentic test passages and detailed feedback." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto px-6 py-8">
		<!-- Header Section -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				IELTS READING
			</h1>
			<div class="max-w-6xl mx-auto px-6">
				<p class="text-xl text-gray-600 dark:text-gray-300 text-center py-4 mb-8">
					The Reading Test consists of three passages of increasing difficulty with a total of 14 question types.
				</p>
			</div>
		</div>

		<!-- Test Overview -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Format
				</h2>
				<p class="text-left mb-4 text-xl">You have 60 minutes to read three passages and answer 40 questions. There is no extra time to transfer your answers, so you must write them directly on the answer sheet as you work through the test.
				</p>
				<div class="grid md:grid-cols-3 gap-6 text-center">
					<div>
						<div class="text-3xl font-bold text-primary-600 dark:text-primary-400">60 min</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Total Duration</div>
					</div>
					<div>
						<div class="text-3xl font-bold text-primary-600 dark:text-primary-400">3</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Passages</div>
					</div>
					<div>
						<div class="text-3xl font-bold text-primary-600 dark:text-gray-300">40</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Questions</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Test Sections -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Test Structure
				</h2>
				<p class="text-left mb-4 text-xl">The Reading Test has <b>three passages</b> of increasing difficulty. Each passage is followed by <b>13-14 questions</b> testing different reading skills.
				</p>
				<div class="grid md:grid-cols-3 gap-6">
					{#each testSections as section}
						<div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{section.section}</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{section.description}</p>
							<div class="text-xs text-gray-500 dark:text-gray-400">
								<div>{section.questions}</div>
								<div class="font-medium text-primary-600 dark:text-primary-400">{section.difficulty}</div>
							</div>
						</div>
					{/each}
				</div>
			</Card>
		</div>

		<!-- Assessment Criteria -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Assessment Criteria
				</h2>
				<p class="text-left mb-4 text-xl">The <b>Reading Test</b> is scored using a system that may slightly vary with 
					each <b>IELTS</b> test. Band cut-offs are set after global results are analysed. Approximate scores are:
				</p>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Band Score Targets</h3>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 9:</span>
								<span class="font-medium text-gray-900 dark:text-white">39-40 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 8:</span>
								<span class="font-medium text-gray-900 dark:text-white">36-38 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 7:</span>
								<span class="font-medium text-gray-900 dark:text-white">30-35 correct</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-300">Band 6:</span>
								<span class="font-medium text-gray-900 dark:text-white">23-29 correct</span>
							</div>
						</div>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Key Skills Tested</h3>
						<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
							<li>• Reading for main ideas and supporting details</li>
							<li>• Understanding logical argument and cause & effect</li>
							<li>• Recognising writers' views, attitudes and purpose</li>
							<li>• Following development of ideas, opinions and events</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>

		<!-- Question Types -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Question Types
				</h2>
				<p class="text-left mb-4 text-xl">There are <b>14</b> types of reading questions. All questions are worth <b>1 mark</b> and there will usually be three to four different question types within each section:</p>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each questionTypes as type}
						<div class="text-center">
							<div class="text-2xl mb-3">{type.icon}</div>
							<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{type.title}</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{type.description}</p>
							<div class="mt-4">
								<Lightbox 
									src={type.image} 
									alt="{type.title} example"
									className="w-full h-auto max-h-48 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
								/>
							</div>
						</div>
					{/each}
				</div>
				<p class="mt-6 mb-2 text-xl">It's very important that you carefully read the instructions for each question type and follow the word limits exactly. Always check how many words you can use in your answer.</p>
			</Card>
		</div>

		<!-- Call to Action -->
		<div class="text-center">
			<div class="bg-gray-900 border-2 border-teal-600 border-t-12 border-t-teal-300 rounded-lg p-8 shadow-lg">
				<h2 class="text-2xl font-semibold text-white mb-6 text-center">
					Ready to Start Practicing?
				</h2>
				<p class="text-gray-300 mb-6 text-xl">
					Take our complete IELTS Reading practice test with authentic passages and questions.
				</p>
				<a 
					href="/reading/practice"
					class="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
				>
					Start Practice Test Now
				</a>
			</div>
		</div>
	</div>
</div>