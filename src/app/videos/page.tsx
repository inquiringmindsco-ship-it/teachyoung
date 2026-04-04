'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, Calculator, Globe, Music, Palette } from 'lucide-react';

const subjects = [
  {
    name: 'Math',
    icon: Calculator,
    color: 'from-amber-500 to-amber-600',
    channels: [
      { name: 'Khan Academy Kids', url: 'https://www.khanacademy.org/kids', desc: 'Free math lessons for all ages' },
      { name: 'Numberblocks', url: 'https://www.youtube.com/results?search_query=numberblocks', desc: 'Fun math videos for young learners' },
      { name: 'Math Antics', url: 'https://www.youtube.com/results?search_query=math+antics', desc: 'Clear explanations of math concepts' },
    ],
  },
  {
    name: 'Reading',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    channels: [
      { name: 'Storyline Online', url: 'https://www.storylineonline.net', desc: 'Famous actors reading children books' },
      { name: 'Alphablocks', url: 'https://www.youtube.com/results?search_query=alphablocks', desc: 'Learn to read with letter characters' },
      { name: 'Read Across America', url: 'https://www.readacrossamerica.org', desc: 'Reading activities and book lists' },
    ],
  },
  {
    name: 'Science',
    icon: Globe,
    color: 'from-green-500 to-green-600',
    channels: [
      { name: 'SciShow Kids', url: 'https://www.youtube.com/results?search_query=scishow+kids', desc: 'Science experiments and explanations' },
      { name: 'Crash Course Kids', url: 'https://www.youtube.com/results?search_query=crash+course+kids', desc: 'All subjects explained simply' },
      { name: 'National Geographic Kids', url: 'https://kids.nationalgeographic.com', desc: 'Animals, space, and nature' },
    ],
  },
  {
    name: 'Music',
    icon: Music,
    color: 'from-pink-500 to-pink-600',
    channels: [
      { name: 'Music Together', url: 'https://www.youtube.com/results?search_query=music+together+kids', desc: 'Singing and rhythm activities' },
      { name: 'GoNoodle', url: 'https://www.youtube.com/results?search_query=gonoodle+kids', desc: 'Movement and dance videos' },
      { name: 'Super Simple Songs', url: 'https://www.youtube.com/results?search_query=super+simple+songs', desc: 'Easy songs for learning' },
    ],
  },
  {
    name: 'Art',
    icon: Palette,
    color: 'from-purple-500 to-purple-600',
    channels: [
      { name: 'Art for Kids Hub', url: 'https://www.youtube.com/results?search_query=art+for+kids+hub', desc: 'Step-by-step drawing tutorials' },
      { name: 'Crafty Carol', url: 'https://www.youtube.com/results?search_query=crafty+carol', desc: 'Easy craft projects' },
      { name: 'Happy Music', url: 'https://www.youtube.com/results?search_query=art+happy+music', desc: 'Creative art activities' },
    ],
  },
];

export default function VideosPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center">
              <Play className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Learning Videos</h1>
              <p className="text-slate-400">Curated videos by subject</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Subject Categories */}
        {subjects.map((subject, catIndex) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                <subject.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{subject.name}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {subject.channels.map((channel, index) => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center flex-shrink-0`}>
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">
                        {channel.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{channel.desc}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Quick Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6"
        >
          <h2 className="text-white font-semibold mb-4">Search YouTube</h2>
          <p className="text-slate-300 text-sm mb-4">
            Can&apos;t find what you need? Search YouTube directly for any topic.
          </p>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition text-sm"
          >
            <Play className="w-4 h-4" />
            Open YouTube
          </a>
        </motion.div>

      </div>
    </main>
  );
}
