'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Globe, Brain, Star, Heart, 
  ExternalLink, Search, ChevronRight, Shield, Lightbulb
} from 'lucide-react';

const resources = {
  reading: [
    { name: 'Project Gutenberg', url: 'https://www.gutenberg.org', desc: '60,000+ free ebooks', icon: '📚' },
    { name: 'Open Library', url: 'https://openlibrary.org', desc: 'Borrow free digital books', icon: '📖' },
    { name: 'Libby', url: 'https://libbyapp.com', desc: 'Free library books on your device', icon: '📱' },
    { name: 'Storyline Online', url: 'https://storylineonline.net', desc: 'Celebrities read stories aloud', icon: '🎬' },
  ],
  learning: [
    { name: 'Khan Academy', url: 'https://khanacademy.org', desc: 'Free lessons, all subjects', icon: '🎓' },
    { name: 'BrainPOP', url: 'https://brainpop.com', desc: 'Animated educational videos', icon: '🧠' },
    { name: 'Duolingo', url: 'https://duolingo.com', desc: 'Learn languages free', icon: '🗣️' },
    { name: 'PhET Simulations', url: 'https://phet.colorado.edu', desc: 'Free science simulations', icon: '🔬' },
  ],
  heritage: [
    { name: 'Smithsonian Black History', url: 'https://nmaahc.si.edu', desc: 'National Museum of African American History', icon: '🏛️' },
    { name: 'African American History Museum', url: 'https://nmaahc.si.edu/explore/initiatives/hbcus', desc: 'Historically Black Colleges', icon: '🎓' },
    { name: 'Black Inventors Museum', url: 'https://blackinventormuseum.com', desc: 'Stories of Black innovation', icon: '💡' },
    { name: 'The Henry Ford', url: 'https://www.thehenryford.org', desc: 'Innovation & history', icon: '⚙️' },
  ],
  tools: [
    { name: 'Canva', url: 'https://canva.com', desc: 'Free design for kids', icon: '🎨' },
    { name: 'Google Earth', url: 'https://earth.google.com', desc: 'Explore the world', icon: '🌍' },
    { name: 'Photomath', url: 'https://photomath.com', desc: 'Math help with camera', icon: '📷' },
    { name: 'Grammarly', url: 'https://grammarly.com', desc: 'Writing assistant', icon: '✍️' },
  ],
};

const featured = [
  { name: 'National Geographic Kids', url: 'https://kids.nationalgeographic.com', desc: 'Animals, science, and adventure', icon: '🦁' },
  { name: 'Crash Course Kids', url: 'https://youtube.com/user/crashcoursekids', desc: 'Free YouTube science videos', icon: '⚡' },
  { name: 'Cosmos Education', url: 'https://cosmoseducation.org', desc: 'Pan-African educational resources', icon: '🌍' },
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: 'reading', label: 'Reading', icon: BookOpen, color: '#FFD700' },
    { id: 'learning', label: 'Learning', icon: Brain, color: '#00C896' },
    { id: 'heritage', label: 'Heritage', icon: Star, color: '#FF6B35' },
    { id: 'tools', label: 'Tools', icon: Lightbulb, color: '#00D4FF' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      <header className="sticky top-0 z-50 bg-[#0D0D1A]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/phoenix" className="p-2 rounded-lg hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C896] to-[#FFD700] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Learning Resources</h1>
              <p className="text-xs text-[#B8B8D0]">Curated for Excellence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Learning <span className="text-[#00C896]">Toolkit</span>
          </h1>
          <p className="text-[#B8B8D0] max-w-2xl mx-auto text-lg">
            Curated free resources for reading, learning, heritage, and growth. 
            Quality over quantity—only the best made this list.
          </p>
        </motion.div>
      </div>

      {/* Featured */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-4">⭐ Featured</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((item, i) => (
            <motion.a key={item.name} href={item.url} target="_blank" rel="noopener"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-[#B8B8D0]">{item.desc}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-[#FFD700] ml-auto" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeCategory ? 'bg-[#FFD700] text-[#0D0D1A]' : 'bg-white/5 text-[#B8B8D0] hover:bg-white/10'
            }`}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id ? '' : 'bg-white/5 text-[#B8B8D0] hover:bg-white/10'
              }`}
              style={activeCategory === cat.id ? { background: cat.color, color: '#0D0D1A' } : {}}>
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {(!activeCategory || activeCategory === 'reading') && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#FFD700]" /> Reading & Books
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.reading.map((item, i) => (
                <ResourceCard key={item.name} item={item} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}

        {(!activeCategory || activeCategory === 'learning') && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#00C896]" /> Learning Platforms
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.learning.map((item, i) => (
                <ResourceCard key={item.name} item={item} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}

        {(!activeCategory || activeCategory === 'heritage') && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FF6B35]" /> Heritage & History
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.heritage.map((item, i) => (
                <ResourceCard key={item.name} item={item} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}

        {(!activeCategory || activeCategory === 'tools') && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#00D4FF]" /> Learning Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.tools.map((item, i) => (
                <ResourceCard key={item.name} item={item} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-white/5">
        <div className="p-6 rounded-2xl bg-[#16162A] border border-white/5 max-w-3xl mx-auto text-center">
          <Shield className="w-8 h-8 text-[#00C896] mx-auto mb-4" />
          <h3 className="font-bold mb-2">Safe Browsing</h3>
          <p className="text-sm text-[#B8B8D0]">
            We only recommend vetted, child-safe resources. External links open in new tabs. 
            Parental supervision is recommended for younger children.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ item, delay }: { item: { name: string; url: string; desc: string; icon: string }; delay: number }) {
  return (
    <motion.a href={item.url} target="_blank" rel="noopener" initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="group p-4 rounded-xl bg-[#16162A] border border-white/5 hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm truncate">{item.name}</h3>
        </div>
        <ExternalLink className="w-4 h-4 text-[#6B6B80] group-hover:text-white transition-colors" />
      </div>
      <p className="text-xs text-[#B8B8D0]">{item.desc}</p>
    </motion.a>
  );
}
