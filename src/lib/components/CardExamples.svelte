<script lang="ts">
	import Card from './Card.svelte';

	// Example icon paths
	const starIconPath =
		'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

	const notificationIconPath =
		'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z';

	const lightbulbIconPath =
		'M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z';
</script>

<div class="space-y-8 p-4">
	<h1 class="mb-4 text-2xl font-bold dark:text-white">Card Component Examples</h1>
	<p class="mb-6 text-gray-700 dark:text-gray-300">
		The Card component is now simplified to only provide the container styling. You add your own
		content structure.
	</p>

	<h2 class="mb-4 text-xl font-bold dark:text-white">Using Variants</h2>

	<!-- Default Variant -->
	<div>
		<h2 class="mb-2 text-xl font-semibold dark:text-white">Default Variant (Purple/Blue)</h2>
		<Card>
			<div class="flex items-start space-x-4">
				<!-- Icon -->
				<div class="hidden sm:block">
					<div class="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
						<svg
							class="h-8 w-8 text-indigo-600 dark:text-indigo-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d={starIconPath} />
						</svg>
					</div>
				</div>

				<div class="flex-1">
					<!-- Title -->
					<h3 class="mb-2 flex items-center text-xl font-bold text-indigo-900 dark:text-indigo-300">
						<span class="mr-2 sm:hidden">🌟</span>
						Default Card Example
					</h3>

					<!-- Content -->
					<p class="text-gray-700 dark:text-gray-300">
						This card uses the default color scheme. The Card component provides only the container,
						while you structure the content yourself.
					</p>
					<div class="mt-4 rounded-lg bg-white p-4 dark:bg-gray-800">
						<code class="dark:text-gray-300">{'<Card>your content here</Card>'}</code>
					</div>
				</div>
			</div>
		</Card>
	</div>

	<!-- Teal Variant -->
	<div>
		<h2 class="mb-2 text-xl font-semibold dark:text-white">Teal Variant</h2>
		<Card variant="teal">
			<div class="flex items-start space-x-4">
				<!-- Icon -->
				<div class="hidden sm:block">
					<div class="rounded-full bg-teal-100 p-3 dark:bg-teal-900/50">
						<svg
							class="h-8 w-8 text-teal-600 dark:text-teal-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d={notificationIconPath} />
						</svg>
					</div>
				</div>

				<div class="flex-1">
					<!-- Title -->
					<h3 class="mb-2 flex items-center text-xl font-bold text-teal-900 dark:text-teal-300">
						<span class="mr-2 sm:hidden">🔔</span>
						Teal Card Example
					</h3>

					<!-- Content -->
					<p class="text-gray-700 dark:text-gray-300">
						This card uses the teal variant. You can add any content structure you want inside.
					</p>
					<div class="mt-4 grid grid-cols-2 gap-4">
						<div class="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
							<p class="font-medium dark:text-gray-300">Custom Content</p>
						</div>
						<div class="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
							<p class="font-medium dark:text-gray-300">Flexible Layout</p>
						</div>
					</div>
				</div>
			</div>
		</Card>
	</div>

	<!-- Greyscale Variant -->
	<div>
		<h2 class="mb-2 text-xl font-semibold dark:text-white">Greyscale Variant</h2>
		<Card variant="greyscale">
			<div class="flex items-start space-x-4">
				<!-- Icon -->
				<div class="hidden sm:block">
					<div class="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
						<svg
							class="h-8 w-8 text-gray-600 dark:text-gray-300"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d={lightbulbIconPath} />
						</svg>
					</div>
				</div>

				<div class="flex-1">
					<!-- Title -->
					<h3 class="mb-2 flex items-center text-xl font-bold text-gray-900 dark:text-gray-300">
						<span class="mr-2 sm:hidden">💡</span>
						Greyscale Card Example
					</h3>

					<!-- Content -->
					<p class="text-gray-700 dark:text-gray-300">
						This card uses the greyscale variant. Perfect for secondary content.
					</p>
					<ul class="mt-4 space-y-2">
						<li class="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
							<span class="dark:text-gray-300">Full control over content layout</span>
						</li>
						<li class="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
							<span class="dark:text-gray-300">Consistent card styling</span>
						</li>
					</ul>
				</div>
			</div>
		</Card>
	</div>

	<!-- Example without our standard layout -->
	<div>
		<h2 class="mb-2 text-xl font-semibold dark:text-white">Custom Layout Example</h2>
		<Card variant="teal">
			<div class="text-center">
				<img
					src="https://placekitten.com/300/200"
					alt="Example image"
					class="mx-auto mb-4 rounded-lg"
				/>
				<h3 class="mb-2 text-xl font-bold text-teal-900 dark:text-teal-300">
					Completely Custom Layout
				</h3>
				<p class="text-gray-700 dark:text-gray-300">
					You're not limited to the icon + title layout. Create any content structure you need.
				</p>
			</div>
		</Card>
	</div>
</div>
