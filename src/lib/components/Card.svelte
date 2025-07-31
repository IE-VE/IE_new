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

	type VariantType = 'default' | 'teal' | 'greyscale' | 'primary' | 'secondary';

	// Color scheme presets with classes for each variant
	const colorVariants = {
		default: {
			card: 'border-gray-200 from-white to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-800',
			accent: 'from-gray-200 to-slate-300 dark:from-gray-600 dark:to-slate-700'
		},
		teal: {
			card: 'border-teal-200 from-teal-50 to-emerald-50 dark:border-teal-800 dark:from-teal-950/50 dark:to-emerald-950/50',
			accent: 'from-teal-300 to-emerald-300 dark:from-teal-400 dark:to-emerald-400'
		},
		greyscale: {
			card: 'border-gray-200 from-white to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-800',
			accent: 'from-gray-200 to-slate-300 dark:from-gray-600 dark:to-slate-700'
		},
		primary: {
			card: 'border-teal-300 from-teal-100 to-teal-50 dark:border-teal-600 dark:from-teal-800/40 dark:to-teal-900/40',
			accent: 'from-teal-400 to-teal-300 dark:from-teal-500 dark:to-teal-400'
		},
		secondary: {
			card: 'border-teal-200 from-teal-50 to-emerald-50 dark:border-teal-700 dark:from-teal-900/20 dark:to-emerald-900/20',
			accent: 'from-teal-300 to-emerald-200 dark:from-teal-400 dark:to-emerald-300'
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