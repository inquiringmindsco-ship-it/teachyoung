'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Zap, RotateCcw, Share2, ChevronRight, Lightbulb, CameraOff, ArrowRight, BookOpen, HelpCircle, Layers, X, CheckCircle, RefreshCw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useGamification } from '../hooks/useGamification';

interface LessonPlan {
  hook: string;
  whatIsThis: string;
  howItWorks: string;
  whyItMatters: string;
  vocabulary: string[];
  tryThis: string;
  question: string;
  depth: string;
}

interface QuizQuestion {
  type: string;
  text: string;
  hint: string | null;
  answer?: string;
}

interface Challenge {
  mission: string;
  timeNeeded: string;
  whatToDo: string;
  bonusQuestion: string;
}

type View = 'home' | 'preview' | 'mode' | 'quiz' | 'result';
type Mode = 'explain' | 'teach' | 'quiz' | 'deeper';

const EXAMPLE_SUBJECTS = [
  'a fire hydrant',
  'an elevator button',
  'a barcode',
  'a traffic light',
  'a plant leaf',
];

function ShareCard({ result, item }: { result: LessonPlan; item: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.9, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `overstood-${item}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `Overstood: ${item}`, text: `Check out what I learned about ${item} with Overstood.` });
      } else {
        const link = document.createElement('a');
        link.download = `overstood-${item}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) { console.warn('Share failed', e); }
    setSharing(false);
  }, [item]);

  return (
    <div className="space-y-3">
      <div className="fixed -left-[9999px] top-0" style={{ width: 600, height: 750 }}>
        <div ref={cardRef} className="w-[600px] h-[750px] p-8 flex flex-col" style={{ background: '#FAFAFA' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-600 text-sm font-semibold">Overstood</span>
          </div>
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{item}</h1>
            <p className="text-gray-400 text-sm">Powered by Overstood</p>
          </div>
          {result.hook && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FFD700]/10 mb-4">
              <p className="text-base text-gray-800 font-medium leading-relaxed">"{result.hook}"</p>
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h2 className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider mb-1">What is this</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{result.whatIsThis}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h2 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-1">Why it matters</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{result.whyItMatters}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-300 text-xs">overstood.app</p>
            <p className="text-gray-300 text-xs">Understand what you see</p>
          </div>
        </div>
      </div>
      <button onClick={handleShare} disabled={sharing} className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50">
        <Share2 className="w-4 h-4" />
        {sharing ? 'Preparing...' : 'Share'}
      </button>
    </div>
  );
}

export default function GeneratePage() {
  const [view, setView] = useState<View>('home');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [capturedSubject, setCapturedSubject] = useState('');
  const [mode, setMode] = useState<Mode>('explain');
  const [result, setResult] = useState<LessonPlan | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const { state, showDiscoveryToast, showAchievementToast, addDiscovery, completeChallenge, useCamera } = useGamification();

  const handleCapture = useCallback((subject: string, imageData: string | null = null) => {
    setCapturedSubject(subject);
    if (imageData) setPhotoPreview(imageData);
    useCamera();
    setView('mode');
  }, [useCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const filename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toLowerCase();
        handleCapture(filename, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateChallenge = (item: string): Challenge => {
    const challenges = [
      { mission: 'Find 3 more examples', timeNeeded: '5 min', whatToDo: `Look around and find 3 things related to "${item}". Write or sketch what you found.`, bonusQuestion: 'What do they have in common?' },
      { mission: 'Explain it back', timeNeeded: '5 min', whatToDo: `Explain "${item}" to someone nearby. Can they understand it?`, bonusQuestion: 'What questions did they ask?' },
      { mission: 'Draw it from memory', timeNeeded: '5 min', whatToDo: `Without looking, sketch or describe "${item}" from memory. Add labels for the important parts.`, bonusQuestion: 'What did you remember first?' },
      { mission: 'Compare it', timeNeeded: '5 min', whatToDo: `Find something similar to "${item}" and list 3 ways they're alike and 3 ways they're different.`, bonusQuestion: 'Which is more interesting to you?' },
    ];
    const base = challenges[Math.floor(Math.random() * challenges.length)];
    return { mission: base.mission, timeNeeded: base.timeNeeded, whatToDo: base.whatToDo, bonusQuestion: base.bonusQuestion };
  };

  const loadLesson = useCallback(async () => {
    setLoading(true);
    setLoadingMessage(mode === 'explain' ? 'Getting clarity...' : mode === 'teach' ? 'Building lesson...' : mode === 'deeper' ? 'Going deeper...' : 'Creating quiz...');
    
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: capturedSubject, depth: mode === 'deeper' ? 'deep' : mode === 'teach' ? 'standard' : 'quick' }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      const lesson = data.lesson as LessonPlan;
      lesson.depth = mode === 'deeper' ? 'Deep' : mode === 'teach' ? 'Standard' : 'Quick';
      setResult(lesson);
      setView('result');
      setLoading(false);
      addDiscovery();
      try {
        const saved = JSON.parse(localStorage.getItem('overstood_history') || '[]');
        saved.unshift({ id: Date.now().toString(), item: capturedSubject, mode, lesson, createdAt: new Date().toISOString() });
        localStorage.setItem('overstood_history', JSON.stringify(saved.slice(0, 50)));
      } catch {}
    } catch (error) {
      console.error('Generation error:', error);
      setLoading(false);
      setView('home');
    }
  }, [capturedSubject, mode, addDiscovery]);

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setLoadingMessage('Creating quiz...');
    try {
      const qResponse = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: capturedSubject }),
      });
      if (!qResponse.ok) throw new Error('Questions failed');
      const qData = await qResponse.json();
      const questions = qData.questions.questions || [];
      if (questions.length === 0) {
        loadLesson();
        return;
      }
      setQuizQuestions(questions);
      setView('quiz');
      setLoading(false);
    } catch (error) {
      console.error('Quiz error:', error);
      setLoading(false);
      loadLesson();
    }
  }, [capturedSubject, loadLesson]);

  const handleAnswer = (index: number) => {
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(index);
    setAnsweredQuestions(newAnswered);
    if (newAnswered.size >= quizQuestions.length) {
      setTimeout(() => loadLesson(), 800);
    }
  };

  const handleTryAnother = () => {
    setView('home');
    setPhotoPreview(null);
    setCapturedSubject('');
    setResult(null);
    setQuizQuestions([]);
    setAnsweredQuestions(new Set());
    setMode('explain');
    setLoading(false);
  };

  // Camera simulation subjects
  const handleDemoCapture = (subject: string) => {
    handleCapture(subject);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex flex-col">

      {/* HEADER */}
      <header className="w-full px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-900 font-bold text-sm tracking-tight">Overstood</span>
        </div>
        <div className="flex items-center gap-3">
          {state.discoveries > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-5 h-5 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#FF6B35]">{state.discoveries}</span>
              </div>
              <span className="hidden sm:inline">explored</span>
            </div>
          )}
        </div>
      </header>

      {/* TOASTS */}
      <AnimatePresence>
        {showDiscoveryToast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-[#FF6B35] text-white text-xs font-semibold shadow-lg">
              +1 Discovery ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievementToast && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white text-xs font-semibold shadow-lg">
              🎉 {showAchievementToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HOME — CAMERA FIRST === */}
      {view === 'home' && (
        <div className="flex-1 flex flex-col">

          {/* Hero */}
          <section className="w-full pt-10 pb-6 px-5">
            <div className="max-w-sm mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
                Understand
                <br />
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">what you see.</span>
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Point your camera at anything. Get an instant explanation, lesson, or quiz.
              </p>
            </div>
          </section>

          {/* Camera CTA — THE STAR */}
          <section className="w-full px-5 pb-6">
            <div className="max-w-sm mx-auto">
              
              {/* Big camera button */}
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                whileTap={{ scale: 0.97 }}
                className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] p-8 flex flex-col items-center justify-center shadow-xl shadow-[#FF6B35]/20"
              >
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Camera className="w-16 h-16 text-white mb-3" />
                  </motion.div>
                  <p className="text-white font-bold text-lg mb-1">Point & Learn</p>
                  <p className="text-white/70 text-xs">Tap to open camera</p>
                </div>
              </motion.button>

              <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

              {/* Demo captures */}
              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-3">Or try these</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLE_SUBJECTS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleDemoCapture(s)}
                      className="px-3 py-2 rounded-2xl bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:shadow-sm transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fallback text input */}
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center px-4">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <p className="relative text-center text-[10px] text-gray-400 bg-[#FAFAFA] px-3 inline-block mx-auto">or type below</p>
              </div>
              <div className="mt-4 relative">
                <input
                  ref={textInputRef}
                  type="text"
                  placeholder="Type anything you want to understand..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                      handleCapture((e.target as HTMLInputElement).value.trim());
                    }
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition-all"
                />
                <button
                  onClick={() => {
                    const val = textInputRef.current?.value.trim();
                    if (val) handleCapture(val);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="w-full px-5 pb-10">
            <div className="max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-2">
                    <Camera className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <p className="text-gray-900 text-xs font-semibold mb-0.5">Snap</p>
                  <p className="text-gray-400 text-[10px]">anything you see</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <p className="text-gray-900 text-xs font-semibold mb-0.5">Learn</p>
                  <p className="text-gray-400 text-[10px]">instant clarity</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#00C896]/10 flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-5 h-5 text-[#00C896]" />
                  </div>
                  <p className="text-gray-900 text-xs font-semibold mb-0.5">Explore</p>
                  <p className="text-gray-400 text-[10px]">deeper knowledge</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* === MODE SELECT — AFTER CAPTURE === */}
      {view === 'mode' && (
        <div className="flex-1 flex flex-col">
          <div className="w-full px-5 pt-6 pb-4">
            <div className="max-w-sm mx-auto">
              <button onClick={handleTryAnother} className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-gray-600 transition-colors mb-4">
                <X className="w-3.5 h-3.5" />
                Start over
              </button>

              {photoPreview && (
                <div className="relative rounded-2xl overflow-hidden mb-5 shadow-md">
                  <img src={photoPreview} alt="Captured" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              <div className="text-center mb-5">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">You captured</p>
                <h2 className="text-xl font-bold text-gray-900 capitalize">{capturedSubject}</h2>
              </div>

              <p className="text-center text-gray-500 text-sm mb-5">What would you like to do?</p>
            </div>
          </div>

          {/* Mode cards */}
          <section className="flex-1 px-5 pb-6">
            <div className="max-w-sm mx-auto space-y-3">
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { setMode('explain'); loadLesson(); }}
                className="w-full p-5 rounded-2xl bg-white border-2 border-[#FF6B35]/20 shadow-sm hover:shadow-md hover:border-[#FF6B35]/40 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B35]/20 transition-colors">
                    <Lightbulb className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-0.5">Explain it</p>
                    <p className="text-gray-500 text-xs">Quick, clear explanation in seconds</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { setMode('teach'); loadLesson(); }}
                className="w-full p-5 rounded-2xl bg-white border-2 border-[#FFD700]/20 shadow-sm hover:shadow-md hover:border-[#FFD700]/40 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD700]/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-0.5">Teach me</p>
                    <p className="text-gray-500 text-xs">Full lesson with context and depth</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { setMode('quiz'); loadQuiz(); }}
                className="w-full p-5 rounded-2xl bg-white border-2 border-[#00C896]/20 shadow-sm hover:shadow-md hover:border-[#00C896]/40 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00C896]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00C896]/20 transition-colors">
                    <HelpCircle className="w-6 h-6 text-[#00C896]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-0.5">Quiz me</p>
                    <p className="text-gray-500 text-xs">Test what you know, learn what you don't</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { setMode('deeper'); loadLesson(); }}
                className="w-full p-5 rounded-2xl bg-gray-900 text-white shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold mb-0.5">Go deeper</p>
                    <p className="text-white/50 text-xs">Comprehensive breakdown and analysis</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </div>
              </motion.button>

            </div>
          </section>
        </div>
      )}

      {/* === LOADING === */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF6B35]/10 to-[#FFD700]/10 flex items-center justify-center mx-auto mb-5">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-8 h-8 text-[#FF6B35]" />
              </motion.div>
            </div>
            <p className="text-gray-600 font-semibold text-sm mb-1">{loadingMessage || 'Thinking...'}</p>
            <p className="text-gray-400 text-xs">This takes about 3 seconds</p>
          </motion.div>
        </div>
      )}

      {/* === QUIZ STEP === */}
      {!loading && view === 'quiz' && (
        <div className="flex-1 flex flex-col px-5 py-6">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#00C896]/10 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6 text-[#00C896]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Quiz time</h2>
              <p className="text-gray-500 text-sm">Think about {capturedSubject.toLowerCase()}...</p>
            </div>

            <div className="space-y-3 mb-6">
              {quizQuestions.map((q, i) => {
                const answered = answeredQuestions.has(i);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl transition-all ${
                      answered
                        ? q.type === 'intuition'
                          ? 'bg-[#FFD700]/8 border-2 border-[#FFD700]/30'
                          : 'bg-[#00C896]/8 border-2 border-[#00C896]/20'
                        : 'bg-white border-2 border-gray-100'
                    }`}
                  >
                    <button onClick={() => !answered && handleAnswer(i)} disabled={answered} className="w-full p-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          answered
                            ? q.type === 'intuition' ? 'bg-[#FFD700]/20' : 'bg-[#00C896]/20'
                            : 'bg-gray-100'
                        }`}>
                          {answered ? (
                            <CheckCircle className={`w-4 h-4 ${q.type === 'intuition' ? 'text-[#FFD700]' : 'text-[#00C896]'}`} />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed ${answered ? 'text-gray-400' : 'text-gray-800'}`}>{q.text}</p>
                          {!answered && q.hint && <p className="text-xs text-gray-400 mt-1">💡 {q.hint}</p>}
                        </div>
                      </div>
                    </button>
                    {answered && q.type === 'intuition' && q.answer && (
                      <div className="px-4 pb-4">
                        <div className="p-3 rounded-xl bg-[#FFD700]/8 border border-[#FFD700]/20">
                          <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-1">Actually</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                        </div>
                      </div>
                    )}
                    {answered && q.type === 'experience' && (
                      <div className="px-4 pb-4">
                        <p className="text-xs text-gray-400 italic leading-relaxed">Everyone's experience is valid. Here's how it actually works...</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={loadLesson}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
            >
              See the full explanation
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* === RESULT STEP === */}
      {!loading && view === 'result' && result && (
        <div className="flex-1 flex flex-col pb-6">
          
          {/* Result header */}
          <div className="w-full px-5 pt-5 pb-3 bg-white border-b border-gray-100">
            <div className="max-w-sm mx-auto">
              <button onClick={handleTryAnother} className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-gray-600 transition-colors mb-3">
                <RefreshCw className="w-3.5 h-3.5" />
                Try another
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 capitalize">{capturedSubject}</h1>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{result.depth} · Overstood</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-sm mx-auto px-5 py-5 space-y-3">

              {result.hook && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6B35]/8 to-[#FFD700]/5 border border-[#FF6B35]/15"
                >
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">"{result.hook}"</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <h2 className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider mb-2">What is this</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{result.whatIsThis}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <h2 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-2">How it works</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{result.howItWorks}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <h2 className="text-[10px] font-bold text-[#B866D6] uppercase tracking-wider mb-2">Why it matters</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{result.whyItMatters}</p>
              </motion.div>

              {result.vocabulary && result.vocabulary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <h2 className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider mb-3">Key ideas</h2>
                  <div className="flex flex-wrap gap-2">
                    {result.vocabulary.map((v, i) => (
                      <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {result.tryThis && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-4 rounded-2xl bg-[#00C896]/8 border border-[#00C896]/20"
                >
                  <h2 className="text-[10px] font-bold text-[#00C896] uppercase tracking-wider mb-2">Try it</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.tryThis}</p>
                </motion.div>
              )}

              {result.question && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.question}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <ShareCard result={result} item={capturedSubject} />
              </motion.div>

              {/* Try another mode */}
              <div className="pt-2 pb-4">
                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mb-3">Explore more</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['explain', 'teach', 'quiz', 'deeper'] as Mode[]).filter(m => m !== mode).map(m => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); if (m === 'quiz') loadQuiz(); else loadLesson(); }}
                      className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:border-[#FF6B35]/40 hover:text-[#FF6B35] transition-all"
                    >
                      {m === 'explain' ? '💡 Quick explain' : m === 'teach' ? '📖 Full lesson' : m === 'quiz' ? '❓ Quiz me' : '🔍 Go deeper'}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
