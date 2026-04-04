'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, BookOpen, Pen, 
  Sparkles, ChevronRight, CheckCircle, Users
} from 'lucide-react';
import { bridgePrompts } from '@/lib/design-system';

export default function BridgePage() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);

  const currentPrompt = bridgePrompts.find(p => p.week === selectedWeek);

  const saveResponse = () => {
    if (selectedWeek && responses[selectedWeek]) {
      if (!completedWeeks.includes(selectedWeek)) {
        setCompletedWeeks([...completedWeeks, selectedWeek]);
      }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B2D8E] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Question Bridge</h1>
              <p className="text-xs text-[#B8B8D0]">Parent-Child Connection</p>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Connect as a Family
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-[#00D4FF]">Question Bridge</span>
          </h1>
          <p className="text-[#B8B8D0] max-w-2xl mx-auto">
            Every week, a question bridges generations. Parents write the question. 
            Children respond through words, art, or conversation. Together, you build 
            a family archive of wisdom, dreams, and love.
          </p>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[#00D4FF]" />
            </div>
            <h3 className="font-bold mb-2">Parent Reads</h3>
            <p className="text-sm text-[#B8B8D0]">
              Each week, parents receive a thought-provoking question. 
              Read it together or privately—whatever works for your family.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
              <Pen className="w-6 h-6 text-[#FFD700]" />
            </div>
            <h3 className="font-bold mb-2">Child Responds</h3>
            <p className="text-sm text-[#B8B8D0]">
              Children respond through writing, drawing, or conversation. 
              There's no wrong answer—just honest thinking.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00C896]/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-[#00C896]" />
            </div>
            <h3 className="font-bold mb-2">Family Grows</h3>
            <p className="text-sm text-[#B8B8D0]">
              Over time, you'll have a beautiful archive of your family's 
              thoughts, dreams, and conversations. A legacy in words.
            </p>
          </div>
        </div>
      </div>

      {/* Bridge Prompts */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Weekly Questions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bridgePrompts.map((prompt, index) => (
            <motion.div
              key={prompt.week}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                selectedWeek === prompt.week
                  ? 'bg-gradient-to-br from-[#00D4FF]/20 to-[#7B2D8E]/10 border-[#00D4FF]/50'
                  : 'bg-[#16162A] border-white/5 hover:border-[#00D4FF]/30'
              }`}
              onClick={() => setSelectedWeek(prompt.week)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{prompt.emoji}</span>
                {completedWeeks.includes(prompt.week) && (
                  <CheckCircle className="w-6 h-6 text-[#00C896]" />
                )}
              </div>
              <div className="text-xs text-[#00D4FF] font-medium mb-1">
                Week {prompt.week}
              </div>
              <h3 className="font-bold capitalize mb-2">{prompt.category}</h3>
              <p className="text-sm text-[#B8B8D0] line-clamp-3">
                {prompt.question}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Selected Prompt Detail */}
        {currentPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#16162A] to-[#1A1A2E] border border-white/5 max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <span className="text-6xl">{currentPrompt.emoji}</span>
              <h3 className="text-2xl font-bold mt-4 capitalize">
                {currentPrompt.category} — Week {currentPrompt.week}
              </h3>
            </div>

            <div className="p-6 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-[#00D4FF]" />
                <span className="font-bold text-[#00D4FF]">The Question</span>
              </div>
              <p className="text-lg font-medium">
                {currentPrompt.question}
              </p>
            </div>

            {/* Response Area */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Pen className="w-5 h-5 text-[#FFD700]" />
                <span className="font-bold">Your Response</span>
              </div>
              <textarea
                value={responses[currentPrompt.week] || ''}
                onChange={(e) => setResponses({
                  ...responses,
                  [currentPrompt.week]: e.target.value
                })}
                placeholder="Write your thoughts here, or draw your response and tell someone to write it down for you..."
                className="w-full h-48 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#6B6B80] focus:outline-none focus:border-[#00D4FF]/50 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveResponse}
                disabled={!responses[currentPrompt.week]}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  responses[currentPrompt.week]
                    ? 'bg-[#00C896] text-[#0D0D1A] hover:bg-[#00D4FF]'
                    : 'bg-white/10 text-[#6B6B80] cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Save Response
              </button>
              <button className="px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-all">
                <BookOpen className="w-5 h-5" />
                Print Journal Page
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Archive Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            Your Family Archive
          </h2>
          <p className="text-[#B8B8D0]">
            Over time, these responses become a precious family heirloom.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#7B2D8E]/10 to-[#00D4FF]/10 border border-[#7B2D8E]/20 text-center">
            <BookOpen className="w-16 h-16 text-[#B866D6] mx-auto mb-4" />
            <p className="text-[#B8B8D0] mb-4">
              Complete all 8 weekly questions to build your complete family journal. 
              Print it, bind it, and treasure it forever.
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                <div
                  key={week}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    completedWeeks.includes(week)
                      ? 'bg-[#00C896] text-[#0D0D1A]'
                      : 'bg-white/10'
                  }`}
                >
                  {completedWeeks.includes(week) ? '✓' : week}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#6B6B80] mt-4">
              {completedWeeks.length}/8 weeks completed
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why This Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <Heart className="w-10 h-10 text-[#FF6B35] mb-4" />
            <h3 className="font-bold mb-2">Deepens Bonds</h3>
            <p className="text-sm text-[#B8B8D0]">
              When we share our inner worlds, we grow closer. These questions 
              create sacred space for honest conversation.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <Sparkles className="w-10 h-10 text-[#FFD700] mb-4" />
            <h3 className="font-bold mb-2">Develops Thinking</h3>
            <p className="text-sm text-[#B8B8D0]">
              Thoughtful questions develop critical thinking, self-awareness, 
              and the ability to articulate feelings and ideas.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <BookOpen className="w-10 h-10 text-[#00C896] mb-4" />
            <h3 className="font-bold mb-2">Creates Legacy</h3>
            <p className="text-sm text-[#B8B8D0]">
              Years from now, these journals will be treasured artifacts of 
              who your family was and who you're becoming.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5">
            <MessageCircle className="w-10 h-10 text-[#00D4FF] mb-4" />
            <h3 className="font-bold mb-2">Opens Doors</h3>
            <p className="text-sm text-[#B8B8D0]">
              Sometimes the most important conversations need a starting point. 
              These questions open doors that might otherwise stay closed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
