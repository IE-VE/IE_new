
<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	const taskOneGTQuestions = [
		{
			title: 'Complaint Letter',
			description: 'Write a letter to complain about a service or product',
			icon: '📋',
			image: '/writing-images/ielts-writing-test-1-general-complaint.png'
		},
		{
			title: 'Letter to Inform',
			description: 'Write a letter to inform someone about a situation',
			icon: '📝',
			image: '/writing-images/ielts-writing-test-1-general-inform.png'
		},
		{
			title: 'Request Letter',
			description: 'Write a letter to request information or assistance',
			icon: '❓',
			image: '/writing-images/ielts-writing-test-1-general-request.png'
		}
	];

	const taskOneAcQuestions = [
		{
			title: 'Line Graph',
			description: 'Describe trends and changes over time',
			icon: '📈',
			image: '/writing-images/ielts-writing-test-1-line-graph.png'
		},
		{
			title: 'Table (i)',
			description: 'Compare data presented in table format',
			icon: '📊',
			image: '/writing-images/ielts-writing-test-1-table.png'
		},
		{
			title: 'Table (ii)',
			description: 'Analyze numerical information in tables',
			icon: '📋',
			image: '/writing-images/ielts-writing-test-1-table-2.png'
		},
		{
			title: 'Table (iii)',
			description: 'Report on statistical data',
			icon: '📄',
			image: '/writing-images/ielts-writing-test-1-table-3.png'
		},
		{
			title: 'Pie Chart',
			description: 'Describe proportions and percentages',
			icon: '🥧',
			image: '/writing-images/ielts-writing-test-1-pie-chart.png'
		},
		{
			title: 'Bar Chart (i)',
			description: 'Compare quantities across categories',
			icon: '📊',
			image: '/writing-images/ielts-writing-test-1-bar-chart.png'
		},
		{
			title: 'Bar Chart (ii)',
			description: 'Analyze comparative data',
			icon: '📈',
			image: '/writing-images/ielts-writing-test-1-bar-chart-2.png'
		},
		{
			title: 'Combined Table & Line Graph',
			description: 'Report on multiple data sources',
			icon: '📊',
			image: '/writing-images/ielts-writing-test-1-combined.png'
		},
		{
			title: 'Combined Pie Chart & Table',
			description: 'Synthesize information from different formats',
			icon: '📋',
			image: '/writing-images/ielts-writing-test-1-combined_2.png'
		},
		{
			title: 'Process Diagram',
			description: 'Explain how something works or is made',
			icon: '🔄',
			image: '/writing-images/ielts-writing-test-1-process.png'
		},
		{
			title: 'Map',
			description: 'Describe changes in location over time',
			icon: '🗺️',
			image: '/writing-images/ielts-writing-test-1-map.png'
		}
	];

	const taskTwoQuestions = [
		{
			title: 'Agree/Disagree',
			description: 'Present your opinion on a statement',
			icon: '💭',
			image: '/writing-images/ielts-writing-test-2-agree_disagree.png'
		},
		{
			title: 'Discuss',
			description: 'Examine both sides of an issue',
			icon: '🤔',
			image: '/writing-images/ielts-writing-test-2-discuss.png'
		},
		{
			title: 'Evaluate',
			description: 'Assess advantages and disadvantages',
			icon: '⚖️',
			image: '/writing-images/ielts-writing-test-2-evaluate.png'
		}
	];

	const assessmentCriteria = [
		{
			name: 'Task Achievement (T1) / Task Response (T2)',
			description: 'How well you address the requirements of the task',
			weight: '25%'
		},
		{
			name: 'Coherence & Cohesion',
			description: 'Organization of ideas and clarity of presentation',
			weight: '25%'
		},
		{
			name: 'Lexical Resource',
			description: 'Range and accuracy of vocabulary',
			weight: '25%'
		},
		{
			name: 'Grammatical Range & Accuracy',
			description: 'Variety and correctness of grammatical structures',
			weight: '25%'
		}
	];
</script>

<svelte:head>
	<title>IELTS Writing Practice - InsideIELTS</title>
	<meta name="description" content="Practice IELTS Writing with our comprehensive test materials. Master both Task 1 and Task 2 with authentic test questions and detailed feedback." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto max-w-6xl px-6 py-8">
		<!-- Header Section -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				IELTS WRITING
			</h1>
			<div class="max-w-6xl mx-auto px-6">
				<p class="text-xl text-gray-600 dark:text-gray-300 text-center py-4 mb-8">
					The Writing Test is the third paper you will take on test day. It is split into two parts: Task 1 and Task 2.
				</p>
			</div>
		</div>

		<!-- Test Overview -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Format
				</h2>
				<p class="text-left mb-4 text-xl">You have 60 minutes to complete both tasks. Task 1 is worth one-third of the marks, and Task 2 is worth two-thirds, so you should spend approximately 20 minutes on Task 1 and 40 minutes on Task 2.
				</p>
				<div class="grid md:grid-cols-3 gap-6 text-center">
					<div>
						<div class="text-3xl font-bold text-primary-600 dark:text-primary-400">60 min</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Total Duration</div>
					</div>
					<div>
						<div class="text-3xl font-bold text-primary-600 dark:text-primary-400">2</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Tasks</div>
					</div>
					<div>
						<div class="text-3xl font-bold text-primary-600 dark:text-primary-400">400+</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">Total Words</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Task 1 General Training -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Task 1 (General Training)
				</h2>
				<p class="text-left mb-4 text-xl">The Task 1 writing exercise for the <b>General Training</b> module is a <b>letter</b>. The topics are centered around everyday situations and usually require you to request or convey information, express thanks, or make a suggestion or complaint in writing.
				</p>
				<p class="text-left mb-6 text-xl">The question will ask you to <b><i>"Write a letter to..."</i></b>, and then give you three bullet points that you must cover in your letter.
				</p>
				<div class="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
					{#each taskOneGTQuestions as type}
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
				<p class="mt-6 mb-2 text-xl"><b>Task 1</b> is worth one-third of the available marks for the writing section, so you should aim to spend around <b>20 minutes</b> on this task.
				</p>
			</Card>
		</div>

		<!-- Task 1 Academic -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Task 1 (Academic)
				</h2>
				<p class="text-left mb-4 text-xl">The <b>Task 1 Academic</b> writing exercise is in the form of a <b>report</b>. You may be asked to report on a line graph, bar chart, table, pie chart, map or process diagram. Sometimes the question may combine these elements.
				</p>
				<p class="text-left mb-6 text-xl">The question will ask you to: <i><b>"Summarise the information by selecting and reporting the main features, and make comparisons where relevant."</b></i>
				</p>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each taskOneAcQuestions as type}
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
				<p class="mt-6 mb-2 text-xl"><b>Task 1</b> is worth one-third of the available marks for the writing section, so you should aim to spend around <b>20 minutes</b> on this task.
				</p>
			</Card>
		</div>

		<!-- Task 2 -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Task 2
				</h2>
				<p class="text-left mb-4 text-xl">The <b>Task 2</b> general and academic writing exercise is a <b>250 word discursive essay</b>. The question will be in the form of a topic statement followed by a question.
				</p>
				<p class="text-left mb-4 text-xl">You will be assessed on your ability to present and justify an opinion; present a solution to a problem; compare and contrast evidence and opinions; and evaluate and challenge ideas, evidence and arguments.
				</p>
				<p class="text-left mb-6 text-xl">The task will give you a direct instruction relating to the topic and then ask you to: <i><b>"Give reasons for your answer and include any relevant examples from your own knowledge or experience."</b></i>
				</p>
				<div class="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
					{#each taskTwoQuestions as type}
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
				<p class="mt-6 mb-2 text-xl">You should aim to spend around <b>40 minutes</b> on <b>Task 2</b>.
				</p>
			</Card>
		</div>

		<!-- Assessment Criteria -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Assessment Criteria
				</h2>
				<p class="text-left mb-4 text-xl">The <b>Writing Test</b> is assessed using four criteria, each worth equal marks. You must demonstrate all the descriptors at a particular band level to achieve that score.
				</p>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Four Assessment Criteria</h3>
						<div class="space-y-3">
							{#each assessmentCriteria as criterion}
								<div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
									<div class="flex justify-between items-center mb-1">
										<span class="font-medium text-gray-900 dark:text-white text-sm">{criterion.name}</span>
										<span class="text-primary-600 dark:text-primary-400 font-medium text-sm">{criterion.weight}</span>
									</div>
									<p class="text-xs text-gray-600 dark:text-gray-300">{criterion.description}</p>
								</div>
							{/each}
						</div>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Key Success Factors</h3>
						<ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
							<li>• Address all parts of the task completely</li>
							<li>• Organize ideas logically with clear paragraphs</li>
							<li>• Use a wide range of vocabulary accurately</li>
							<li>• Demonstrate varied sentence structures</li>
							<li>• Support ideas with relevant examples</li>
							<li>• Maintain appropriate tone and register</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>

		<!-- Important Notes -->
		<div class="mb-12">
			<Card variant="secondary">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
					Important Guidelines
				</h2>
				<div class="space-y-4 text-xl">
					<p class="text-left">The writing task is often the part of the IELTS test in which candidates score lowest. The key to achieving the band score you need is to:</p>
					<ul class="text-left text-lg text-gray-600 dark:text-gray-300 space-y-2 ml-6">
						<li>• Clearly understand the requirements of each task</li>
						<li>• Be familiar with the IELTS writing assessment criteria</li>
						<li>• Develop a clear, well-practiced essay writing technique</li>
						<li>• Manage your time effectively between both tasks</li>
						<li>• Practice different question types regularly</li>
					</ul>
				</div>
			</Card>
		</div>

		<!-- Call to Action -->
		<div class="text-center">
			<div class="bg-gray-900 border-2 border-teal-600 border-t-12 border-t-teal-300 rounded-lg p-8 shadow-lg">
				<h2 class="text-2xl font-semibold text-white mb-6 text-center">
					Ready to Start Practicing?
				</h2>
				<p class="text-gray-300 mb-6 text-xl">
					Take our complete IELTS Writing practice test with authentic Task 1 and Task 2 questions.
				</p>
				<a 
					href="/writing/practice"
					class="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
				>
					Start Practice Test Now
				</a>
			</div>
		</div>
	</div>
</div>
