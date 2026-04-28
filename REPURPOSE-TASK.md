# Overstood™ Repurpose Mode — Implementation Task

## Overview
Add a "Repurpose Mode" to Overstood™ — when users snap a photo of any object, AI suggests creative ways to repurpose, upcycle, or recycle it with actionable steps.

## Current Architecture
- `src/app/generate/page.tsx` — Main flow (camera → analyze → lesson → quiz → save)
- `src/app/api/analyze-image/route.ts` — Vision analysis API  
- `src/app/api/generate-lesson/route.ts` — Lesson generation API
- `src/app/dashboard/page.tsx` — Parent view
- `src/lib/types.ts` — TypeScript types
- `OVERSTOOD-MVP-SPEC.md` — Product spec

## What to Build

### 1. Mode Selection UI
Add toggle on generate page:
- "Learn" (current: what is this?)
- "Repurpose" (new: what can I make?)

### 2. Repurpose Flow
When Repurpose mode is active:
- Same camera/upload step
- Same `analyze-image` endpoint
- NEW: `generate-repurpose` endpoint or modify `generate-lesson` with `mode` param
- Output format:
  - What the object is (brief)
  - 3 repurposing ideas with difficulty (Easy/Medium/Advanced)
  - Materials needed per idea
  - Step-by-step instructions (3-5 steps)
  - Safety notes
  - Estimated time
- "Save to My Projects" instead of quiz

### 3. Discovery Type
Add "project" or "repurpose" as discovery type in gamification

### 4. Dashboard Update
Show saved projects with "Completed" toggle

### 5. UI Polish
Match Overstood's premium dark UI (#08080B base, Inter font, orange accent)

## Technical Notes
- Use existing GPT-4o Vision — change system prompt for repurpose mode
- Store in same `lessons` table (add `type: 'lesson' | 'repurpose'` column)
- Keep linear flow per mode

## Deliverables
1. Implementation plan doc (`REPURPOSE-IMPLEMENTATION-PLAN.md`)
2. Mode selection UI code
3. New/modified API endpoint
4. Dashboard updates
5. Updated types and gamification
6. Build verification passes

## Do Not
- Break existing Learn mode
- Add complex state management
- Create new tables unless necessary

When finished, write summary to `REPURPOSE-IMPLEMENTATION-PLAN.md` with files changed, schema changes, testing instructions.
