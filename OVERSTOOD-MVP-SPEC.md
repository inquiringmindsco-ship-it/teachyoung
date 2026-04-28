# Overstood MVP Spec

## Goal
Build one child-safe learning loop:

`camera or upload -> explanation -> quiz -> save -> parent view`

This MVP should feel simple enough for a child to use with a parent nearby. Do not add gamification, social features, advanced dashboards, subject libraries, avatars, streaks, rewards, or marketplace features.

## Required Flow

### 0. Parent Consent Gate
This screen appears before the first image is processed.

Shows:
- Overstood turns a photo into a short lesson and quiz.
- The photo is sent for image analysis.
- The photo should be temporary unless the parent explicitly chooses otherwise later.
- Progress metadata is saved so the parent can review activity.
- One clear button: `I am the parent and I consent`.

Stores:
- `parentConsentAccepted: true`
- `parentConsentAcceptedAt`
- `lk_id` or family/profile id from the authenticated session

API called:
- `GET /api/auth/session` to confirm the parent/family session.
- No image API is called until consent is accepted.

### 1. Camera Or Upload
One screen lets the child provide a photo.

Shows:
- `Take Photo`
- `Upload Photo`
- Image preview after selection
- `Use This Photo`
- Simple retry option if the image is wrong or unclear

Stores locally before processing:
- temporary image data for preview only
- no permanent image record yet

API called:
- None when selecting the image.
- On `Use This Photo`, call `POST /api/analyze-image` with:

```json
{
  "image": "base64-or-temporary-image-url"
}
```

Expected response:

```json
{
  "subject": "specific image subject"
}
```

### 2. Explanation
After analysis, generate one short kid-friendly lesson from the subject.

Shows:
- The image preview
- The detected subject, for example `sunflower` or `bicycle wheel`
- A loading state: `Making your lesson...`
- A short explanation after generation
- One button: `Start Quiz`
- One retry action if generation fails

Lesson must show only:
- what it is
- why it matters
- one interesting fact
- one tiny thing to try or notice

Stores locally before save:
- `subject`
- generated `lessonData`
- selected image preview only
- `lessonStartedAt`

API called:
- `POST /api/generate-lesson` with:

```json
{
  "item": "specific image subject",
  "depth": "quick"
}
```

Expected response:

```json
{
  "lesson": {
    "actually": "short opening idea",
    "whatsGoingOn": "simple explanation",
    "curiosityTraps": [],
    "activities": {
      "tryIt": "one tiny action",
      "buildIt": "",
      "goSeeIt": ""
    },
    "quiz": []
  }
}
```

Implementation note:
- The current endpoint returns extra fields. The MVP UI should display only the short explanation and one tiny action.
- If the lesson response already includes 3 quiz questions, the app may use them and skip `POST /api/generate-questions`.

### 3. Quiz
The quiz is 3-5 questions based only on the explanation.

Shows:
- One question at a time
- 2-4 answer choices per question
- Clear selected state
- Simple positive feedback after each answer
- Final result: `You finished the lesson`
- One button: `Save Lesson`

Stores locally before save:
- `quizAnswers`
- `quizScore`
- `quizTotal`
- `quizCompletedAt`

API called:
- Prefer quiz questions from `POST /api/generate-lesson`.
- If missing or invalid, call `POST /api/generate-questions` with:

```json
{
  "item": "specific image subject"
}
```

Expected response:

```json
{
  "questions": {
    "questions": []
  }
}
```

Implementation requirement:
- Claude should normalize quiz data into one UI shape:

```ts
type MvpQuizQuestion = {
  question: string
  options: string[]
  correctIndex?: number
  answerText?: string
}
```

### 4. Save
Saving happens after the quiz is completed.

Shows:
- `Saving...`
- `Saved`
- `Show Parent`
- Retry if saving fails

Stores permanently:
- `lk_id`
- `subject`
- `lesson_data`
- `depth_mode: "quick"`
- `quiz score`
- `quiz total`
- `lesson created timestamp`
- `quiz completed timestamp`
- optional `image_url` only if image retention is intentionally enabled

Do not store:
- child free-text messages
- public sharing links
- unnecessary location data
- original image by default

API called:
- First call `POST /api/lessons/save` with:

```json
{
  "subject": "specific image subject",
  "imageUrl": null,
  "lessonData": {},
  "depthMode": "quick"
}
```

Expected response:

```json
{
  "success": true,
  "lessonId": "uuid-or-local-only"
}
```

- Then call `POST /api/progress/save` with:

```json
{
  "score": 3,
  "total": 3,
  "subject": "specific image subject",
  "lessonId": "uuid-or-null"
}
```

Expected response:

```json
{
  "success": true
}
```

### 5. Parent View
The parent view is a simple activity page, not an analytics dashboard.

Shows:
- recent lessons
- subject
- date/time
- quiz completion result
- `Review Lesson`
- empty state: `No lessons yet`

Stores:
- no new child data
- view state only, if needed

API called:
- `GET /api/lessons/history?limit=20`

Expected response:

```json
{
  "lessons": [
    {
      "id": "lesson id",
      "subject": "specific image subject",
      "image_url": null,
      "depth_mode": "quick",
      "created_at": "timestamp"
    }
  ]
}
```

## Privacy Rules
- Parent consent is required before image analysis.
- Images are temporary by default.
- Do not use child images for marketing, training, public galleries, or sharing.
- Store only progress metadata needed for the parent view.
- The child should never manage privacy settings.
- The parent must be able to review activity later.
- Use plain language. Do not claim the app is certified, perfect, or risk-free.

## Build Notes For Claude
- Main child flow should live in one focused route, preferably `/generate`.
- Parent activity view should live at `/dashboard`.
- Reuse existing endpoints before creating new ones.
- Keep screens linear. The child should always know the next action.
- Keep all copy short and calm.
- If an API fails, show one retry button and keep the child on the same screen.
- If auth/session is missing, stop before image processing and route the parent to the auth flow.

## Acceptance Criteria
- Parent consent blocks image processing until accepted.
- A child can take or upload one photo.
- The app identifies the subject with `POST /api/analyze-image`.
- The app generates one short explanation with `POST /api/generate-lesson`.
- The app presents a 3-5 question quiz.
- The app saves lesson metadata with `POST /api/lessons/save`.
- The app saves quiz progress with `POST /api/progress/save`.
- The parent dashboard loads recent activity with `GET /api/lessons/history?limit=20`.
- The flow works on mobile without horizontal overflow.
- No gamification, social features, advanced dashboards, or extra UI systems are added.
