'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Share2, ChevronRight, Lightbulb, ArrowRight, BookOpen, HelpCircle, Layers, X, CheckCircle, RefreshCw, Wand2 } from 'lucide-react';
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

const EXAMPLE_SUBJECTS = [
  { label: 'a fire hydrant', emoji: '🚒' },
  { label: 'an elevator', emoji: '🏢' },
  { label: 'a barcode', emoji: '📊' },
  { label: 'gravity', emoji: '🌍' },
  { label: 'a traffic light', emoji: '🚦' },
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
        body: JSON.stringify({ 
          item: capturedSubject, 
          depth: mode === 'deeper' ? 'deep' : mode === 'teach' ? 'standard' : 'quick' 
        }),
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
    if (newAnswered.size >= quizQuestions.length) {
      setTimeout(() => loadLesson(), 1000);
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

  const selectMode = (m: Mode) => {
    setMode(m);
    if (m === 'quiz') loadQuiz();
    else loadLesson();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex flex-col relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF6B35]/8 via-[#FFD700]/5 to-transparent -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#00C896]/6 via-[#FFD700]/3 to-transparent translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#B866D6]/5 blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="relative w-full px-5 py-4 flex items-center justify-between z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-900 font-bold text-sm tracking-tight">Overstood</span>
        </motion.div>
      </header>

      {/* TOASTS */}
      <AnimatePresence>
        {showDiscoveryToast && (
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.9 }} className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
            <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white text-xs font-bold shadow-xl flex items-center gap-2">
              <span>✨</span><span>+1 Discovery</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAchievementToast && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
            <div className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold shadow-xl flex items-center gap-2">
              <span>🎉</span><span>{showAchievementToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HOME === */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex-1 flex flex-col z-10">

            {/* Hero */}
            <section className="w-full pt-12 pb-8 px-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-sm mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-4">
                  Understand
                  <br />
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">what you see.</span>
                </h1>
                <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
                  Take a picture of anything and turn it into an explanation, lesson, or quiz.
                </p>
              </motion.div>
            </section>

            {/* Camera CTA */}
            <section className="w-full px-5 pb-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-sm mx-auto">
                
                {/* Big camera button */}
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B35] via-[#FF8C5A] to-[#FFD700] p-10 flex flex-col items-center justify-center shadow-2xl shadow-[#FF6B35]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                  <div className="relative">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-10 h-10 text-white" />
                    </motion.div>
                    <p className="text-white font-bold text-xl mb-1">Snap to Learn</p>
                    <p className="text-white/70 text-sm">Point at anything and tap</p>
                  </div>
                </motion.button>

                <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                {/* Demo subjects */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {EXAMPLE_SUBJECTS.map((s, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCapture(s.label)}
                        className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:shadow-md transition-all flex items-center gap-2"
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Text fallback */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-8">
                  <p className="text-center text-xs text-gray-400 font-medium mb-3">Prefer to type?</p>
                  <div className="relative">
                    <input
                      ref={textInputRef}
                      type="text"
                      placeholder="Ask anything instead..."
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                          handleCapture((e.target as HTMLInputElement).value.trim());
                        }
                      }}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B35]/50 focus:ring-4 focus:ring-[#FF6B35]/10 shadow-sm transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const val = textInputRef.current?.value.trim();
                        if (val) handleCapture(val);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>

              </motion.div>
            </section>

            {/* How it works */}
            <section className="w-full px-5 pb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-sm mx-auto">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-2">
                        <Camera className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <p className="text-gray-900 text-sm font-semibold mb-0.5">Snap</p>
                      <p className="text-gray-400 text-xs">anything you see</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-2">
                        <Wand2 className="w-5 h-5 text-[#FFD700]" />
                      </div>
                      <p className="text-gray-900 text-sm font-semibold mb-0.5">Learn</p>
                      <p className="text-gray-400 text-xs">instantly</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#00C896]/10 flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="w-5 h-5 text-[#00C896]" />
                      </div>
                      <p className="text-gray-900 text-sm font-semibold mb-0.5">Explore</p>
                      <p className="text-gray-400 text-xs">at your pace</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* === MODE SELECT === */}
      <AnimatePresence mode="wait">
        {view === 'mode' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="relative flex-1 flex flex-col z-10 px-5 pt-6">
            <button onClick={handleTryAnother} className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-gray-600 transition-colors mb-4 self-start">
              <X className="w-4 h-4" />
              Start over
            </button>

            {photoPreview && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl overflow-hidden mb-5 shadow-xl">
                <img src={photoPreview} alt="Captured" className="w-full h-44 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-center mb-6">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-1">You captured</p>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{capturedSubject}</h2>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center text-gray-500 text-sm mb-6">
              What would you like to do?
            </motion.p>

            <div className="space-y-3 pb-6">
              
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('explain')} className="w-full p-5 rounded-2xl bg-white border-2 border-[#FF6B35]/20 shadow-sm hover:shadow-md hover:border-[#FF6B35]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-7 h-7 text-[#FF6B35]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 text-lg mb-0.5">Explain it simply</p>
                    <p className="text-gray-500 text-sm">Quick, clear answer in seconds</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('teach')} className="w-full p-5 rounded-2xl bg-white border-2 border-[#FFD700]/20 shadow-sm hover:shadow-md hover:border-[#FFD700]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-7 h-7 text-[#FFD700]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 text-lg mb-0.5">Teach me more</p>
                    <p className="text-gray-500 text-sm">Full lesson with context</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('quiz')} className="w-full p-5 rounded-2xl bg-white border-2 border-[#00C896]/20 shadow-sm hover:shadow-md hover:border-[#00C896]/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#00C896]/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-7 h-7 text-[#00C896]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 text-lg mb-0.5">Quiz me</p>
                    <p className="text-gray-500 text-sm">Test what you know</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => selectMode('deeper')} className="w-full p-5 rounded-2xl bg-gray-900 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-white text-lg mb-0.5">Explore deeper</p>
                    <p className="text-white/50 text-sm">Comprehensive breakdown</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LOADING === */}
      <AnimatePresence>
        {loading && view !== 'home' && view !== 'mode' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center px-5 z-10">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF6B35]/10 to-[#FFD700]/10 flex items-center justify-center mx-auto mb-6">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-10 h-10 text-[#FF6B35]" />
                </motion.div>
              </div>
              <p className="text-gray-700 font-semibold text-lg mb-1">{loadingMessage || 'Thinking...'}</p>
              <p className="text-gray-400 text-sm">This takes about 3 seconds</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === QUIZ STEP === */}
      <AnimatePresence mode="wait">
        {!loading && view === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex-1 flex flex-col z-10 px-5 py-6">
            <div className="max-w-sm mx-auto w-full">
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl bg-[#00C896]/10 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-[#00C896]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz time!</h2>
                <p className="text-gray-500 text-sm">Think about {capturedSubject.toLowerCase()}...</p>
              </div>

              <div className="space-y-3 mb-6">
                {quizQuestions.map((q, i) => {
                  const answered = answeredQuestions.has(i);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl transition-all ${answered ? q.type === 'intuition' ? 'bg-[#FFD700]/8 border-2 border-[#FFD700]/30' : 'bg-[#00C896]/8 border-2 border-[#00C896]/20' : 'bg-white border-2 border-gray-100'}`}
                    >
                      <button onClick={() => !answered && handleAnswer(i)} disabled={answered} className="w-full p-4 text-left">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${answered ? q.type === 'intuition' ? 'bg-[#FFD700]/20' : 'bg-[#00C896]/20' : 'bg-gray-100'}`}>
                            {answered ? (
                              <CheckCircle className={`w-5 h-5 ${q.type === 'intuition' ? 'text-[#FFD700]' : 'text-[#00C896]'}`} />
                            ) : (
                              <span className="text-sm font-bold text-gray-400">{i + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm leading-relaxed ${answered ? 'text-gray-400' : 'text-gray-800'}`}>{q.text}</p>
                            {!answered && q.hint && (
                              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                <span>💡</span> {q.hint}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                      {answered && q.type === 'intuition' && q.answer && (
                        <div className="px-4 pb-4">
                          <div className="p-4 rounded-xl bg-[#FFD700]/8 border border-[#FFD700]/20">
                            <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-1.5">Actually</p>
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

              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} onClick={loadLesson} className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
                See the full explanation
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === RESULT STEP === */}
      <AnimatePresence mode="wait">
        {!loading && view === 'result' && result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex-1 flex flex-col z-10">
            
            {/* Result header */}
            <div className="w-full px-5 pt-5 pb-4 bg-white border-b border-gray-100">
              <div className="max-w-sm mx-auto">
                <button onClick={handleTryAnother} className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-gray-600 transition-colors mb-3">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try another
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF6B35]/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 capitalize">{capturedSubject}</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{result.depth} · Overstood</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-sm mx-auto px-5 py-5 space-y-3">

                {result.hook && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-gradient-to-r from-[#FF6B35]/8 to-[#FFD700]/5 border border-[#FF6B35]/15">
                    <p className="text-base text-gray-800 font-medium leading-relaxed">"{result.hook}"</p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h2 className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider mb-2">What is this</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.whatIsThis}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h2 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider mb-2">How it works</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.howItWorks}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <h2 className="text-[10px] font-bold text-[#B866D6] uppercase tracking-wider mb-2">Why it matters</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.whyItMatters}</p>
                </motion.div>

                {result.vocabulary && result.vocabulary.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <h2 className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider mb-3">Key ideas</h2>
                    <div className="flex flex-wrap gap-2">
                      {result.vocabulary.map((v, i) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl font-medium">
                          {v}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result.tryThis && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-5 rounded-2xl bg-[#00C896]/8 border border-[#00C896]/20">
                    <h2 className="text-[10px] font-bold text-[#00C896] uppercase tracking-wider mb-2">Try it</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.tryThis}</p>
                  </motion.div>
                )}

                {result.question && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question to consider</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.question}</p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="pt-2">
                  <ShareCard result={result} item={capturedSubject} />
                </motion.div>

                {/* Explore more */}
                <div className="pt-4 pb-6">
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mb-3">Explore more</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['explain', 'teach', 'quiz', 'deeper'] as Mode[]).filter(m => m !== mode).map(m => (
                      <button key={m} onClick={() => selectMode(m)} className="py-3 px-3 rounded-2xl bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:shadow-md transition-all">
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
