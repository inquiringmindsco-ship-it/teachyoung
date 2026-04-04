'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Clock, Award, Star, ChevronRight,
  Mountain, Leaf, Droplets, Wind, Sun as SunIcon, Moon, Eye
} from 'lucide-react';
import { adventures } from '@/lib/design-system';

export default function AdventuresPage() {
  const [activeAdventure, setActiveAdventure] = useState<string | null>(null);
  const [completedAdventures, setCompletedAdventures] = useState<string[]>([]);

  const currentAdventure = adventures.find(a => a.id === activeAdventure);

  const markComplete = (id: string) => {
    if (!completedAdventures.includes(id)) {
      setCompletedAdventures([...completedAdventures, id]);
    }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C896] to-[#00D4FF] flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Outdoor Adventures</h1>
              <p className="text-xs text-[#B8B8D0]">Weekly Mission Program</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[#B8B8D0]">
              {completedAdventures.length}/{adventures.length} Completed
            </span>
            <div className="w-24 h-2 rounded-full bg-[#16162A] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00C896] to-[#00D4FF]"
                style={{ width: `${(completedAdventures.length / adventures.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C896]/10 text-[#00C896] text-sm font-medium mb-4">
            <Mountain className="w-4 h-4" />
            Explorer Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Become a <span className="text-[#00C896]">World Explorer</span>
          </h1>
          <p className="text-[#B8B8D0] max-w-2xl mx-auto">
            Every week brings a new outdoor adventure. Watch the video guide, 
            print your mission card, complete the challenge, and earn XP. 
            Nature is the greatest teacher—let's explore!
          </p>
        </motion.div>
      </div>

      {/* Adventures Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adventures.map((adventure, index) => (
            <motion.div
              key={adventure.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group mission-card cursor-pointer"
              onClick={() => setActiveAdventure(adventure.id)}
            >
              <div 
                className="h-40 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${adventure.color}20 0%, transparent 100%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform">{adventure.icon}</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                    Week {adventure.week}
                  </span>
                </div>
                {completedAdventures.includes(adventure.id) && (
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-[#00C896] flex items-center justify-center">
                      ✓
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{adventure.title}</h3>
                <p className="text-sm text-[#B8B8D0] mb-3">{adventure.subtitle}</p>

                <div className="flex items-center gap-4 text-xs text-[#B8B8D0] mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {adventure.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> {adventure.xp} XP
                  </span>
                </div>

                <button 
                  className="w-full py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAdventure(adventure.id);
                  }}
                >
                  View Mission <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Detail Modal */}
        <AnimatePresence>
          {currentAdventure && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
              onClick={() => setActiveAdventure(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-3xl bg-[#16162A] rounded-3xl overflow-hidden my-8"
                onClick={e => e.stopPropagation()}
              >
                {/* Hero */}
                <div 
                  className="p-8 relative"
                  style={{ background: `linear-gradient(135deg, ${currentAdventure.color}30 0%, transparent 100%)` }}
                >
                  <button
                    onClick={() => setActiveAdventure(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>

                  <div className="flex items-center gap-6 mb-4">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl animate-breathe"
                      style={{ background: `${currentAdventure.color}20` }}
                    >
                      {currentAdventure.icon}
                    </div>
                    <div>
                      <div className="text-sm text-[#00C896] mb-1">Week {currentAdventure.week}</div>
                      <h2 className="text-3xl font-bold">{currentAdventure.title}</h2>
                      <p className="text-[#B8B8D0]">{currentAdventure.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2 text-[#B8B8D0]">
                      <Clock className="w-4 h-4" /> {currentAdventure.duration}
                    </span>
                    <span className="flex items-center gap-2 text-[#FFD700]">
                      <Award className="w-4 h-4" /> {currentAdventure.xp} XP
                    </span>
                    <span className="flex items-center gap-2 text-[#00D4FF]">
                      <Star className="w-4 h-4" /> Science + Art + Exercise
                    </span>
                  </div>
                </div>

                {/* Mission Brief */}
                <div className="p-6 border-t border-white/5">
                  <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6">
                    <div className="text-sm text-[#FFD700] font-bold mb-1">MISSION BRIEFING</div>
                    <p className="font-medium">{currentAdventure.mission}</p>
                  </div>

                  {/* Materials Needed */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#00C896]/20 flex items-center justify-center text-xs text-[#00C896]">1</span>
                      Materials Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAdventure.materials.map((m, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-sm">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center text-xs text-[#FF6B35]">2</span>
                      Mission Steps
                    </h4>
                    <div className="space-y-3">
                      {currentAdventure.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5">
                          <div className="w-8 h-8 rounded-full bg-[#7B2D8E]/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">{step.title}</h5>
                            <p className="text-sm text-[#B8B8D0]">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Science */}
                  <div className="p-4 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-[#00D4FF]" />
                      <span className="font-bold text-[#00D4FF]">Science Behind It</span>
                    </div>
                    <p className="text-sm">{currentAdventure.science}</p>
                  </div>

                  {/* Reflection */}
                  <div className="p-4 rounded-xl bg-[#7B2D8E]/10 border border-[#7B2D8E]/20 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-[#B866D6]" />
                      <span className="font-bold text-[#B866D6]">Reflection Questions</span>
                    </div>
                    <p className="text-sm text-[#B8B8D0]">{currentAdventure.reflection}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => markComplete(currentAdventure.id)}
                      className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#00C896] text-[#0D0D1A] hover:bg-[#00D4FF] transition-colors"
                    >
                      <Award className="w-5 h-5" />
                      Mark Complete (+{currentAdventure.xp} XP)
                    </button>
                    <button className="px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors">
                      <Play className="w-5 h-5" />
                      Watch Video
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-center mb-8">
          Explorer Tips
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="text-4xl mb-4">🌤</div>
            <h3 className="font-bold mb-2">Best Time</h3>
            <p className="text-sm text-[#B8B8D0]">
              Early morning or late afternoon for the best light and comfortable temperature.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="font-bold mb-2">Document</h3>
            <p className="text-sm text-[#B8B8D0]">
              Take photos or videos of your discoveries. They'll help with reflections later!
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="text-4xl mb-4">👨‍👩‍👧</div>
            <h3 className="font-bold mb-2">Bring Family</h3>
            <p className="text-sm text-[#B8B8D0]">
              These missions are more fun with others. Invite a parent or sibling to join!
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="text-4xl mb-4">📓</div>
            <h3 className="font-bold mb-2">Journal</h3>
            <p className="text-sm text-[#B8B8D0]">
              Write or draw what you observed. Future you will thank present you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
