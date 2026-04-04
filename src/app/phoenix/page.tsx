'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mountain, Brain, Heart, BookOpen, Crown, Flame, 
  Camera, Wand2, ChevronRight, Star, Zap, Sun, Moon, Wind,
  Menu, X, Play, ArrowRight, Loader2, CheckCircle, Menu as MenuIcon
} from 'lucide-react';
import { mudras, adventures, peakExercises, bridgePrompts } from '@/lib/design-system';

const sections = [
  { id: 'hero', name: 'Home', icon: Crown, color: '#FFD700' },
  { id: 'magic', name: 'AI Generator', icon: Wand2, color: '#FF6B35' },
  { id: 'mudras', name: 'Mudras', icon: Sparkles, color: '#FFD700' },
  { id: 'yoga', name: 'Yoga', icon: Sun, color: '#00C896' },
  { id: 'adventures', name: 'Adventures', icon: Mountain, color: '#00D4FF' },
  { id: 'peak', name: 'Peak Training', icon: Brain, color: '#7B2D8E' },
  { id: 'bridge', name: 'Bridge', icon: Heart, color: '#FF6B35' },
  { id: 'printables', name: 'Printables', icon: BookOpen, color: '#FFD700' },
  { id: 'resources', name: 'Resources', icon: Star, color: '#00C896' },
];

export default function PhoenixHome() {
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white overflow-x-hidden">
      {/* Particle Background */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#FF6B35', '#FFD700', '#00C896', '#7B2D8E', '#00D4FF'][i % 5],
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D1A]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#7B2D8E] flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm">TeachYoung™</h1>
                <p className="text-xs text-[#B8B8D0]">PHOENIX</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeSection === section.id ? 'bg-white/10' : 'text-[#B8B8D0] hover:text-white'
                  }`}
                >
                  <section.icon className="w-3.5 h-3.5" style={{ color: section.color }} />
                  <span className="hidden xl:inline">{section.name}</span>
                </a>
              ))}
            </div>

            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#16162A] border-t border-white/5">
              <div className="px-4 py-3 space-y-1">
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}>
                    <section.icon className="w-5 h-5" style={{ color: section.color }} />
                    {section.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Side Navigation */}
      <div className="nav-dots hidden lg:flex">
        {sections.map((section) => (
          <button key={section.id} className={`nav-dot ${activeSection === section.id ? 'active' : ''}`}
            style={{ background: activeSection === section.id ? section.color : undefined }}
            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })} />
        ))}
      </div>

      {/* Hero */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35]/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              PHOENIX EDITION — All Ages
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF6B35] via-[#FFD700] to-[#FF6B35] bg-clip-text text-transparent">
                PHOENIX
              </span>
              <br />
              <span className="text-white">ACADEMY</span>
            </h1>
            <p className="text-xl text-[#B8B8D0] max-w-2xl mx-auto mb-8">
              The Peak Performance Learning System for Black Children<br/>
              Mind • Body • Spirit • Excellence
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link href="#magic" className="group p-5 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD700]/10 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all">
              <Wand2 className="w-8 h-8 text-[#FFD700] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm">AI Generator</div>
              <div className="text-xs text-[#B8B8D0]">Snap & Learn</div>
            </Link>
            <Link href="#mudras" className="group p-5 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FF6B35]/10 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all">
              <Sparkles className="w-8 h-8 text-[#FFD700] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm">Mudras</div>
              <div className="text-xs text-[#B8B8D0]">Hand Science</div>
            </Link>
            <Link href="#yoga" className="group p-5 rounded-2xl bg-gradient-to-br from-[#00C896]/20 to-[#00D4FF]/10 border border-[#00C896]/20 hover:border-[#00C896]/50 transition-all">
              <Sun className="w-8 h-8 text-[#00C896] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm">Yoga</div>
              <div className="text-xs text-[#B8B8D0]">Body & Breath</div>
            </Link>
            <Link href="#adventures" className="group p-5 rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 to-[#7B2D8E]/10 border border-[#00D4FF]/20 hover:border-[#00D4FF]/50 transition-all">
              <Mountain className="w-8 h-8 text-[#00D4FF] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm">Adventures</div>
              <div className="text-xs text-[#B8B8D0]">Outdoor Learning</div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Magic Generator */}
      <section id="magic" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm font-medium mb-4">
              <Wand2 className="w-4 h-4" />
              🔥 THE KILLER FEATURE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Snap & <span className="text-[#FF6B35]">Learn</span>
            </h2>
            <p className="text-[#B8B8D0] max-w-2xl mx-auto text-lg">
              Take a picture of ANYTHING — a bottle, a McDonald's sign, a leaf, a car, anything — 
              and get a complete lesson plan instantly. Learning is everywhere.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#16162A] to-[#1A1A2E] border border-[#FF6B35]/30">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-[#FF6B35]/20 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-12 h-12 text-[#FF6B35]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Lesson Generator</h3>
                <p className="text-sm text-[#B8B8D0]">Snap a photo or describe anything to generate a lesson</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <input type="file" accept="image/*" id="lesson-photo" className="hidden" />
                  <label htmlFor="lesson-photo"
                    className="flex-1 py-4 px-6 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/30 text-[#FF6B35] font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FF6B35]/30 transition-all">
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-[#16162A] text-sm text-[#B8B8D0]">or type what you see</span>
                  </div>
                </div>

                <input type="text" placeholder="Example: McDonald's, Febreze bottle, a leaf, a car..."
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#6B6B80] focus:outline-none focus:border-[#FF6B35]/50" />

                <div className="flex gap-3">
                  <select className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none">
                    <option>Ages 3-5</option>
                    <option>Ages 6-8</option>
                    <option selected>Ages 9-12</option>
                    <option>Ages 13+</option>
                    <option>All Ages</option>
                  </select>
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                    <Wand2 className="w-5 h-5" />
                    Generate
                  </button>
                </div>
              </div>

              {/* Example Results */}
              <div className="mt-8 p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-[#00C896]" />
                  <span className="font-bold">Example: Febreze Bottle</span>
                </div>
                <div className="space-y-3 text-sm text-[#B8B8D0]">
                  <div><strong className="text-white">Science:</strong> Chemistry of odor molecules, how scents travel</div>
                  <div><strong className="text-white">Math:</strong> Measuring volume, fractions for dilution</div>
                  <div><strong className="text-white">History:</strong> When did humans start using air fresheners?</div>
                  <div><strong className="text-white">Activity:</strong> Create your own natural air freshener</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mudras */}
      <section id="mudras" className="py-24 bg-gradient-to-b from-transparent via-[#FFD700]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Hand <span className="text-[#FFD700]">Mudras</span></h2>
            <p className="text-[#B8B8D0]">Sacred hand science for focus, energy, and spiritual connection</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {mudras.map((mudra, i) => (
              <motion.div key={mudra.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#FFD700]/30 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${mudra.color}20` }}>
                    {mudra.icon}
                  </div>
                  <div>
                    <h3 className="font-bold">{mudra.name}</h3>
                    <p className="text-xs text-[#B8B8D0]">{mudra.superpower}</p>
                  </div>
                </div>
                <p className="text-sm text-[#B8B8D0] mb-3">{mudra.position}</p>
                <Link href="/mudras" className="text-sm text-[#FFD700] font-medium flex items-center gap-1 hover:underline">
                  Practice <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yoga */}
      <section id="yoga" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C896]/10 text-[#00C896] text-sm font-medium mb-4">
              <Sun className="w-4 h-4" />
              Body & Breath
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Yoga & <span className="text-[#00C896]">Meditation</span>
            </h2>
            <p className="text-[#B8B8D0] max-w-2xl mx-auto">
              Ancient practices for strength, flexibility, calm, and spiritual connection. 
              For all ages and all bodies. No fancy equipment needed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'Morning Sun Salutation', icon: '🌅', desc: '12-minute energy activation', color: '#FFD700', level: 'All Ages' },
              { name: 'Warrior Flow', icon: '💪', desc: 'Build strength and confidence', color: '#FF6B35', level: 'Ages 6+' },
              { name: 'Calm Breath Meditation', icon: '🧘', desc: '5-minute anxiety relief', color: '#7B2D8E', level: 'All Ages' },
              { name: 'Sleepy Time Yoga', icon: '🌙', desc: 'Prepare for deep sleep', color: '#00D4FF', level: 'All Ages' },
              { name: 'Balance Challenge', icon: '🌳', desc: 'Tree pose and focus training', color: '#00C896', level: 'Ages 4+' },
              { name: 'Family Yoga Party', icon: '👨‍👩‍👧', desc: 'Move together, laugh together', color: '#FF6B35', level: 'All Ages' },
              { name: 'Brain Break Flow', icon: '⚡', desc: 'Reset between lessons', color: '#FFD700', level: 'Ages 5+' },
              { name: 'Gratitude Meditation', icon: '🙏', desc: 'Heart-centered reflection', color: '#7B2D8E', level: 'All Ages' },
            ].map((yoga, i) => (
              <motion.div key={yoga.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-[#16162A] border border-white/5 hover:border-[#00C896]/30 transition-all cursor-pointer">
                <div className="text-4xl mb-3">{yoga.icon}</div>
                <h3 className="font-bold text-sm mb-1">{yoga.name}</h3>
                <p className="text-xs text-[#B8B8D0] mb-2">{yoga.desc}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${yoga.color}20`, color: yoga.color }}>{yoga.level}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/yoga" className="btn btn-gold inline-flex items-center gap-2">
              <Play className="w-4 h-4" />
              View All Yoga & Meditation
            </Link>
          </div>
        </div>
      </section>

      {/* Adventures */}
      <section id="adventures" className="py-24 bg-gradient-to-b from-transparent via-[#00D4FF]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Outdoor <span className="text-[#00D4FF]">Adventures</span></h2>
            <p className="text-[#B8B8D0]">Weekly missions with video guides and printable activities</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {adventures.slice(0, 8).map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-[#16162A] border border-white/5 hover:border-[#00C896]/30 transition-all">
                <div className="text-4xl mb-2 animate-breathe">{a.icon}</div>
                <h3 className="font-bold text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-[#B8B8D0] mb-2">{a.subtitle}</p>
                <div className="flex items-center gap-2 text-xs text-[#FFD700]">
                  <Star className="w-3 h-3" /> Week {a.week} • {a.xp} XP
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Peak Performance */}
      <section id="peak" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Peak <span className="text-[#B866D6]">Performance</span></h2>
            <p className="text-[#B8B8D0]">Train mind, body, and spirit like a champion</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20">
              <Wind className="w-10 h-10 text-[#00D4FF] mb-4" />
              <h3 className="font-bold text-xl mb-3">Breathwork</h3>
              <div className="space-y-2 text-sm text-[#B8B8D0]">
                <div>🫁 Box Breathing — Focus</div>
                <div>🦁 Lion's Breath — Release</div>
                <div>⚡ Energy Breath — Activate</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7B2D8E]/10 to-transparent border border-[#7B2D8E]/20">
              <Brain className="w-10 h-10 text-[#B866D6] mb-4" />
              <h3 className="font-bold text-xl mb-3">Focus Training</h3>
              <div className="space-y-2 text-sm text-[#B8B8D0]">
                <div>👀 Staring Game</div>
                <div>👂 Sound Hunt</div>
                <div>🎯 One Thing Focus</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20">
              <Zap className="w-10 h-10 text-[#FF6B35] mb-4" />
              <h3 className="font-bold text-xl mb-3">Energy Activation</h3>
              <div className="space-y-2 text-sm text-[#B8B8D0]">
                <div>🐯 Tiger Stretches</div>
                <div>🧠 Brain Jacks</div>
                <div>💃 Dance Breaks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge */}
      <section id="bridge" className="py-24 bg-gradient-to-b from-transparent via-[#00D4FF]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Question <span className="text-[#00D4FF]">Bridge</span></h2>
            <p className="text-[#B8B8D0]">Parent-child connection through powerful questions</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {bridgePrompts.slice(0, 4).map((p, i) => (
              <motion.div key={p.week} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-[#16162A] border border-white/5">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <div className="text-xs text-[#00D4FF] mb-1">Week {p.week}</div>
                <h3 className="font-bold mb-2 capitalize">{p.category}</h3>
                <p className="text-sm text-[#B8B8D0] line-clamp-4">{p.question}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Learning <span className="text-[#00C896]">Resources</span></h2>
            <p className="text-[#B8B8D0]">Curated tools, links, and materials for excellence</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/resources" className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#00C896]/30 transition-all">
              <BookOpen className="w-10 h-10 text-[#00C896] mb-4" />
              <h3 className="font-bold text-lg mb-2">Free Libraries</h3>
              <p className="text-sm text-[#B8B8D0]">Access thousands of free books and educational materials</p>
            </Link>
            <Link href="/resources" className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#FFD700]/30 transition-all">
              <Brain className="w-10 h-10 text-[#FFD700] mb-4" />
              <h3 className="font-bold text-lg mb-2">Learning Tools</h3>
              <p className="text-sm text-[#B8B8D0]">Apps, games, and platforms for every subject</p>
            </Link>
            <Link href="/resources" className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#FF6B35]/30 transition-all">
              <Star className="w-10 h-10 text-[#FF6B35] mb-4" />
              <h3 className="font-bold text-lg mb-2">Heritage Heroes</h3>
              <p className="text-sm text-[#B8B8D0]">Black history, inventors, scientists, and artists</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#7B2D8E] flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">TeachYoung™</h3>
              <p className="text-xs text-[#B8B8D0]">PHOENIX EDITION</p>
            </div>
          </div>
          <p className="text-[#6B6B80] text-sm">Built for Kings, Queens, and Everyone They Become</p>
          <p className="text-[#6B6B80] text-xs mt-2">By Od & Kelcee for Honor & Noble</p>
        </div>
      </footer>
    </div>
  );
}
