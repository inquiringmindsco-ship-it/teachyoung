export type Grade = 'honor' | 'noble';
export type Subject = 'math' | 'reading' | 'science' | 'social-studies' | 'art' | 'music';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  grade: Grade;
  description: string;
  content: string;
  difficulty: Difficulty;
  duration: string;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId: string;
  grade: Grade;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Student {
  name: 'Honor' | 'Noble';
  grade: Grade;
  age: number;
  progress: Record<Subject, number>;
}

// ─── Overstood Repurpose Mode ─────────────────────────────────────
export type OverstoodMode = 'learn' | 'repurpose';

export type RepurposeDifficulty = 'Easy' | 'Medium' | 'Advanced';

export interface RepurposeIdea {
  title: string;
  difficulty: RepurposeDifficulty;
  estimatedTime: string;
  materials: string[];
  steps: string[];
  safetyNotes: string;
}

export interface RepurposePlan {
  whatItIs: string;
  ideas: RepurposeIdea[];
  tags: string[];
}

// Saved record (returned from /api/lessons/history)
export interface SavedLessonRecord {
  id: string;
  subject: string;
  image_url: string | null;
  depth_mode: string;
  created_at: string;
  type?: 'lesson' | 'repurpose';
  lesson_data?: unknown;
}
