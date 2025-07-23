import type { D1Database } from '@cloudflare/workers-types';
import type {
	Session,
	Recording,
	NewSession,
	NewRecording,
	SessionStatus,
	RecordingStatus,
	ParsedRecording,
	Analysis,
	NewAnalysis,
	ParsedAnalysis,
	AnalysisStatus
} from './types';

export class DatabaseConnector {
	constructor(private db: D1Database) {}

	// Session Operations
	async createSession(session: NewSession): Promise<Session> {
		const {
			id,
			status,
			metadata,
			current_question_index,
			total_questions,
			current_question,
			email,
			use_video,
			instructor_feedback,
			last_analysis_at
		} = session;
		const now = Date.now();

		await this.db
			.prepare(
				`INSERT INTO sessions (id, status, metadata, current_question_index, total_questions, current_question, email, use_video, instructor_feedback, last_analysis_at, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				id,
				status,
				metadata,
				current_question_index,
				total_questions,
				current_question,
				email || null,
				use_video,
				instructor_feedback || null,
				last_analysis_at || null,
				now,
				now
			)
			.run();

		const created = await this.getSession(id);
		if (!created) throw new Error(`Failed to create session ${id}`);
		return created;
	}

	async getSession(id: string): Promise<Session | null> {
		const result = await this.db.prepare('SELECT * FROM sessions WHERE id = ?').bind(id).first();
		return result as Session | null;
	}

	async getSessionByEmail(email: string): Promise<Session | null> {
		const result = await this.db
			.prepare('SELECT * FROM sessions WHERE email = ? ORDER BY created_at DESC LIMIT 1')
			.bind(email)
			.first();
		return result as Session | null;
	}

	async getAllSessions({
		limit = 50,
		offset = 0,
		status,
		email,
		orderBy = 'updated_at',
		orderDirection = 'DESC'
	}: {
		limit?: number;
		offset?: number;
		status?: string;
		email?: string;
		orderBy?: string;
		orderDirection?: 'ASC' | 'DESC';
	} = {}): Promise<Session[]> {
		let query = this.db.prepare(`
			SELECT * FROM sessions
			${status ? 'WHERE status = ?' : ''}
			${email ? (status ? 'AND' : 'WHERE') + ' email LIKE ?' : ''}
			ORDER BY ${orderBy} ${orderDirection}
			LIMIT ? OFFSET ?
		`);

		// Bind parameters and execute
		const params = [];
		if (status) params.push(status);
		if (email) params.push(`%${email}%`);
		params.push(limit, offset);

		const result = await query.bind(...params).all<Session>();
		return result?.results || [];
	}

	async getPaginatedSessions({
		page = 1,
		pageSize = 15,
		status,
		email,
		orderBy = 'updated_at',
		orderDirection = 'DESC'
	}: {
		page: number;
		pageSize: number;
		status?: string;
		email?: string;
		orderBy?: string;
		orderDirection?: 'ASC' | 'DESC';
	}): Promise<{ sessions: Session[]; totalCount: number }> {
		const offset = (page - 1) * pageSize;

		// Build the query based on whether status filter is provided
		let countQuery = 'SELECT COUNT(*) as count FROM sessions';
		let sessionsQuery = 'SELECT * FROM sessions';

		const params: (string | number)[] = [];
		const whereConditions: string[] = [];

		if (status) {
			whereConditions.push('status = ?');
			params.push(status);
		}

		if (email) {
			whereConditions.push('email LIKE ?');
			params.push(`%${email}%`);
		}

		// Add WHERE clause if we have conditions
		if (whereConditions.length > 0) {
			countQuery += ' WHERE ' + whereConditions.join(' AND ');
			sessionsQuery += ' WHERE ' + whereConditions.join(' AND ');
		}

		// Use the provided orderBy and orderDirection
		sessionsQuery += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;

		// Get total count
		const countResult = await this.db
			.prepare(countQuery)
			.bind(...params)
			.first<{ count: number }>();

		// Get paginated sessions
		const sessionsResult = await this.db
			.prepare(sessionsQuery)
			.bind(...[...params, pageSize, offset])
			.all<Session>();

		return {
			sessions: sessionsResult?.results || [],
			totalCount: countResult?.count || 0
		};
	}

	async updateSession(session: Session): Promise<Session> {
		const {
			id,
			status,
			metadata,
			current_question_index,
			total_questions,
			current_question,
			email,
			use_video,
			instructor_feedback,
			last_analysis_at
		} = session;

		await this.db
			.prepare(
				`UPDATE sessions SET 
					status = ?, 
					metadata = ?,
					current_question_index = ?,
					total_questions = ?,
					current_question = ?,
					email = ?,
					use_video = ?,
					instructor_feedback = ?,
					last_analysis_at = ?,
					updated_at = ?
				WHERE id = ?`
			)
			.bind(
				status,
				metadata,
				current_question_index,
				total_questions,
				current_question,
				email,
				use_video,
				instructor_feedback,
				last_analysis_at,
				Date.now(),
				id
			)
			.run();

		const updated = await this.getSession(id);
		if (!updated) throw new Error(`Failed to update session ${id}`);
		return updated;
	}

	async updateSessionStatus(id: string, status: SessionStatus): Promise<void> {
		await this.db
			.prepare(
				`UPDATE sessions 
                 SET status = ?, updated_at = ? 
                 WHERE id = ?`
			)
			.bind(status, Date.now(), id)
			.run();
	}

	async updateSessionLastAnalysisAt(id: string, timestamp: number): Promise<void> {
		await this.db
			.prepare(
				`UPDATE sessions 
                 SET last_analysis_at = ?, updated_at = ? 
                 WHERE id = ?`
			)
			.bind(timestamp, Date.now(), id)
			.run();
	}

	// Recording Operations
	async createRecording(recording: NewRecording): Promise<ParsedRecording> {
		const {
			id,
			session_id,
			question_text,
			question_index,
			video_object_key,
			audio_object_key,
			mp3_object_key,
			mime_type,
			duration_ms,
			status,
			error_message,
			transcription_json,
			analysis_json,
			pronunciation_analysis
		} = recording;

		await this.db
			.prepare(
				`INSERT INTO recordings (
					id, session_id, question_text, question_index, video_object_key, 
					audio_object_key, mp3_object_key, mime_type, duration_ms, status, error_message,
					transcription_json, analysis_json, pronunciation_analysis, timestamp
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				id,
				session_id,
				question_text,
				question_index,
				video_object_key,
				audio_object_key,
				mp3_object_key,
				mime_type,
				duration_ms,
				status,
				error_message,
				transcription_json,
				analysis_json,
				pronunciation_analysis || null,
				Date.now()
			)
			.run();

		const created = await this.getRecording(id);
		if (!created) throw new Error(`Failed to create recording ${id}`);

		const parsed = {
			...created,
			transcription: JSON.parse(created.transcription_json || '{}'),
			analysis: JSON.parse(created.analysis_json || '{}')
		};
		return parsed;
	}

	async getRecording(id: string): Promise<Recording | null> {
		const result = await this.db
			.prepare('SELECT * FROM recordings WHERE id = ?')
			.bind(id)
			.first<Recording>();

		return result || null;
	}

	async getSessionRecordings(sessionId: string): Promise<ParsedRecording[]> {
		const results = await this.db
			.prepare('SELECT * FROM recordings WHERE session_id = ? ORDER BY question_index ASC')
			.bind(sessionId)
			.all<Recording>();

		if (!results) return [];
		return results.results.map((result) => ({
			...result,
			transcription: JSON.parse(result.transcription_json || '{}'),
			analysis: JSON.parse(result.analysis_json || '{}')
		}));
	}

	async updateRecordingStatus(
		id: string,
		status: RecordingStatus,
		error_message?: string
	): Promise<void> {
		await this.db
			.prepare(
				`UPDATE recordings 
                 SET status = ?, error_message = ? 
                 WHERE id = ?`
			)
			.bind(status, error_message || null, id)
			.run();
	}

	async updateRecordingTranscription(
		id: string,
		transcription_json: string,
		analysis_json?: string
	): Promise<void> {
		await this.db
			.prepare(
				`UPDATE recordings 
                 SET transcription_json = ?, 
                     analysis_json = ?,
                     status = ?
                 WHERE id = ?`
			)
			.bind(transcription_json, analysis_json || null, 'ready', id)
			.run();
	}

	async updateRecordingPronunciation(id: string, pronunciation_analysis: string): Promise<void> {
		await this.db
			.prepare(
				`UPDATE recordings 
                 SET pronunciation_analysis = ?
                 WHERE id = ?`
			)
			.bind(pronunciation_analysis, id)
			.run();
	}

	async updateRecordingMp3ObjectKey(id: string, mp3_object_key: string): Promise<void> {
		await this.db
			.prepare(
				`UPDATE recordings 
                 SET mp3_object_key = ?
                 WHERE id = ?`
			)
			.bind(mp3_object_key, id)
			.run();
	}

	async deletePronunciationAnalysisBySessionId(sessionId: string): Promise<void> {
		await this.db
			.prepare(
				`UPDATE recordings 
                 SET pronunciation_analysis = NULL
                 WHERE session_id = ?`
			)
			.bind(sessionId)
			.run();
	}

	async deleteSession(sessionId: string): Promise<void> {
		// Due to CASCADE, this will delete associated recordings
		await this.db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
	}

	// Analysis Operations
	async createAnalysis(analysis: NewAnalysis): Promise<ParsedAnalysis> {
		const { id, session_id, analysis_json, version, status } = analysis;

		await this.db
			.prepare(
				`INSERT INTO analysis (
					id, session_id, analysis_json, created_at, version, status
				) VALUES (?, ?, ?, ?, ?, ?)`
			)
			.bind(id, session_id, analysis_json, Date.now(), version, status || 'complete')
			.run();

		const created = await this.getAnalysis(id);
		if (!created) throw new Error(`Failed to create analysis ${id}`);

		return {
			...created,
			analysis: JSON.parse(created.analysis_json)
		};
	}

	async getAnalysis(id: string): Promise<Analysis | null> {
		const result = await this.db
			.prepare('SELECT * FROM analysis WHERE id = ?')
			.bind(id)
			.first<Analysis>();

		return result || null;
	}

	async getSessionAnalysis(sessionId: string): Promise<ParsedAnalysis | null> {
		const result = await this.db
			.prepare('SELECT * FROM analysis WHERE session_id = ?')
			.bind(sessionId)
			.first<Analysis>();

		if (!result) return null;

		return {
			...result,
			analysis: JSON.parse(result.analysis_json)
		};
	}

	async updateAnalysis(id: string, analysis_json: string): Promise<void> {
		await this.db
			.prepare(
				`UPDATE analysis 
				SET analysis_json = ?
				WHERE id = ?`
			)
			.bind(analysis_json, id)
			.run();
	}

	async updateInstructorFeedback(id: string, instructor_feedback: string): Promise<void> {
		await this.db
			.prepare(
				`UPDATE sessions 
				SET instructor_feedback = ?
				WHERE id = (SELECT session_id FROM analysis WHERE id = ?)`
			)
			.bind(instructor_feedback, id)
			.run();
	}

	async updateAnalysisStatus(id: string, status: AnalysisStatus): Promise<void> {
		await this.db
			.prepare(
				`UPDATE analysis 
				SET status = ?
				WHERE id = ?`
			)
			.bind(status, id)
			.run();
	}

	async deleteAnalysisBySessionId(sessionId: string): Promise<void> {
		// DELETE will not error if no rows match - it will just delete 0 rows
		await this.db.prepare('DELETE FROM analysis WHERE session_id = ?').bind(sessionId).run();
	}

	async getSessionsWithInstructorScore(): Promise<
		{ session: Session; analysis: Analysis; recordings: ParsedRecording[] }[]
	> {
		const results = await this.db
			.prepare(
				`
				SELECT 
					s.*,
					a.id as analysis_id,
					a.analysis_json,
					a.version,
					a.status as analysis_status,
					a.created_at as analysis_created_at,
					r.id as recording_id,
					r.question_index,
					r.transcription_json,
					r.analysis_json as recording_analysis_json,
					r.pronunciation_analysis,
					r.status as recording_status,
					r.error_message,
					r.mp3_object_key,
					r.timestamp,
					r.question_text,
					r.video_object_key,
					r.audio_object_key,
					r.mime_type,
					r.duration_ms,
					s.instructor_feedback
				FROM sessions s
				INNER JOIN analysis a ON s.id = a.session_id
				LEFT JOIN recordings r ON s.id = r.session_id
				WHERE s.instructor_feedback IS NOT NULL
				ORDER BY s.created_at DESC, r.question_index ASC
			`
			)
			.all<any>();

		if (!results?.results) return [];

		console.log(`Found ${results.results.length} sessions with instructor feedback`);

		// Group recordings by session ID
		const recordingsBySession = new Map<string, ParsedRecording[]>();
		results.results.forEach((row) => {
			if (row.recording_id) {
				const recording: ParsedRecording = {
					id: row.recording_id,
					session_id: row.id,
					timestamp: row.timestamp,
					question_text: row.question_text,
					question_index: row.question_index,
					video_object_key: row.video_object_key,
					audio_object_key: row.audio_object_key,
					mp3_object_key: row.mp3_object_key,
					mime_type: row.mime_type,
					duration_ms: row.duration_ms,
					status: row.recording_status,
					error_message: row.error_message,
					transcription_json: row.transcription_json,
					analysis_json: row.recording_analysis_json,
					pronunciation_analysis: row.pronunciation_analysis,
					transcription: JSON.parse(row.transcription_json || '{}'),
					analysis: JSON.parse(row.recording_analysis_json || '{}')
				};

				const recordings = recordingsBySession.get(row.id) || [];
				recordings.push(recording);
				recordingsBySession.set(row.id, recordings);
			}
		});

		// Get unique sessions (since the JOIN might duplicate rows)
		const uniqueSessions = new Map<string, { session: Session; analysis: Analysis }>();
		results.results.forEach((row) => {
			if (!uniqueSessions.has(row.id)) {
				uniqueSessions.set(row.id, {
					session: {
						id: row.id,
						created_at: row.created_at,
						updated_at: row.updated_at,
						status: row.status,
						metadata: row.metadata,
						current_question_index: row.current_question_index,
						total_questions: row.total_questions,
						current_question: row.current_question,
						email: row.email,
						use_video: row.use_video,
						instructor_feedback: row.instructor_feedback,
						last_analysis_at: row.last_analysis_at
					},
					analysis: {
						id: row.analysis_id,
						session_id: row.id,
						created_at: row.analysis_created_at,
						analysis_json: row.analysis_json,
						version: row.version,
						status: row.analysis_status,
						instructor_feedback: null
					}
				});
			}
		});

		// Combine sessions with their recordings
		return Array.from(uniqueSessions.values()).map(({ session, analysis }) => ({
			session,
			analysis,
			recordings: recordingsBySession.get(session.id) || []
		}));
	}
}
