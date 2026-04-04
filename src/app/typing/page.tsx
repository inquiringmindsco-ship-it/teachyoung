'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Keyboard } from 'lucide-react';

const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly.',
  'Sphinx of black quartz, judge my vow.',
];

const homeRowKeys = [
  { key: 'A', finger: 'Left ring', color: 'bg-blue-600' },
  { key: 'S', finger: 'Left middle', color: 'bg-blue-500' },
  { key: 'D', finger: 'Left index', color: 'bg-blue-400' },
  { key: 'F', finger: 'Left index (home)', color: 'bg-blue-400 ring-2 ring-yellow-400', bump: true },
  { key: 'G', finger: 'Left index', color: 'bg-blue-400' },
  { key: 'H', finger: 'Right index', color: 'bg-pink-400' },
  { key: 'J', finger: 'Right index (home)', color: 'bg-pink-400 ring-2 ring-yellow-400', bump: true },
  { key: 'K', finger: 'Right middle', color: 'bg-pink-500' },
  { key: 'L', finger: 'Right ring', color: 'bg-pink-600' },
];

export default function TypingPage() {
  const [sentence, setSentence] = useState(sentences[0]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (completed) {
      setTimeout(() => {
        setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
        setInput('');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setCompleted(false);
      }, 1500);
    }
  }, [completed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }
    
    setInput(val);
    
    // Calculate WPM
    if (startTime && val.length > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = val.split(' ').length;
      setWpm(Math.round(wordsTyped / timeElapsed));
    }
    
    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === sentence[i]) correct++;
    }
    setAccuracy(Math.round((correct / val.length) * 100));
    
    // Check if complete
    if (val === sentence) {
      setCompleted(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center">
              <Keyboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Typing Practice</h1>
              <p className="text-slate-400">Practice typing to get faster</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Practice Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-8"
        >
          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{wpm}</div>
              <div className="text-slate-500 text-sm">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
              <div className="text-slate-500 text-sm">Accuracy</div>
            </div>
            {completed && (
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">✓</div>
                <div className="text-slate-500 text-sm">Done!</div>
              </div>
            )}
          </div>

          {/* Sentence to type */}
          <div className="bg-slate-900 rounded-xl p-4 mb-4 font-mono text-lg leading-relaxed">
            {sentence.split('').map((char, i) => {
              let color = 'text-slate-600';
              if (i < input.length) {
                color = input[i] === char ? 'text-green-400' : 'text-red-400 bg-red-900/30';
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={handleChange}
            className="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-lg focus:outline-none focus:border-blue-500 transition"
            placeholder="Start typing..."
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </motion.div>

        {/* Home Row Guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-8"
        >
          <h2 className="text-white font-semibold mb-4">Home Row Keys (F and J have bumps)</h2>
          <div className="flex flex-wrap gap-2">
            {homeRowKeys.map((k) => (
              <div
                key={k.key}
                className={`${k.color} w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white font-bold transition-all`}
              >
                <span className="text-sm">{k.key}</span>
                {k.bump && <span className="text-xs opacity-60">▲</span>}
              </div>
            ))}
          </div>
          <p className="text-slate-300 text-sm mt-3">
            Rest your index fingers on F and J. The bumps help you find them without looking.
          </p>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6"
        >
          <h2 className="text-white font-semibold mb-4">Tips</h2>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>• Always return to home row position after each keystroke</li>
            <li>• Use the correct finger for each key (don't hunt and peck)</li>
            <li>• Focus on accuracy first, speed will come naturally</li>
            <li>• Practice a little each day rather than long sessions</li>
          </ul>
        </motion.div>

      </div>
    </main>
  );
}
