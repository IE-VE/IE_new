<script lang="ts">
	import UpsellCard from '$lib/components/UpsellCard.svelte';
</script>

<div class="container mx-auto max-w-4xl p-6">
	<h1 class="mb-8 text-3xl font-bold">Upsell Card Component Demo</h1>

	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold">Default IETPP Upsell</h2>
		<UpsellCard />
	</section>

	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold">Custom Score Targets</h2>
		<UpsellCard userScore={5.5} targetScore={6.5} />
	</section>

	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold">Different Price Points</h2>
		<UpsellCard discountedPrice={6.99} originalPrice={14.99} />
	</section>

	<section class="mb-12">
		<h2 class="mb-4 text-xl font-semibold">No Special Offer</h2>
		<UpsellCard showSpecialOffer={false} />
	</section>

	<section>
		<h2 class="mb-4 text-xl font-semibold">Different Variant</h2>
		<UpsellCard variant="default" />
	</section>
</div>
