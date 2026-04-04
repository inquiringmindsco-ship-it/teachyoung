'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, CheckCircle, Star, Heart, 
  Sparkles, Sun, Moon, Wind, Eye, Zap, ChevronRight
} from 'lucide-react';
import { mudras } from '@/lib/design-system';

export default function MudrasPage() {
  const [activeMudra, setActiveMudra] = useState<string | null>(null);
  const [practicing, setPracticing] = useState(false);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [completedMudras, setCompletedMudras] = useState<string[]>([]);

  const currentMudra = mudras.find(m => m.id === activeMudra);

  const startPractice = () => {
    setPracticing(true);
    setPracticeTimer(0);
    const interval = setInterval(() => {
      setPracticeTimer(t => t + 1);
    }, 1000);
    (window as any).mudraInterval = interval;
  };

  const stopPractice = () => {
    setPracticing(false);
    if ((window as any).mudraInterval) {
      clearInterval((window as any).mudraInterval);
    }
    if (currentMudra && !completedMudras.includes(currentMudra.id)) {
      setCompletedMudras([...completedMudras, currentMudra.id]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D1A]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/phoenix" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FF6B35] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Hand Mudras</h1>
              <p className="text-xs text-[#B8B8D0]">Sacred Hand Science</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[#B8B8D0]">
              {completedMudras.length}/{mudras.length} Mastered
            </span>
            <div className="w-24 h-2 rounded-full bg-[#16162A] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35]"
                style={{ width: `${(completedMudras.length / mudras.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mudra Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mudras.map((mudra, index) => (
            <motion.div
              key={mudra.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                activeMudra === mudra.id
                  ? 'bg-gradient-to-br from-[#16162A] to-[#1A1A2E] border-[#FFD700]/50 glow-gold'
                  : 'bg-[#16162A] border-white/5 hover:border-white/20'
              }`}
              onClick={() => setActiveMudra(mudra.id)}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${mudra.color}20` }}
                >
                  {mudra.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{mudra.name}</h3>
                  <p className="text-xs text-[#B8B8D0] mb-2">{mudra.sanskrit}</p>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: `${mudra.color}20`, color: mudra.color }}
                    >
                      {mudra.superpower}
                    </span>
                  </div>
                </div>
                {completedMudras.includes(mudra.id) && (
                  <CheckCircle className="w-6 h-6 text-[#00C896]" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Practice Modal */}
        <AnimatePresence>
          {currentMudra && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                setActiveMudra(null);
                setPracticing(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-[#16162A] rounded-3xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Hero Section */}
                <div 
                  className="p-8 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${currentMudra.color}30 0%, transparent 100%)` }}
                >
                  <button
                    onClick={() => {
                      setActiveMudra(null);
                      setPracticing(false);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    ×
                  </button>

                  <div className="flex items-center gap-6 mb-6">
                    <div 
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
                      style={{ background: `${currentMudra.color}30` }}
                    >
                      {currentMudra.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{currentMudra.name}</h2>
                      <p className="text-[#B8B8D0]">{currentMudra.sanskrit} • {currentMudra.meaning}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#FFD700]" />
                        <span style={{ color: currentMudra.color }}>{currentMudra.superpower}</span>
                      </div>
                    </div>
                  </div>

                  {/* Position Guide */}
                  <div className="p-4 rounded-xl bg-black/30 backdrop-blur-sm">
                    <div className="text-sm text-[#B8B8D0] mb-1">Hand Position</div>
                    <p className="font-medium">{currentMudra.position}</p>
                  </div>
                </div>

                {/* Practice Timer */}
                <div className="p-6 border-t border-white/5">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold mb-2" style={{ color: currentMudra.color }}>
                      {formatTime(practiceTimer)}
                    </div>
                    <p className="text-[#B8B8D0]">
                      {practicing ? 'Practicing...' : 'Ready to practice?'}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    {!practicing ? (
                      <button
                        onClick={startPractice}
                        className="px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                        style={{ background: currentMudra.color, color: '#0D0D1A' }}
                      >
                        <Play className="w-5 h-5" />
                        Start Practice
                      </button>
                    ) : (
                      <button
                        onClick={stopPractice}
                        className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-white/10"
                      >
                        <Pause className="w-5 h-5" />
                        Stop Practice
                      </button>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3">Benefits</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {currentMudra.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#00C896]" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* When to Use */}
                  <div className="p-4 rounded-xl bg-white/5 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-[#00D4FF]" />
                      <span className="font-bold">When to Use</span>
                    </div>
                    <p className="text-[#B8B8D0]">{currentMudra.when}</p>
                  </div>

                  {/* How to Practice */}
                  <div className="p-4 rounded-xl bg-white/5 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#FF6B35]" />
                      <span className="font-bold">How to Practice</span>
                    </div>
                    <p className="text-[#B8B8D0]">{currentMudra.how}</p>
                  </div>

                  {/* Affirmation */}
                  <div 
                    className="p-4 rounded-xl text-center mb-6"
                    style={{ background: `${currentMudra.color}20`, border: `1px solid ${currentMudra.color}40` }}
                  >
                    <div className="text-sm mb-2" style={{ color: currentMudra.color }}>
                      Your Superpower Affirmation
                    </div>
                    <p className="text-lg font-medium italic">
                      "{currentMudra.affirmation}"
                    </p>
                  </div>

                  {/* Spiritual Dimension */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#7B2D8E]/20 to-transparent border border-[#7B2D8E]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-[#B866D6]" />
                      <span className="font-bold">Spiritual Connection</span>
                    </div>
                    <p className="text-sm text-[#B8B8D0]">{currentMudra.spiritual}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mastery Tips */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-center mb-8">
          Mastery Tips from the Ancients
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <div className="text-3xl mb-4">🌅</div>
            <h3 className="font-bold mb-2">Practice in Morning</h3>
            <p className="text-sm text-[#B8B8D0]">
              The mind is clearest in the morning. Practice mudras before breakfast 
              to set your intention for the day.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <div className="text-3xl mb-4">🧘</div>
            <h3 className="font-bold mb-2">Sit Comfortably</h3>
            <p className="text-sm text-[#B8B8D0]">
              You do not need to sit cross-legged. Any comfortable position works. 
              The key is straight posture and deep breathing.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <div className="text-3xl mb-4">💎</div>
            <h3 className="font-bold mb-2">Be Consistent</h3>
            <p className="text-sm text-[#B8B8D0]">
              Five minutes daily beats an hour once a week. 
              Track your practice and watch your power grow!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
