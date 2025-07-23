import { R2Bucket, KVNamespace, Ai, ExecutionContext, Cloudflare } from '@cloudflare/workers-types';
import type { CacheStorage, CfProperties, D1Database } from '@cloudflare/workers-types';
import type { DatabaseConnector } from '$lib/db/connector';
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: DatabaseConnector;
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				STORAGE: R2Bucket;
				SESSIONS: KVNamespace;
				AI: Ai;
				POSTMARK_API_KEY: string;
				DB: D1Database;
				OPENAI_API_KEY: string;
				ADMIN_PASSWORD: string;
				QUEUE: Queue;
				BREVO_API_KEY: string;
				BREVO_MA_KEY: string;
				ASSEMBLY_API_KEY: string;
			};
			context: ExecutionContext;
			cf: CfProperties;
			caches: CacheStorage;
		}
	}
}

export {};
