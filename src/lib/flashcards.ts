'use client';

import { Subject } from './types';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  grade: 'honor' | 'noble';
  deck: string;
  // SM-2 Algorithm fields
  easeFactor: number;  // Default 2.5
  interval: number;    // Days until next review
  repetitions: number; // Times reviewed successfully
  nextReview: number;  // Timestamp of next review
  created: number;
  lastReviewed: number | null;
}

export interface Deck {
  id: string;
  name: string;
  subject: Subject;
  grade: 'honor' | 'noble';
  description: string;
  cardCount: number;
  dueCount: number;
}

export interface ReviewLog {
  cardId: string;
  quality: number; // 0-5
  reviewedAt: number;
  responseTime: number; // ms
}

// SM-2 Algorithm Implementation
export function calculateNextReview(card: Flashcard, quality: number): Flashcard {
  // quality: 0-5
  // 0-2: Failure (reset)
  // 3: Hard
  // 4: Good
  // 5: Easy

  let { easeFactor, interval, repetitions } = card;
  const now = Date.now();

  if (quality < 3) {
    // Failed - reset
    repetitions = 0;
    interval = 1;
  } else {
    // Success
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    
    repetitions += 1;
    
    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Minimum ease factor
    if (easeFactor < 1.3) easeFactor = 1.3;
  }

  // Calculate next review timestamp
  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastReviewed: now,
  };
}

export function getQualityLabel(quality: number): { label: string; color: string } {
  switch (quality) {
    case 0: return { label: 'Blackout', color: 'bg-gray-900 text-white' };
    case 1: return { label: 'Wrong', color: 'bg-red-500 text-white' };
    case 2: return { label: 'Hard', color: 'bg-orange-500 text-white' };
    case 3: return { label: 'Good', color: 'bg-blue-500 text-white' };
    case 4: return { label: 'Great', color: 'bg-green-500 text-white' };
    case 5: return { label: 'Easy', color: 'bg-emerald-500 text-white' };
    default: return { label: 'Unknown', color: 'bg-gray-500 text-white' };
  }
}

// Storage functions
const FLASHCARDS_KEY = 'teachyoung_flashcards';
const REVIEWS_KEY = 'teachyoung_reviews';

export function getAllFlashcards(): Flashcard[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FLASHCARDS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveFlashcards(cards: Flashcard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
}

export function getFlashcardsByDeck(deckId: string): Flashcard[] {
  return getAllFlashcards().filter(c => c.deck === deckId);
}

export function getDueCards(studentName: 'honor' | 'noble'): Flashcard[] {
  const now = Date.now();
  return getAllFlashcards()
    .filter(c => c.grade === studentName && c.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}

export function updateCard(card: Flashcard): void {
  const cards = getAllFlashcards();
  const index = cards.findIndex(c => c.id === card.id);
  if (index !== -1) {
    cards[index] = card;
    saveFlashcards(cards);
  }
}

export function getReviewLogs(): ReviewLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REVIEWS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addReviewLog(log: ReviewLog): void {
  const logs = getReviewLogs();
  logs.push(log);
  if (logs.length > 10000) {
    // Keep only last 10000 logs
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(logs.slice(-10000)));
  } else {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(logs));
  }
}

export function getDeckStats(deckId: string, studentName: 'honor' | 'noble'): { total: number; due: number; mastered: number; learning: number } {
  const cards = getFlashcardsByDeck(deckId).filter(c => c.grade === studentName);
  const now = Date.now();
  
  return {
    total: cards.length,
    due: cards.filter(c => c.nextReview <= now).length,
    mastered: cards.filter(c => c.interval >= 21).length, // 3+ weeks
    learning: cards.filter(c => c.interval < 21).length,
  };
}

export function createNewCard(front: string, back: string, subject: Subject, grade: 'honor' | 'noble', deck: string): Flashcard {
  const now = Date.now();
  return {
    id: `${deck}_${now}_${Math.random().toString(36).substr(2, 9)}`,
    front,
    back,
    subject,
    grade,
    deck,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: now, // Due immediately
    created: now,
    lastReviewed: null,
  };
}
