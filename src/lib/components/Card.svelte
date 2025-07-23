<script lang="ts">
	// Props for the Card component - simplified to only provide styling container
	// variant: Preset color scheme (default, teal, greyscale)
	// gradientColors: Custom colors for the gradient background and accent bar (overrides variant)

	type ColorScheme = {
		from: string;
		to: string;
		accent1: string;
		accent2: string;
	};

	type VariantType = 'default' | 'teal' | 'greyscale' | 'notebook';

	// Color scheme presets with classes for each variant
	const colorVariants = {
		default: {
			card: 'border-indigo-200 from-indigo-50 to-purple-50 dark:border-indigo-800 dark:from-indigo-950/50 dark:to-purple-950/50',
			accent: 'from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400'
		},
		teal: {
			card: 'border-teal-200 from-teal-50 to-emerald-50 dark:border-teal-800 dark:from-teal-950/50 dark:to-emerald-950/50',
			accent: 'from-teal-300 to-emerald-300 dark:from-teal-400 dark:to-emerald-400'
		},
		greyscale: {
			card: 'border-gray-200 from-white to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-800',
			accent: 'from-gray-200 to-slate-300 dark:from-gray-600 dark:to-slate-700'
		},
		notebook: {
			card: 'border-amber-200 from-[#fff5e9] to-[#fffdf7] dark:border-amber-800 dark:from-amber-950/30 dark:to-amber-900/20',
			accent: 'from-amber-300 to-yellow-200 dark:from-amber-500 dark:to-yellow-400'
		}
	};

	const { variant = 'default', children } = $props<{
		variant?: VariantType;
		children: any;
	}>();

	// Get classes directly from the colorVariants object
	const selectedVariant = colorVariants[variant as VariantType] || colorVariants.default;
	const cardClasses = selectedVariant.card;
	const accentClasses = selectedVariant.accent;
</script>

<div
	class="relative rounded-xl border bg-gradient-to-br p-6 pt-8 shadow-lg dark:shadow-xl {cardClasses}"
>
	<!-- Top accent bar - increased height for visibility -->
	<div class="absolute top-0 left-0 h-4 w-full rounded-t-xl bg-gradient-to-r {accentClasses}"></div>

	<!-- Content using new render syntax for Svelte 5 runes mode -->
	{@render children()}
</div>
