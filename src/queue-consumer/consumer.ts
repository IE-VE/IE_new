import { doAnalyses } from '$lib/ai/doAnalyses';
import { type ExportedHandler } from '@cloudflare/workers-types';

interface Env {
	STORAGE: R2Bucket;
	SESSIONS: KVNamespace;
	AI: Ai;
	POSTMARK_API_KEY: string;
	DB: D1Database;
	OPENAI_API_KEY: string;
	ADMIN_PASSWORD: string;
}

interface QueueMessage {
	sessionId: string;
	forceEmail: boolean;
}

export default {
	async queue(batch, env: Env, ctx: ExecutionContext) {
		console.log(`🔄 Processing ${batch.messages.length} messages from queue`);

		for (const message of batch.messages) {
			try {
				const message_data = message.body as QueueMessage;

				if (!message_data.sessionId) {
					throw new Error('Missing sessionId in queue message');
				}

				console.log(
					`🔍 Processing session: ${message_data.sessionId} (forceEmail: ${message_data.forceEmail || false})`
				);

				await doAnalyses(
					message_data.sessionId,
					{ env, ctx } as unknown as App.Platform,
					message_data.forceEmail || false
				);
				console.log(`✅ Successfully processed session: ${message_data.sessionId}`);
			} catch (error) {
				console.error(`❌ Error processing queue message:`, error);
				// Don't throw here to allow other messages to be processed
			}
		}
	}
} satisfies ExportedHandler<Env>;
