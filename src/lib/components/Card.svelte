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
			card: 'border-primary-200 from-primary-50 to-primary-100 dark:border-primary-700 dark:from-primary-900/50 dark:to-primary-800/50',
			accent: 'from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-400'
		},
		greyscale: {
			card: 'border-gray-200 from-white to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-800',
			accent: 'from-gray-200 to-slate-300 dark:from-gray-600 dark:to-slate-700'
		},
		primary: {
			card: 'border-primary-300 from-primary-100 to-primary-50 dark:border-primary-600 dark:from-primary-800/40 dark:to-primary-900/40',
			accent: 'from-primary-500 to-primary-400 dark:from-primary-400 dark:to-primary-500'
		},
		secondary: {
			card: 'border-primary-200 from-primary-50 to-primary-100 dark:border-primary-700 dark:from-primary-900/20 dark:to-primary-800/20',
			accent: 'from-primary-400 to-primary-300 dark:from-primary-500 dark:to-primary-400'
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