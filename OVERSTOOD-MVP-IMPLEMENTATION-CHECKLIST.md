# Overstood MVP Implementation Checklist

## Build Target
One clean child-safe loop:

`camera/upload -> explanation -> quiz -> save -> parent view`

Do not add gamification, social features, advanced dashboards, subject libraries, avatars, streaks, rewards, or new product surfaces.

## 1. Exact Routes And Screens

### Route: `/generate`
Use one route with step-based screens.

- [ ] `ConsentGate`
  - Shows what Overstood does.
  - Shows that the photo is analyzed.
  - Shows that progress metadata is saved for the parent.
  - Has one action: `I am the parent and I consent`.
  - Blocks all image processing until accepted.

- [ ] `CaptureScreen`
  - Shows `Take Photo`.
  - Shows `Upload Photo`.
  - Shows selected image preview.
  - Shows `Use This Photo`.
  - Shows `Try Another Photo`.

- [ ] `ExplanationScreen`
  - Shows image preview.
  - Shows detected subject.
  - Shows loading copy: `Making your lesson...`.
  - Shows short lesson only.
  - Shows one tiny action.
  - Shows `Start Quiz`.

- [ ] `QuizScreen`
  - Shows one question at a time.
  - Shows 2-4 choices.
  - Shows selected state.
  - Shows calm feedback.
  - Shows final completion state.
  - Shows `Save Lesson`.

- [ ] `SaveCompleteScreen`
  - Shows `Saving...`.
  - Shows `Saved`.
  - Shows `Show Parent`.
  - Shows one retry button if save fails.

### Route: `/dashboard`
Use this as the parent activity view.

- [ ] Shows recent lessons.
- [ ] Shows subject.
- [ ] Shows date/time.
- [ ] Shows quiz completion if available.
- [ ] Shows `Review Lesson`.
- [ ] Shows empty state: `No lessons yet`.
- [ ] Does not show charts, streaks, child rankings, badges, or social features.

## 2. Exact APIs Needed

- [ ] `GET /api/auth/session`
  - Called before consent and before image processing.
  - If no session, stop and route parent to auth flow.

- [ ] `POST /api/analyze-image`
  - Called only after parent consent and image selection.
  - Request:

```json
{
  "image": "base64-or-temporary-image-url"
}
```

  - Response:

```json
{
  "subject": "specific image subject"
}
```

- [ ] `POST /api/generate-lesson`
  - Called after image subject is returned.
  - Request:

```json
{
  "item": "specific image subject",
  "depth": "quick"
}
```

  - Use only the short explanation, tiny action, and quiz fields needed for the MVP.

- [ ] `POST /api/generate-questions`
  - Fallback only if lesson response has no valid 3-5 question quiz.
  - Request:

```json
{
  "item": "specific image subject"
}
```

- [ ] `POST /api/lessons/save`
  - Called after quiz completion.
  - Request:

```json
{
  "subject": "specific image subject",
  "imageUrl": null,
  "lessonData": {},
  "depthMode": "quick"
}
```

- [ ] `POST /api/progress/save`
  - Called after lesson save returns.
  - Request:

```json
{
  "score": 3,
  "total": 3,
  "subject": "specific image subject",
  "lessonId": "uuid-or-null"
}
```

- [ ] `GET /api/lessons/history?limit=20`
  - Called by parent dashboard.

## 3. Database And State Needed

### Existing Supabase Tables
- [ ] `teachyoung_users`
  - Stores authenticated family/user identity through `lk_id`.

- [ ] `teachyoung_lessons`
  - Stores `user_id`, `lk_id`, `subject`, optional `image_url`, `lesson_data`, `depth_mode`, `created_at`.

- [ ] `teachyoung_quiz_scores`
  - Stores `user_id`, `lk_id`, `lesson_id`, `score`, `total`, `subject`, `created_at`.

- [ ] `teachyoung_progress`
  - Stores `lk_id`, activity timestamps, and discovery totals.
  - MVP UI should not expose streaks or gamification.

### Client State On `/generate`
- [ ] `parentConsentAccepted`
- [ ] `parentConsentAcceptedAt`
- [ ] `imagePreview`
- [ ] `imagePayload`
- [ ] `subject`
- [ ] `lessonData`
- [ ] `quizQuestions`
- [ ] `quizAnswers`
- [ ] `quizScore`
- [ ] `quizTotal`
- [ ] `lessonId`
- [ ] `step`
- [ ] `error`
- [ ] `isLoading`

### Persistence Rules
- [ ] Consent may be stored client-side for MVP, but must be tied to the authenticated session where possible.
- [ ] Lesson and quiz progress must be saved through existing API routes.
- [ ] `imageUrl` must be `null` unless retention is intentionally enabled.

## 4. Parent Consent Flow

- [ ] Load `/generate`.
- [ ] Call `GET /api/auth/session`.
- [ ] If session is missing, stop before camera/upload processing and route parent to auth flow.
- [ ] Show consent language before image selection or analysis.
- [ ] Parent clicks `I am the parent and I consent`.
- [ ] Store consent state.
- [ ] Unlock `Take Photo` and `Upload Photo`.
- [ ] Never call `POST /api/analyze-image` before consent.

## 5. Privacy And Retention Rules

- [ ] Photos are temporary by default.
- [ ] Do not store the original image by default.
- [ ] Do not pass `imageUrl` to save unless retention is intentionally enabled.
- [ ] Do not create public galleries or sharing links.
- [ ] Do not collect child location data.
- [ ] Do not collect child free-text profile data.
- [ ] Do not use child images for marketing, public display, training, or reuse.
- [ ] Parent dashboard shows only activity metadata and lesson review.
- [ ] Copy must not claim the app is certified, perfect, risk-free, or private by default.

## 6. Child-Safe UX Rules

- [ ] One primary action per screen.
- [ ] Large tap targets on mobile.
- [ ] Short calm copy.
- [ ] No dense instructions.
- [ ] No social sharing.
- [ ] No public profile language.
- [ ] No leaderboard, points, badges, streaks, or rewards.
- [ ] No dark patterns around consent.
- [ ] Retry states keep the child on the same screen.
- [ ] Failure copy should be plain: `Try another photo` or `Try again`.
- [ ] Quiz feedback should be encouraging and non-punitive.
- [ ] No horizontal overflow on mobile.

## 7. Claude Execution Order

- [ ] Read `OVERSTOOD-MVP-SPEC.md`.
- [ ] Inspect existing `/generate` and `/dashboard` implementations.
- [ ] Remove or hide non-MVP features from `/generate` only as needed for the single flow.
- [ ] Implement `ConsentGate` first.
- [ ] Wire session check with `GET /api/auth/session`.
- [ ] Wire camera/upload screen.
- [ ] Wire `POST /api/analyze-image`.
- [ ] Wire `POST /api/generate-lesson`.
- [ ] Normalize lesson and quiz data into the MVP shape.
- [ ] Add fallback `POST /api/generate-questions` only if needed.
- [ ] Wire quiz completion state.
- [ ] Wire `POST /api/lessons/save`.
- [ ] Wire `POST /api/progress/save`.
- [ ] Simplify `/dashboard` to parent activity view using `GET /api/lessons/history?limit=20`.
- [ ] Run build.
- [ ] Run smoke tests below.

## 8. Smoke Tests

### Build
- [ ] `npm run build` passes.

### Consent
- [ ] Open `/generate`.
- [ ] Confirm image processing controls are blocked until consent.
- [ ] Accept consent.
- [ ] Confirm camera/upload controls appear.

### Camera Or Upload
- [ ] Upload a test image.
- [ ] Confirm preview appears.
- [ ] Click `Use This Photo`.
- [ ] Confirm `POST /api/analyze-image` returns a subject.

### Explanation
- [ ] Confirm `POST /api/generate-lesson` runs with `depth: "quick"`.
- [ ] Confirm explanation renders without extra advanced sections.
- [ ] Confirm `Start Quiz` appears.

### Quiz
- [ ] Complete every question.
- [ ] Confirm only one question appears at a time.
- [ ] Confirm final state shows `You finished the lesson`.
- [ ] Confirm `Save Lesson` appears.

### Save
- [ ] Click `Save Lesson`.
- [ ] Confirm `POST /api/lessons/save` succeeds.
- [ ] Confirm `POST /api/progress/save` succeeds.
- [ ] Confirm `Show Parent` appears.

### Parent View
- [ ] Open `/dashboard`.
- [ ] Confirm recent lesson appears.
- [ ] Confirm subject and date/time appear.
- [ ] Confirm no gamification, charts, social features, or leaderboard content appears.

### Mobile
- [ ] Test `/generate` at mobile width.
- [ ] Test `/dashboard` at mobile width.
- [ ] Confirm no horizontal overflow.
- [ ] Confirm tap targets are usable.

## Stop Conditions

- [ ] Stop if any image API runs before parent consent.
- [ ] Stop if the app stores the original image by default.
- [ ] Stop if `/generate` turns into a multi-feature app instead of one flow.
- [ ] Stop if `/dashboard` becomes an analytics or gamification dashboard.
- [ ] Stop if any route exposes social, sharing, leaderboard, or public child content.
