'use client';

import { use } from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Brain, Sparkles, CheckCircle, BookOpen } from 'lucide-react';

export default function LessonPage({
  params,
}: {
  params: Promise<{ grade: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const gradeStr = resolvedParams.grade;
  const lessonIdStr = resolvedParams.lessonId;
  
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const studentName = gradeStr === 'honor' ? 'Honor' : 'Noble';
  const theme = gradeStr === 'honor' 
    ? { primary: 'purple', gradient: 'from-purple-600 to-purple-800', accent: 'amber', icon: '🐉', badge: 'bg-purple-500/20 text-purple-300' }
    : { primary: 'pink', gradient: 'from-pink-600 to-rose-800', accent: 'rose', icon: '✨', badge: 'bg-pink-500/20 text-pink-300' };

  useEffect(() => {
    import('@/lib/curriculum').then(mod => {
      const found = mod.lessons.find((l: any) => l.id === lessonIdStr);
      setLesson(found);
      
      if (found) {
        const quizData = mod.getQuizByLesson(lessonIdStr);
        setQuiz(quizData);
      }
    });
  }, [lessonIdStr]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem(`completed_${gradeStr}`) || '[]');
      setCompleted(completed.includes(lessonIdStr));
    }
  }, [gradeStr, lessonIdStr]);

  const handleMarkComplete = () => {
    if (typeof window !== 'undefined') {
      const key = `completed_${gradeStr}`;
      const completed = JSON.parse(localStorage.getItem(key) || '[]');
      if (!completed.includes(lessonIdStr)) {
        completed.push(lessonIdStr);
        localStorage.setItem(key, JSON.stringify(completed));
        setCompleted(true);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 3000);
      }
    }
  };

  if (!lesson) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading lesson...</p>
        </div>
      </main>
    );
  }

  // Parse content into sections
  const contentSections = lesson.content.split('\n\n');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 text-center shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 3, duration: 0.5 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
              <p className="text-green-100 text-xl mb-6">Great job, {studentName}!</p>
              <div className="flex flex-col gap-3">
                {quiz && (
                  <Link
                    href={`/lessons/${gradeStr}/${lessonIdStr}/quiz`}
                    className="w-full py-3 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition"
                  >
                    Take the Quiz →
                  </Link>
                )}
                <Link
                  href={`/lessons/${gradeStr}`}
                  className="w-full py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition"
                >
                  Back to Lessons
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} pt-12 pb-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link href={`/lessons/${gradeStr}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to {studentName}&apos;s Classroom</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badge} text-sm mb-3`}>
                <span className="text-lg">{theme.icon}</span>
                <span className="capitalize">{lesson.subject.replace('-', ' ')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {lesson.title}
              </h1>
              <p className="text-slate-400">{lesson.description}</p>
            </div>
            
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${theme.primary}-400 to-${theme.primary}-600 flex items-center justify-center text-4xl shadow-xl`}>
                {theme.icon}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{lesson.duration}</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                lesson.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                lesson.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {lesson.difficulty}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8"
        >
          <div className="space-y-6">
            {contentSections.map((section: string, index: number) => {
              const trimmed = section.trim();
              
              if (!trimmed) return <div key={index} className="h-4" />;
              
              if (trimmed.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0 flex items-center gap-3">
                  <Brain className="w-8 h-8 text-amber-400" />
                  {trimmed.slice(2)}
                </h1>;
              }
              if (trimmed.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold text-slate-200 mt-8 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  {trimmed.slice(3)}
                </h2>;
              }
              if (trimmed.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold text-slate-300 mt-6 mb-3">
                  {trimmed.slice(4)}
                </h3>;
              }

              // Bold text
              const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
              
              // Lists
              if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
                const lines = trimmed.split('\n');
                const items = lines.filter((l: string) => l.trim().startsWith('-'));
                
                return (
                  <div key={index} className="space-y-2">
                    {items.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-slate-300">
                        <span className={`text-${theme.primary}-400 mt-1`}>→</span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/^-\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                );
              }

              // Numbered lists
              if (trimmed.match(/^\d+\./)) {
                const lines = trimmed.split('\n').filter((l: string) => l.match(/^\d+\./));
                return (
                  <div key={index} className="space-y-2 pl-4">
                    {lines.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-slate-300">
                        <span className={`w-6 h-6 rounded-full bg-${theme.primary}-500/20 text-${theme.primary}-300 text-sm flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          {i + 1}
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                );
              }

              return <p key={index} className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: withBold }} />;
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-8 border border-${theme.primary}-500/30`}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {!completed ? (
              <button
                onClick={handleMarkComplete}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition flex items-center justify-center gap-3 shadow-xl"
              >
                <CheckCircle className="w-6 h-6" />
                Mark as Complete
              </button>
            ) : (
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span>Lesson Completed!</span>
              </div>
            )}
            
            {quiz && (
              <Link
                href={`/lessons/${gradeStr}/${lessonIdStr}/quiz`}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-3"
              >
                <BookOpen className="w-6 h-6" />
                Take Quiz
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
