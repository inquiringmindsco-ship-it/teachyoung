'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Share2, ChevronRight, Lightbulb, ArrowRight, BookOpen, HelpCircle, Layers, X, CheckCircle, RefreshCw, Aperture, Wand2 } from 'lucide-react';
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

type View = 'home' | 'mode' | 'quiz' | 'result';
type Mode = 'explain' | 'teach' | 'quiz' | 'deeper';

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
        await navigator.share({ files: [file], title: `Overstood: ${item}`, text: `I just learned about ${item} with Overstood!` });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1 capitalize">{item}</h1>
            <p className="text-gray-400 text-sm">Powered by Overstood</p>
          </div>
          {result.hook && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6B35]/8 to-[#FFD700]/8 mb-4">
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
      <button onClick={handleShare} disabled={sharing} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all disabled:opacity-50">
        <Share2 className="w-4 h-4" />
        {sharing ? 'Preparing...' : 'Share what I learned'}
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

  const { showDiscoveryToast, showAchievementToast, addDiscovery, useCamera } = useGamification();

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
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const filename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toLowerCase();
        handleCapture(filename, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadLesson = useCallback(async () => {
    setLoading(true);
    setLoadingMessage('Finding clarity...');
    setView('result');
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: capturedSubject, depth: mode === 'deeper' ? 'deep' : mode === 'teach' ? 'standard' : 'quick' }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      const lesson = data.lesson as LessonPlan;
      lesson.depth = mode === 'deeper' ? 'Deep' : mode === 'teach' ? 'Lesson' : 'Quick';
      setResult(lesson);
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
      if (questions.length === 0) { loadLesson(); return; }
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
    if (newAnswered.size >= quizQuestions.length) setTimeout(() => loadLesson(), 1000);
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

  const selectMode = (m: Mode) => {
    setMode(m);
    if (m === 'quiz') loadQuiz();
    else loadLesson();
  };

  return (
    <div className="h-screen bg-[#0D0D1A] text-white flex flex-col overflow-hidden relative">

      {/* === AMBIENT BACKGROUND === */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#14142B] to-[#0D0D1A]" />
        <div className="absolute top-0 left-1/4 right-1/4 h-[500px] bg-gradient-to-b from-[#FF6B35]/20 via-[#FF8C5A]/10 to-transparent blur-[120px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#FFD700]/10 via-[#FF6B35]/5 to-transparent blur-[100px] rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B866D6]/5 rounded-full blur-[120px]" />
      </div>

      {/* TOASTS */}
      <AnimatePresence>
        {showDiscoveryToast && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.9 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-[100]">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white text-sm font-bold shadow-2xl flex items-center gap-2">
              <span>✨</span><span>+1 Discovery</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAchievementToast && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-[100]">
            <div className="px-6 py-3 rounded-full bg-white text-[#0D0D1A] text-sm font-bold shadow-2xl flex items-center gap-2">
              <span>🎉</span><span>{showAchievementToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HEADER === */}
      {/* DEBUG: NEW CAMERA BUILD ACTIVE - commit 9bdd582 */}
      <div className="absolute top-0 left-0 right-0 z-[200] bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white text-center text-xs font-bold py-1">
        🔍 NEW BUILD 9bdd582 — If you see this, new code IS rendering
      </div>
      <header className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between flex-shrink-0">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">Overstood</span>
        </motion.div>
      </header>

      {/* === HOME — CENTERED CAMERA APP === */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="relative z-10 flex-1 flex flex-col"
          >
            {/* Headline — centered, top third */}
            <div className="flex-shrink-0 text-center px-8 pt-6 pb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-3"
              >
                Understand
                <br />
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">
                  what you see.
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-white/50 text-base max-w-xs mx-auto"
              >
                Point your camera at anything and turn it into a lesson.
              </motion.p>
            </div>

            {/* Camera button — dead center, dominant */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                className="relative"
              >
                {/* Outer glow rings */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.08, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-[#FF6B35]/20 blur-[30px]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.04, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute inset-0 rounded-full bg-[#FFD700]/10 blur-[40px]"
                />

                {/* Main camera button */}
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex flex-col items-center justify-center shadow-2xl shadow-[#FF6B35]/40"
                >
                  {/* Inner aperture rings */}
                  <div className="absolute inset-0 rounded-full border border-white/20" />
                  <div className="absolute inset-[12px] rounded-full border border-white/10" />

                  <Camera className="w-14 h-14 text-white mb-1" />
                  <span className="text-white font-bold text-sm">Snap</span>
                </motion.button>

                <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 text-sm font-medium mt-5"
              >
                Tap to open camera
              </motion.p>
            </div>

            {/* Text input — bottom, glass style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex-shrink-0 px-8 pb-10"
            >
              <div className="relative">
                <input
                  ref={textInputRef}
                  type="text"
                  placeholder="Ask instead..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                      handleCapture((e.target as HTMLInputElement).value.trim());
                    }
                  }}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white text-base placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.12] transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const val = textInputRef.current?.value.trim();
                    if (val) handleCapture(val);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white shadow-lg"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MODE SELECT === */}
      <AnimatePresence mode="wait">
        {view === 'mode' && (
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -24 }}
            className="relative z-10 flex-1 flex flex-col overflow-y-auto"
          >
            {/* Top bar */}
            <div className="flex-shrink-0 px-6 pt-6 pb-4 flex items-center justify-between">
              <button onClick={handleTryAnother} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
                <X className="w-4 h-4" />
                <span>Start over</span>
              </button>
            </div>

            {/* Image + subject */}
            {photoPreview && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0 mx-6 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src={photoPreview} alt="Captured" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            )}

            {/* Subject text */}
            <div className="flex-shrink-0 text-center px-6 pt-5 pb-1">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">You captured</p>
              <h2 className="text-3xl font-bold text-white capitalize">{capturedSubject}</h2>
            </div>

            <p className="flex-shrink-0 text-center text-white/40 text-sm px-6 pt-2 pb-6">
              What would you like to do?
            </p>

            {/* Action cards */}
            <div className="flex-1 px-6 pb-8 space-y-3">
              
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.02, x: 8 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('explain')} className="w-full p-5 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35]/30 to-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-base mb-0.5">Explain it simply</p>
                  <p className="text-white/40 text-sm">Quick, clear answer</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }} whileHover={{ scale: 1.02, x: 8 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('teach')} className="w-full p-5 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700]/30 to-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-base mb-0.5">Teach me more</p>
                  <p className="text-white/40 text-sm">Full lesson with context</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 }} whileHover={{ scale: 1.02, x: 8 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('quiz')} className="w-full p-5 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00C896]/30 to-[#00C896]/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-[#00C896]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-base mb-0.5">Quiz me</p>
                  <p className="text-white/40 text-sm">Test what you know</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.44 }} whileHover={{ scale: 1.02, x: 8 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('deeper')} className="w-full p-5 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B866D6]/30 to-[#B866D6]/10 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6 text-[#B866D6]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-base mb-0.5">Explore deeper</p>
                  <p className="text-white/40 text-sm">Comprehensive breakdown</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LOADING === */}
      <AnimatePresence>
        {loading && view !== 'home' && view !== 'mode' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-center">
              <div className="w-24 h-24 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center mx-auto mb-6">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-10 h-10 text-[#FF6B35]" />
                </motion.div>
              </div>
              <p className="text-white font-bold text-xl mb-1">{loadingMessage || 'Getting curious...'}</p>
              <p className="text-white/40 text-sm">Almost there</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === QUIZ === */}
      <AnimatePresence mode="wait">
        {!loading && view === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 px-6 py-6 max-w-md mx-auto w-full">
              <div className="text-center mb-7">
                <div className="w-14 h-14 rounded-full bg-[#00C896]/20 border border-[#00C896]/30 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-7 h-7 text-[#00C896]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Quiz time</h2>
                <p className="text-white/40 text-sm">Think about {capturedSubject.toLowerCase()}...</p>
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
                      className={`rounded-2xl transition-all ${answered ? q.type === 'intuition' ? 'bg-[#FFD700]/10 border border-[#FFD700]/30' : 'bg-[#00C896]/10 border border-[#00C896]/20' : 'bg-white/[0.06] border border-white/[0.1]'}`}
                    >
                      <button onClick={() => !answered && handleAnswer(i)} disabled={answered} className="w-full p-4 text-left">
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${answered ? q.type === 'intuition' ? 'bg-[#FFD700]/20' : 'bg-[#00C896]/20' : 'bg-white/[0.08]'}`}>
                            {answered ? <CheckCircle className={`w-4 h-4 ${q.type === 'intuition' ? 'text-[#FFD700]' : 'text-[#00C896]'}`} /> : <span className="text-xs font-bold text-white/40">{i + 1}</span>}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm leading-relaxed ${answered ? 'text-white/40' : 'text-white/90'}`}>{q.text}</p>
                            {!answered && q.hint && <p className="text-xs text-white/30 mt-1.5">💡 {q.hint}</p>}
                          </div>
                        </div>
                      </button>
                      {answered && q.type === 'intuition' && q.answer && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
                            <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-1">Actually</p>
                            <p className="text-sm text-white/80">{q.answer}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={loadLesson} className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/20">
                See the full explanation
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === RESULT === */}
      <AnimatePresence mode="wait">
        {!loading && view === 'result' && result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex-1 flex flex-col overflow-hidden">

            {/* Result header */}
            <div className="flex-shrink-0 px-6 pt-5 pb-4 bg-white/[0.03] border-b border-white/[0.06]">
              <button onClick={handleTryAnother} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-4">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try another</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FF6B35]/30 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white capitalize">{capturedSubject}</h1>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{result.depth} · Overstood</p>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-3 max-w-md mx-auto">

                {result.hook && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-gradient-to-r from-[#FF6B35]/15 to-[#FFD700]/10 border border-[#FF6B35]/20">
                    <p className="text-base text-white/90 font-medium leading-relaxed">"{result.hook}"</p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                  <h2 className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider mb-2">What is this</h2>
                  <p className="text-sm text-white/70 leading-relaxed">{result.whatIsThis}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                  <h2 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-2">How it works</h2>
                  <p className="text-sm text-white/70 leading-relaxed">{result.howItWorks}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                  <h2 className="text-[10px] font-bold text-[#B866D6] uppercase tracking-wider mb-2">Why it matters</h2>
                  <p className="text-sm text-white/70 leading-relaxed">{result.whyItMatters}</p>
                </motion.div>

                {result.vocabulary && result.vocabulary.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                    <h2 className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider mb-3">Key ideas</h2>
                    <div className="flex flex-wrap gap-2">
                      {result.vocabulary.map((v, i) => (
                        <span key={i} className="text-xs text-white/60 bg-white/[0.06] px-3 py-1.5 rounded-xl font-medium border border-white/[0.08]">{v}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result.tryThis && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-5 rounded-2xl bg-[#00C896]/10 border border-[#00C896]/20">
                    <h2 className="text-[10px] font-bold text-[#00C896] uppercase tracking-wider mb-2">Try it</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{result.tryThis}</p>
                  </motion.div>
                )}

                {result.question && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Question to consider</h2>
                    <p className="text-sm text-white/50 leading-relaxed">{result.question}</p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="pt-2">
                  <ShareCard result={result} item={capturedSubject} />
                </motion.div>

                {/* Explore more */}
                <div className="pt-4 pb-6">
                  <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mb-3">Explore more</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['explain', 'teach', 'quiz', 'deeper'] as Mode[]).filter(m => m !== mode).map(m => (
                      <button key={m} onClick={() => selectMode(m)} className="py-3 px-3 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-white/50 text-xs font-medium hover:bg-white/[0.1] hover:text-white/70 transition-all">
                        {m === 'explain' ? '⚡ Explain it' : m === 'teach' ? '📖 Teach me' : m === 'quiz' ? '❓ Quiz me' : '🔍 Explore deeper'}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
