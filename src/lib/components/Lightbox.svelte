
<script lang="ts">
	import { onMount } from 'svelte';
	
	let { 
		src, 
		alt, 
		className = '', 
		maxWidth = '90vw', 
		maxHeight = '90vh' 
	} = $props<{
		src: string;
		alt: string;
		className?: string;
		maxWidth?: string;
		maxHeight?: string;
	}>();
	
	let showLightbox = $state(false);
	let lightboxElement: HTMLDivElement;
	
	function openLightbox() {
		showLightbox = true;
		document.body.style.overflow = 'hidden';
	}
	
	function closeLightbox() {
		showLightbox = false;
		document.body.style.overflow = 'auto';
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeLightbox();
		}
	}
	
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === lightboxElement) {
			closeLightbox();
		}
	}
	
	onMount(() => {
		return () => {
			document.body.style.overflow = 'auto';
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Thumbnail image -->
<img 
	{src} 
	{alt}
	class="cursor-pointer hover:opacity-80 transition-opacity {className}"
	onclick={openLightbox}
	loading="lazy"
/>

<!-- Lightbox overlay -->
{#if showLightbox}
	<div 
		bind:this={lightboxElement}
		class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
		onclick={handleBackdropClick}
	>
		<div class="relative max-w-full max-h-full">
			<!-- Close button -->
			<button 
				class="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl font-bold z-10"
				onclick={closeLightbox}
				aria-label="Close lightbox"
			>
				×
			</button>
			
			<!-- Enlarged image -->
			<img 
				{src} 
				{alt}
				class="max-w-full max-h-full object-contain"
				style="max-width: {maxWidth}; max-height: {maxHeight};"
			/>
		</div>
	</div>
{/if}

<style>
	:global(body.lightbox-open) {
		overflow: hidden;
	}
</style>
