# Overstood™ Architecture Documentation

**System**: Overstood™ — AI-powered curiosity learning platform  
**Path**: `~/Documents/teachyoung/`  
**Last Updated**: April 27, 2026

---

## Overview

Overstood™ transforms any photo into instant AI explanations + interactive quizzes. Built for curious learners (kids + adults) with a parent dashboard for progress tracking.

---

## Core Flow

```
[Camera/Upload] → [Analyze Image] → [Generate Lesson] → [Quiz] → [Save] → [Parent Dashboard]
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI GPT-4o Vision |
| Auth | Magic Link (Resend) |
| Deployment | Vercel |

---

## Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/generate` | Main capture + lesson flow |
| `/dashboard` | Parent view (progress, history) |
| `/api/analyze-image` | Vision analysis (GPT-4o) |
| `/api/generate-lesson` | Lesson generation |
| `/api/generate-repurpose` | Repurpose ideas generation |
| `/api/generate-questions` | Quiz questions |
| `/api/lessons/save` | Save lesson metadata |
| `/api/progress/save` | Save quiz results |
| `/api/lessons/history` | Fetch lesson history |

---

## Key Components

### generate/page.tsx
- Camera/upload selector
- Image preview
- **Mode selector**: Learn | Repurpose |
- Lesson/Repurpose display
- Quiz interface (Learn mode)
- Save flow

### api/analyze-image/route.ts
**Input**: Base64 image  
**Output**: `{ subject: string }`  
**Model**: GPT-4o Vision

### api/generate-lesson/route.ts
**Input**: `{ item: string, depth: "quick" | "standard" | "deep" }`  
**Output**: Lesson object with explanation + activities + quiz questions

### api/generate-repurpose/route.ts
**Input**: `{ item: string }`  
**Output**: Repurpose ideas with:
- 3 difficulty levels (Easy/Medium/Advanced)
- Materials needed
- Step-by-step instructions
- Safety notes
- Estimated time

### dashboard/page.tsx
- Recent lessons list
- **Projects tab**: Saved repurpose ideas with completion toggle
- Quiz scores
- Empty states
- Progress indicators

---

## Database Schema

### lessons table
```sql
id: uuid
lk_id: text (user identifier)
subject: text
image_url: text (nullable)
lesson_data: jsonb
depth_mode: text
type: text ("lesson" | "repurpose")  -- NEW
created_at: timestamp
```

### progress table
```sql
id: uuid
lk_id: text
lesson_id: uuid
score: int
total: int
subject: text
completed_at: timestamp
```

### projects table (NEW for Repurpose Mode)
```sql
id: uuid
lk_id: text
subject: text
ideas: jsonb (array of repurpose ideas)
status: text ("saved" | "in_progress" | "completed")
created_at: timestamp
completed_at: timestamp (nullable)
```

---

## Gamification System

- **Discovery Paths**: Tracks lesson types (Animals, Space, Inventions, etc.)
- **Projects**: Tracks repurpose projects completed
- **Streaks**: Daily engagement tracking
- **Achievements**: Milestone badges
- **Share Cards**: Export lesson summaries

---

## UI Design System

- **Base**: #08080B (near-black)
- **Accent**: Orange (single accent color)
- **Font**: Inter
- **Style**: Apple/Linear/Arc-inspired premium dark UI

---

## Modes

### Learn Mode (Original)
Flow: Photo → Explanation → Quiz → Save → Dashboard

### Repurpose Mode (NEW — April 27, 2026)
Flow: Photo → Object ID → Repurpose Ideas → Save Project → Dashboard  
Purpose: Show creative ways to upcycle/recycle any object  
Output: Actionable projects with materials, steps, difficulty ratings

---

## Environment Variables

```
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

---

## Development

```bash
cd ~/Documents/teachyoung
npx next dev --port 3000
```

Build verification:
```bash
npm run build
```

---

## Upcoming Features

- [x] Repurpose Mode — IN PROGRESS (April 27)
- [ ] Deploy to Vercel + connect overstood.app
- [ ] Enhanced parent dashboard with analytics
- [ ] Content moderation layer
- [ ] Multi-language support
