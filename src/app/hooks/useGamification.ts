'use client';

import { useState, useEffect, useCallback } from 'react';

interface GamificationState {
  discoveries: number;
  streak: number;
  lastVisit: string | null;
  achievements: {
    firstDiscovery: boolean;
    fiveDiscoveries: boolean;
    tenDiscoveries: boolean;
    firstChallenge: boolean;
    firstCamera: boolean;
  };
}

const STORAGE_KEY = 'phoenix_gamification';

const DEFAULT_STATE: GamificationState = {
  discoveries: 0,
  streak: 0,
  lastVisit: null,
  achievements: {
    firstDiscovery: false,
    fiveDiscoveries: false,
    tenDiscoveries: false,
    firstChallenge: false,
    firstCamera: false,
  },
};

export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);
  const [showDiscoveryToast, setShowDiscoveryToast] = useState(false);
  const [showAchievementToast, setShowAchievementToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GamificationState;
        
        // Check if it's a new day for streak
        const today = new Date().toDateString();
        const lastVisit = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : null;
        
        if (lastVisit === today) {
          // Same day — keep streak
          setState(parsed);
        } else if (lastVisit) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastVisit === yesterday.toDateString()) {
            // Consecutive day — increment streak
            setState({ ...parsed, streak: parsed.streak + 1, lastVisit: new Date().toISOString() });
          } else {
            // Streak broken — reset
            setState({ ...parsed, streak: 1, lastVisit: new Date().toISOString() });
          }
        } else {
          // First visit
          setState({ ...parsed, streak: 1, lastVisit: new Date().toISOString() });
        }
      } else {
        // First ever visit
        const newState = { ...DEFAULT_STATE, streak: 1, lastVisit: new Date().toISOString() };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    } catch {}
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.lastVisit) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state]);

  const addDiscovery = useCallback(() => {
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
    }));

    setShowDiscoveryToast(true);
    setTimeout(() => setShowDiscoveryToast(false), 2000);

    if (achievementUnlocked) {
      setShowAchievementToast(achievementUnlocked);
      setTimeout(() => setShowAchievementToast(null), 3000);
    }
  }, [state.discoveries, state.achievements]);

  const completeChallenge = useCallback(() => {
    if (!state.achievements.firstChallenge) {
      setState(prev => ({
        ...prev,
        achievements: { ...prev.achievements, firstChallenge: true },
      }));
      setShowAchievementToast('Challenge Complete');
      setTimeout(() => setShowAchievementToast(null), 3000);
    }
  }, [state.achievements.firstChallenge]);

  const useCamera = useCallback(() => {
    if (!state.achievements.firstCamera) {
      setState(prev => ({
        ...prev,
        achievements: { ...prev.achievements, firstCamera: true },
      }));
      setShowAchievementToast('Camera Opened');
      setTimeout(() => setShowAchievementToast(null), 3000);
    }
  }, [state.achievements.firstCamera]);

  return {
    state,
    showDiscoveryToast,
    showAchievementToast,
    addDiscovery,
    completeChallenge,
    useCamera,
  };
}
