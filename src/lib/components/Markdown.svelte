<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	/**
	 * The markdown content to be rendered
	 */
	const { content = '', className = '' } = $props();

	let htmlContent = $state('');

	// Process the markdown whenever the content changes
	$effect(() => {
		if (content) {
			// Convert markdown to HTML and sanitize
			const result = marked.parse(content);
			if (result instanceof Promise) {
				result.then((html) => {
					htmlContent = DOMPurify.sanitize(html);
				});
			} else {
				htmlContent = DOMPurify.sanitize(result);
			}
		} else {
			htmlContent = '';
		}
	});
</script>

<div class={`markdown-content ${className}`}>
	{@html htmlContent}
</div>

<style>
	.markdown-content :global(h1) {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.markdown-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.markdown-content :global(h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(p) {
		margin-bottom: 1rem;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.markdown-content :global(li) {
		margin-bottom: 0.25rem;
	}

	.markdown-content :global(a) {
		color: #0284c7;
		text-decoration: underline;
	}

	.markdown-content :global(code) {
		background-color: #f1f5f9;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
	}

	.markdown-content :global(pre) {
		background-color: #f1f5f9;
		padding: 1rem;
		border-radius: 0.25rem;
		margin-bottom: 1rem;
		overflow-x: auto;
	}

	.markdown-content :global(blockquote) {
		border-left: 4px solid #e2e8f0;
		padding-left: 1rem;
		margin-bottom: 1rem;
		font-style: italic;
	}

	.markdown-content :global(hr) {
		border: 0;
		border-top: 1px solid #e2e8f0;
		margin: 1.5rem 0;
	}

	.markdown-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	.markdown-content :global(th),
	.markdown-content :global(td) {
		border: 1px solid #e2e8f0;
		padding: 0.5rem;
	}

	.markdown-content :global(th) {
		background-color: #f8fafc;
	}
</style>
