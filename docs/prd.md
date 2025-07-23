# PRD: IELTS Speaking Test

## 1. Overview

**Product Name:** InsideIELTS Speaking Test  
**Owner:** [Your Name / Product Manager / IELTS Examiner]  
**Purpose:** Provide a quick, free test that captures and analyzes a user's speaking ability using AI (via Whisper + an AI analysis layer) under IELTS-like criteria. The immediate business goal is to capture leads (user emails) and funnel them into a paid 1:1 coaching session or package.

### 1.1 Background & Motivation

IELTS stands for the International English Language Testing System – an English Language proficiency test. Globally, there are more than 4 million test takers a year, making IELTS the world's most popular English language proficiency test for higher education and global migration.

- IELTS Speaking is a common pain point for test-takers; students often seek quick feedback and demonstration of an examiner's capabilities.
- This **demo service** offers a **quick test** with **3 questions**, transcribes and evaluates user speech, and provides a summary of strengths/weaknesses.
- Users see value in a quick rating/analysis, which is a teaser for in-depth paid coaching.
- This approach helps build trust in the service and capture user emails for further marketing.

### 1.2 Goals & Objectives

1. **Lead Generation:** Collect user email addresses to feed into marketing funnels and upsell coaching sessions.
2. **Brand Credibility:** Demonstrate a credible speaking evaluation by referencing IELTS official criteria.
3. **User Engagement:** Offer immediate, tangible feedback to the user about their speaking performance.
4. **Technical Proof-of-Concept:** Build a minimal, scalable system to record user audio, transcribe, and analyze it automatically.

## 2. Scope

### 2.1 In-Scope

1. **Landing Page:**

   - Highlights the free speaking test.
   - Persuades the user to enter their email and record a short video or audio snippet.
   - Explains the unique selling point (IELTS examiner's background, quick AI analysis).

2. **Speaking Test Module:**

   - Displays **3 test questions** in sequence.
   - Supports multiple recording modes:
     - **Audio-only mode**: High-quality voice recording with noise reduction
     - **Video mode**: Full video + audio capture with face tracking
     - **Practice mode**: Unlimited attempts before final submission
     - **Quick mode**: Single-take recording for each question
   - Captures and stores data securely with automatic quality checks
   - Provides real-time audio level monitoring and feedback

3. **AI Analysis Pipeline:**

   - Uses **Whisper (API)** for transcription.
   - Processes Q&A pairs for clarity and cleans up the text (spelling, grammar, etc.).
   - Rates or scores the response with **IELTS-like criteria** (at least a band estimate or key feedback).
   - Outputs short textual feedback to the user (fluency, pronunciation, grammar, lexical resource, etc.).
   - Provides personalised exercises based on analysis results.
   - Includes detailed pronunciation analysis.

4. **Result Delivery:**

   - Summarizes the user's performance (recommendation: 3–5 bullet points).
   - Delivers a link to an HTML page with detailed results (no PDF).
   - Email is mandatory for receiving results.
   - Includes improved answer suggestions for each question.

5. **Funnel & Call-to-Action (CTA):**
   - Encourages the user to **book a 1:1 coaching session** or purchase a **coaching package**.
   - CTA integrated in the final results page and follow-up email.
   - Offers personalised exercises to improve specific areas.

### 2.2 Out of Scope (Phase 1)

- No advanced scheduling or payment gateway for the coaching sessions (can be placeholders or a simple manual process initially).
- No multiple question sets or advanced branching logic for the interview.
- No multi-language support beyond English.
- No official IELTS scoring or certification. This is an unofficial analysis.

## 3. User Flow

1. **Landing Page (LP)**

   - User visits the site.
   - Sees a headline: "Know your IELTS Band Score in under 3 minutes"
   - CTA button: "Get My Speaking Score Now"

2. **Email Capture & Consent**

   - Email is captured after the recording process.
   - User is guided to the recording page directly from the landing page.

3. **Recording Module**

   - User selects whether to use video or audio-only recording.
   - A countdown timer prepares the user before each question.
   - Question is displayed, user records their response for approximately 45 seconds per question.
   - User can review their recording and re-record if needed.
   - Once all recordings are complete, user enters their email to receive results.

4. **AI Analysis Pipeline**

   - The audio file is **sent to the server**.
   - **Whisper** (transcription) processes the audio -> text.
   - The system organizes Q&A pairs.
   - The text is fed into an **AI-based script** to generate:
     - A corrected script with improved answers.
     - **IELTS-like band score estimate**.
     - Strengths/weaknesses in fluency, pronunciation, grammar, lexical resource.
     - Key advice for improvement.
     - Personalised exercises for improvement.

5. **Results Page Generation**

   - The system **stores** user data (audio, transcript, rating) in the database.
   - A unique URL is created for the user's result.

6. **Email Delivery**

   - An **email** is sent to the user with a link to the **Results Page**.
   - The email includes a brief summary and encourages the user to view the detailed analysis.

7. **Results Page**

   - Shows user's band estimate or rating.
   - Shows bullet-point feedback.
   - Provides corrected/improved answers for each question.
   - Includes personalised practice exercises.
   - CTA: "Improve Your Score – Book a 1:1 Session with Our Certified IELTS Examiner"
   - Option to view original recordings.

8. **Funnel**
   - Users are encouraged to book coaching sessions through the upsell card.
   - Follow-up email system in place to nurture leads.

## 4. Functional Requirements

### 4.1 Landing Page

- **Persuasive copy:** Summarize the unique value proposition (UVP: free test, quick feedback, real examiner's rating approach).
- **Clear CTA:** "Get My Speaking Score Now" with a minimal design.
- **Responsive Design:** Mobile-first approach, since many users might access on phones.

### 4.2 Recording Module

1. **Record Audio/Video:**

   - Handles microphone and camera access in the browser.
   - User can choose between video or audio-only recording.
   - 45-second countdown timer for each question.
   - Automatic stop when time runs out or user can manually end the recording.
   - Preview mode allows users to review their recordings.

2. **Multiple Browsers Compatibility:**

   - Works smoothly on Chrome, Firefox, Safari, Edge.
   - Degrades to audio-only if the user's browser doesn't support video APIs.

3. **Security & Consent:**

   - Displays appropriate permissions requests for microphone and camera access.

4. **Uploading Mechanism:**
   - On completing the recording, files are uploaded to a secure cloud storage.
   - Progress indicator shows upload status.

### 4.3 AI Processing Pipeline

1. **Transcription (Whisper):**

   - Audio is transcribed to text.
   - Handles potential transcription errors or empty files gracefully.

2. **Question/Answer Parsing:**

   - The system knows the 3 questions asked.
   - Organizes Q&A pairs for analysis.

3. **AI Rating:**

   - Analyzes the text with reference to IELTS speaking band descriptors.
   - Output includes:
     - Approximate band rating (e.g., 5.5, 6.0, 7.0).
     - Feedback on fluency, grammar, pronunciation, lexical resource.
     - Improved/corrected answers for each question.
     - Personalised exercises for improvement.

4. **Pronunciation Analysis:**

   - Detailed analysis of pronunciation patterns.
   - Integration with IELTS band descriptors for pronunciation scoring.

5. **Report Generation:**
   - Creates an HTML page with the user's results.
   - Includes interactive elements for viewing recordings and exercises.

### 4.4 Results & Delivery

1. **Results Storage:**

   - Database stores user email, audio links, transcripts, ratings, feedback, and timestamps.
   - Supports multiple analysis versions when reanalyzing.

2. **Email Sending:**

   - Uses an email service to send users their unique results link.
   - HTML email template with professional formatting.

3. **Results Page / Link:**

   - Accessible via a unique session ID.
   - Displays:
     - Band score and breakdown
     - Feedback on different criteria
     - Question and answer review with improved versions
     - Personalised exercises
     - Option to view original recordings
     - Upsell for coaching services

4. **User Interactions:**
   - Toggle visibility of exercise details.
   - Play back original recordings.
   - Navigate through different sections of analysis.

### 4.5 Booking/Coaching CTA

- **Upsell card** presents coaching options and benefits.
- Prominent call-to-action for booking coaching sessions.
- Tracking of user interactions with upsell features.

## 5. Non-Functional Requirements

1. **Performance:**

   - The transcription and AI analysis should complete efficiently to maintain user engagement.
   - Optimized media handling for faster uploads and processing.

2. **Reliability:**

   - The system should handle moderate volume without timeouts.
   - Error handling for recording, upload, and analysis failures.
   - Queue system for processing analysis requests.

3. **Security & Privacy:**

   - Audio and video files stored securely with unique identifiers.
   - Adherence to data protection regulations.
   - Secure processing of user data.

4. **Scalability:**

   - Architecture supports increased load.
   - Ability to reanalyze sessions with updated AI models.

5. **Maintainability:**

   - Modular code structure for future enhancements.
   - Version control for AI analysis models.

6. **Version Control & Change Management:**
   - Database schema version control through migrations.
   - Feature versioning for AI analysis models.
   - Tracking of analysis versions for each session.

## 6. Milestones & Timeline

This section outlines the development timeline that has been implemented:

1. **Phase 1**:

   - Landing page implementation
   - Basic server architecture
   - Email capture functionality

2. **Phase 2**:

   - Recording module with audio/video support
   - Storage integration

3. **Phase 3**:

   - Whisper API integration for transcription
   - Basic AI analysis

4. **Phase 4**:

   - Results page with detailed feedback
   - Email notification system

5. **Phase 5**:

   - Enhanced AI analysis with exercises
   - UI/UX improvements
   - Upsell integration

6. **Ongoing**:
   - Iterative improvements based on user feedback
   - Analysis model updates

## 7. Dependencies

- **Whisper API**: For transcription.
- **OpenAI API**: For evaluating and summarizing user's spoken content.
- **Cloudflare R2**: For audio/video storage.
- **Cloudflare D1**: For database storage.
- **Postmark**: For transactional emails.
- **SvelteKit**: Frontend framework.
- **Cloudflare Workers**: Backend serverless platform.

## 8. Risks & Assumptions

1. **API Costs**: High usage of OpenAI APIs can incur costs. We assume initial traffic is manageable.
2. **Accuracy**: Transcription errors may affect the AI's rating quality. Clear disclaimers about "unofficial estimate."
3. **User Privacy**: Some users might be hesitant to record audio/video; mitigate with a clear privacy statement.
4. **Processing Time**: AI analysis might take some time; ensure user patience with a "Please wait" message or asynchronous approach with email notification.
5. **Browser Compatibility**: Recording functionality might vary across browsers and devices.

## 9. Future Enhancements

- **Longer Test**: More questions or part-by-part structure (Part 1, Part 2, Part 3) for a realistic IELTS simulation.
- **Advanced Video Analysis**: More detailed body language or facial expressions analysis.
- **Paid Tier**: Premium features for subscribers.
- **Scheduling & Payment**: Fully integrate booking system + online payments for 1:1 sessions.
- **Multilingual Support**: Potentially localize landing pages for different markets.
- **Instructor Feedback**: Enable human examiners to provide additional feedback on recordings.

---

## 10. Appendix

- **IELTS Criteria Reference**: For internal calibration, see official IELTS Band Descriptors for Speaking: (Fluency, Lexical Resource, Grammatical Range and Accuracy, Pronunciation).
- **Branding Guidelines**: Colors, fonts, logos. (If any exist).
- **Disclaimers**: Must state "Unofficial test, not affiliated with IELTS/British Council/IDP."

---

## Summary

This PRD sets the foundation for an IELTS Speaking test application that captures audio/video, analyzes it via AI, and provides detailed results to showcase expertise as an IELTS Speaking examiner and generate leads. The flow focuses on providing value through detailed analysis while driving conversions for 1:1 coaching.
