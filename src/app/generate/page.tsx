'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ArrowRight, ChevronDown, ChevronUp, Zap, Eye, Wrench, RotateCcw, Share2, Check, X, Bookmark, Volume2, Lock, AlertTriangle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useGamification } from '../hooks/useGamification';
import { getCuratedRelated } from '../hooks/useDiscoveryPaths';
import { useAuth } from '../hooks/useAuth';

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

interface LessonPlan {
  actually: string;
  whatsGoingOn: string;
  curiosityTraps: string[];
  activities: {
    tryIt: string;
    buildIt: string;
    goSeeIt: string;
  };
  quiz: QuizQuestion[];
  unlockMore: string[];
}

// ─── Logo SVG ────────────────────────────────────────────────────
function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="lgA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35"/>
          <stop offset="100%" stopColor="#D4A847"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#lgA)" strokeWidth="6"/>
      <path d="M50 14 A36 36 0 0 1 81 35" fill="none" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M50 14 A36 36 0 0 0 19 35" fill="none" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="5" fill="url(#lgA)"/>
    </svg>
  );
}

// ─── Expandable Layer ────────────────────────────────────────────
function Layer({
  icon, label, color, children, defaultOpen = false, pulse = false
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  pulse?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: open ? 'rgba(255,255,255,0.03)' : '#0C0C10',
          border: `1px solid ${open ? color + '30' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: 14,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
          animation: !open && pulse ? 'quizGlow 2s ease-in-out infinite' : 'none',
        }}
      >
        <style>{`@keyframes quizGlow { 0%,100%{box-shadow:0 0 0 0 rgba(184,102,214,0)} 50%{box-shadow:0 0 12px 2px rgba(184,102,214,0.3)} }`}</style>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color, flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#CCC', fontFamily: 'inherit' }}>{label}</span>
        {open
          ? <ChevronUp style={{ width: 16, height: 16, color: '#555' }} />
          : <ChevronDown style={{ width: 16, height: 16, color: '#555' }} />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 18px 20px', background: 'rgba(255,255,255,0.015)', border: `1px solid ${color}20`, borderTop: 'none', borderRadius: '0 0 14px 14px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Curiosity Trap ─────────────────────────────────────────────
function CuriosityTrap({ text }: { text: string }) {
  return (
    <div style={{
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.025)',
      borderRadius: 10,
      marginBottom: 8,
      borderLeft: '3px solid #FF6B35',
    }}>
      <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, fontStyle: 'italic' }}>{text}</p>
    </div>
  );
}

// ─── Activity Pill ──────────────────────────────────────────────
function ActivityPill({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div style={{
      flex: '1 1 auto',
      minWidth: 100,
      maxWidth: '100%',
      padding: '12px 10px',
      background: '#0C0C10',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ color: '#FF6B35' }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <p style={{ fontSize: 12, color: '#777', lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

// ─── Quiz Section ───────────────────────────────────────────────
function QuizSection({ quiz, onComplete }: { quiz: QuizQuestion[]; onComplete: (correct: number, total: number) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const current = quiz[step];
  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const newAnswers = [...answers, i];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (step + 1 < quiz.length) {
        setStep(step + 1);
        setSelected(null);
      } else {
        setDone(true);
        const correct = newAnswers.filter((a, idx) => a === quiz[idx].answer).length;
        onComplete(correct, quiz.length);
      }
    }, 900);
  };

  if (done) {
    const correct = answers.filter((a, i) => a === quiz[i].answer).length;
    const pct = correct / quiz.length;
    let message = 'Keep exploring.';
    if (pct === 1) message = 'Locked in. You understand this.';
    else if (pct >= 0.66) message = 'Solid. You\'re getting this.';
    else if (pct >= 0.33) message = 'Getting there. Keep questioning.';

    return (
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
          {quiz.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i < correct ? '#00C896' : '#FF4444',
            }} />
          ))}
        </div>
        <p style={{
          fontSize: 32, fontWeight: 700,
          color: pct === 1 ? '#00C896' : pct >= 0.5 ? '#F5F5F7' : '#FF6B35',
          marginBottom: 8, letterSpacing: '-0.02em'
        }}>
          {correct}/{quiz.length}
        </p>
        <p style={{ fontSize: 14, color: '#777' }}>{message}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
        {quiz.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i < step ? '#00C896' : i === step ? '#FF6B35' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      <p style={{ fontSize: 14, color: '#AAA', lineHeight: 1.5, marginBottom: 16, textAlign: 'center' }}>{current.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {current.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === current.answer;
          const show = selected !== null;
          let bg = 'rgba(255,255,255,0.03)';
          let border = 'rgba(255,255,255,0.07)';
          let color = '#777';
          if (show) {
            if (isCorrect) { bg = 'rgba(0,200,150,0.1)'; border = 'rgba(0,200,150,0.3)'; color = '#00C896'; }
            else if (isSelected) { bg = 'rgba(255,68,68,0.1)'; border = 'rgba(255,68,68,0.3)'; color = '#FF4444'; }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                width: '100%',
                padding: '13px 16px',
                background: isSelected ? bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? border : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 10,
                color: show ? color : '#888',
                fontSize: 13,
                textAlign: 'left',
                cursor: show ? 'default' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                background: show ? (isCorrect ? '#00C896' : isSelected ? '#FF4444' : 'rgba(255,255,255,0.05)') : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontSize: 11, fontWeight: 700,
              }}>
                {show
                  ? (isCorrect ? <Check style={{ width: 12, height: 12, color: 'white' }} /> : isSelected ? <X style={{ width: 12, height: 12, color: 'white' }} /> : String.fromCharCode(65 + i))
                  : String.fromCharCode(65 + i)
                }
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Unlock More ─────────────────────────────────────────────────
function UnlockMore({ topics, onSelect, sessionTopics }: { topics: string[]; onSelect: (t: string) => void; sessionTopics: string[] }) {
  const [saved, setSaved] = useState<string[]>([]);

  const toggleSave = (e: React.MouseEvent, topic: string) => {
    e.stopPropagation();
    setSaved(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  return (
    <div>
      {/* Session chain */}
      {sessionTopics.length > 0 && (
        <div style={{ marginBottom: 18, padding: '12px 14px', background: 'rgba(255,107,53,0.04)', border: '1px solid rgba(255,107,53,0.08)', borderRadius: 10 }}>
          <p style={{ fontSize: 10, color: '#FF6B35', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Tonight&apos;s chain</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            {sessionTopics.map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                {t}
                {i < sessionTopics.length - 1 && <ArrowRight style={{ width: 9, height: 9, opacity: 0.3 }} />}
              </span>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: 12, color: '#444', marginBottom: 12 }}>
        {sessionTopics.length > 0 ? 'Keep the chain going.' : 'What to explore next.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {topics.slice(0, 4).map((topic, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onSelect(topic)}
              style={{
                flex: 1,
                padding: '13px 14px',
                background: 'rgba(255,107,53,0.04)',
                border: '1px solid rgba(255,107,53,0.1)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span style={{ flex: 1, fontSize: 13, color: '#AAA', fontWeight: 500 }}>{topic}</span>
              <ArrowRight style={{ width: 14, height: 14, color: '#FF6B35', flexShrink: 0 }} />
            </button>
            <button
              onClick={(e) => toggleSave(e, topic)}
              style={{
                padding: '13px 10px',
                background: saved.includes(topic) ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Bookmark style={{ width: 14, height: 14, color: saved.includes(topic) ? '#FF6B35' : '#444', fill: saved.includes(topic) ? '#FF6B35' : 'none' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Share Card ──────────────────────────────────────────────────
function ShareCard({ result, item }: { result: LessonPlan; item: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.9, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `overstood-${item}.png`;
      link.href = dataUrl;
      link.click();
    } catch { /* cancelled */ }
  }, [item]);

  return (
    <div className="hidden">
      <div ref={cardRef} style={{ width: 600, height: 700, background: '#08080B', padding: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <LogoMark size={32} />
          <span style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>OVERSTOOD</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#F5F5F7', marginBottom: 8, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>{item}</h1>
        {result.actually && (
          <div style={{ background: 'rgba(255,107,53,0.08)', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid rgba(255,107,53,0.15)' }}>
            <p style={{ fontSize: 16, color: '#F5F5F7', lineHeight: 1.6, fontWeight: 500 }}>"{result.actually}"</p>
          </div>
        )}
        {result.whatsGoingOn && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#FF6B35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>What&apos;s Going On</p>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>{result.whatsGoingOn}</p>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 40, left: 48, right: 48, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#333' }}>overstood.app</span>
          <span style={{ fontSize: 11, color: '#333' }}>Understand what you see</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
type Mode = 'learn' | 'repurpose';

interface RepurposeResult {
  object: string;
  material: string;
  ideas: Array<{
    type: 'easy' | 'useful' | 'creative';
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
    time: string;
    materials: string[];
    steps: string[];
    safety: string[];
  }>;
  recyclingOptions: {
    canRecycle: boolean;
    howToRecycle: string;
    alternatives: string[];
  };
}

export default function GeneratePage() {
  const [input, setInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [depth, setDepth] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [mode, setMode] = useState<Mode>('learn');
  const [result, setResult] = useState<LessonPlan | null>(null);
  const [repurposeResult, setRepurposeResult] = useState<RepurposeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [topicChain, setTopicChain] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [savedToProjects, setSavedToProjects] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { state, addDiscovery, completeQuiz, sessionStarted } = useGamification();
  const { authenticated, trySilentBridge, signIn } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const speak = useCallback((text: string) => {
    if (isSpeaking) {
      // Stop
      if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
      setIsSpeaking(false);
      return;
    }
    // Fetch audio from our ElevenLabs proxy
    setIsSpeaking(true);
    fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId: 'bQxW1c7YCr6VQgQhw8KX' }),
    })
      .then(r => r.arrayBuffer())
      .then(buf => {
        const url = URL.createObjectURL(new Blob([buf], { type: 'audio/mpeg' }));
        setAudioUrl(url);
        const a = new Audio(url);
        a.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); setAudioUrl(null); };
        a.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); setAudioUrl(null); };
        a.play();
      })
      .catch(() => setIsSpeaking(false));
  }, [isSpeaking, audioUrl]);

  // Resolve related topics — curated first, then AI fallback
  const resolvedRelated = (result?.unlockMore?.length ?? 0) > 0
    ? getCuratedRelated(subject) ?? result!.unlockMore!
    : getCuratedRelated(subject) ?? [];

  const generate = useCallback(async (item: string, imageData?: string | null) => {
    setSubject(item);
    setLoading(true);
    setError('');
    setQuizCompleted(false);
    setSavedToProjects(false);

    if (mode === 'repurpose') {
      setLoadingMessage('Analyzing');
      try {
        const res = await fetch('/api/generate-repurpose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const repurpose = data.result as RepurposeResult;
        setRepurposeResult(repurpose);
        if (imageData) setPhotoPreview(imageData);
        addDiscovery(item, false);
        setTopicChain(prev => [...prev, item]);
      } catch {
        setError('Could not generate repurpose ideas right now. Try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoadingMessage('Unlocking');
    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, depth }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const lesson = data.lesson as LessonPlan;
      setResult(lesson);
      if (imageData) setPhotoPreview(imageData);
      addDiscovery(item, false);

      if (authenticated) {
        fetch('/api/lessons/save', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: item, imageUrl: imageData || null, lessonData: lesson, depthMode: depth }),
        }).catch(() => {});
      }

      setTopicChain(prev => [...prev, item]);
    } catch {
      setError('Could not generate right now. Try again.');
    } finally {
      setLoading(false);
    }
  }, [mode, depth, addDiscovery, authenticated]);

  const analyzeImage = useCallback(async (imageData: string, file?: File) => {
    setPhotoPreview(imageData);
    setInput('');
    setLoading(true);
    setLoadingMessage('Seeing');
    setError('');

    try {
      let imageToSend = imageData;
      if (file && (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic'))) {
        try {
          const img = document.createElement('img');
          img.src = imageData;
          await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(); });
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d')!.drawImage(img, 0, 0);
          imageToSend = canvas.toDataURL('image/jpeg', 0.9);
        } catch { /* use original */ }
      }

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageToSend }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      if (!data.subject) throw new Error();

      await generate(data.subject, imageData);
    } catch {
      setError('Could not read that image. Type what you see instead.');
      setLoading(false);
      setPhotoPreview(null);
    }
  }, [generate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      analyzeImage(dataUrl, file);
    };
    reader.onerror = () => { setError('Could not read that file.'); setLoading(false); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    generate(trimmed);
  };

  const handleTryAnother = () => {
    setInput('');
    setSubject('');
    setPhotoPreview(null);
    setResult(null);
    setRepurposeResult(null);
    setError('');
    setDepth('standard');
    setQuizCompleted(false);
    setSavedToProjects(false);
    inputRef.current?.focus();
  };

  const handleQuizComplete = (correct: number, total: number) => {
    setQuizCompleted(true);
    completeQuiz();
    // Save quiz score to server (fire-and-forget)
    if (authenticated) {
      fetch('/api/progress/save', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: correct, total, subject }),
      }).catch(() => {});
    }
  };

  const handleChainSelect = (topic: string) => {
    setTopicChain(prev => [...prev, topic]);
    setSubject('');
    setResult(null);
    setQuizCompleted(false);
    setTimeout(() => generate(topic), 100);
  };

  const isActive = !result && !loading;

  // Silent bridge: try to upgrade likeness_session → ty_session on mount
  useEffect(() => {
    trySilentBridge();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: '100vh', background: '#08080B', color: '#F5F5F7', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(8,8,11,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoMark size={26} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#F5F5F7' }}>OVERSTOOD</span>
          </div>

          {result ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Streak */}
              {state.streak > 0 && (
                <button
                  onClick={() => setShowStreak(s => !s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)',
                    borderRadius: 100, padding: '5px 12px', cursor: 'pointer',
                  }}
                >
                  {state.streak >= 3
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF6B35"><path d="M12 2C10 6 7 8 7 12c0 2.76 2.24 5 5 5s5-2.24 5-5c0-4-3-6-5-10z"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                  }
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B35' }}>{state.streak}</span>
                </button>
              )}
              {/* Chain count */}
              {topicChain.length > 0 && (
                <span style={{ fontSize: 11, color: '#333' }}>{topicChain.length} explored</span>
              )}
              <button
                onClick={handleTryAnother}
                style={{ fontSize: 12, color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RotateCcw style={{ width: 12, height: 12 }} />
                New
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {state.streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {state.streak >= 3
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6B35"><path d="M12 2C10 6 7 8 7 12c0 2.76 2.24 5 5 5s5-2.24 5-5c0-4-3-6-5-10z"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                  }
                  <span style={{ fontSize: 12, fontWeight: 700, color: state.streak >= 3 ? '#FF6B35' : '#555' }}>{state.streak} day{state.streak !== 1 ? 's' : ''}</span>
                </div>
              )}
              {!authenticated ? (
                <button
                  onClick={signIn}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)',
                    borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 11,
                    fontFamily: 'inherit', color: '#FF6B35', fontWeight: 600,
                  }}
                >
                  🔔 Sign in
                </button>
              ) : (
                <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 4 }}>
                  ✓ <span style={{ color: '#FF6B35' }}>Likeness™</span>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>

        {/* ── INPUT STATE ── */}
        {isActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ paddingTop: 80, paddingBottom: 60 }}>

            {/* Streak reminder */}
            {state.streak >= 2 && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.12)', borderRadius: 100, padding: '6px 16px' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF6B35"><path d="M12 2C10 6 7 8 7 12c0 2.76 2.24 5 5 5s5-2.24 5-5c0-4-3-6-5-10z"/></svg>
                  <span style={{ fontSize: 11, color: '#FF6B35', fontWeight: 600 }}>{state.streak} day streak — keep it going</span>
                </div>
              </motion.div>
            )}

            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5 }}
                style={{ fontSize: 'clamp(32px, 7vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F5F7', marginBottom: 16 }}>
                Understand anything.
                <br />
                <span style={{ color: '#FF6B35' }}>Instantly.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}
                style={{ fontSize: 15, color: '#555', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
                Snap or type. Unlock what you see.
              </motion.p>
            </div>

            {/* Last session hint */}
            {state.lastSessionTopics.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                style={{ marginBottom: 32, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#333', marginBottom: 10, letterSpacing: '0.05em' }}>Last time you explored</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {state.lastSessionTopics.slice(-4).map((t, i) => (
                    <button key={i} onClick={() => { setInput(t); inputRef.current?.focus(); }}
                      style={{ fontSize: 11, color: '#555', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mode Selector */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {(['learn', 'repurpose'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                    background: mode === m ? '#FF6B35' : 'rgba(255,255,255,0.05)',
                    color: mode === m ? '#fff' : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {m === 'learn' ? (
                    <>
                      <Eye style={{ width: 14, height: 14 }} />
                      Learn
                    </>
                  ) : (
                    <>
                      <Wrench style={{ width: 14, height: 14 }} />
                      Repurpose
                    </>
                  )}
                </button>
              ))}
            </motion.div>

            {/* Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }}
              style={{ background: '#0F0F13', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 18px', gap: 12 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={mode === 'learn' ? "What do you want to understand?" : "What object do you want to repurpose?"}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: '#F5F5F7', fontFamily: 'inherit' }}
                  autoFocus
                />
                <button onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#555', display: 'flex', alignItems: 'center' }}>
                  <Camera style={{ width: 20, height: 20 }} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
              </div>
              {mode === 'learn' && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#333', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Depth</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['quick', 'standard', 'deep'] as const).map(d => (
                      <button key={d} onClick={() => setDepth(d)} style={{
                        padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                        border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                        background: depth === d ? '#FF6B35' : 'rgba(255,255,255,0.05)',
                        color: depth === d ? '#fff' : '#444',
                      }}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}
              onClick={handleSubmit} disabled={!input.trim()} style={{
                width: '100%', padding: '15px', borderRadius: 12,
                background: input.trim() ? '#FF6B35' : 'rgba(255,107,53,0.12)',
                color: input.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
              }}>
              Unlock this
              <ArrowRight style={{ width: 16, height: 16 }} />
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', color: '#FF4444', fontSize: 12, marginTop: 14 }}>
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Examples */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: 56 }}>
              <p style={{ fontSize: 11, color: '#2A2A2A', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 18, fontWeight: 600 }}>Try these</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {(mode === 'learn'
                  ? ['Why is the sky blue?', 'How do elevators work?', 'What is a barcode?', 'Why do we dream?']
                  : ['Glass jar', 'Old t-shirt', 'Plastic bottle', 'Cardboard box']
                ).map(ex => (
                  <button key={ex} onClick={() => { setInput(ex); inputRef.current?.focus(); }}
                    style={{ padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── LOADING STATE ── */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 20 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,107,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogoMark size={24} />
              </div>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: '#666', fontWeight: 500 }}>{loadingMessage}…</p>
              {subject && <p style={{ fontSize: 12, color: '#333', marginTop: 6 }}>{subject}</p>}
            </div>
            {photoPreview && (
              <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', maxWidth: 200, width: '100%' }}>
                <img src={photoPreview} alt="Your capture" style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 160 }} />
              </div>
            )}
          </motion.div>
        )}

        {/* ── RESULT STATE ── */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ paddingTop: 56, paddingBottom: 100 }}>

            {/* Photo */}
            {photoPreview && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
                <img src={photoPreview} alt="Your capture" style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 280 }} />
              </motion.div>
            )}

            {/* Subject + Actually */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                <h1 style={{ fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#F5F5F7', textTransform: 'capitalize' }}>
                  {subject}
                </h1>
                {result.actually && (
                  <button
                    onClick={() => speak(result.actually)}
                    title="Read this aloud"
                    style={{
                      background: isSpeaking ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Volume2 style={{ width: 16, height: 16, color: isSpeaking ? '#FF6B35' : '#555' }} />
                  </button>
                )}
              </div>
              {result.actually && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  style={{ background: 'rgba(255,107,53,0.07)', border: '1px solid rgba(255,107,53,0.15)', borderRadius: 14, padding: '20px 24px', marginBottom: 0 }}>
                  <p style={{ fontSize: 16, color: '#F5F5F7', lineHeight: 1.6, fontWeight: 500 }}>"{result.actually}"</p>
                </motion.div>
              )}
            </div>

            {/* Layer 1 — Whats Going On */}
            {result.whatsGoingOn && (
              <Layer icon={<Eye style={{ width: 16, height: 16 }} />} label="What's actually going on" color="#FF6B35" defaultOpen={true}>
                <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8 }}>{result.whatsGoingOn}</p>
              </Layer>
            )}

            {/* Layer 2 — Think About This */}
            {result.curiosityTraps?.length > 0 && (
              <Layer icon={<Zap style={{ width: 16, height: 16 }} />} label="Think about this" color="#FFD700">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.curiosityTraps.map((trap, i) => (
                    <CuriosityTrap key={i} text={trap} />
                  ))}
                </div>
              </Layer>
            )}

            {/* Layer 3 — Activities */}
            {result.activities && (
              <Layer icon={<Wrench style={{ width: 16, height: 16 }} />} label="3 ways to test it" color="#00C896">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {result.activities.tryIt && <ActivityPill icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>} label="Try it" text={result.activities.tryIt} />}
                  {result.activities.buildIt && <ActivityPill icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>} label="Build it" text={result.activities.buildIt} />}
                  {result.activities.goSeeIt && <ActivityPill icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>} label="Go see" text={result.activities.goSeeIt} />}
                </div>
              </Layer>
            )}

            {/* Layer 4 — Quiz */}
            {result.quiz?.length > 0 && (
              <Layer
                icon={<Check style={{ width: 16, height: 16 }} />}
                label="Did that actually click?"
                color="#B866D6"
                pulse={!quizCompleted}
              >
                <QuizSection quiz={result.quiz} onComplete={handleQuizComplete} />
              </Layer>
            )}

            {/* Layer 5 — Unlock More */}
            {(resolvedRelated.length > 0 || result.unlockMore?.length > 0) && (
              <Layer icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B35"><path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z"/></svg>} label="Unlock more" color="#FF6B35">
                <UnlockMore
                  topics={resolvedRelated.length > 0 ? resolvedRelated : result.unlockMore!}
                  onSelect={handleChainSelect}
                  sessionTopics={topicChain}
                />
              </Layer>
            )}

            {/* Share */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ marginTop: 24 }}>
              <ShareCard result={result} item={subject} />
              <button
                onClick={() => {
                  const card = document.querySelector('[data-share-card]');
                  if (card) {
                    const link = document.createElement('a');
                    link.download = `overstood-${subject}.png`;
                    link.href = (card as HTMLCanvasElement).toDataURL();
                    link.click();
                  }
                }}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  color: '#555', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <Share2 style={{ width: 14, height: 14 }} />
                Share what you understood
              </button>
            </motion.div>

          </motion.div>
        )}

        {/* ── REPURPOSE RESULT STATE ── */}
        {repurposeResult && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ paddingTop: 56, paddingBottom: 100 }}>

            {/* Photo */}
            {photoPreview && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
                <img src={photoPreview} alt="Your capture" style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 280 }} />
              </motion.div>
            )}

            {/* Object Header */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#F5F5F7', marginBottom: 8 }}>
                {repurposeResult.object}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ fontSize: 14, color: '#666' }}>
                Material: {repurposeResult.material}
              </motion.p>
            </div>

            {/* Repurpose Ideas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {repurposeResult.ideas.map((idea, index) => (
                <motion.div
                  key={idea.type}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  style={{
                    background: '#0C0C10',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Idea Header */}
                  <div style={{
                    padding: '16px 18px',
                    background: idea.type === 'easy' ? 'rgba(0,200,150,0.08)' : idea.type === 'useful' ? 'rgba(255,107,53,0.08)' : 'rgba(184,102,214,0.08)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: idea.type === 'easy' ? '#00C896' : idea.type === 'useful' ? '#FF6B35' : '#B866D6',
                      }}>
                        {idea.type}
                      </span>
                      <span style={{ fontSize: 11, color: '#444' }}>{idea.time}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F7', marginBottom: 4 }}>{idea.title}</h3>
                    <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{idea.description}</p>
                    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                        background: idea.difficulty === 'Easy' ? 'rgba(0,200,150,0.15)' : idea.difficulty === 'Medium' ? 'rgba(255,193,7,0.15)' : 'rgba(255,68,68,0.15)',
                        color: idea.difficulty === 'Easy' ? '#00C896' : idea.difficulty === 'Medium' ? '#FFC107' : '#FF4444',
                      }}>
                        {idea.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Materials */}
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#444', marginBottom: 10 }}>Materials needed</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {idea.materials.map((material, i) => (
                        <span key={i} style={{ fontSize: 12, color: '#777', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: 8 }}>
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#444', marginBottom: 10 }}>Steps</p>
                    <ol style={{ margin: 0, paddingLeft: 18 }}>
                      {idea.steps.map((step, i) => (
                        <li key={i} style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 6 }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Safety */}
                  {idea.safety.length > 0 && (
                    <div style={{ padding: '16px 18px', background: 'rgba(255,68,68,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <AlertTriangle style={{ width: 14, height: 14, color: '#FF4444' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FF4444' }}>Safety</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {idea.safety.map((safety, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 4 }}>{safety}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Recycling Options */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: repurposeResult.recyclingOptions.canRecycle ? 'rgba(0,200,150,0.05)' : 'rgba(255,193,7,0.05)',
                borderRadius: 14,
                border: `1px solid ${repurposeResult.recyclingOptions.canRecycle ? 'rgba(0,200,150,0.15)' : 'rgba(255,193,7,0.15)'}`,
                padding: '18px',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: repurposeResult.recyclingOptions.canRecycle ? 'rgba(0,200,150,0.15)' : 'rgba(255,193,7,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {repurposeResult.recyclingOptions.canRecycle ? (
                    <Check style={{ width: 14, height: 14, color: '#00C896' }} />
                  ) : (
                    <X style={{ width: 14, height: 14, color: '#FFC107' }} />
                  )}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F7' }}>
                  {repurposeResult.recyclingOptions.canRecycle ? 'Recyclable' : 'Not curbside recyclable'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>
                {repurposeResult.recyclingOptions.howToRecycle}
              </p>
              {repurposeResult.recyclingOptions.alternatives.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 8 }}>Alternatives:</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {repurposeResult.recyclingOptions.alternatives.map((alt, i) => (
                      <li key={i} style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Save to Projects */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={() => {
                setSavedToProjects(true);
                alert('Projects feature coming soon!');
              }}
              disabled={savedToProjects}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                background: savedToProjects ? 'rgba(255,255,255,0.08)' : '#FF6B35',
                border: 'none',
                color: savedToProjects ? '#666' : '#fff',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.03em',
                cursor: savedToProjects ? 'default' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s',
              }}
            >
              {savedToProjects ? (
                <>
                  <Bookmark style={{ width: 16, height: 16 }} />
                  Coming Soon
                </>
              ) : (
                <>
                  <Bookmark style={{ width: 16, height: 16 }} />
                  Save to My Projects
                </>
              )}
            </motion.button>

          </motion.div>
        )}
      </main>
    </div>
  );
}
