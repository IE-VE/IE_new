# Itegration refactor

This free test is actually part of a bigger website that offers general IELTS training material.

The refactor we need to do is to make this part of the bigger website. We also made practices for students that we still need to integrate.

I think we need a logical url structure, someting like:

1 speaking
1a /test (the freetest)
1b /practice
2 /writing
2a /practice
3 /reading
3a /practice
4 /listening
4a /practice

The refactor will basically do:

- Make this "homepage" of this freetest under /freetest
- Add the other pages (they can be placeholders)
- Make sure there is a new homepage which is more general but mentions the freetest.
- Make sure the SEO stuff is good, keywords should be more broad now.
- We currently have google traffic going to insideielts.com and we want to be sure to keep that going to insideielts.com

# InsideIELTS Integration Plan 🔗

## 1. Objective

Merge the stand-alone Free Speaking Test into insideielts.com,
while laying the groundwork for Writing, Reading and Listening practice areas.

## 2. Success Criteria

- /freetest reachable at insideielts.com/freetest (HTTP 200)
- 301 from freetest.insideielts.com → insideielts.com/freetest
- Existing SERP positions retained (monitor Search Console & GA)
- New homepage showcases all four skills + freetest CTA
- Placeholder pages for /speaking, /writing, /reading, /listening with basic content and SEO meta

## 3. URL Architecture

| Skill     | Test             | Practice            |
| --------- | ---------------- | ------------------- |
| Speaking  | /freetest        | /speaking/practice  |
| Writing   | /writing/test?   | /writing/practice   |
| Reading   | /reading/test?   | /reading/practice   |
| Listening | /listening/test? | /listening/practice |

_"Test?" rows can stay empty until the feature exists._

## 4. Technical Tasks

1. **Routing (SvelteKit, runes mode)**

   - Move current repo under `src/routes/freetest/*`.
   - Create new `src/routes/+layout.svelte` as global shell (navigation, dark-mode defaults, etc.).
   - Scaffold empty pages for the other skills.

2. **Redirects (Cloudflare UI)**

   - Set up 301 redirects in Cloudflare dashboard (Page Rules or Bulk Redirects):
     - Source: `https://freetest.insideielts.com/*`
     - Destination: `https://insideielts.com/freetest/$1`
     - Type: 301 Permanent Redirect
     - Preserve query string: Enabled
   - Monitor redirect traffic in Cloudflare Analytics to ensure proper functioning
   - Verify with curl/browser tests after deployment

3. **SEO**

   - Update sitemap.xml + robots.txt.
   - Add canonical tags: freetest pages now canonical to insideielts.com/freetest/...
   - Broaden meta keywords (IELTS preparation, practice, band score, etc.).
   - Keep `ld+json` structured data but adjust URLs.

4. **Analytics**

   - Move GA events to global container.
   - Verify Search Console property for insideielts.com/freetest path.

5. **Dark Theme Default**

   - Keep single `<script>` that adds `dark` class; ensure no duplication (already fixed).

6. **CI/CD**
   - Update GitHub Actions pipeline to deploy both root and freetest routes.
   - Smoke tests on / /freetest /speaking/practice (place-holder)

## 5. Content Tasks

- Write short copy for new homepage highlighting all skills.
- Add "Coming soon" copy for un-implemented tests.
- Update nav & footer links across site.

## 6. Timeline & Ownership

| Task                 | Owner          | Due        |
| -------------------- | -------------- | ---------- |
| Routing scaffolding  | Dev Team       | DD-MM-YYYY |
| Redirects live       | DevOps         | ...        |
| SEO audit            | SEO lead       | ...        |
| Content placeholders | Content writer | ...        |

## 7. Risks & Mitigations

- SEO traffic drop → use 301s + keep page titles similar.
- Broken deep links → set up catch-all redirect to /freetest.
- DB schema mismatch → run migrations sequentially.
