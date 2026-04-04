'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Trophy, Flame, TrendingUp, Clock, Shield, Star, ChevronRight, Activity } from 'lucide-react';

// Simple chart component
function ProgressChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className={`w-6 rounded-t ${color} opacity-80`}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [honorData, setHonorData] = useState({ completedLessons: 0, quizzesTaken: 0, scores: {} as Record<string, number> });
  const [nobleData, setNobleData] = useState({ completedLessons: 0, quizzesTaken: 0, scores: {} as Record<string, number> });

  useEffect(() => {
    setMounted(true);
    
    // Load data from localStorage
    const honorCompleted = JSON.parse(localStorage.getItem('completed_honor') || '[]');
    const nobleCompleted = JSON.parse(localStorage.getItem('completed_noble') || '[]');
    const honorScores = JSON.parse(localStorage.getItem('quiz_scores_honor') || '{}');
    const nobleScores = JSON.parse(localStorage.getItem('quiz_scores_noble') || '{}');
    
    setHonorData({
      completedLessons: honorCompleted.length,
      quizzesTaken: Object.keys(honorScores).length,
      scores: honorScores
    });
    
    setNobleData({
      completedLessons: nobleCompleted.length,
      quizzesTaken: Object.keys(nobleScores).length,
      scores: nobleScores
    });
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const totalLessons = honorData.completedLessons + nobleData.completedLessons;
  const totalQuizzes = honorData.quizzesTaken + nobleData.quizzesTaken;
  const honorAvg = Object.values(honorData.scores).length > 0 
    ? Math.round(Object.values(honorData.scores).reduce((a, b) => a + b, 0) / Object.values(honorData.scores).length) 
    : 0;
  const nobleAvg = Object.values(nobleData.scores).length > 0 
    ? Math.round(Object.values(nobleData.scores).reduce((a, b) => a + b, 0) / Object.values(nobleData.scores).length) 
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-amber-600/20 border-b border-amber-500/20 pt-12 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-amber-400/70 hover:text-amber-300 mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Parent Command Center
              </h1>
              <p className="text-amber-400/70 text-lg">Monitor progress, track growth, guide success</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Total Lessons', value: totalLessons, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/20' },
            { label: 'Quizzes Taken', value: totalQuizzes, icon: Trophy, color: 'text-pink-400', bg: 'bg-pink-500/20' },
            { label: "Honor Avg.", value: honorAvg > 0 ? `${honorAvg}%` : '--', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/20' },
            { label: "Noble Avg.", value: nobleAvg > 0 ? `${nobleAvg}%` : '--', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Student Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Honor's Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-2xl border border-purple-500/30 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-purple-800 flex items-center justify-center text-4xl">
                    🐉
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Honor</h2>
                    <p className="text-purple-200">Age 8 • 3rd Grade</p>
                  </div>
                </div>
                <Link href="/lessons/honor" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition">
                  View →
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-purple-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-purple-200">{honorData.completedLessons}</div>
                  <div className="text-xs text-slate-300">Lessons</div>
                </div>
                <div className="text-center p-3 bg-purple-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-purple-200">{honorData.quizzesTaken}</div>
                  <div className="text-xs text-slate-300">Quizzes</div>
                </div>
                <div className="text-center p-3 bg-purple-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-amber-300">🔥 0</div>
                  <div className="text-xs text-slate-300">Day Streak</div>
                </div>
              </div>
              
              {/* Progress */}
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Progress</h3>
              <div className="space-y-4">
                {[
                  { name: 'Mathematics', progress: honorData.completedLessons > 0 ? Math.min(100, honorData.completedLessons * 15) : 0, color: 'from-amber-500 to-amber-400' },
                  { name: 'Reading', progress: honorData.completedLessons > 0 ? Math.min(100, honorData.completedLessons * 10) : 0, color: 'from-blue-500 to-blue-400' },
                  { name: 'Science', progress: honorData.completedLessons > 0 ? Math.min(100, honorData.completedLessons * 8) : 0, color: 'from-emerald-500 to-emerald-400' },
                ].map((subject) => (
                  <div key={subject.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-200">{subject.name}</span>
                      <span className="text-purple-200">{subject.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Noble's Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-900/50 to-slate-900 rounded-2xl border border-pink-500/30 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-600 to-rose-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-pink-800 flex items-center justify-center text-4xl">
                    ✨
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Noble</h2>
                    <p className="text-pink-200">Age 9 • 4th Grade</p>
                  </div>
                </div>
                <Link href="/lessons/noble" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition">
                  View →
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-pink-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-pink-200">{nobleData.completedLessons}</div>
                  <div className="text-xs text-slate-300">Lessons</div>
                </div>
                <div className="text-center p-3 bg-pink-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-pink-200">{nobleData.quizzesTaken}</div>
                  <div className="text-xs text-slate-300">Quizzes</div>
                </div>
                <div className="text-center p-3 bg-pink-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-amber-300">🔥 0</div>
                  <div className="text-xs text-slate-300">Day Streak</div>
                </div>
              </div>
              
              {/* Progress */}
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Progress</h3>
              <div className="space-y-4">
                {[
                  { name: 'Mathematics', progress: nobleData.completedLessons > 0 ? Math.min(100, nobleData.completedLessons * 15) : 0, color: 'from-amber-500 to-amber-400' },
                  { name: 'Reading', progress: nobleData.completedLessons > 0 ? Math.min(100, nobleData.completedLessons * 10) : 0, color: 'from-blue-500 to-blue-400' },
                  { name: 'Science', progress: nobleData.completedLessons > 0 ? Math.min(100, nobleData.completedLessons * 8) : 0, color: 'from-emerald-500 to-emerald-400' },
                ].map((subject) => (
                  <div key={subject.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-200">{subject.name}</span>
                      <span className="text-pink-200">{subject.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Family Learning Insights
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-white font-semibold mb-2">Total Lessons</h3>
              <p className="text-4xl font-bold text-purple-400">{totalLessons}</p>
              <p className="text-slate-400 text-sm mt-1">Completed this session</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-white font-semibold mb-2">Quizzes Taken</h3>
              <p className="text-4xl font-bold text-pink-400">{totalQuizzes}</p>
              <p className="text-slate-400 text-sm mt-1">Across all subjects</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-white font-semibold mb-2">Avg. Performance</h3>
              <p className="text-4xl font-bold text-amber-400">
                {honorAvg > 0 || nobleAvg > 0 
                  ? Math.round((honorAvg + nobleAvg) / (honorAvg > 0 && nobleAvg > 0 ? 2 : 1)) 
                  : '--'}%
              </p>
              <p className="text-slate-400 text-sm mt-1">Keep it up!</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Recommendations
            </h3>
            <div className="flex flex-wrap gap-3">
              {totalLessons === 0 && (
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  👉 Start by completing your first lesson!
                </span>
              )}
              {honorData.completedLessons > 0 && honorData.quizzesTaken === 0 && (
                <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm">
                  👉 Honor, try taking a quiz to test your knowledge!
                </span>
              )}
              {nobleData.completedLessons > 0 && nobleData.quizzesTaken === 0 && (
                <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                  👉 Noble, ready for a challenge? Take a quiz!
                </span>
              )}
              {totalLessons > 0 && totalQuizzes > 0 && (
                <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
                  🎉 Great progress! Keep up the excellent work!
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
