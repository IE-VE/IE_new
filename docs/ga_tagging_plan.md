Below is a concise **Google Analytics (GA4) Tagging Plan** tailored to this IELTS Speaking Test MVP. It focuses on the critical steps in the user journey (landing → record → analyze → results → CTA) without overloading you with unnecessary events. Where relevant, we'll reference pushes to the **dataLayer** so you can handle these events in **Google Tag Manager (GTM)** and forward them to GA4.

---

## 1. Tracking Approach

- **Use GA4:** Recommended for modern analytics.
- **Implement via Google Tag Manager:** Insert your GA4 Measurement ID in GTM.
- **Page Views + Key Funnel Events:** We'll track both standard pageviews and critical conversion steps.

---

## 2. Data Layer & GA4 Events

### 2.1 Overview of Key Events

Below is a list of the most important user interactions you'll want to measure:

1. **Page Views**

   - **Landing Page View**
   - **Recording Page View**
   - **Completion/Results Page View**

2. **CTA Click: "Start My Free Test"**

   - Helps measure how many users click through from the Landing Page to begin the test.

3. **Recording Flow**

   - **Recording Start**
   - **Recording Stop** (or auto-stop after 45 seconds)

4. **Test Progress**

   - "Next Question" or "Answered Question X"

5. **Email Submit / Form Submit**

   - Tracks how many users actually provide their email.

6. **Completion**

   - **"Test Completed"** event (final question answered).
   - Possibly separate from the "Email Submitted" event.

7. **Book a Coaching Session** (CTA click from the results or email link)
   - Critical as an eventual conversion event.

### 2.2 Minimal Data Layer Structure

Below is an example structure you can use for each event. Note that you can simplify or expand the parameters as needed:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
	event: 'event_name_here', // e.g., "cta_click", "start_recording"
	eventCategory: 'IELTS_Speaking',
	eventAction: 'user_action_here',
	eventLabel: 'additional_info_here',
	// Additional parameters if relevant:
	sessionId: 'ABCD1234', // your session ID if needed
	questionNumber: 1, // for question-based events
	emailProvided: 'user@example.com' // for form submission events
});
```

In GA4, you'll typically map these `event` names (and parameters) to your custom or recommended events.

---

## 3. Detailed Event Plan

Below is a simple table outlining each event, where it fires, what's captured, and example data layer pushes.

> **Tip:** The actual naming convention can vary; pick clear, consistent names.

| **Event**                                | **Event Name**       | **Where / Trigger**                                                                  | **Parameters**                                      | **Example dataLayer Push**                                                                                                                                                    |
| ---------------------------------------- | -------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Page View** (Landing)               | `page_view`          | Every time user lands on the homepage (`/`, or `/landing`).                          | - page_title<br>- page_location <br>- page_referrer | _No custom push needed if you rely on built-in GA4 page view tracking._                                                                                                       |
| **2. CTA Click**<br>"Start My Free Test" | `cta_click`          | When user clicks on the main CTA button on the landing page.                         | - button_text: `"Start My Free Test"`               | `js\nwindow.dataLayer.push({\n  event: "cta_click",\n  eventCategory: "IELTS_Speaking",\n  eventAction: "click",\n  eventLabel: "Start Test - Landing"\n});`                  |
| **3. Page View** (Record)                | `page_view`          | When user arrives on the recording page (`/record`).                                 | - page_title<br>- page_location                     | _Same as above (built-in GA4 page view tracking), but ensure GTM is firing on the new route._                                                                                 |
| **4. Start Recording**                   | `start_recording`    | When user presses the "Record" button.                                               | - questionNumber<br>- sessionId                     | `js\nwindow.dataLayer.push({\n  event: "start_recording",\n  questionNumber: currentQuestionIndex + 1,\n  sessionId: session.id\n});`                                         |
| **5. Stop Recording**                    | `stop_recording`     | When user presses "Stop" or recording auto-stops after 45s.                          | - questionNumber<br>- sessionId                     | `js\nwindow.dataLayer.push({\n  event: "stop_recording",\n  questionNumber: currentQuestionIndex + 1,\n  sessionId: session.id\n});`                                          |
| **6. Next Question**                     | `next_question`      | After user confirms and uploads their response, moving to next Q.                    | - questionNumber<br>- sessionId                     | `js\nwindow.dataLayer.push({\n  event: "next_question",\n  questionNumber: currentQuestionIndex + 1,\n  sessionId: session.id\n});`                                           |
| **7. Test Completion**                   | `test_completed`     | Once user has finished all 3 questions (just before the "Completed" page).           | - sessionId                                         | `js\nwindow.dataLayer.push({\n  event: "test_completed",\n  sessionId: session.id\n});`                                                                                       |
| **8. Page View** (Completed / Results)   | `page_view`          | When the user lands on the final results page (`/record` showing completed)          | - page_title<br>- sessionId                         | _Built-in GA4 page view if using standard GTM and route-based triggers._                                                                                                      |
| **9. Email Submission**                  | `email_submit`       | On "Send Me My Results" button submit.                                               | - email<br>- sessionId                              | `js\nwindow.dataLayer.push({\n  event: "email_submit",\n  eventCategory: "IELTS_Speaking",\n  eventAction: "form_submit",\n  email: userEmail,\n  sessionId: session.id\n});` |
| **10. Book Coaching Click**              | `coaching_cta_click` | When user clicks the "Book a 1:1 Coaching" button or link in the email/results page. | - sessionId                                         | `js\nwindow.dataLayer.push({\n  event: "coaching_cta_click",\n  eventAction: "click",\n  eventLabel: "Book Coaching"\n});`                                                    |

### Notes

- **Event Parameters** in GA4: Instead of `eventCategory`, `eventAction`, and `eventLabel` (Universal Analytics style), you can pass custom parameters (e.g., `button_text`, `questionNumber`, `sessionId`) directly in GA4.
- **Conversions**: You likely want to mark **Email Submission** (`email_submit`) and **Book Coaching** (`coaching_cta_click`) as conversion events in GA4. That way you can track how many leads you get.

---

## 4. Implementation Tips

1. **Pageview Tracking**

   - GA4 uses an _automatic_ page_view event when the GTM container is loaded. However, in a single-page app (SPA) or SvelteKit scenario, you must ensure each route change triggers a page_view event (either via GTM's History Change trigger or a custom dataLayer push on route change).

2. **Setup in GTM**

   - Create a **Custom Event** Trigger in GTM for each of the event names above (e.g., "cta_click").
   - Create a corresponding **GA4 Event Tag** that fires on that Custom Event Trigger.
   - In the **GA4 Event Tag**, map relevant data from the dataLayer to GA4 event parameters.

3. **Mark Conversion Events**

   - In your GA4 property, go to **Configure → Events** and mark `email_submit` and/or `coaching_cta_click` as conversions.

4. **Testing**
   - Use GTM's Preview Mode to confirm your events are pushing into the dataLayer and that the GA4 Tag is firing.
   - Check the **Realtime** report in GA4 to see events come through.

---

## 5. Keeping It Simple vs. Future Add-Ons

**Simple Approach (Recommended Initially):**

- Track each major button click + final conversion steps (email submit, coaching CTA).
- Use standard page_view for each route.

**Potential Future Enhancements:**

- Track **time_on_page** or **scroll_depth** on the landing page to see if users are reading your content.
- Capture more granular question-level details (e.g., how many re-records a user does).
- A/B test different CTA designs or question sets.

---

## 6. Quick Reference: Sample Code Snippets

**Example: "Start My Free Test" button**

```html
<button on:click="{()" ="">
	{ window.dataLayer.push({ event: "cta_click", eventCategory: "IELTS_Speaking", eventAction:
	"click", eventLabel: "Start Test - Landing" }); // Then navigate to /record }} > Start My Free
	Test
</button>
```

**Example: Stopping Recording**

```js
function stopRecording() {
	// ... your existing code ...
	window.dataLayer.push({
		event: 'stop_recording',
		questionNumber: currentQuestionIndex + 1,
		sessionId: session?.id || 'unknown'
	});
}
```

**Example: Email Submission**

```html
<form onsubmit="{handleSubmit}">
	<!-- user types email -->
	<button on:click="{()" ="">
		{ window.dataLayer.push({ event: "email_submit", eventCategory: "IELTS_Speaking", eventAction:
		"form_submit", email: email, sessionId: session?.id || "unknown" }); }} > Send Me My Results
	</button>
</form>
```

---

## 7. Summary

1. **Track Only the Critical Events**: Page views, start/stop recording, question progress, email submission, and coaching CTA.
2. **Push Data to the dataLayer**: This ensures clean separation of data collection (GTM) from your Svelte code.
3. **Use GA4 Custom Event Tags**: In GTM, map these events to GA4, mark your highest-value events as conversions.
4. **Keep an Eye on Funnel**: You can then analyze your funnel: _Landing Page → Start Test → Complete Test → Email Submit → Coaching CTA._

This setup is "simple but effective" for your MVP. You'll capture the entire user journey from landing on the site to completing the test and eventually clicking to book a session—without cluttering your analytics with too many micro-events.
