<script lang="ts">
	import Card from './Card.svelte';
	import { tracking } from '$lib/utils/analytics';

	// Defining variant type
	type VariantType = 'default' | 'teal' | 'greyscale' | 'notebook';

	// Props
	const {
		userScore = 6.0,
		targetScore = 7.0,
		discountedPrice = undefined,
		originalPrice = 9.99,
		showSpecialOffer = true,
		variant = 'teal',
		sessionId = '', // Add sessionId prop
		email = null // Add email prop
	} = $props<{
		userScore?: number;
		targetScore?: number;
		discountedPrice?: number;
		originalPrice?: number;
		showSpecialOffer?: boolean;
		variant?: VariantType;
		sessionId?: string;
		email?: string | null;
	}>();

	// Icon paths
	const rocketIconPath =
		'M9.315 7.584C12.195 3.883 16.693 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z';
	const clockIconPath =
		'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z';
	const starIconPath =
		'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z';

	// Define color scheme type
	type ColorScheme = {
		title: string;
		icon: {
			bg: string;
			text: string;
		};
		highlight: {
			bg: string;
			text: string;
		};
		starIcon: string;
		price: string;
		button: string;
	};

	// Color scheme for elements based on variant
	const variantColors: Record<VariantType, ColorScheme> = {
		default: {
			title: 'text-indigo-800 dark:text-indigo-300',
			icon: {
				bg: 'bg-indigo-100 dark:bg-indigo-900/50',
				text: 'text-indigo-600 dark:text-indigo-400'
			},
			highlight: {
				bg: 'bg-indigo-50 dark:bg-indigo-900/40',
				text: 'text-indigo-800 dark:text-indigo-300'
			},
			starIcon: 'text-indigo-500 dark:text-indigo-400',
			price: 'text-indigo-700 dark:text-indigo-400',
			button:
				'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500'
		},
		teal: {
			title: 'text-teal-800 dark:text-teal-300',
			icon: {
				bg: 'bg-teal-100 dark:bg-teal-900/50',
				text: 'text-teal-600 dark:text-teal-400'
			},
			highlight: {
				bg: 'bg-teal-50 dark:bg-teal-900/40',
				text: 'text-teal-800 dark:text-teal-300'
			},
			starIcon: 'text-teal-500 dark:text-teal-400',
			price: 'text-teal-700 dark:text-teal-400',
			button:
				'from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 dark:from-teal-600 dark:to-emerald-600 dark:hover:from-teal-500 dark:hover:to-emerald-500'
		},
		greyscale: {
			title: 'text-gray-800 dark:text-gray-200',
			icon: {
				bg: 'bg-gray-100 dark:bg-gray-700',
				text: 'text-gray-600 dark:text-gray-300'
			},
			highlight: {
				bg: 'bg-gray-50 dark:bg-gray-700',
				text: 'text-gray-800 dark:text-gray-200'
			},
			starIcon: 'text-gray-500 dark:text-gray-400',
			price: 'text-gray-700 dark:text-gray-300',
			button:
				'from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 dark:from-gray-600 dark:to-slate-600 dark:hover:from-gray-500 dark:hover:to-slate-500'
		},
		notebook: {
			title: 'text-amber-800 dark:text-amber-300',
			icon: {
				bg: 'bg-amber-100 dark:bg-amber-900/50',
				text: 'text-amber-600 dark:text-amber-400'
			},
			highlight: {
				bg: 'bg-amber-50 dark:bg-amber-900/40',
				text: 'text-amber-800 dark:text-amber-300'
			},
			starIcon: 'text-amber-500 dark:text-amber-400',
			price: 'text-amber-700 dark:text-amber-400',
			button:
				'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 dark:from-amber-600 dark:to-yellow-600 dark:hover:from-amber-500 dark:hover:to-yellow-500'
		}
	};

	// Get colors for the current variant
	const colors = variantColors[variant as VariantType];

	// Reactive state
	const limitedTimeLeft = $state(48); // hours

	// Format prices with 2 decimal places
	const formattedDiscountedPrice = $derived(discountedPrice?.toFixed(2));
	const formattedOriginalPrice = $derived(originalPrice.toFixed(2));

	// Calculate discount percentage only if discounted price exists
	const discountPercentage = $derived(
		discountedPrice ? Math.round((1 - discountedPrice / originalPrice) * 100) : 0
	);

	// Calculate score improvement
	const scoreImprovement = $derived(targetScore - userScore);

	// Handle purchase button click
	function handlePurchaseClick() {
		// Track the event using centralized analytics
		tracking.upsellCta(sessionId, userScore, targetScore, discountedPrice);

		// Navigate to purchase page with email parameter if available
		const purchaseUrl = email
			? `https://buy.stripe.com/3cseYM1U7ao58es4gh?prefilled_email=${encodeURIComponent(email)}`
			: 'https://buy.stripe.com/3cseYM1U7ao58es4gh';

		window.location.href = purchaseUrl;
	}
</script>

<Card {variant}>
	<div class="space-y-6">
		<!-- Header section -->
		<div class="flex items-start justify-between">
			<div>
				<h3 class="text-2xl font-bold {colors.title}">Achieve your full IELTS Potential.</h3>
				<p class="mt-1 text-lg text-gray-700 dark:text-gray-300">
					Our step-by-step program is your path to IELTS success.
				</p>
			</div>

			<!-- Icon -->
			<div class="hidden md:block">
				<div class="rounded-full {colors.icon.bg} p-3">
					<svg class="h-8 w-8 {colors.icon.text}" viewBox="0 0 24 24" fill="currentColor">
						<path d={rocketIconPath} />
					</svg>
				</div>
			</div>
		</div>

		<!-- Benefits -->
		<div class="rounded-lg bg-white p-4 dark:bg-gray-800">
			<h4 class="mb-4 font-semibold text-gray-800 dark:text-white">Package Benefits:</h4>
			<ul class="space-y-3">
				<li class="flex">
					<div
						class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50"
					>
						<svg
							class="h-4 w-4 text-teal-600 dark:text-teal-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="text-gray-700 dark:text-gray-300">
						Diagnostic Test and Final Test with real Part-1 IELTS Questions
					</div>
				</li>
				<li class="flex">
					<div
						class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50"
					>
						<svg
							class="h-4 w-4 text-teal-600 dark:text-teal-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="text-gray-700 dark:text-gray-300">
						Four easy-to-follow 40-minute Assesment Criteria lessons, designed specifically to
						target your personal areas of weakness.
					</div>
				</li>
				<li class="flex">
					<div
						class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50"
					>
						<svg
							class="h-4 w-4 text-teal-600 dark:text-teal-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="text-gray-700 dark:text-gray-300">
						Extra study activities and links to additional IELTS practice resources
					</div>
				</li>
				<li class="flex">
					<div
						class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50"
					>
						<svg
							class="h-4 w-4 text-teal-600 dark:text-teal-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="text-gray-700 dark:text-gray-300">
						Final Day Test analysis with feedback and IETPP progress summary.
					</div>
				</li>
				<li class="flex">
					<div
						class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50"
					>
						<svg
							class="h-4 w-4 text-teal-600 dark:text-teal-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="text-gray-700 dark:text-gray-300">
						Full E-mail and Chat access to qualified IE examiners for the duration of the 6 Day
						IETPP!
					</div>
				</li>
			</ul>
		</div>

		<!-- Outcome highlight -->
		<div class="rounded-lg {colors.highlight.bg} p-4">
			<p class="text-center text-lg font-medium {colors.highlight.text}">
				Achieve the Band Score you desire with the <span class="font-bold"
					>InsideIELTS Test Preparation Program</span
				>
			</p>
		</div>

		<!-- Social proof -->
		<div class="rounded-lg bg-white p-4 dark:bg-gray-800">
			<div class="flex space-x-1">
				<svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
					<path d={starIconPath} />
				</svg>
				<svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
					<path d={starIconPath} />
				</svg>
				<svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
					<path d={starIconPath} />
				</svg>
				<svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
					<path d={starIconPath} />
				</svg>
				<svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
					<path d={starIconPath} />
				</svg>
			</div>
			<p class="mt-2 text-gray-700 italic dark:text-gray-300">
				"“After completing the easy 6-day plan, my speaking improved by 1 full band! The daily
				criteria lessons were exactly what I needed to keep me focused and working towards my IELTS
				goals.”"
			</p>
			<p class="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
				— Mei L., achieved Band 7.5
			</p>
		</div>

		<!-- Pricing & CTA -->
		<div class="space-y-3">
			{#if showSpecialOffer && discountedPrice !== undefined}
				<div class="flex items-center space-x-2">
					<svg class="h-5 w-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
						<path d={clockIconPath} />
					</svg>
					<p class="font-medium text-rose-600 dark:text-rose-400">
						Limited time special offer - Save {discountPercentage}%!
					</p>
				</div>
			{/if}

			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-700 dark:text-gray-300">IETPP 6 Day plan:</p>
					<!-- <div class="flex items-center gap-2">
						<p class="text-2xl font-bold {colors.price}">
							${discountedPrice !== undefined ? formattedDiscountedPrice : formattedOriginalPrice}
						</p>
						{#if discountedPrice !== undefined}
							<p class="text-lg text-gray-500 line-through dark:text-gray-400">
								${formattedOriginalPrice}
							</p>
						{/if}
					</div> -->
				</div>
				<button
					class="rounded-lg bg-gradient-to-r {colors.button} px-8 py-4 text-xl font-bold text-white shadow-md transition-shadow duration-150 hover:shadow-lg"
					onclick={handlePurchaseClick}
				>
					${discountedPrice !== undefined ? formattedDiscountedPrice : formattedOriginalPrice}
				</button>
			</div>
		</div>

		<!-- Guarantee -->
		<div class="rounded-lg bg-white p-4 dark:bg-gray-800">
			<div class="flex items-start">
				<svg
					class="mr-2 h-5 w-5 text-teal-600 dark:text-teal-400"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<p class="text-gray-700 dark:text-gray-300">
					<strong>100% Satisfaction Guarantee:</strong> See your score improve or get your money back.
				</p>
			</div>
		</div>
	</div>
</Card>
