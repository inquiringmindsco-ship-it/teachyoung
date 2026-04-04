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
