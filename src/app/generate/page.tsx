'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Zap, RotateCcw, Share2, ChevronRight, Lightbulb, Flame, Compass, Upload, ArrowRight, CheckCircle, Brain, Gauge } from 'lucide-react';
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

type Step = 'input' | 'quiz' | 'result';
type Depth = 'quick' | 'standard' | 'deep';

const DEPTH_OPTIONS: { value: Depth; label: string; desc: string }[] = [
  { value: 'quick', label: 'Quick', desc: 'Fast, essential answer' },
  { value: 'standard', label: 'Standard', desc: 'Balanced clarity' },
  { value: 'deep', label: 'Deep', desc: 'Full breakdown' },
];

const EXAMPLE_PROMPTS = [
  'Why do fire hydrants have caps?',
  'How does a barcode scanner work?',
  'What makes elevators safe?',
  'Why is the sky blue?',
  'How does gravity work?',
];

function ShareCard({ result, item, depth }: { result: LessonPlan; item: string; depth: Depth }) {
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
      <div className="fixed -left-[9999px] top-0" style={{ width: 600, height: 800 }}>
        <div ref={cardRef} className="w-[600px] h-[800px] p-8 flex flex-col" style={{ background: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 100%)' }}>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">Overstood</span>
            <span className="text-white/30 text-xs ml-auto">{depth}</span>
          </div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-1">{item}</h1>
            <p className="text-white/40 text-sm">Get Overstood</p>
          </div>
          {result.hook && (
            <div className="p-3 rounded-xl bg-white/5 mb-3">
              <p className="text-base text-white/80 leading-relaxed">"{result.hook}"</p>
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div className="p-3 rounded-xl bg-white/5">
              <h2 className="text-xs font-medium text-[#FF6B35] mb-1">What is this</h2>
              <p className="text-sm text-white/70 leading-relaxed">{result.whatIsThis}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <h2 className="text-xs font-medium text-[#FFD700] mb-1">Why it matters</h2>
              <p className="text-sm text-white/70 leading-relaxed">{result.whyItMatters}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-white/20 text-xs">overstood.app</p>
            <p className="text-white/20 text-xs">Understand anything instantly</p>
          </div>
        </div>
      </div>
      <button onClick={handleShare} disabled={sharing} className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/[0.10] hover:text-white/80 transition-all">
        <Share2 className="w-3.5 h-3.5" />
        {sharing ? 'Preparing...' : 'Share this'}
      </button>
    </div>
  );
}

export default function GeneratePage() {
  const [step, setStep] = useState<Step>('input');
  const [mode, setMode] = useState<'explain' | 'challenge'>('explain');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [item, setItem] = useState('');
  const [depth, setDepth] = useState<Depth>('standard');
  const [result, setResult] = useState<LessonPlan | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { state, showDiscoveryToast, showAchievementToast, addDiscovery, completeChallenge, useCamera } = useGamification();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    useCamera();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
        const filename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setItem(filename);
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
      { mission: '5 senses', timeNeeded: '5 min', whatToDo: `If possible, experience "${item}" with all 5 senses. Describe what you notice.`, bonusQuestion: 'Which sense gives you the most information?' },
    ];
    const base = challenges[Math.floor(Math.random() * challenges.length)];
    return { mission: base.mission, timeNeeded: base.timeNeeded, whatToDo: base.whatToDo, bonusQuestion: base.bonusQuestion };
  };

  const loadLesson = useCallback(async () => {
    setLoading(true);
    setLoadingMessage('Finding clarity...');
    setMode('explain');
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: item.trim(), depth }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      const lesson = data.lesson as LessonPlan;
      lesson.depth = depth;
      const generatedChallenge = generateChallenge(item.trim());
      setResult(lesson);
      setChallenge(generatedChallenge);
      setStep('result');
      setLoading(false);
      addDiscovery();
      try {
        const saved = JSON.parse(localStorage.getItem('overstood_history') || '[]');
        saved.unshift({ id: Date.now().toString(), item: item.trim(), depth, lesson, challenge: generatedChallenge, createdAt: new Date().toISOString() });
        localStorage.setItem('overstood_history', JSON.stringify(saved.slice(0, 50)));
      } catch {}
    } catch (error) {
      console.error('Generation error:', error);
      setLoading(false);
      setStep('input');
    }
  }, [item, depth, addDiscovery]);

  const handleGenerate = async () => {
    if (!item.trim()) return;
    setLoading(true);
    setLoadingMessage('Getting curious...');
    try {
      const qResponse = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: item.trim() }),
      });
      if (!qResponse.ok) throw new Error('Questions failed');
      const qData = await qResponse.json();
      const questions = qData.questions.questions || [];
      setQuizQuestions(questions);
      setStep(questions.length > 0 ? 'quiz' : 'result');
      setLoading(false);
      if (questions.length === 0) loadLesson();
    } catch (error) {
      console.error('Questions error:', error);
      setLoading(false);
      loadLesson();
    }
  };

  const handleAnswer = (index: number) => {
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(index);
    setAnsweredQuestions(newAnswered);
    if (newAnswered.size >= quizQuestions.length) {
      setTimeout(() => loadLesson(), 600);
    }
  };

  const handleSkip = () => {
    setQuizQuestions([]);
    loadLesson();
  };

  const handleChallengeComplete = () => { completeChallenge(); };

  const handleTryAnother = () => {
    setStep('input');
    setPhotoPreview(null);
    setItem('');
    setDepth('standard');
    setResult(null);
    setChallenge(null);
    setQuizQuestions([]);
    setAnsweredQuestions(new Set());
    setMode('explain');
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#090910] text-white flex flex-col">

      {/* HEADER */}
      <header className="w-full px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Overstood</span>
        </div>
        <div className="flex items-center gap-4">
          {state.streak > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Flame className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{state.streak} day{state.streak > 1 ? 's' : ''}</span>
            </div>
          )}
          {state.discoveries > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Compass className="w-3.5 h-3.5 text-[#00C896]" />
              <span>{state.discoveries} explored</span>
            </div>
          )}
        </div>
      </header>

      {/* TOASTS */}
      <AnimatePresence>
        {showDiscoveryToast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-16 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-[#00C896]/20 border border-[#00C896]/30 text-[#00C896] text-xs font-medium">
              +1 Discovery
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAchievementToast && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-16 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35]/20 to-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-xs font-medium">
              {showAchievementToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* === HOME / INPUT VIEW === */}
        {step === 'input' && (
          <div className="flex-1 flex flex-col">
            
            {/* HERO */}
            <section className="w-full pt-8 pb-6 px-5">
              <div className="max-w-xl mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
                  Understand anything.
                  <br />
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">Instantly.</span>
                </h1>
                <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Type it, snap it, or upload it. Get a clear explanation in seconds — no jargon, no complexity.
                </p>
              </div>
            </section>

            {/* INPUT CARD */}
            <section className="w-full px-5 pb-6">
              <div className="max-w-xl mx-auto">
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4 backdrop-blur-sm">
                  
                  {/* Text input */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={item}
                      onChange={e => setItem(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && item.trim() && handleGenerate()}
                      placeholder="Ask about anything… fire hydrants, gravity, elevators"
                      className="w-full p-4 pr-12 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF6B35]/30 focus:bg-white/[0.07] transition-all"
                      autoFocus
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                  </div>

                  {/* Photo preview */}
                  {photoPreview && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-xl overflow-hidden">
                      <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover" />
                      <button 
                        onClick={() => { setPhotoPreview(null); setItem(''); }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white backdrop-blur-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* Depth selector */}
                  <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl">
                    {DEPTH_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDepth(opt.value)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                          depth === opt.value
                            ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#090910] shadow-lg shadow-[#FF6B35]/20'
                            : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/25 text-center -mt-1">
                    {DEPTH_OPTIONS.find(o => o.value === depth)?.desc}
                  </p>

                  {/* Generate button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!item.trim() || loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#090910] font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-100 hover:shadow-xl hover:shadow-[#FF6B35]/20 transition-all disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        <span>{loadingMessage || 'Thinking...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* EXAMPLE PROMPTS */}
            <section className="w-full px-5 pb-8">
              <div className="max-w-xl mx-auto">
                <p className="text-[10px] text-white/20 uppercase tracking-widest text-center mb-3">Try these</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLE_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => { setItem(prompt); inputRef.current?.focus(); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* BENEFIT CARDS */}
            <section className="w-full px-5 pb-12">
              <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-9 h-9 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <p className="text-white/60 text-xs font-medium mb-1">Snap or type</p>
                    <p className="text-white/25 text-[10px] leading-relaxed">Anything you encounter</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-9 h-9 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-2">
                      <Brain className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <p className="text-white/60 text-xs font-medium mb-1">Get clarity</p>
                    <p className="text-white/25 text-[10px] leading-relaxed">Plain explanations</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-9 h-9 rounded-xl bg-[#00C896]/10 flex items-center justify-center mx-auto mb-2">
                      <Gauge className="w-4 h-4 text-[#00C896]" />
                    </div>
                    <p className="text-white/60 text-xs font-medium mb-1">Learn deeper</p>
                    <p className="text-white/25 text-[10px] leading-relaxed">At your own pace</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* === LOADING STATE === */}
        {loading && step !== 'input' && (
          <div className="flex-1 flex flex-col items-center justify-center px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#FFD700]/10 flex items-center justify-center mx-auto mb-5">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-8 h-8 text-[#FFD700]" />
                </motion.div>
              </div>
              <p className="text-white/50 text-sm">{loadingMessage || 'Thinking...'}</p>
              <p className="text-white/20 text-xs mt-1">This takes about 3 seconds</p>
            </motion.div>
          </div>
        )}

        {/* === QUIZ STEP === */}
        {!loading && step === 'quiz' && (
          <div className="flex-1 flex flex-col px-5 py-6">
            <div className="max-w-md mx-auto w-full">
              
              {/* Quiz header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-[#FFD700]" />
                </div>
                <h2 className="text-xl font-bold mb-1">Before we explain...</h2>
                <p className="text-white/40 text-sm">Think about {item.toLowerCase()} for a second.</p>
              </div>

              {/* Questions */}
              <div className="space-y-3 mb-6">
                {quizQuestions.map((q, i) => {
                  const answered = answeredQuestions.has(i);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`rounded-xl transition-all ${
                        answered
                          ? q.type === 'intuition'
                            ? 'bg-[#FFD700]/8 border border-[#FFD700]/20'
                            : 'bg-[#00C896]/8 border border-[#00C896]/15'
                          : 'bg-white/[0.04] border border-white/[0.06]'
                      }`}
                    >
                      <button onClick={() => !answered && handleAnswer(i)} disabled={answered} className="w-full p-4 text-left">
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            answered
                              ? q.type === 'intuition' ? 'bg-[#FFD700]/20' : 'bg-[#00C896]/20'
                              : 'bg-white/8'
                          }`}>
                            {answered ? (
                              <CheckCircle className={`w-3.5 h-3.5 ${q.type === 'intuition' ? 'text-[#FFD700]' : 'text-[#00C896]'}`} />
                            ) : (
                              <span className="text-[10px] text-white/30 font-medium">{i + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm leading-relaxed ${answered ? 'text-white/40' : 'text-white/80'}`}>{q.text}</p>
                            {!answered && q.hint && <p className="text-xs text-white/25 mt-1">Hint: {q.hint}</p>}
                          </div>
                        </div>
                      </button>
                      {answered && q.type === 'intuition' && q.answer && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-lg bg-[#FFD700]/8 border border-[#FFD700]/15">
                            <p className="text-[10px] text-[#FFD700] font-semibold uppercase tracking-wider mb-1">Actually</p>
                            <p className="text-sm text-white/70 leading-relaxed">{q.answer}</p>
                          </div>
                        </div>
                      )}
                      {answered && q.type === 'experience' && (
                        <div className="px-4 pb-4">
                          <p className="text-xs text-white/35 italic leading-relaxed">Everyone's experience is valid. Here's how it actually works...</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="flex gap-2">
                <button onClick={handleSkip} className="flex-1 py-3 rounded-xl bg-white/[0.04] text-white/40 text-sm hover:bg-white/[0.07] hover:text-white/60 transition-colors">
                  Skip
                </button>
                <button onClick={handleSkip} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#090910] font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all">
                  See the answer
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === RESULT STEP === */}
        {!loading && step === 'result' && result && challenge && (
          <div className="flex-1 flex flex-col pb-24">
            
            {/* Result header */}
            <div className="w-full px-5 pt-6 pb-4">
              <div className="max-w-md mx-auto">
                <button onClick={handleTryAnother} className="flex items-center gap-1.5 text-white/30 text-xs hover:text-white/50 transition-colors mb-4">
                  <RotateCcw className="w-3 h-3" />
                  Try another
                </button>
                <div className="text-center mb-6">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Overstood</p>
                  <h1 className="text-2xl font-bold">{item}</h1>
                </div>
              </div>
            </div>

            {/* Mode toggle */}
            <div className="w-full px-5 mb-4">
              <div className="max-w-md mx-auto">
                <div className="flex gap-1.5 p-1 bg-white/[0.04] rounded-xl w-fit mx-auto">
                  <button
                    onClick={() => setMode('explain')}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      mode === 'explain' ? 'bg-white/10 text-white' : 'text-white/40'
                    }`}
                  >
                    Explanation
                  </button>
                  <button
                    onClick={() => { setMode('challenge'); handleChallengeComplete(); }}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      mode === 'challenge' ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#090910]' : 'text-white/40'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    Try it
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-md mx-auto px-5">

                {mode === 'explain' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    
                    {result.hook && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FFD700]/5 border border-[#FF6B35]/15">
                        <p className="text-sm text-white/90 font-medium leading-relaxed">"{result.hook}"</p>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <h2 className="text-[10px] font-semibold text-[#FF6B35] uppercase tracking-wider mb-2">What is this</h2>
                      <p className="text-sm text-white/70 leading-relaxed">{result.whatIsThis}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <h2 className="text-[10px] font-semibold text-[#FFD700] uppercase tracking-wider mb-2">How it works</h2>
                      <p className="text-sm text-white/70 leading-relaxed">{result.howItWorks}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <h2 className="text-[10px] font-semibold text-[#B866D6] uppercase tracking-wider mb-2">Why it matters</h2>
                      <p className="text-sm text-white/70 leading-relaxed">{result.whyItMatters}</p>
                    </div>

                    {result.vocabulary && result.vocabulary.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <h2 className="text-[10px] font-semibold text-[#00D4FF] uppercase tracking-wider mb-3">Key ideas</h2>
                        <div className="flex flex-wrap gap-2">
                          {result.vocabulary.map((v, i) => (
                            <span key={i} className="text-xs text-white/60 bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.tryThis && (
                      <div className="p-4 rounded-xl bg-[#00C896]/8 border border-[#00C896]/12">
                        <h2 className="text-[10px] font-semibold text-[#00C896] uppercase tracking-wider mb-2">Try it</h2>
                        <p className="text-sm text-white/70 leading-relaxed">{result.tryThis}</p>
                      </div>
                    )}

                    {result.question && (
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <h2 className="text-[10px] font-semibold text-[#FFD700] uppercase tracking-wider mb-2">Question to consider</h2>
                        <p className="text-sm text-white/60 leading-relaxed">{result.question}</p>
                      </div>
                    )}

                    <div className="pt-2">
                      <ShareCard result={result} item={item} depth={depth} />
                    </div>
                  </motion.div>
                )}

                {mode === 'challenge' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF6B35]/20">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Try it</p>
                      <h2 className="text-xl font-bold">{challenge.mission}</h2>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Time</p>
                      <p className="text-sm text-white/70">{challenge.timeNeeded}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">What to do</p>
                      <p className="text-sm text-white/70 leading-relaxed">{challenge.whatToDo}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#B866D6]/8 border border-[#B866D6]/12">
                      <p className="text-[10px] text-[#B866D6] uppercase tracking-wider mb-1">Bonus question</p>
                      <p className="text-sm text-white/70">{challenge.bonusQuestion}</p>
                    </div>

                    <div className="pt-2">
                      <ShareCard result={result!} item={item} depth={depth} />
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

            {/* Fixed bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#090910] via-[#090910] to-transparent pt-8">
              <div className="max-w-md mx-auto flex gap-2">
                <button 
                  onClick={() => setMode(mode === 'explain' ? 'challenge' : 'explain')}
                  className="flex-1 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/[0.10] transition-colors"
                >
                  {mode === 'explain' ? (
                    <>
                      <Zap className="w-4 h-4 text-[#FF6B35]" />
                      Try it
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      Explanation
                    </>
                  )}
                </button>
                <button 
                  onClick={handleTryAnother}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#090910] font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore more
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
