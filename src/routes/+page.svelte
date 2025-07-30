<script lang="ts">
	import { tracking } from '$lib/utils/analytics';
	import {
		Button,
		Listgroup,
		ListgroupItem,
		Card,
		Accordion,
		AccordionItem,
		Heading,
		P,
		List,
		Li
	} from 'flowbite-svelte';
	import {
		ArrowRight,
		Check,
		Clock,
		Clipboard,
		Zap,
		MicVocal,
		BarChart,
		Sparkles,
		Quote
	} from 'lucide-svelte';

	function handleStartTest() {
		tracking.startTest();
	}

	// FAQ items for accordion
	const faqItems = [
		{
			id: 1,
			title: 'How accurate is the assessment?',
			content:
				'Our AI is trained on thousands of real IELTS responses and calibrated by certified IELTS examiners. While no automated system is perfect, our assessments have shown to be within 0.5 bands of human examiner scores in over 90% of cases.'
		},
		{
			id: 2,
			title: 'Is my data private and secure?',
			content:
				"Absolutely. Your recordings are processed securely and are never shared with third parties. We don't require personal information to use the free test, and all data is handled according to strict privacy standards."
		},
		{
			id: 3,
			title: 'What if I need more help after the free test?',
			content:
				'The freetest is designed to give you a good idea of your starting point for improvement. For personal guidance on your IELTS journey you can sign up to the InsideIELTS Test Preparation Program: it\'s quick, efficient and focused on your personal needs.<br><br>(We can\'t be beaten on value either - check the price - you\'ll be pleasantly surprised!)<br><br>And if you are not <strong>100%</strong> satisfied with our service we will refund your payment in full at any time - no questions asked.'
		}
	];

	// Value props data
	const valueProps = [
		{
			title: 'AI-Powered Assessment',
			description: 'Get instant feedback trained on 1000+ real IELTS responses',
			icon: Clock
		},
		{
			title: 'Official IELTS Criteria',
			description: 'Feedback on all 4 assessment criteria - just like the real exam',
			icon: Clipboard
		},
		{
			title: 'Personalised Tips',
			description: 'Get customised practice exercises',
			icon: Zap
		}
	];

	// How it works steps
	const howItWorksSteps = [
		{
			emoji: '1️⃣',
			title: 'Record Your Answer',
			description: 'Speak for up to 45 seconds for each question',
			icon: MicVocal
		},
		{
			emoji: '2️⃣',
			title: 'Receive Your Feedback',
			description: 'Instant analysis of your speaking performance',
			icon: BarChart
		},
		{
			emoji: '3️⃣',
			title: 'Practise and Improve',
			description: 'Follow personalised tips to increase your score',
			icon: Sparkles
		}
	];

	// Testimonial data
	const testimonials = [
		{
			quote:
				'The feedback was spot-on! It helped me identify my weak points in pronunciation. After practising with the suggested exercises, I improved from Band 6 to 7.5!',
			author: 'Priya from India'
		},
		{
			quote:
				'Finally, a tool that gives instant, accurate feedback! The personalised tips helped me improve my fluency and grammar. I got Band 7 in speaking!',
			author: 'Mahendra from Indonesia'
		}
	];
</script>

<div class="container mx-auto px-6 py-12">
	<h1 class="mb-8 text-center text-4xl font-bold text-teal-600 dark:text-teal-400">
		InsideIELTS: Complete IELTS Preparation
	</h1>

	<p class="mb-10 text-center text-lg">
		Comprehensive training for all IELTS skills with AI-powered feedback.
	</p>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Speaking -->
		<a
			href="/freetest"
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h2 class="mb-2 text-xl font-bold text-teal-600 dark:text-teal-400">Speaking</h2>
			<p class="text-gray-600 dark:text-gray-300">
				Take our free AI-powered test and get instant feedback on your speaking skills.
			</p>
			<div class="mt-4 text-sm font-medium text-teal-600 dark:text-teal-400">Try Free Test →</div>
		</a>

		<!-- Writing -->
		<a
			href="/writing/practice"
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h2 class="mb-2 text-xl font-bold text-teal-600 dark:text-teal-400">Writing</h2>
			<p class="text-gray-600 dark:text-gray-300">
				Sharpen your essay and report writing with targeted exercises and feedback.
			</p>
			<div class="mt-4 text-sm font-medium text-teal-600 dark:text-teal-400">Explore Writing →</div>
		</a>

		<!-- Reading -->
		<a
			href="/reading/practice"
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h2 class="mb-2 text-xl font-bold text-teal-600 dark:text-teal-400">Reading</h2>
			<p class="text-gray-600 dark:text-gray-300">
				Boost your comprehension with authentic IELTS-style texts and questions.
			</p>
			<div class="mt-4 text-sm font-medium text-teal-600 dark:text-teal-400">Start Reading →</div>
		</a>

		<!-- Listening -->
		<a
			href="/listening"
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h2 class="mb-2 text-xl font-bold text-teal-600 dark:text-teal-400">Listening</h2>
			<p class="text-gray-600 dark:text-gray-300">
				Train your ear with real audio samples and interactive tasks.
			</p>
			<div class="mt-4 text-sm font-medium text-teal-600 dark:text-teal-400">Listen & Learn →</div>
		</a>
	</div>
</div>

<!-- Hero Section -->
<section
	class="relative bg-gradient-to-br from-teal-100 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
>
	<div class="absolute inset-0 bg-gradient-to-tr from-teal-200/20 to-transparent"></div>
	<div class="relative container mx-auto px-6 py-16 md:py-24">
		<div class="flex flex-col items-center md:flex-row">
			<div class="mb-10 w-full text-center md:mb-0 md:w-3/5 md:text-left">
				<Heading tag="h1">
					Know your IELTS Band Score in <span class="text-teal-600 dark:text-teal-400"
						>under 3 minutes</span
					>
				</Heading>

				<P size="xl" class="mt-4">
					Get instant expert feedback on your speaking skills, based on official IELTS criteria.<br
					/>
					<strong>No registration needed!</strong>
				</P>

				<List tag="ul" class="mt-6">
					<Li icon>
						<Check class="mr-2 h-5 w-5 text-teal-600 dark:text-teal-400" />
						Detailed band score breakdown across all 4 criteria
					</Li>
					<Li icon>
						<Check class="mr-2 h-5 w-5 text-teal-600 dark:text-teal-400" />
						Personalised improvement tips from IELTS experts
					</Li>
					<Li icon>
						<Check class="mr-2 h-5 w-5 text-teal-600 dark:text-teal-400" />
						Identify your key areas of weakness
					</Li>
				</List>

				<div
					class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start"
				>
					<Button
						href="/record"
						onclick={handleStartTest}
						color="primary"
						class="shadow-lg"
						size="lg"
					>
						Get My Speaking Score Now
						<ArrowRight class="ml-2 h-5 w-5" />
					</Button>

					<div class="flex items-center">
						<svg
							class="mr-1 h-4 w-4 text-teal-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<P size="sm">100% private - no account needed</P>
					</div>
				</div>
			</div>

			<div class="w-full md:w-2/5">
				<div class="relative mx-auto max-w-sm">
					<div
						class="absolute inset-0 rotate-3 transform rounded-lg bg-teal-600 dark:bg-teal-500"
					></div>
					<Card class="relative shadow-lg">
						<div class="mb-6 text-center">
							<div
								class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-800"
							>
								<svg
									class="h-8 w-8 text-teal-600 dark:text-teal-300"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
									/>
								</svg>
							</div>
							<Heading tag="h4">IELTS Speaking Test</Heading>
							<P class="text-center">Free assessment in minutes</P>
						</div>

						<List tag="ul" class="mb-6 space-y-3">
							<Li icon>
								<Check class="mt-0.5 mr-2 h-5 w-5 text-teal-600 dark:text-teal-300" />
								Answer 3 speaking questions
							</Li>
							<Li icon>
								<Check class="mt-0.5 mr-2 h-5 w-5 text-teal-600 dark:text-teal-300" />
								Get your band score instantly
							</Li>
							<Li icon>
								<Check class="mt-0.5 mr-2 h-5 w-5 text-teal-600 dark:text-teal-300" />
								Receive personalised feedback
							</Li>
						</List>

						<Button href="/record" onclick={handleStartTest} color="primary">
							Start Free Test
						</Button>
					</Card>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Value Props -->
<section class="relative py-16">
	<div
		class="absolute inset-0 bg-gradient-to-tr from-teal-50/20 via-transparent to-blue-50/20 dark:from-teal-900/10 dark:via-transparent dark:to-blue-900/10"
	></div>
	<div class="relative container mx-auto px-6">
		<div class="mb-12 text-center">
			<P class="mb-2 text-center text-sm font-semibold text-teal-600 dark:text-teal-400"
				>WHY WE'RE DIFFERENT</P
			>
			<Heading tag="h2">Why Choose Our Free Test</Heading>
			<div class="mx-auto mt-4 h-1 w-24 rounded-full bg-teal-500/40"></div>
			<P class="mt-6 text-center">Expert features to help you succeed</P>
		</div>
		<div class="grid place-items-center gap-8 md:grid-cols-3">
			{#each valueProps as prop}
				<Card>
					<div class="flex flex-col items-center">
						<div
							class="icon-container icon-pulse mb-6 rounded-full bg-teal-100 p-5 dark:bg-teal-900"
						>
							<svelte:component this={prop.icon} class="h-8 w-8 text-teal-600 dark:text-teal-400" />
						</div>
						<Heading tag="h4" class="mb-2 text-center">{prop.title}</Heading>
						<div class="mx-auto mb-4 h-1 w-12 rounded-full bg-teal-500/40"></div>
						<P class="text-center">{prop.description}</P>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Expert Section -->
<section class="relative flex items-center justify-center py-14">
	<div
		class="absolute inset-0 bg-gradient-to-b bg-gradient-to-tr from-gray-50 from-teal-100/20 via-blue-50/10 to-gray-100 to-transparent dark:from-gray-800 dark:from-teal-900/10 dark:via-transparent dark:to-gray-900 dark:to-transparent"
	></div>
	<Card class="relative max-w-4xl">
		<div class="grid items-center gap-8 md:grid-cols-2">
			<div class="space-y-4">
				<Heading tag="h4">Meet Your IELTS Expert</Heading>
				<P>
					With 14 years as a qualified IELTS examiner, Alex has helped countless students achieve
					their desired band scores. His proven strategies and personalised guidance make
					InsideIELTS FreeTest a trusted resource for IELTS preparation.
				</P>
				<blockquote class="border-l-4 border-teal-500 pl-4 italic">
					"My mission is to help every student understand exactly where they stand and what they
					need to improve. No guesswork, just clear, actionable feedback."
				</blockquote>
			</div>
			<div class="flex justify-center">
				<picture>
					<source srcset="/alex-2.webp" type="image/webp" />
					<img
						src="/alex-2.jpg"
						alt="Alex - IELTS Speaking Expert"
						class="h-64 w-64 rounded-full object-cover shadow-lg"
						loading="lazy"
						width="256"
						height="256"
					/>
				</picture>
			</div>
		</div>
	</Card>
</section>

<!-- Social Proof -->
<section class="section-divider relative overflow-hidden py-16">
	<div class="container">
		<div class="mx-auto max-w-4xl">
			<div class="mb-8 text-center">
				<P class="mb-2 text-center text-sm font-semibold text-teal-600 dark:text-teal-400"
					>TRUSTED BY IELTS TEST-TAKERS</P
				>
				<Heading tag="h2" class="mt-2">Real Results from Real Students</Heading>
			</div>
			<div class="grid place-items-center gap-6 md:grid-cols-2">
				{#each testimonials as testimonial}
					<Card class="max-w-md">
						<div class="flex items-start">
							<Quote class="mr-2 h-8 w-8 flex-shrink-0 text-teal-600" />
							<div>
								<P class="mb-4 text-lg">"{testimonial.quote}"</P>
								<P class="text-sm font-medium text-teal-600 dark:text-teal-400">
									— {testimonial.author}
								</P>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- How It Works -->
<section id="how-it-works" class="section-divider relative overflow-hidden py-16">
	<div
		class="absolute inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
	></div>
	<div class="absolute inset-0 bg-[url('/grid.svg')] opacity-5 mix-blend-soft-light"></div>
	<div class="relative container text-center">
		<P class="mb-2 text-center text-sm font-semibold text-teal-600 dark:text-teal-400"
			>SIMPLE PROCESS</P
		>
		<Heading tag="h2">How It Works</Heading>
		<div class="mx-auto mt-4 h-1 w-24 rounded-full bg-teal-500/40"></div>
		<P class="mt-6 text-center">Three simple steps to improve your speaking</P>

		<div class="mt-12 grid place-items-center gap-6 md:grid-cols-3">
			{#each howItWorksSteps as step, i}
				<Card class=" w-full max-w-sm text-center">
					<div class="-mr-6 -mb-6 text-right text-8xl font-bold text-teal-50 dark:text-teal-900/30">
						{i + 1}
					</div>

					<div class="-mt-8 flex flex-col items-center">
						<div
							class="icon-container icon-pulse mb-6 rounded-full bg-teal-100 p-5 dark:bg-teal-900"
						>
							<svelte:component this={step.icon} class="h-8 w-8 text-teal-600 dark:text-teal-400" />
						</div>
						<Heading tag="h3" class="mb-3 text-xl">
							{step.title}
						</Heading>
						<div class="mx-auto mb-4 h-1 w-12 rounded-full bg-teal-500/40"></div>
						<P class="text-center">{step.description}</P>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- FAQ Section for Objection Handling -->
<section
	class="section-divider relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 py-14 dark:from-gray-800 dark:to-gray-900"
>
	<div class="container">
		<div class="mb-10 text-center">
			<Heading tag="h2">Frequently Asked Questions</Heading>
			<P size="xl" class="mt-3 text-center">Everything you need to know about our free test</P>
		</div>
		<div class="container max-w-5xl">
			<Accordion>
				{#each faqItems as item}
					<AccordionItem>
						<span slot="header" class="text-lg font-semibold">
							{item.title}
						</span>
						<div class="mt-2 text-gray-500 dark:text-gray-400">
							{@html item.content}
						</div>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	</div>
</section>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.section-divider {
		position: relative;
	}

	.section-divider::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 10%;
		right: 10%;
		height: 1px;
		background: linear-gradient(to right, transparent, rgb(229, 231, 235), transparent);
	}

	:global(.dark) .section-divider::after {
		background: linear-gradient(to right, transparent, rgb(55, 65, 81), transparent);
	}

	/* Icon animations - keeping these for visual interest */
	.icon-container {
		position: relative;
		transition: transform 0.3s ease;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.6);
			opacity: 0;
		}
	}
</style>