'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Download, FileText, Pen, 
  Sparkles, Heart, Brain, Mountain, Star, CheckCircle,
  Printer, ExternalLink
} from 'lucide-react';

const printables = [
  {
    id: 'mudra-journal',
    title: 'Mudra Practice Journal',
    description: 'Track daily mudra practice with guided pages for each hand position, including affirmations and reflection prompts.',
    icon: '🙏',
    color: '#FFD700',
    pages: 8,
    category: 'mudras',
    features: ['Daily tracking sheet', 'All 6 mudras guide', 'Affirmation pages', 'Weekly reflection']
  },
  {
    id: 'adventure-cards',
    title: 'Adventure Mission Cards',
    description: 'Printable mission cards for all 8 outdoor adventures. Each card has materials list, steps, and reflection questions.',
    icon: '🗺️',
    color: '#00C896',
    pages: 8,
    category: 'adventures',
    features: ['All 8 missions', 'Step-by-step guides', 'Observation logs', 'Reflection questions']
  },
  {
    id: 'question-bridge',
    title: 'Question Bridge Journal',
    description: 'Family journal pages for the 8-week parent-child conversation program. Beautiful design for archiving family wisdom.',
    icon: '💭',
    color: '#00D4FF',
    pages: 12,
    category: 'bridge',
    features: ['8 weekly prompts', 'Response pages', 'Family photos space', 'Archive binding guide']
  },
  {
    id: 'observation-lab',
    title: 'Observation Lab Notes',
    description: 'Scientific observation sheets for nature studies, experiments, and discovery. Structured for young scientists.',
    icon: '🔬',
    color: '#7B2D8E',
    pages: 6,
    category: 'science',
    features: ['Nature observation', 'Experiment logging', 'Hypothesis sheets', 'Data recording']
  },
  {
    id: 'focus-training',
    title: 'Focus Training Cards',
    description: 'Concentration exercises with breathing guides, timers, and progress tracking. Train your attention like a muscle.',
    icon: '🧠',
    color: '#FF6B35',
    pages: 10,
    category: 'peak',
    features: ['Breathing exercises', 'Focus games', 'Progress tracking', 'Achievement badges']
  },
  {
    id: 'gratitude-journal',
    title: 'Gratitude & Growth Journal',
    description: 'Daily and weekly reflection pages for personal development. Build the habit of gratitude and self-awareness.',
    icon: '🌱',
    color: '#00C896',
    pages: 20,
    category: 'growth',
    features: ['Daily gratitude lists', 'Weekly reflection', 'Goal setting', 'Growth tracking']
  },
  {
    id: 'nutrition-tracker',
    title: 'Superhero Nutrition Tracker',
    description: 'Track what you eat and how it makes you feel. Learn the connection between food and brain power.',
    icon: '🍎',
    color: '#FF6B35',
    pages: 5,
    category: 'peak',
    features: ['Meal tracking', 'Energy logging', 'Rainbow food chart', 'Hydration tracker']
  },
  {
    id: 'heritage-project',
    title: 'Heritage Heroes Project',
    description: 'Research and document the Black heroes in history. Includes templates for presentations and family tree.',
    icon: '🏛️',
    color: '#FFD700',
    pages: 10,
    category: 'heritage',
    features: ['Research templates', 'Presentation pages', 'Family tree', 'Achievement awards']
  },
];

export default function PrintablesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(printables.map(p => p.category))];
  
  const filteredPrintables = selectedCategory 
    ? printables.filter(p => p.category === selectedCategory)
    : printables;

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
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Printables</h1>
              <p className="text-xs text-[#B8B8D0]">Download & Print</p>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-sm font-medium mb-4">
            <Printer className="w-4 h-4" />
            Your Learning Toolkit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Print & <span className="text-[#FFD700]">Learn Anywhere</span>
          </h1>
          <p className="text-[#B8B8D0] max-w-2xl mx-auto">
            Everything you need for your learning journey. Print these resources and use them 
            anywhere—at home, in the park, at grandma's house. Excellence has no boundaries.
          </p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-[#FFD700] text-[#0D0D1A]'
                : 'bg-white/5 text-[#B8B8D0] hover:bg-white/10'
            }`}
          >
            All ({printables.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FFD700] text-[#0D0D1A]'
                  : 'bg-white/5 text-[#B8B8D0] hover:bg-white/10'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({printables.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Printables Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrintables.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#FFD700]/30 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${item.color}20` }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-[#B8B8D0]">{item.pages} pages</p>
                </div>
              </div>

              <p className="text-sm text-[#B8B8D0] mb-4">
                {item.description}
              </p>

              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#B8B8D0] mb-2">Includes:</h4>
                <div className="flex flex-wrap gap-1">
                  {item.features.map((f, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-all">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Print Instructions */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <h2 className="text-2xl font-bold text-center mb-8">
          How to Print Like a Pro
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-[#00D4FF]">1</span>
            </div>
            <h3 className="font-bold mb-2">Download</h3>
            <p className="text-sm text-[#B8B8D0]">
              Click the download button to save the PDF to your device.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-[#FFD700]">2</span>
            </div>
            <h3 className="font-bold mb-2">Open</h3>
            <p className="text-sm text-[#B8B8D0]">
              Find the file in your downloads folder and open it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00C896]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-[#00C896]">3</span>
            </div>
            <h3 className="font-bold mb-2">Print</h3>
            <p className="text-sm text-[#B8B8D0]">
              Press Ctrl+P (or Cmd+P) to open print settings.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#7B2D8E]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-[#B866D6]">4</span>
            </div>
            <h3 className="font-bold mb-2">Create</h3>
            <p className="text-sm text-[#B8B8D0]">
              Print single-sided on white paper for best results.
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#16162A] to-[#1A1A2E] border border-white/5 max-w-4xl mx-auto text-center">
          <Printer className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Pro Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/5">
              <h4 className="font-bold mb-1">Use Good Paper</h4>
              <p className="text-sm text-[#B8B8D0]">
                Regular printer paper works, but cardstock makes journals and cards much nicer!
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <h4 className="font-bold mb-1">Ink Savings</h4>
              <p className="text-sm text-[#B8B8D0]">
                Print in "draft" or "economy" mode for practice sheets to save ink.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <h4 className="font-bold mb-1">Laminate Important Pages</h4>
              <p className="text-sm text-[#B8B8D0]">
                Laminate mission cards and tracking sheets so they last longer!
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <h4 className="font-bold mb-1">Bind Your Journals</h4>
              <p className="text-sm text-[#B8B8D0]">
                Use a 3-ring binder or spiral binding to create professional-looking journals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
