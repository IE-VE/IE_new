import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform, url }) => {
	// Check if storage is available
	if (!platform?.env.STORAGE) {
		return json({ message: 'Storage not available' }, { status: 500 });
	}

	try {
		const data = (await request.json()) as { batchRequestKey: string; batchOutputKey: string };
		const { batchRequestKey, batchOutputKey } = data;
		const fetchSamplesOnly = url.searchParams.get('fetchSamplesOnly') === 'true';

		if (!batchRequestKey || !batchOutputKey) {
			return json(
				{ message: 'Both batch request and batch output keys are required' },
				{ status: 400 }
			);
		}

		// Validate that both files exist in storage
		const requestExists = await platform.env.STORAGE.head(batchRequestKey);
		const outputExists = await platform.env.STORAGE.head(batchOutputKey);

		if (!requestExists) {
			return json({ message: `Batch request file ${batchRequestKey} not found` }, { status: 404 });
		}

		if (!outputExists) {
			return json({ message: `Batch output file ${batchOutputKey} not found` }, { status: 404 });
		}

		// Get file contents
		const requestFileObj = await platform.env.STORAGE.get(batchRequestKey);
		const outputFileObj = await platform.env.STORAGE.get(batchOutputKey);

		if (!requestFileObj || !outputFileObj) {
			return json({ message: 'Failed to retrieve file contents' }, { status: 500 });
		}

		const requestText = await requestFileObj.text();
		const outputText = await outputFileObj.text();

		// Process the files
		const requestLines = requestText.split('\n').filter(Boolean);
		const outputLines = outputText.split('\n').filter(Boolean);

		// Get samples for debugging
		const requestSample = requestLines.slice(0, 2).join('\n');
		const outputSample = outputLines.slice(0, 2).join('\n');

		// If we're just fetching samples, return them now
		if (fetchSamplesOnly) {
			return json({
				message: 'File samples fetched successfully',
				requestSample,
				outputSample,
				requestCount: requestLines.length,
				outputCount: outputLines.length
			});
		}

		// Parse the JSON lines
		const requestData = requestLines
			.map((line) => {
				try {
					return JSON.parse(line);
				} catch (e) {
					console.error('Error parsing request line:', line);
					return null;
				}
			})
			.filter(Boolean);

		const outputData = outputLines
			.map((line) => {
				try {
					return JSON.parse(line);
				} catch (e) {
					console.error('Error parsing output line:', line);
					return null;
				}
			})
			.filter(Boolean);

		// Log the structure of the first item in each file for debugging
		console.log('Request data structure:', JSON.stringify(requestData[0], null, 2));
		console.log('Output data structure:', JSON.stringify(outputData[0], null, 2));

		// IMPORTANT: File structure mappings
		// - Input files: We match on custom_id and get score from body.metadata.instructorScore
		// - Output files: We match on custom_id and extract bandScore from the parsed JSON in response.body.choices[0].message.content

		// Create a map of session IDs to request data
		const sessionMap = new Map();
		const requestIdField = 'custom_id'; // Always use custom_id for matching

		for (const item of requestData) {
			// Check if body.metadata.instructorScore exists (this is where the score is stored in batch input)
			if (
				item[requestIdField] &&
				item.body &&
				item.body.metadata &&
				item.body.metadata.instructorScore
			) {
				// Parse the instructorScore which should be a JSON string containing a number
				let instructorScore;
				try {
					instructorScore = JSON.parse(item.body.metadata.instructorScore);
				} catch (e) {
					console.error(`Error parsing instructorScore for ${item[requestIdField]}:`, e);
					instructorScore = 0;
				}

				sessionMap.set(item[requestIdField], {
					instructorScore: instructorScore,
					instructorFeedback: 'Instructor feedback from metadata',
					sessionId: item[requestIdField]
				});
			}
		}

		// Compare with output data
		const comparisons = [];
		let matchCount = 0;
		const outputIdField = 'custom_id'; // Always use custom_id for matching

		for (const item of outputData) {
			const sessionId = item[outputIdField];
			if (sessionId && sessionMap.has(sessionId)) {
				const requestItem = sessionMap.get(sessionId);

				// Parse the model score from the content.bandScore field
				let modelScore = 0;
				try {
					// Extract bandScore from content
					if (
						item.response &&
						item.response.body &&
						item.response.body.choices &&
						item.response.body.choices[0] &&
						item.response.body.choices[0].message &&
						item.response.body.choices[0].message.content
					) {
						// Try to parse the content as JSON to get bandScore
						const content = JSON.parse(item.response.body.choices[0].message.content);
						if (content && content.bandScore !== undefined) {
							modelScore = content.bandScore.band;
						}
					}
				} catch (e) {
					console.error(`Error extracting bandScore from content for ${sessionId}:`, e);
				}

				// Get model feedback (optional)
				let modelFeedback = 'No feedback provided';
				try {
					if (
						item.response &&
						item.response.body &&
						item.response.body.choices &&
						item.response.body.choices[0] &&
						item.response.body.choices[0].message &&
						item.response.body.choices[0].message.content
					) {
						const content = JSON.parse(item.response.body.choices[0].message.content);
						if (content && content.feedback) {
							modelFeedback = content.feedback;
						}
					}
				} catch (e) {
					console.error(`Error extracting feedback from content for ${sessionId}:`, e);
				}

				const match = modelScore == requestItem.instructorScore;

				if (match) {
					matchCount++;
				}

				comparisons.push({
					sessionId,
					instructorScore: requestItem.instructorScore,
					instructorFeedback: requestItem.instructorFeedback,
					modelScore,
					modelFeedback,
					match
				});
			}
		}

		return json({
			message: 'Files compared successfully',
			comparisons,
			totalComparisons: comparisons.length,
			matchCount,
			requestSample,
			outputSample,
			requestCount: requestLines.length,
			outputCount: outputLines.length,
			requestParseCount: requestData.length,
			outputParseCount: outputData.length,
			requestIdField,
			outputIdField,
			matchRate: comparisons.length > 0 ? (matchCount / comparisons.length) * 100 : 0
		});
	} catch (error) {
		console.error('Error comparing files:', error);
		return json(
			{
				message: error instanceof Error ? error.message : 'An error occurred while comparing files'
			},
			{ status: 500 }
		);
	}
};
