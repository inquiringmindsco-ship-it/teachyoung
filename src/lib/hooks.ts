'use client';

import { useState, useEffect, useCallback } from 'react';
import { Subject } from './types';
import { 
  getProgress, 
  saveProgress, 
  getCompletedLessons, 
  markLessonCompleted,
  getQuizScores,
  saveQuizScore,
  getStudentData,
  resetProgress
} from './storage';

// Hook for accessing and updating progress
export function useProgress() {
  const [progress, setProgress] = useState<Record<string, Record<Subject, number>>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setLoaded(true);
  }, []);

  const updateSubjectProgress = useCallback((
    studentName: 'honor' | 'noble',
    subject: Subject,
    completedLessons: number,
    totalLessons: number
  ) => {
    const newProgress = getProgress();
    const percentage = Math.round((completedLessons / totalLessons) * 100);
    newProgress[studentName][subject] = Math.max(newProgress[studentName][subject], percentage);
    saveProgress(newProgress);
    setProgress(newProgress);
  }, []);

  return { progress, updateSubjectProgress, loaded };
}

// Hook for completed lessons
export function useCompletedLessons(studentName: 'honor' | 'noble') {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompletedLessons(studentName));
  }, [studentName]);

  const markCompleted = useCallback((lessonId: string) => {
    markLessonCompleted(studentName, lessonId);
    setCompleted(getCompletedLessons(studentName));
  }, [studentName]);

  return { completed, markCompleted };
}

// Hook for quiz scores
export function useQuizScores(studentName: 'honor' | 'noble') {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    setScores(getQuizScores(studentName));
  }, [studentName]);

  const addScore = useCallback((quizId: string, score: number) => {
    saveQuizScore(studentName, quizId, score);
    setScores(getQuizScores(studentName));
  }, [studentName]);

  return { scores, addScore };
}

// Hook for full student data
export function useStudentData(studentName: 'honor' | 'noble', age: number) {
  const [studentData, setStudentData] = useState<ReturnType<typeof getStudentData> | null>(null);

  const refresh = useCallback(() => {
    setStudentData(getStudentData(studentName, age));
  }, [studentName, age]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { studentData, refresh };
}

// Hook for resetting progress (testing)
export function useResetProgress() {
  const reset = useCallback((studentName?: 'honor' | 'noble') => {
    resetProgress(studentName);
  }, []);
  return reset;
}
