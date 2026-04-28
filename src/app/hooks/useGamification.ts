'use client';

import { useState, useEffect, useCallback } from 'react';

export type DiscoveryType = 'lesson' | 'project';

interface TopicEntry {
  topic: string;
  timestamp: number;
  completed: boolean; // quiz completed (lesson) or marked done (project)
  type?: DiscoveryType;
}

interface GamificationState {
  discoveries: number;
  streak: number;
  lastVisit: string | null;
  lastSessionTopics: string[]; // topics explored last session
  sessionHistory: TopicEntry[];
  achievements: {
    firstDiscovery: boolean;
    fiveDiscoveries: boolean;
    tenDiscoveries: boolean;
    firstChallenge: boolean;
    firstCamera: boolean;
    threeDayStreak: boolean;
    weekStreak: boolean;
  };
}

const STORAGE_KEY = 'overstood_gamification';

const DEFAULT_STATE: GamificationState = {
  discoveries: 0,
  streak: 0,
  lastVisit: null,
  lastSessionTopics: [],
  sessionHistory: [],
  achievements: {
    firstDiscovery: false,
    fiveDiscoveries: false,
    tenDiscoveries: false,
    firstChallenge: false,
    firstCamera: false,
    threeDayStreak: false,
    weekStreak: false,
  },
};

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

function isSameDay(dateStr: string): boolean {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);
  const [showDiscoveryToast, setShowDiscoveryToast] = useState(false);
  const [showAchievementToast, setShowAchievementToast] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GamificationState;
        const today = new Date().toDateString();
        const lastVisitDate = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : null;

        if (isSameDay(parsed.lastVisit || '')) {
          // Same day — resume session
          setState({ ...parsed, sessionHistory: [] });
          setSessionStarted(true);
        } else if (isYesterday(parsed.lastVisit || '')) {
          // Consecutive day — new session, streak lives
          const newStreak = parsed.streak + 1;
          setState({
            ...parsed,
            streak: newStreak,
            lastVisit: new Date().toISOString(),
            lastSessionTopics: parsed.sessionHistory.map(h => h.topic),
            sessionHistory: [],
            achievements: {
              ...parsed.achievements,
              threeDayStreak: newStreak >= 3 ? true : parsed.achievements.threeDayStreak,
              weekStreak: newStreak >= 7 ? true : parsed.achievements.weekStreak,
            },
          });
          setSessionStarted(true);
        } else {
          // Streak broken or first time
          const newState = {
            ...parsed,
            streak: parsed.lastVisit ? 1 : 0,
            lastVisit: new Date().toISOString(),
            lastSessionTopics: parsed.sessionHistory.map(h => h.topic),
            sessionHistory: [],
          };
          setState(newState);
          setSessionStarted(true);
        }
      } else {
        // First ever visit
        const newState: GamificationState = {
          ...DEFAULT_STATE,
          streak: 1,
          lastVisit: new Date().toISOString(),
          sessionHistory: [],
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setSessionStarted(true);
      }
    } catch {
      setSessionStarted(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.lastVisit) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state]);

  const addDiscovery = useCallback((topic: string, quizCompleted = false, type: DiscoveryType = 'lesson') => {
    const entry: TopicEntry = {
      topic,
      timestamp: Date.now(),
      completed: quizCompleted,
      type,
    };

    const newCount = state.discoveries + 1;
    const newAchievements = { ...state.achievements };
    let achievementUnlocked: string | null = null;

    // Check achievements
    if (!newAchievements.firstDiscovery) {
      newAchievements.firstDiscovery = true;
      achievementUnlocked = 'First Discovery';
    } else if (newCount >= 5 && !newAchievements.fiveDiscoveries) {
      newAchievements.fiveDiscoveries = true;
      achievementUnlocked = '5 Discoveries';
    } else if (newCount >= 10 && !newAchievements.tenDiscoveries) {
      newAchievements.tenDiscoveries = true;
      achievementUnlocked = '10 Discoveries';
    }

    setState(prev => ({
      ...prev,
      discoveries: newCount,
      achievements: newAchievements,
      sessionHistory: [...prev.sessionHistory, entry],
    }));

    setShowDiscoveryToast(true);
    setTimeout(() => setShowDiscoveryToast(false), 1800);

    if (achievementUnlocked) {
      setShowAchievementToast(achievementUnlocked);
      setTimeout(() => setShowAchievementToast(null), 2800);
    }
  }, [state.discoveries, state.achievements]);

  const completeQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      achievements: { ...prev.achievements, firstChallenge: true },
    }));
    setShowAchievementToast('Quiz Complete');
    setTimeout(() => setShowAchievementToast(null), 2800);
  }, []);

  const useCamera = useCallback(() => {
    setState(prev => ({
      ...prev,
      achievements: { ...prev.achievements, firstCamera: true },
    }));
  }, []);

  const clearSessionHistory = useCallback(() => {
    setState(prev => ({ ...prev, sessionHistory: [] }));
  }, []);

  return {
    state,
    showDiscoveryToast,
    showAchievementToast,
    addDiscovery,
    completeQuiz,
    useCamera,
    clearSessionHistory,
    sessionStarted,
    // Derived
    sessionCount: state.sessionHistory.length,
    lastSessionCount: state.lastSessionTopics.length,
    streakActive: state.streak >= 1,
    streakFire: state.streak >= 3,
  };
}
