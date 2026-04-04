'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Zap, RotateCcw, Share2, ChevronDown } from 'lucide-react';
import { toPng } from 'html-to-image';

interface LessonPlan {
  title: string;
  whatIsThis: string;
  howItWorks: string;
  whyItMatters: string;
  vocabulary: { word: string; definition: string }[];
  tryThisTogether: string;
  askYourChild: string[];
  subject: string;
  depth: string;
}

interface Challenge {
  mission: string;
  timeNeeded: string;
  whatToDo: string;
  bonusQuestion: string;
}

type Step = 'input' | 'loading' | 'result';
type Depth = 'quick' | 'standard' | 'deep';

const DEPTH_LABELS: Record<Depth, string> = {
  quick: 'Quick',
  standard: 'Standard',
  deep: 'Deep',
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
  return {
    mission: base.mission,
    timeNeeded: base.timeNeeded,
    whatToDo: base.whatToDo,
    bonusQuestion: base.bonusQuestion,
  };
};

const DEPTH_PROMPTS: Record<Depth, string> = {
  quick: 'Keep every answer to 1-2 sentences. Maximum brevity. Get to the point fast. No fluff.',
  standard: 'Use thoughtful explanations. Relate ideas to everyday life. Include useful vocabulary.',
  deep: 'Go deeper. Include nuances, examples, and real-world applications. Challenge assumptions.',
};

function ShareCard({ result, item, depth }: { result: LessonPlan; item: string; depth: Depth }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.9, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `understand-${item}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Understanding: ${item}`,
          text: `I just learned about ${item} with Understand.`,
        });
      } else {
        const link = document.createElement('a');
        link.download = `understand-${item}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.warn('Share failed', e);
    }
    setSharing(false);
  }, [item]);

  return (
    <div className="space-y-3">
      {/* Hidden share card */}
      <div className="fixed -left-[9999px] top-0" style={{ width: 600, height: 800 }}>
        <div 
          ref={cardRef}
          className="w-[600px] h-[800px] p-8 flex flex-col"
          style={{ background: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 100%)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">Understand</span>
            <span className="text-white/30 text-xs ml-auto">{DEPTH_LABELS[depth]}</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-1">{item}</h1>
            <p className="text-white/40 text-sm">Understanding</p>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-xl bg-white/5">
              <h2 className="text-xs font-medium text-[#FF6B35] mb-1">What is this</h2>
              <p className="text-sm text-white/70 leading-relaxed">{result.whatIsThis}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h2 className="text-xs font-medium text-[#FFD700] mb-1">How it works</h2>
              <p className="text-sm text-white/70 leading-relaxed">{result.howItWorks}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h2 className="text-xs font-medium text-[#B866D6] mb-1">Why it matters</h2>
              <p className="text-sm text-white/70 leading-relaxed">{result.whyItMatters}</p>
            </div>

            {result.vocabulary && result.vocabulary.length > 0 && (
              <div className="p-4 rounded-xl bg-white/5">
                <h2 className="text-xs font-medium text-[#00D4FF] mb-2">Key ideas</h2>
                <div className="space-y-1">
                  {result.vocabulary.map((v, i) => (
                    <p key={i} className="text-sm text-white/60">
                      <span className="text-white/80">{v.word}</span> — {v.definition}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-white/20 text-xs">understand.app</p>
            <p className="text-white/20 text-xs">Understand anything instantly</p>
          </div>
        </div>
      </div>

      {/* Button */}
      <button 
        onClick={handleShare}
        disabled={sharing}
        className="w-full py-3 rounded-xl bg-white/8 text-white/70 text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/12 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        {sharing ? 'Preparing...' : 'Share'}
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleGenerate = async () => {
    if (!item.trim()) return;
    setStep('loading');
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
      
      lesson.title = item.trim();
      lesson.depth = DEPTH_LABELS[depth];
      
      const generatedChallenge = generateChallenge(item.trim());
      setResult(lesson);
      setChallenge(generatedChallenge);
      setStep('result');
      
      // Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('understand_history') || '[]');
        saved.unshift({ id: Date.now().toString(), item: item.trim(), depth, lesson, challenge: generatedChallenge, createdAt: new Date().toISOString() });
        localStorage.setItem('understand_history', JSON.stringify(saved.slice(0, 50)));
      } catch {}
      
    } catch (error) {
      console.error('Generation error:', error);
      setStep('input');
    }
  };

  const handleTryAnother = () => {
    setStep('input');
    setPhotoPreview(null);
    setItem('');
    setResult(null);
    setChallenge(null);
    setMode('explain');
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white flex flex-col">
      {/* Minimal header */}
      <header className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        {step === 'result' && (
          <button onClick={handleTryAnother} className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3 h-3" />
            New
          </button>
        )}
      </header>

      {/* Main — centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-5">

        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            {/* Headline */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Understand anything<br />instantly.</h1>
              <p className="text-white/40 text-sm">Type or snap anything. Get a clear explanation.</p>
            </div>

            {/* Main input */}
            <div className="space-y-3">
              <div className="relative">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={item}
                  onChange={e => setItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && item.trim() && handleGenerate()}
                  placeholder="Why is the sky blue? How does a refrigerator work? What is..." 
                  className="w-full p-4 pr-24 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-base text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF6B35]/30 transition-colors text-center"
                  autoFocus
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/30 hover:text-white/50 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </div>

              {/* Photo preview */}
              {photoPreview && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-xl overflow-hidden"
                >
                  <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover" />
                  <button 
                    onClick={() => { setPhotoPreview(null); setItem(''); }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/70 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Depth selector — small and optional */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/30 text-xs">Depth:</span>
                <div className="flex gap-1 bg-white/[0.04] p-1 rounded-xl">
                  {(['quick', 'standard', 'deep'] as Depth[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setDepth(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        depth === d 
                          ? 'bg-[#FF6B35] text-white' 
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {DEPTH_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <button 
                onClick={handleGenerate}
                disabled={!item.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] font-bold text-base flex items-center justify-center gap-2 disabled:opacity-30 hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-5 h-5" />
                Generate
              </button>
            </div>

            {/* Subtle examples */}
            <p className="text-center text-white/20 text-xs mt-6">
              Try: fire hydrant, antibiotics, gravity, barcodes, elevators
            </p>
          </motion.div>
        )}

        {/* LOADING */}
        {step === 'loading' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border-2 border-[#FFD700] border-t-transparent"
              />
            </div>
            <p className="text-base font-medium text-white/70">Understanding "{item}"...</p>
          </motion.div>
        )}

        {/* RESULT STEP */}
        {step === 'result' && result && challenge && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg pb-32"
          >
            {/* Mode toggle */}
            <div className="flex gap-1.5 mb-6 p-1 bg-white/[0.05] rounded-xl w-fit mx-auto">
              <button
                onClick={() => setMode('explain')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === 'explain' ? 'bg-white/10 text-white' : 'text-white/40'
                }`}
              >
                Explanation
              </button>
              <button
                onClick={() => setMode('challenge')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  mode === 'challenge' ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A]' : 'text-white/40'
                }`}
              >
                <Zap className="w-3 h-3" />
                Try it
              </button>
            </div>

            {/* EXPLANATION VIEW */}
            {mode === 'explain' && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Understanding: {item}</h1>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/[0.04]">
                    <h2 className="text-xs font-medium text-[#FF6B35] mb-2">What is this</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{result.whatIsThis}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.04]">
                    <h2 className="text-xs font-medium text-[#FFD700] mb-2">How it works</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{result.howItWorks}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.04]">
                    <h2 className="text-xs font-medium text-[#B866D6] mb-2">Why it matters</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{result.whyItMatters}</p>
                  </div>

                  {result.vocabulary && result.vocabulary.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/[0.04]">
                      <h2 className="text-xs font-medium text-[#00D4FF] mb-3">Key ideas</h2>
                      <div className="space-y-2">
                        {result.vocabulary.map((v, i) => (
                          <p key={i} className="text-sm text-white/60">
                            <span className="text-white/80 font-medium">{v.word}</span> — {v.definition}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.tryThisTogether && (
                    <div className="p-5 rounded-2xl bg-[#00C896]/8 border border-[#00C896]/15">
                      <h2 className="text-xs font-medium text-[#00C896] mb-2">Try it</h2>
                      <p className="text-sm text-white/70">{result.tryThisTogether}</p>
                    </div>
                  )}

                  {result.askYourChild && result.askYourChild.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/[0.04]">
                      <h2 className="text-xs font-medium text-[#FFD700] mb-3">Questions to consider</h2>
                      <div className="space-y-2">
                        {result.askYourChild.map((q, i) => (
                          <p key={i} className="text-sm text-white/70">• {q}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Share — below everything */}
                <div className="mt-8 mb-2">
                  <ShareCard result={result} item={item} depth={depth} />
                </div>
              </>
            )}

            {/* CHALLENGE VIEW */}
            {mode === 'challenge' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Try it</p>
                  <h2 className="text-xl font-bold mt-1">{challenge.mission}</h2>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04]">
                  <p className="text-[11px] text-white/30 mb-1">Time</p>
                  <p className="text-sm text-white/70">{challenge.timeNeeded}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04]">
                  <p className="text-[11px] text-white/30 mb-1">What to do</p>
                  <p className="text-sm text-white/70 leading-relaxed">{challenge.whatToDo}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#B866D6]/8 border border-[#B866D6]/15">
                  <p className="text-[11px] text-[#B866D6] font-medium mb-1">Bonus question</p>
                  <p className="text-sm text-white/70">{challenge.bonusQuestion}</p>
                </div>

                <div className="mt-4">
                  <ShareCard result={result!} item={item} depth={depth} />
                </div>
              </motion.div>
            )}

            {/* Fixed bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0D0D1A] via-[#0D0D1A] to-transparent">
              <div className="w-full max-w-lg mx-auto flex gap-2">
                <button 
                  onClick={handleTryAnother}
                  className="flex-1 py-3.5 rounded-xl bg-white/8 text-white/70 text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try another
                </button>
                {mode === 'explain' ? (
                  <button 
                    onClick={() => setMode('challenge')}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Try it
                  </button>
                ) : (
                  <button 
                    onClick={() => setMode('explain')}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explanation
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
