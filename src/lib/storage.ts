'use client';

import { Student, Subject } from './types';

const STORAGE_KEY = 'teachyoung_progress';

// Get all progress from localStorage
export function getProgress(): Record<string, Record<Subject, number>> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with zeros for both students
    return {
      'honor': { math: 0, reading: 0, science: 0, 'social-studies': 0, art: 0, music: 0 },
      'noble': { math: 0, reading: 0, science: 0, 'social-studies': 0, art: 0, music: 0 },
    };
  }
  return JSON.parse(stored);
}

// Save progress to localStorage
export function saveProgress(progress: Record<string, Record<Subject, number>>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Update a specific subject progress for a student
export function updateSubjectProgress(
  studentName: 'honor' | 'noble',
  subject: Subject,
  completedLessons: number,
  totalLessons: number
): void {
  const progress = getProgress();
  const percentage = Math.round((completedLessons / totalLessons) * 100);
  progress[studentName][subject] = Math.max(progress[studentName][subject], percentage);
  saveProgress(progress);
}

// Get completed lesson IDs for a student
export function getCompletedLessons(studentName: 'honor' | 'noble'): string[] {
  if (typeof window === 'undefined') return [];
  const key = `teachyoung_completed_${studentName}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

// Mark a lesson as completed
export function markLessonCompleted(studentName: 'honor' | 'noble', lessonId: string): void {
  const completed = getCompletedLessons(studentName);
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(`teachyoung_completed_${studentName}`, JSON.stringify(completed));
  }
}

// Get quiz scores for a student
export function getQuizScores(studentName: 'honor' | 'noble'): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const key = `teachyoung_quiz_scores_${studentName}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

// Save a quiz score
export function saveQuizScore(studentName: 'honor' | 'noble', quizId: string, score: number): void {
  const scores = getQuizScores(studentName);
  // Keep the best score
  scores[quizId] = Math.max(scores[quizId] || 0, score);
  localStorage.setItem(`teachyoung_quiz_scores_${studentName}`, JSON.stringify(scores));
}

// Get student data with real progress
export function getStudentData(studentName: 'honor' | 'noble', age: number): Student & {
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  completedLessons: string[];
  quizScores: Record<string, number>;
} {
  const progress = getProgress();
  const completedLessons = getCompletedLessons(studentName);
  const quizScores = getQuizScores(studentName);
  
  const quizzesTaken = Object.keys(quizScores).length;
  const averageScore = quizzesTaken > 0 
    ? Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / quizzesTaken)
    : 0;
  
  const totalCompleted = completedLessons.length;
  
  return {
    name: studentName === 'honor' ? 'Honor' : 'Noble',
    grade: studentName,
    age,
    progress: progress[studentName],
    lessonsCompleted: totalCompleted,
    quizzesTaken,
    averageScore,
    completedLessons,
    quizScores,
  };
}

// Reset all progress (for testing)
export function resetProgress(studentName?: 'honor' | 'noble'): void {
  if (studentName) {
    localStorage.removeItem(`teachyoung_completed_${studentName}`);
    localStorage.removeItem(`teachyoung_quiz_scores_${studentName}`);
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('teachyoung_completed_honor');
    localStorage.removeItem('teachyoung_completed_noble');
    localStorage.removeItem('teachyoung_quiz_scores_honor');
    localStorage.removeItem('teachyoung_quiz_scores_noble');
  }
}
