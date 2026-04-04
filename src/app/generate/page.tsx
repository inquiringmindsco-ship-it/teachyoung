'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Zap, RotateCcw, Share2, Loader2 } from 'lucide-react';
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
  ageGroup: string;
}

interface Challenge {
  mission: string;
  timeNeeded: string;
  whatToDo: string;
  bonusQuestion: string;
}

type Step = 'input' | 'loading' | 'lesson';

const generateChallenge = (item: string, lesson: Partial<LessonPlan>): Challenge => {
  const challenges = [
    { mission: 'Find 3 more examples', timeNeeded: '10 min', whatToDo: `Walk around and find 3 things that relate to "${item}". Write or draw what you found.`, bonusQuestion: 'What do they all have in common?' },
    { mission: 'Become the teacher', timeNeeded: '15 min', whatToDo: `Explain "${item}" to someone in your family. Can they understand it?`, bonusQuestion: 'What questions did they ask?' },
    { mission: 'Draw it from memory', timeNeeded: '10 min', whatToDo: `Close your eyes and picture "${item}". Draw it without looking. Add labels for the important parts.`, bonusQuestion: 'What did you remember first?' },
    { mission: 'Sort it', timeNeeded: '10 min', whatToDo: `Find 3 things related to "${item}" and 3 things that are completely different. Sort them into groups.`, bonusQuestion: 'What makes things belong together?' },
    { mission: '5 senses check', timeNeeded: '10 min', whatToDo: `Find something like "${item}" and describe it using all 5 senses — what you see, hear, smell, feel, and taste.`, bonusQuestion: 'Which sense gives you the most information?' },
  ];
  
  const base = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    ...base,
    mission: base.mission,
    timeNeeded: base.timeNeeded,
    whatToDo: base.whatToDo.replace(/"/g, "'"),
    bonusQuestion: base.bonusQuestion,
  };
};

// Share Card Component
function ShareCard({ lesson, challenge, item }: { lesson: LessonPlan; challenge: Challenge; item: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.9, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `lesson-${item}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Lesson: ${item}`,
          text: `We just learned about ${item}! Created with TeachYoung`,
        });
      } else {
        const link = document.createElement('a');
        link.download = `lesson-${item}.png`;
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
      <div className="fixed -left-[9999px] top-0" style={{ width: 600, height: 900 }}>
        <div 
          ref={cardRef}
          className="w-[600px] h-[900px] p-8 flex flex-col"
          style={{ background: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 100%)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/60 text-sm font-medium">TeachYoung</span>
            </div>
            <span className="text-white/40 text-xs">{lesson.ageGroup}</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <p className="text-[#00C896] text-xs font-medium uppercase tracking-wider mb-1">{lesson.subject}</p>
            <h1 className="text-3xl font-bold text-white capitalize">{item}</h1>
          </div>

          {/* What is this */}
          <div className="mb-4 p-4 rounded-xl bg-white/5">
            <h2 className="text-xs font-bold text-[#FF6B35] uppercase tracking-wide mb-1">What is this</h2>
            <p className="text-sm text-white/70 leading-relaxed">{lesson.whatIsThis}</p>
          </div>

          {/* How it works */}
          <div className="mb-4 p-4 rounded-xl bg-white/5">
            <h2 className="text-xs font-bold text-[#FFD700] uppercase tracking-wide mb-1">How it works</h2>
            <p className="text-sm text-white/70 leading-relaxed">{lesson.howItWorks}</p>
          </div>

          {/* Why it matters */}
          <div className="mb-4 p-4 rounded-xl bg-white/5">
            <h2 className="text-xs font-bold text-[#B866D6] uppercase tracking-wide mb-1">Why it matters</h2>
            <p className="text-sm text-white/70 leading-relaxed">{lesson.whyItMatters}</p>
          </div>

          {/* Vocabulary */}
          <div className="mb-4 p-4 rounded-xl bg-white/5">
            <h2 className="text-xs font-bold text-[#00D4FF] uppercase tracking-wide mb-2">Vocabulary</h2>
            <div className="space-y-1">
              {lesson.vocabulary?.map((v: { word: string; definition: string }, i: number) => (
                <p key={i} className="text-sm text-white/60">
                  <span className="text-white/80 font-medium">{v.word}</span> — {v.definition}
                </p>
              ))}
            </div>
          </div>

          {/* Try this */}
          <div className="p-4 rounded-xl bg-[#00C896]/10 border border-[#00C896]/20">
            <h2 className="text-xs font-bold text-[#00C896] uppercase tracking-wide mb-1">Try this together</h2>
            <p className="text-sm text-white/70">{lesson.tryThisTogether}</p>
          </div>

          {/* Challenge */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD700]/10 border border-[#FFD700]/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-[#FFD700]" />
              <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wide">5-Min Challenge</span>
            </div>
            <p className="text-sm font-medium text-white">{challenge.mission}</p>
            <p className="text-xs text-white/50 mt-1">{challenge.timeNeeded}</p>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 flex items-center justify-between">
            <p className="text-white/30 text-xs">teachyg.org</p>
            <p className="text-white/30 text-xs">Made for curious minds</p>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button 
        onClick={handleShare}
        disabled={sharing}
        className="w-full py-3 rounded-xl bg-white/10 text-white/80 text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/15 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        {sharing ? 'Preparing...' : 'Share Card'}
      </button>
    </div>
  );
}

export default function GeneratePage() {
  const [step, setStep] = useState<Step>('input');
  const [mode, setMode] = useState<'lesson' | 'challenge'>('lesson');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [item, setItem] = useState('');
  const [ageGroup, setAgeGroup] = useState('9-12');
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setMode('lesson');
    
    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: item.trim(), ageGroup }),
      });
      
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      
      const data = await response.json();
      const lesson = data.lesson as LessonPlan;
      
      lesson.title = item.trim();
      lesson.ageGroup = `Ages ${ageGroup}`;
      lesson.subject = lesson.subject || 'Learning';
      
      const generatedChallenge = generateChallenge(item.trim(), lesson);
      setLessonPlan(lesson);
      setChallenge(generatedChallenge);
      setStep('lesson');
      
      // Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('teachyoung_lessons') || '[]');
        saved.unshift({ id: Date.now().toString(), item: item.trim(), ageGroup, lesson, challenge: generatedChallenge, createdAt: new Date().toISOString() });
        localStorage.setItem('teachyoung_lessons', JSON.stringify(saved.slice(0, 50)));
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
    setLessonPlan(null);
    setChallenge(null);
    setMode('lesson');
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white flex flex-col">
      {/* Header */}
      <header className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white/80">TeachYoung</span>
        </div>
        {step === 'lesson' && (
          <button onClick={handleTryAnother} className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            New
          </button>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-5">

        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-5"
          >
            {/* Headline */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight">Turn anything into a lesson</h1>
              <p className="text-white/40 text-xs">Snap a photo or type anything. Get an instant lesson.</p>
            </div>

            {/* Photo/Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.03] flex flex-col items-center justify-center cursor-pointer active:scale-98 transition-all hover:border-[#FF6B35]/30"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-white/30 mb-2" />
                  <p className="text-sm text-white/50">Tap to take photo</p>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </div>

            {/* Text input */}
            <div className="space-y-2">
              <input 
                type="text" 
                value={item}
                onChange={e => setItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && item.trim() && handleGenerate()}
                placeholder="McDonald's, leaf, washing machine..."
                className="w-full p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF6B35]/40 transition-colors"
              />
              
              {/* Age selector */}
              <div className="flex gap-1.5 justify-center">
                {[
                  { value: '3-5', label: '3–5' },
                  { value: '6-8', label: '6–8' },
                  { value: '9-12', label: '9–12' },
                  { value: '13+', label: '13+' },
                ].map(age => (
                  <button
                    key={age.value}
                    onClick={() => setAgeGroup(age.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      ageGroup === age.value 
                        ? 'bg-[#FF6B35] text-white' 
                        : 'bg-white/[0.05] text-white/40 hover:text-white/60'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button 
              onClick={handleGenerate}
              disabled={!item.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Sparkles className="w-4 h-4" />
              Generate Lesson
            </button>
          </motion.div>
        )}

        {/* LOADING STEP */}
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
            <p className="text-base font-medium text-white/70">Creating lesson...</p>
          </motion.div>
        )}

        {/* LESSON STEP */}
        {step === 'lesson' && lessonPlan && challenge && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm pb-32"
          >
            {/* Mode toggle */}
            <div className="flex gap-1.5 mb-5 p-1 bg-white/[0.05] rounded-xl">
              <button
                onClick={() => setMode('lesson')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === 'lesson' ? 'bg-white/10 text-white' : 'text-white/40'
                }`}
              >
                Lesson
              </button>
              <button
                onClick={() => setMode('challenge')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  mode === 'challenge' ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A]' : 'text-white/40'
                }`}
              >
                <Zap className="w-3 h-3" />
                Challenge
              </button>
            </div>

            {/* LESSON VIEW */}
            {mode === 'lesson' && (
              <>
                <div className="text-center mb-4">
                  <span className="text-[10px] text-[#00C896] font-medium uppercase tracking-wider">{lessonPlan.subject}</span>
                  <h1 className="text-xl font-bold mt-0.5 capitalize">{item}</h1>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wide mb-1">What is this</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{lessonPlan.whatIsThis}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#FFD700] uppercase tracking-wide mb-1">How it works</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{lessonPlan.howItWorks}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#B866D6] uppercase tracking-wide mb-1">Why it matters</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{lessonPlan.whyItMatters}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#00D4FF] uppercase tracking-wide mb-2">Vocabulary</h2>
                    <div className="space-y-1">
                      {(lessonPlan.vocabulary || []).map((v: { word: string; definition: string }, i: number) => (
                        <p key={i} className="text-xs text-white/60">
                          <span className="text-white/80 font-medium">{v.word}</span> — {v.definition}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00C896]/8 border border-[#00C896]/15">
                    <h2 className="text-[11px] font-bold text-[#00C896] uppercase tracking-wide mb-1">Try this together</h2>
                    <p className="text-sm text-white/70">{lessonPlan.tryThisTogether}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#FFD700] uppercase tracking-wide mb-2">Ask your child</h2>
                    <div className="space-y-1">
                      {(lessonPlan.askYourChild || []).map((q: string, i: number) => (
                        <p key={i} className="text-sm text-white/70">• {q}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Share card */}
                <div className="mt-6">
                  <ShareCard lesson={lessonPlan} challenge={challenge} item={item} />
                </div>
              </>
            )}

            {/* CHALLENGE VIEW */}
            {mode === 'challenge' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">5-Minute Challenge</p>
                  <h2 className="text-lg font-bold mt-1">{challenge.mission}</h2>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04]">
                  <p className="text-[11px] text-white/40 uppercase tracking-wide mb-1">⏱ Time</p>
                  <p className="text-sm text-white/70">{challenge.timeNeeded}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04]">
                  <p className="text-[11px] text-white/40 uppercase tracking-wide mb-1">🎯 What to do</p>
                  <p className="text-sm text-white/70 leading-relaxed">{challenge.whatToDo}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#B866D6]/8 border border-[#B866D6]/15">
                  <p className="text-[11px] text-[#B866D6] font-bold uppercase tracking-wide mb-1">💎 Bonus</p>
                  <p className="text-sm text-white/70">{challenge.bonusQuestion}</p>
                </div>

                {/* Share card for challenge */}
                <div className="mt-4">
                  <ShareCard lesson={lessonPlan} challenge={challenge} item={item} />
                </div>
              </motion.div>
            )}

            {/* Fixed bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0D0D1A] via-[#0D0D1A] to-transparent">
              <div className="w-full max-w-sm mx-auto flex gap-2">
                <button 
                  onClick={handleTryAnother}
                  className="flex-1 py-3 rounded-xl bg-white/8 text-white/70 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Another
                </button>
                {mode === 'lesson' ? (
                  <button 
                    onClick={() => setMode('challenge')}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    5-Min Challenge
                  </button>
                ) : (
                  <button 
                    onClick={() => setMode('lesson')}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Back to Lesson
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
