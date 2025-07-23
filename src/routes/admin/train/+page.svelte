<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import LoadingOverlay from '../components/LoadingOverlay.svelte';

	const { data }: { data: PageData } = $props();
	let batches = $state(data.batches || []);
	let outputFiles = $state(data.outputFiles || []);
	let finetunedFiles = $state(data.finetunedFiles || []);
	let isLoading = $state(false);
	let processingBatch = $state(false);
	let deletingBatch = $state<string | null>(null);
	let batchCreationResult = $state<null | {
		phase1BatchFilePath: string;
		totalSessions: number;
		message: string;
	}>(null);
	let errorMessage = $state<string | null>(null);
	let fileUploading = $state(false);
	let uploadResult = $state<null | { success: boolean; message: string }>(null);
	let selectedFile = $state<File | null>(null);

	// For combining batches
	let combiningBatches = $state(false);
	let selectedInputBatch = $state<string>('');
	let selectedOutputBatch = $state<string>('');
	let combineResult = $state<null | {
		success: boolean;
		message: string;
		finetunedChatsFilePath?: string;
		totalChats?: number;
	}>(null);

	// For comparing batch request and output
	let comparingFiles = $state(false);
	let selectedBatchRequestFile = $state<string>('');
	let selectedBatchOutputFile = $state<string>('');
	let compareResult = $state<null | {
		success: boolean;
		message: string;
		comparisons?: Array<{
			sessionId: string;
			instructorScore: number;
			instructorFeedback?: string;
			modelScore: number;
			modelFeedback?: string;
			match: boolean;
		}>;
		totalComparisons?: number;
		matchCount?: number;
		requestSample?: string;
		outputSample?: string;
		requestCount?: number;
		outputCount?: number;
		requestParseCount?: number;
		outputParseCount?: number;
		requestIdField?: string;
		outputIdField?: string;
		matchRate?: number;
	}>(null);

	// For feedback modal
	let showFeedbackModal = $state(false);
	let selectedFeedback = $state<{
		sessionId: string;
		instructorScore: number;
		instructorFeedback?: string;
		modelScore: number;
		modelFeedback?: string;
		match: boolean;
	} | null>(null);

	// Create a new training batch
	const createTrainingBatch = async () => {
		try {
			isLoading = true;
			errorMessage = null;

			const response = await fetch('/admin/ai/training/create-batch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || 'Failed to create training batch');
			}

			const result = (await response.json()) as {
				phase1BatchFilePath: string;
				totalSessions: number;
				message: string;
			};
			batchCreationResult = result;
			await invalidateAll();
		} catch (error) {
			console.error('Error creating training batch:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
	};

	const deleteBatch = async (key: string) => {
		if (
			!confirm('Are you sure you want to delete this batch file? This action cannot be undone.')
		) {
			return;
		}

		try {
			deletingBatch = key;
			errorMessage = null;

			const response = await fetch(`/admin/ai/training/delete/${encodeURIComponent(key)}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || 'Failed to delete batch file');
			}

			// Remove the batch from the local list
			batches = batches.filter((batch) => batch.key !== key);
			outputFiles = outputFiles.filter((file) => file.key !== key);
			finetunedFiles = finetunedFiles.filter((file) => file.key !== key);
		} catch (error) {
			console.error('Error deleting batch file:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		} finally {
			deletingBatch = null;
		}
	};

	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			if (file.name.match(/batch_.*_output\.jsonl$/)) {
				selectedFile = file;
				uploadResult = null;
				errorMessage = null;
			} else {
				errorMessage = 'Please select a valid batch output file (batch_*_output.jsonl)';
				selectedFile = null;
			}
		}
	};

	const uploadBatchFile = async () => {
		if (!selectedFile) {
			errorMessage = 'Please select a file to upload';
			return;
		}

		try {
			fileUploading = true;
			errorMessage = null;
			uploadResult = null;

			const formData = new FormData();
			formData.append('file', selectedFile);

			const response = await fetch('/admin/api/training/upload-batch', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || 'Failed to upload batch file');
			}

			const result = (await response.json()) as { message: string };
			uploadResult = {
				success: true,
				message: result.message || 'File uploaded successfully'
			};

			// Reset selected file
			selectedFile = null;

			// Refresh the list of batches
			await invalidateAll();
		} catch (error) {
			console.error('Error uploading batch file:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			uploadResult = {
				success: false,
				message: error instanceof Error ? error.message : 'An unknown error occurred'
			};
		} finally {
			fileUploading = false;
		}
	};

	const combineBatches = async () => {
		if (!selectedInputBatch || !selectedOutputBatch) {
			errorMessage = 'Please select both input batch and output batch files';
			return;
		}

		try {
			combiningBatches = true;
			errorMessage = null;
			combineResult = null;

			const response = await fetch('/admin/api/training/combine-batch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					inputBatchKey: selectedInputBatch,
					outputBatchKey: selectedOutputBatch
				})
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || 'Failed to combine batch files');
			}

			const result = (await response.json()) as {
				message: string;
				finetunedChatsFilePath: string;
				totalChats: number;
			};

			combineResult = {
				success: true,
				message: result.message || 'Files combined successfully',
				finetunedChatsFilePath: result.finetunedChatsFilePath,
				totalChats: result.totalChats
			};

			// Reset selections
			selectedInputBatch = '';
			selectedOutputBatch = '';

			// Refresh the lists
			await invalidateAll();
		} catch (error) {
			console.error('Error combining batch files:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			combineResult = {
				success: false,
				message: error instanceof Error ? error.message : 'An unknown error occurred'
			};
		} finally {
			combiningBatches = false;
		}
	};

	const compareFiles = async () => {
		if (!selectedBatchRequestFile || !selectedBatchOutputFile) {
			errorMessage = 'Please select both batch request and batch output files';
			return;
		}

		try {
			comparingFiles = true;
			errorMessage = null;
			compareResult = null;

			// First, let's fetch samples from both files to display
			const sampleResponse = await fetch(
				'/admin/api/training/compare-files?fetchSamplesOnly=true',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						batchRequestKey: selectedBatchRequestFile,
						batchOutputKey: selectedBatchOutputFile
					})
				}
			);

			if (!sampleResponse.ok) {
				const errorData = (await sampleResponse.json()) as { message?: string };
				throw new Error(errorData.message || 'Failed to fetch file samples');
			}

			// Now perform the actual comparison
			const response = await fetch('/admin/api/training/compare-files', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					batchRequestKey: selectedBatchRequestFile,
					batchOutputKey: selectedBatchOutputFile
				})
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || 'Failed to compare files');
			}

			const result = (await response.json()) as {
				message: string;
				comparisons: Array<{
					sessionId: string;
					instructorScore: number;
					instructorFeedback?: string;
					modelScore: number;
					modelFeedback?: string;
					match: boolean;
				}>;
				totalComparisons: number;
				matchCount: number;
				requestSample: string;
				outputSample: string;
				requestCount: number;
				outputCount: number;
			};

			compareResult = {
				success: true,
				message: result.message || 'Files compared successfully',
				comparisons: result.comparisons,
				totalComparisons: result.totalComparisons,
				matchCount: result.matchCount,
				requestSample: result.requestSample,
				outputSample: result.outputSample,
				requestCount: result.requestCount,
				outputCount: result.outputCount
			};

			// Reset selections
			// selectedBatchRequestFile = '';
			// selectedBatchOutputFile = '';
		} catch (error) {
			console.error('Error comparing files:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			compareResult = {
				success: false,
				message: error instanceof Error ? error.message : 'An unknown error occurred'
			};
		} finally {
			comparingFiles = false;
		}
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	};

	const formatSize = (size: number) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
		return `${(size / (1024 * 1024)).toFixed(2)} MB`;
	};

	const openFeedbackModal = (comparison: {
		sessionId: string;
		instructorScore: number;
		instructorFeedback?: string;
		modelScore: number;
		modelFeedback?: string;
		match: boolean;
	}) => {
		selectedFeedback = comparison;
		showFeedbackModal = true;
	};

	const closeFeedbackModal = () => {
		showFeedbackModal = false;
		selectedFeedback = null;
	};
</script>

<LoadingOverlay {isLoading} />

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">🧠 AI Training Batches</h1>
		<div class="flex space-x-4">
			<button
				onclick={createTrainingBatch}
				disabled={isLoading}
				class="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50"
			>
				{isLoading ? 'Creating...' : 'Create New Training Batch'}
			</button>
		</div>
	</div>

	<!-- File Upload Section -->
	<div class="mb-8 rounded-lg border border-gray-200 p-4 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">📤 Upload Batch Output File</h2>
		<div class="space-y-4">
			<div class="flex items-center space-x-4">
				<input
					type="file"
					id="batchFileUpload"
					accept=".jsonl"
					onchange={handleFileChange}
					class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
				/>
				<button
					onclick={uploadBatchFile}
					disabled={!selectedFile || fileUploading}
					class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
				>
					{fileUploading ? 'Uploading...' : 'Upload File'}
				</button>
			</div>
			{#if selectedFile}
				<div class="text-sm text-gray-600">
					Selected file: <span class="font-medium">{selectedFile.name}</span> ({formatSize(
						selectedFile.size
					)})
				</div>
			{/if}
			{#if uploadResult}
				<div class={`rounded-md p-4 ${uploadResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
					<div class="flex">
						<div class="flex-shrink-0">
							{#if uploadResult.success}
								<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
						<div class="ml-3">
							<h3
								class={`text-sm font-medium ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}
							>
								{uploadResult.success ? 'Upload Successful' : 'Upload Failed'}
							</h3>
							<div
								class={`mt-2 text-sm ${uploadResult.success ? 'text-green-700' : 'text-red-700'}`}
							>
								<p>{uploadResult.message}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Combine Batches Section -->
	<div class="mb-8 rounded-lg border border-gray-200 p-4 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">🔄 Combine Input and Output Files</h2>
		<div class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="inputBatch" class="mb-2 block text-sm font-medium text-gray-700">
						Select Input Batch File
					</label>
					<select
						id="inputBatch"
						bind:value={selectedInputBatch}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
					>
						<option value="" disabled selected>-- Select Input Batch --</option>
						{#each batches as batch}
							<option value={batch.key}>{batch.key}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="outputBatch" class="mb-2 block text-sm font-medium text-gray-700">
						Select Output Batch File
					</label>
					<select
						id="outputBatch"
						bind:value={selectedOutputBatch}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
					>
						<option value="" disabled selected>-- Select Output Batch --</option>
						{#each outputFiles as file}
							<option value={file.key}>{file.key}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="flex justify-center">
				<button
					onclick={combineBatches}
					disabled={!selectedInputBatch || !selectedOutputBatch || combiningBatches}
					class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50"
				>
					{combiningBatches ? 'Combining...' : '🔗 Combine Files'}
				</button>
			</div>
			{#if combineResult}
				<div class={`rounded-md p-4 ${combineResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
					<div class="flex">
						<div class="flex-shrink-0">
							{#if combineResult.success}
								<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
						<div class="ml-3">
							<h3
								class={`text-sm font-medium ${
									combineResult.success ? 'text-green-800' : 'text-red-800'
								}`}
							>
								{combineResult.success ? 'Combine Successful' : 'Combine Failed'}
							</h3>
							<div
								class={`mt-2 text-sm ${combineResult.success ? 'text-green-700' : 'text-red-700'}`}
							>
								<p>{combineResult.message}</p>
								{#if combineResult.success && combineResult.finetunedChatsFilePath}
									<p class="mt-1">
										File: {combineResult.finetunedChatsFilePath}
									</p>
									<p>Total chats: {combineResult.totalChats}</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Compare Files Section -->
	<div class="mb-8 rounded-lg border border-gray-200 p-4 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">🔄 Compare Batch Request and Output Files</h2>
		<div class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="batchRequest" class="mb-2 block text-sm font-medium text-gray-700">
						Select Batch Request File
					</label>
					<select
						id="batchRequest"
						bind:value={selectedBatchRequestFile}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
					>
						<option value="" disabled selected>-- Select Batch Request --</option>
						{#each batches as batch}
							<option value={batch.key}>{batch.key}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="batchOutput" class="mb-2 block text-sm font-medium text-gray-700">
						Select Batch Output File
					</label>
					<select
						id="batchOutput"
						bind:value={selectedBatchOutputFile}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
					>
						<option value="" disabled selected>-- Select Batch Output --</option>
						{#each outputFiles as file}
							<option value={file.key}>{file.key}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="flex justify-center">
				<button
					onclick={compareFiles}
					disabled={!selectedBatchRequestFile || !selectedBatchOutputFile || comparingFiles}
					class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50"
				>
					{comparingFiles ? 'Comparing...' : '🔄 Compare Files'}
				</button>
			</div>
			{#if compareResult}
				<div class={`rounded-md p-4 ${compareResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
					<div class="flex">
						<div class="flex-shrink-0">
							{#if compareResult.success}
								<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
						<div class="ml-3 w-full">
							<h3
								class={`text-sm font-medium ${
									compareResult.success ? 'text-green-800' : 'text-red-800'
								}`}
							>
								{compareResult.success ? 'Compare Successful' : 'Compare Failed'}
							</h3>
							<div
								class={`mt-2 text-sm ${compareResult.success ? 'text-green-700' : 'text-red-700'}`}
							>
								<p>{compareResult.message}</p>

								<!-- Diagnostic Information -->
								<div class="mt-4 rounded-lg bg-white p-4 shadow-sm">
									<h4 class="mb-2 text-base font-medium text-gray-800">
										📊 Diagnostic Information
									</h4>
									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h5 class="font-medium text-gray-700">
												Request File ({selectedBatchRequestFile})
											</h5>
											<p>Total lines: {compareResult.requestCount || 0}</p>
											<p>Parsed successfully: {compareResult.requestParseCount || 0}</p>
											<p>ID field used: {compareResult.requestIdField || 'id'}</p>
											<div class="mt-2 mb-4">
												<h6 class="text-sm font-medium text-gray-600">
													Sample Data (First 2 Lines):
												</h6>
												<pre
													class="mt-1 overflow-x-auto rounded bg-gray-100 p-2 text-xs">{compareResult.requestSample ||
														'No sample available'}</pre>
											</div>
										</div>
										<div>
											<h5 class="font-medium text-gray-700">
												Output File ({selectedBatchOutputFile})
											</h5>
											<p>Total lines: {compareResult.outputCount || 0}</p>
											<p>Parsed successfully: {compareResult.outputParseCount || 0}</p>
											<p>ID field used: {compareResult.outputIdField || 'id'}</p>
											<div class="mt-2 mb-4">
												<h6 class="text-sm font-medium text-gray-600">
													Sample Data (First 2 Lines):
												</h6>
												<pre
													class="mt-1 overflow-x-auto rounded bg-gray-100 p-2 text-xs">{compareResult.outputSample ||
														'No sample available'}</pre>
											</div>
										</div>
									</div>

									<div class="mt-4">
										<h5 class="font-medium text-gray-700">Match Statistics</h5>
										<div class="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
											<div class="rounded-lg bg-blue-50 p-3 text-center">
												<p class="text-sm text-blue-700">Total Matches Found</p>
												<p class="text-2xl font-bold text-blue-800">
													{compareResult.totalComparisons || 0}
												</p>
											</div>
											<div class="rounded-lg bg-green-50 p-3 text-center">
												<p class="text-sm text-green-700">Score Matches</p>
												<p class="text-2xl font-bold text-green-800">
													{compareResult.matchCount || 0}
												</p>
											</div>
											<div class="rounded-lg bg-purple-50 p-3 text-center">
												<p class="text-sm text-purple-700">Match Rate</p>
												<p class="text-2xl font-bold text-purple-800">
													{compareResult.totalComparisons
														? (
																((compareResult.matchCount || 0) / compareResult.totalComparisons) *
																100
															).toFixed(2)
														: '0.00'}%
												</p>
											</div>
										</div>
									</div>
								</div>

								{#if compareResult.success && compareResult.comparisons && compareResult.comparisons.length > 0}
									<p class="mt-6 font-semibold">
										<span class="font-semibold">Detailed Comparison Results:</span>
									</p>

									<div class="mt-4 overflow-x-auto">
										<table class="min-w-full divide-y divide-gray-200">
											<thead class="bg-gray-50">
												<tr>
													<th
														class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
													>
														Session ID
													</th>
													<th
														class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
													>
														Instructor Score
													</th>
													<th
														class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
													>
														Model Score
													</th>
													<th
														class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
													>
														Match
													</th>
													<th
														class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
													>
														Details
													</th>
												</tr>
											</thead>
											<tbody class="divide-y divide-gray-200 bg-white">
												{#each compareResult.comparisons as comparison}
													<tr class={comparison.match ? 'bg-green-50' : 'bg-red-50'}>
														<td class="px-4 py-2 text-sm text-gray-900">
															{comparison.sessionId}
														</td>
														<td class="px-4 py-2 text-sm text-gray-900">
															{comparison.instructorScore}
														</td>
														<td class="px-4 py-2 text-sm text-gray-900">
															{comparison.modelScore}
														</td>
														<td class="px-4 py-2 text-sm">
															{#if comparison.match}
																<span
																	class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
																>
																	<svg
																		class="mr-1.5 -ml-0.5 h-2 w-2 text-green-400"
																		fill="currentColor"
																		viewBox="0 0 8 8"
																	>
																		<circle cx="4" cy="4" r="3" />
																	</svg>
																	Match
																</span>
															{:else}
																<span
																	class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
																>
																	<svg
																		class="mr-1.5 -ml-0.5 h-2 w-2 text-red-400"
																		fill="currentColor"
																		viewBox="0 0 8 8"
																	>
																		<circle cx="4" cy="4" r="3" />
																	</svg>
																	Mismatch
																</span>
															{/if}
														</td>
														<td class="px-4 py-2 text-sm text-gray-500">
															<button
																class="text-indigo-600 hover:text-indigo-900"
																onclick={() => openFeedbackModal(comparison)}
															>
																View Feedback
															</button>
														</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								{:else if compareResult.success}
									<div
										class="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700"
									>
										<p class="font-medium">No matching sessions found between the files</p>
										<p class="mt-1 text-sm">
											This usually happens when the session IDs in the request file don't match
											those in the output file, or when the file format is different than expected.
											Check the diagnostic information and sample data above.
										</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if errorMessage}
		<div class="mb-6 rounded-md bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{errorMessage}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if batchCreationResult}
		<div class="mb-6 rounded-md bg-green-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-green-800">Batch Created Successfully</h3>
					<div class="mt-2 text-sm text-green-700">
						<p>File path: {batchCreationResult.phase1BatchFilePath}</p>
						<p>Total sessions: {batchCreationResult.totalSessions}</p>
						<p>{batchCreationResult.message}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Training Batches List -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold">📋 Training Batch Files</h2>
		<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Key
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Size
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Last Modified
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#if batches.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
								No training batches found. Create one to get started!
							</td>
						</tr>
					{:else}
						{#each batches as batch}
							<tr>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
									{batch.key}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{formatSize(batch.size)}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{batch.uploaded ? formatDate(Number(new Date(batch.uploaded))) : 'N/A'}
								</td>
								<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
									<a
										href={`/admin/ai/training/download/${encodeURIComponent(batch.key)}`}
										class="text-indigo-600 hover:text-indigo-900"
										target="_blank"
										rel="noopener noreferrer"
									>
										Download
									</a>
									<button
										onclick={() => deleteBatch(batch.key)}
										disabled={deletingBatch === batch.key}
										class="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
									>
										{deletingBatch === batch.key ? 'Deleting...' : '🗑️ Delete'}
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Output Files List -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold">📊 Batch Output Files</h2>
		<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Key
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Size
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Last Modified
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#if outputFiles.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
								No output files found. Upload a batch output file to get started!
							</td>
						</tr>
					{:else}
						{#each outputFiles as file}
							<tr>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
									{file.key}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{formatSize(file.size)}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{file.uploaded ? formatDate(Number(new Date(file.uploaded))) : 'N/A'}
								</td>
								<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
									<a
										href={`/admin/ai/training/download/${encodeURIComponent(file.key)}`}
										class="text-indigo-600 hover:text-indigo-900"
										target="_blank"
										rel="noopener noreferrer"
									>
										Download
									</a>
									<button
										onclick={() => deleteBatch(file.key)}
										disabled={deletingBatch === file.key}
										class="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
									>
										{deletingBatch === file.key ? 'Deleting...' : '🗑️ Delete'}
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Finetuned Chats List -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold">🚀 Finetuned Chat Files</h2>
		<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Key
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Size
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Last Modified
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#if finetunedFiles.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
								No finetuned chat files found. Combine input and output files to create one!
							</td>
						</tr>
					{:else}
						{#each finetunedFiles as file}
							<tr>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
									{file.key}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{formatSize(file.size)}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
									{file.uploaded ? formatDate(Number(new Date(file.uploaded))) : 'N/A'}
								</td>
								<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
									<a
										href={`/admin/ai/training/download/${encodeURIComponent(file.key)}`}
										class="text-indigo-600 hover:text-indigo-900"
										target="_blank"
										rel="noopener noreferrer"
									>
										Download
									</a>
									<button
										onclick={() => deleteBatch(file.key)}
										disabled={deletingBatch === file.key}
										class="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
									>
										{deletingBatch === file.key ? 'Deleting...' : '🗑️ Delete'}
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Instructions -->
	<div class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">📝 How Training Batches Work</h2>
		<ol class="list-decimal space-y-2 pl-5">
			<li>
				<strong>Phase 1: Create Initial Batch</strong> - Generate AI analyses for all sessions with instructor
				scores
			</li>
			<li>
				<strong>Phase 2: Create Correction Batch</strong> - Identify analyses that deviate from instructor
				scores and regenerate them with guidance
			</li>
			<li>
				<strong>Phase 3: Fine-tuning</strong> - Prepare the final training dataset and submit it to OpenAI
				for fine-tuning
			</li>
		</ol>
		<p class="mt-4 text-sm text-gray-600">
			After creating a batch, you need to download it and submit it to OpenAI's batch processing
			API. Once you have the results, upload them to proceed to the next phase.
		</p>
	</div>

	<!-- Feedback Modal -->
	{#if showFeedbackModal && selectedFeedback}
		<div
			class="fixed inset-0 z-10 overflow-y-auto"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div
				class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
			>
				<!-- Background overlay -->
				<div
					class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
					aria-hidden="true"
				></div>

				<!-- Center modal -->
				<span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
					>&#8203;</span
				>

				<div
					class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle"
				>
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
									Feedback Comparison for Session {selectedFeedback.sessionId}
								</h3>
								<div class="mt-4">
									<div class="mb-4 grid grid-cols-2 gap-4">
										<div class="rounded-lg bg-blue-50 p-4">
											<h4 class="mb-2 font-semibold text-blue-800">Instructor Score</h4>
											<p class="text-2xl font-bold text-blue-900">
												{selectedFeedback.instructorScore}
											</p>
										</div>
										<div class="rounded-lg bg-purple-50 p-4">
											<h4 class="mb-2 font-semibold text-purple-800">Model Score</h4>
											<p class="text-2xl font-bold text-purple-900">
												{selectedFeedback.modelScore}
											</p>
										</div>
									</div>

									<div class="mb-4">
										<h4 class="mb-2 font-medium text-gray-700">Instructor Feedback</h4>
										<div class="rounded-lg bg-gray-50 p-3 text-sm">
											{selectedFeedback.instructorFeedback || 'No feedback provided'}
										</div>
									</div>

									<div>
										<h4 class="mb-2 font-medium text-gray-700">Model Feedback</h4>
										<div class="rounded-lg bg-gray-50 p-3 text-sm">
											{selectedFeedback.modelFeedback || 'No feedback provided'}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							onclick={closeFeedbackModal}
							class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
