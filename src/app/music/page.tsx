'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Mic, Piano, Guitar, Drum, Star } from 'lucide-react';

const instruments = [
  {
    name: 'Piano',
    icon: Piano,
    color: 'from-blue-500 to-blue-700',
    description: 'Learn keys, chords, and melodies',
    resources: [
      { title: 'Piano Notes Chart', type: 'PDF' },
      { title: 'Beginner Lessons', type: 'Video' },
    ],
  },
  {
    name: 'Guitar',
    icon: Guitar,
    color: 'from-amber-500 to-amber-700',
    description: 'Strum patterns and finger placement',
    resources: [
      { title: 'Basic Chords', type: 'Guide' },
      { title: 'Easy Songs', type: 'Video' },
    ],
  },
  {
    name: 'Drums',
    icon: Drum,
    color: 'from-red-500 to-red-700',
    description: 'Rhythm and timing basics',
    resources: [
      { title: 'Beat Patterns', type: 'Audio' },
      { title: 'Rhythm Games', type: 'Interactive' },
    ],
  },
  {
    name: 'Vocals',
    icon: Mic,
    color: 'from-purple-500 to-purple-700',
    description: 'Breathing, pitch, and singing',
    resources: [
      { title: 'Warm Ups', type: 'Audio' },
      { title: 'Breathing Exercises', type: 'Guide' },
    ],
  },
];

const concepts = [
  {
    title: 'Reading Music',
    emoji: '📝',
    description: 'Notes, clefs, and sheet music',
    color: 'bg-blue-500/20 border-blue-500/30',
  },
  {
    title: 'Rhythm & Timing',
    emoji: '🥁',
    description: 'Beats, measures, and tempo',
    color: 'bg-red-500/20 border-red-500/30',
  },
  {
    title: 'Scales & Modes',
    emoji: '🎹',
    description: 'Do Re Mi and more',
    color: 'bg-purple-500/20 border-purple-500/30',
  },
  {
    title: 'Song Writing',
    emoji: '✍️',
    description: 'Write your own lyrics',
    color: 'bg-amber-500/20 border-amber-500/30',
  },
];

const artists = [
  {
    name: 'Stevie Wonder',
    era: '1970s-Present',
    genre: 'Soul, R&B, Pop',
    instrument: '🎹',
    bio: 'Blind from birth, Stevie became one of the most celebrated musicians of all time. Hits include "Superstition" and "I Just Called to Say I Love You."',
  },
  {
    name: 'Jimi Hendrix',
    era: '1960s',
    genre: 'Rock, Psychedelic',
    instrument: '🎸',
    bio: 'Revolutionized electric guitar playing with his innovative use of feedback and effects. Legendary performance at Woodstock 1969.',
  },
  {
    name: 'Prince',
    era: '1978-2016',
    genre: 'Funk, Pop, Rock',
    instrument: '🎸',
    bio: 'A virtuoso multi-instrumentalist who could play over 20 instruments. Known for "Purple Rain" and incredible live performances.',
  },
  {
    name: 'Beyoncé',
    era: '1990s-Present',
    genre: 'R&B, Pop, Hip-Hop',
    instrument: '🎤',
    bio: 'One of the best-selling music artists of all time. Started in Destiny\'s Child and became a solo icon.',
  },
  {
    name: 'John Legend',
    era: '2000s-Present',
    genre: 'R&B, Soul',
    instrument: '🎹',
    bio: 'Multi-award winning singer-songwriter known for his powerful vocals and piano skills. Hits include "All of Me."',
  },
  {
    name: 'Kendrick Lamar',
    era: '2010s-Present',
    genre: 'Hip-Hop, Rap',
    instrument: '🎤',
    bio: 'Pulitzer Prize-winning rapper known for his complex lyrics and storytelling. One of the greatest rappers of all time.',
  },
];

export default function MusicPage() {
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
            <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center">
              <Music className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Music</h1>
              <p className="text-slate-400">Learn instruments and theory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Instruments */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Instruments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {instruments.map((inst, index) => (
              <motion.div
                key={inst.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-slate-600 transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${inst.color} flex items-center justify-center mb-3`}>
                  <inst.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{inst.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{inst.description}</p>
                <div className="space-y-1">
                  {inst.resources.map((res) => (
                    <div key={res.title} className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                      {res.title}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Music Theory */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Music Theory</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {concepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${concept.color} border rounded-xl p-4`}
              >
                <div className="text-3xl mb-2">{concept.emoji}</div>
                <h3 className="text-white font-semibold mb-1">{concept.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{concept.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Famous Musicians */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Musicians to Study
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{artist.instrument}</div>
                  <div>
                    <h3 className="text-white font-semibold">{artist.name}</h3>
                    <p className="text-slate-400 text-xs mb-2">{artist.era} • {artist.genre}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{artist.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
