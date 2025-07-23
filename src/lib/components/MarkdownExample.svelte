<script>
	import Markdown from './Markdown.svelte';

	let markdownText = $state(`
# Markdown Example

This is a **bold** text and this is *italic*.

## Lists

* Item 1
* Item 2
* Item 3

## Code

\`\`\`javascript
const greeting = 'Hello, world!';
console.log(greeting);
\`\`\`

## Links

[Visit Svelte](https://svelte.dev)
	`);
</script>

<div class="container">
	<h1>Markdown Component Demo</h1>

	<div class="editor-preview">
		<div class="editor">
			<h2>Edit Markdown</h2>
			<textarea
				value={markdownText}
				onchange={(event) => {
					// @ts-ignore - Ignoring type issues here
					markdownText = event.currentTarget.value;
				}}
				rows="10"
			></textarea>
		</div>

		<div class="preview">
			<h2>Preview</h2>
			<div class="preview-content">
				<Markdown content={markdownText} />
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin-bottom: 2rem;
		text-align: center;
	}

	.editor-preview {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	h2 {
		margin-bottom: 1rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		font-family: monospace;
	}

	.preview-content {
		padding: 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		min-height: 240px;
	}
</style>
