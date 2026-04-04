'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Brain, Wind, Zap, Eye, Star, Heart,
  Play, CheckCircle, ChevronRight, Flame, Moon, Sun
} from 'lucide-react';
import { peakExercises, nutritionTips } from '@/lib/design-system';

export default function PeakPage() {
  const [activeCategory, setActiveCategory] = useState<'breathing' | 'focus' | 'movement'>('breathing');
  const [practicing, setPracticing] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const exercises = peakExercises[activeCategory];

  const markComplete = (id: string) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B2D8E] to-[#FF6B35] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Peak Performance</h1>
              <p className="text-xs text-[#B8B8D0]">Train Like a Champion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#FFD700] to-[#7B2D8E] bg-clip-text text-transparent">
              TRAIN YOUR POWER
            </span>
          </h1>
          <p className="text-[#B8B8D0] max-w-2xl mx-auto">
            Your body and mind are your most powerful tools. Champions train every day. 
            Scientists train their thinking. Ancestors trained their spirits. 
            You are all three. Let's go.
          </p>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-2 p-1 bg-[#16162A] rounded-xl max-w-lg mx-auto">
          <button
            onClick={() => setActiveCategory('breathing')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              activeCategory === 'breathing' 
                ? 'bg-gradient-to-r from-[#00D4FF] to-[#00C896] text-[#0D0D1A]' 
                : 'text-[#B8B8D0] hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4" />
            Breathwork
          </button>
          <button
            onClick={() => setActiveCategory('focus')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              activeCategory === 'focus' 
                ? 'bg-gradient-to-r from-[#7B2D8E] to-[#B866D6] text-white' 
                : 'text-[#B8B8D0] hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Focus
          </button>
          <button
            onClick={() => setActiveCategory('movement')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              activeCategory === 'movement' 
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A]' 
                : 'text-[#B8B8D0] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            Movement
          </button>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#FFD700]/30 transition-all"
            >
              <div className="text-5xl mb-4">{exercise.icon}</div>
              <h3 className="text-xl font-bold mb-2">{exercise.name}</h3>
              <p className="text-[#B8B8D0] mb-4">{exercise.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-bold mb-2">Benefits:</h4>
                <div className="space-y-1">
                  {exercise.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#B8B8D0]">
                      <CheckCircle className="w-4 h-4 text-[#00C896]" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#FFD700] mb-4">
                <Star className="w-4 h-4" />
                {exercise.duration}
              </div>

              <button
                onClick={() => markComplete(exercise.id)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  completed.includes(exercise.id)
                    ? 'bg-[#00C896] text-[#0D0D1A]'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {completed.includes(exercise.id) ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Exercise
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nutrition Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C896]/10 text-[#00C896] text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Fuel Your Power
            </div>
            <h2 className="text-3xl font-bold">
              Nutrition for <span className="text-[#00C896]">Superheroes</span>
            </h2>
            <p className="text-[#B8B8D0] mt-2 max-w-xl mx-auto">
              Your brain is a machine. Feed it right and it runs at peak performance. 
              Here are the superpower foods to power your learning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nutritionTips.map((tip, index) => (
              <motion.div
                key={tip.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-[#16162A] border border-white/5 text-center hover:border-[#00C896]/30 transition-all"
              >
                <div className="text-4xl mb-3">{tip.emoji}</div>
                <h3 className="font-bold text-sm mb-1">{tip.name}</h3>
                <p className="text-xs text-[#B8B8D0] mb-2">{tip.benefit}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {tip.foods.map(f => (
                    <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-white/5">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Routine */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-12">
          A Day of <span className="text-[#FFD700]">Peak Performance</span>
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {/* Morning */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFD700]/10 to-transparent border border-[#FFD700]/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <div className="text-sm text-[#FFD700]">Morning Routine</div>
                  <h3 className="font-bold">Rise & Shine Power-Up</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm text-[#B8B8D0]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Drink a full glass of water (hydrated brain = smart brain)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Prana Mudra breathing (3 minutes) - energy boost
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Brain Jacks or Dance Break (5 minutes) - wake up body
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Healthy breakfast with protein + fruit
                </div>
              </div>
            </div>

            {/* Before Learning */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#7B2D8E]/10 to-transparent border border-[#7B2D8E]/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#7B2D8E]/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#B866D6]" />
                </div>
                <div>
                  <div className="text-sm text-[#B866D6]">Before Lessons</div>
                  <h3 className="font-bold">Focus Activation</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm text-[#B8B8D0]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Gyan Mudra (2 minutes) - wisdom & concentration
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Box Breathing (3 minutes) - calm & ready
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  One Thing Focus exercise (2 minutes) - attention training
                </div>
              </div>
            </div>

            {/* Evening */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-[#00D4FF]" />
                </div>
                <div>
                  <div className="text-sm text-[#00D4FF]">Evening Routine</div>
                  <h3 className="font-bold">Rest & Recover</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm text-[#B8B8D0]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Dhyana Mudra (5 minutes) - wind down & process
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  Gratitude practice (name 3 good things from today)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00C896]" />
                  8+ hours of sleep (your brain is growing!)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B35]/20 border border-[#FFD700]/30">
          <Flame className="w-10 h-10 text-[#FFD700]" />
          <div className="text-left">
            <div className="text-sm text-[#FFD700]">Total Exercises Completed</div>
            <div className="text-3xl font-bold">{completed.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
