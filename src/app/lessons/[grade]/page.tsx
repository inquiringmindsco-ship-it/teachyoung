'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, ChevronRight, Star, Brain, Heart, Palette, Music, Globe, Sparkles } from 'lucide-react';

const subjectConfig: Record<string, { 
  icon: string; 
  bg: string; 
  text: string; 
  border: string; 
  gradient: string;
  delay: number;
}> = {
  'math': { icon: '⚡', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', gradient: 'from-amber-600 to-amber-800', delay: 0 },
  'reading': { icon: '📖', bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', gradient: 'from-blue-600 to-blue-800', delay: 0.1 },
  'science': { icon: '🔬', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', gradient: 'from-emerald-600 to-emerald-800', delay: 0.2 },
  'social-studies': { icon: '🌍', bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30', gradient: 'from-orange-600 to-orange-800', delay: 0.3 },
  'art': { icon: '🎨', bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30', gradient: 'from-pink-600 to-pink-800', delay: 0.4 },
  'music': { icon: '🎵', bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30', gradient: 'from-violet-600 to-violet-800', delay: 0.5 },
};

export default function LessonsPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: gradeParam } = use(params);
  const resolvedParams = use(params);
  const grade = resolvedParams.grade;
  
  const studentName = grade === 'honor' ? 'Honor' : 'Noble';
  const studentIcon = grade === 'honor' ? '🐉' : '✨';
  
  // Theme colors based on student
  const theme = grade === 'honor' 
    ? { primary: 'purple', gradient: 'from-purple-600 to-slate-900', icon: '🐉', accent: 'amber', badge: 'bg-purple-500/20 text-purple-300' }
    : { primary: 'pink', gradient: 'from-pink-600 to-slate-900', icon: '✨', accent: 'rose', badge: 'bg-pink-500/20 text-pink-300' };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Import lessons dynamically to avoid server-side issues
  const [lessons, setLessons] = useState<any[]>([]);
  
  useEffect(() => {
    // Import the curriculum
    import('@/lib/curriculum').then(mod => {
      const filtered = mod.lessons.filter((l: any) => l.grade === grade);
      setLessons(filtered);
    });
  }, [grade]);

  // Group lessons by subject
  const lessonsBySubject: Record<string, any[]> = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.subject]) acc[lesson.subject] = [];
    acc[lesson.subject].push(lesson);
    return acc;
  }, {} as Record<string, any[]>);

  const subjectIcons: Record<string, React.ReactNode> = {
    'math': <Brain className="w-6 h-6" />,
    'reading': <BookOpen className="w-6 h-6" />,
    'science': <Sparkles className="w-6 h-6" />,
    'social-studies': <Globe className="w-6 h-6" />,
    'art': <Palette className="w-6 h-6" />,
    'music': <Music className="w-6 h-6" />,
    'special': <Star className="w-6 h-6" />,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} pt-12 pb-20 px-4`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-${theme.primary}-400 to-${theme.primary}-600 flex items-center justify-center shadow-2xl`}>
              <span className="text-6xl">{studentIcon}</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {studentName}&apos;s Classroom
              </h1>
              <p className="text-slate-400 text-lg">Choose your adventure and start learning</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-20">
        {Object.entries(lessonsBySubject).map(([subject, subjectLessons], subjIndex) => {
          const config = subjectConfig[subject] || subjectConfig['math'];
          return (
            <motion.div
              key={subject}
              initial={{ opacity: 0, y: 30 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: subjIndex * 0.1 }}
              className="mb-10"
            >
              {/* Subject Header */}
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl ${config.bg} border ${config.border} mb-4`}>
                <span className="text-2xl">{config.icon}</span>
                <span className={`${config.text} font-semibold capitalize`}>{subject.replace('-', ' ')}</span>
              </div>

              {/* Lessons Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectLessons.map((lesson: any, index: number) => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    grade={grade}
                    config={config}
                    theme={theme}
                    delay={subjIndex * 0.1 + index * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}

function LessonCard({ 
  lesson, grade, config, theme, delay 
}: { 
  lesson: any; grade: string; config: any; theme: any; delay: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={`/lessons/${grade}/${lesson.id}`} className="group block h-full">
        <div className={`h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl border ${config.border} overflow-hidden transition-all duration-300 hover:border-${theme.primary}-400/50 hover:shadow-xl hover:shadow-${theme.primary}-500/10 hover:-translate-y-1`}>
          
          {/* Subject Header */}
          <div className={`bg-gradient-to-r ${config.gradient} p-4`}>
            <div className="flex items-center justify-between">
              <span className={`${config.text} text-2xl`}>{config.icon}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${config.text} uppercase tracking-wider`}>
                  {lesson.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
              {lesson.title}
            </h3>
            <p className="text-slate-300 text-sm mb-4 line-clamp-2">
              {lesson.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{lesson.duration}</span>
              </div>
              
              <div className={`flex items-center gap-1 text-${theme.primary}-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span>Start</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
