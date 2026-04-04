'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, Clock, BookOpen, CheckCircle, XCircle, Trophy, RefreshCw, ChevronRight } from 'lucide-react';

export default function QuizPage({
  params,
}: {
  params: Promise<{ grade: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const grade = resolvedParams.grade;
  const lessonId = resolvedParams.lessonId;
  
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const studentName = grade === 'honor' ? 'Honor' : 'Noble';
  const theme = grade === 'honor' 
    ? { primary: 'purple', gradient: 'from-purple-600 to-purple-800', icon: '🐉', badge: 'bg-purple-500/20 text-purple-300' }
    : { primary: 'pink', gradient: 'from-pink-600 to-rose-800', icon: '✨', badge: 'bg-pink-500/20 text-pink-300' };

  useEffect(() => {
    import('@/lib/curriculum').then(mod => {
      const quizData = mod.getQuizByLesson(lessonId);
      setQuiz(quizData);
    });
  }, [lessonId]);

  // Fire confetti on finish
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#10b981'];
    
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (quiz && index === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (!quiz) return;
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Save score
      if (typeof window !== 'undefined') {
        const key = `quiz_scores_${grade}`;
        const scores = JSON.parse(localStorage.getItem(key) || '{}');
        scores[quiz.id] = Math.round((score / quiz.questions.length) * 100);
        localStorage.setItem(key, JSON.stringify(scores));
      }
      setFinished(true);
      fireConfetti();
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setQuizStarted(true);
  };

  if (!quiz) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading quiz...</p>
        </div>
      </main>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passingScore = 70;

  // Start screen
  if (!quizStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-8 text-center border border-${theme.primary}-500/30`}>
            <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-${theme.primary}-700 flex items-center justify-center text-6xl`}>
              {theme.icon}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-slate-300 mb-6">{studentName}, are you ready to test your knowledge?</p>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span>Questions</span>
                <span className="text-white font-semibold">{totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span>Passing Score</span>
                <span className="text-white font-semibold">{passingScore}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Time Limit</span>
                <span className="text-white font-semibold">None</span>
              </div>
            </div>

            <button
              onClick={() => setQuizStarted(true)}
              className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition flex items-center justify-center gap-3"
            >
              <span>Start Quiz</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Results screen
  if (finished) {
    const passed = percentage >= passingScore;
    
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-8 md:p-12 text-center border border-${theme.primary}-500/30 shadow-2xl`}>
            
            {/* Result Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                passed ? 'bg-green-500/20' : 'bg-yellow-500/20'
              }`}
            >
              <span className="text-7xl">{passed ? '🎉' : '👍'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {passed ? 'Great Job!' : 'Good Try!'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-300 text-xl mb-6"
            >
              {studentName} scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{totalQuestions}</span>
            </motion.p>

            {/* Score Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className={`text-7xl font-bold mb-6 ${passed ? 'text-green-400' : 'text-yellow-400'}`}
            >
              {percentage}%
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-400 mb-8"
            >
              {passed 
                ? 'You passed! Ready for the next lesson?' 
                : 'Review the lesson and try again!'}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col gap-3"
            >
              <Link
                href={`/lessons/${grade}`}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                  passed 
                    ? 'bg-white text-green-600 hover:bg-green-50' 
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>More Lessons</span>
              </Link>
              
              <button
                onClick={restartQuiz}
                className="w-full py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Retry Quiz</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    );
  }

  // Quiz question screen
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} pt-12 pb-6 px-4`}>
        <div className="max-w-4xl mx-auto">
          <Link href={`/lessons/${grade}/${lessonId}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Lesson</span>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
              <p className="text-slate-400">Question {currentQuestion + 1} of {totalQuestions}</p>
            </div>
            <div className={`w-14 h-14 rounded-xl bg-${theme.primary}-700 flex items-center justify-center text-3xl`}>
              {theme.icon}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              className={`h-full bg-gradient-to-r from-${theme.primary}-400 to-${theme.primary}-300 rounded-full`}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8 -mt-4">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>

          <div className="space-y-4">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showExplanation && isCorrect;
              const showWrong = showExplanation && isSelected && !isCorrect;

              let bgClass = 'bg-slate-700/50 hover:bg-slate-700 border-slate-600';
              if (showCorrect) bgClass = 'bg-green-500/20 border-green-500';
              if (showWrong) bgClass = 'bg-red-500/20 border-red-500';

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${bgClass} ${selectedAnswer === null ? 'cursor-pointer hover:border-purple-400' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                      showCorrect ? 'bg-green-500 text-white' :
                      showWrong ? 'bg-red-500 text-white' :
                      'bg-slate-600 text-slate-200'
                    }`}>
                      {showCorrect ? <CheckCircle className="w-6 h-6" /> : 
                       showWrong ? <XCircle className="w-6 h-6" /> :
                       String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg text-white font-medium">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-5 bg-amber-500/10 rounded-xl border border-amber-500/30"
              >
                <p className="text-amber-200 flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <span><strong>Explanation:</strong> {question.explanation}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Next Button */}
        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <button
                onClick={handleNext}
                className={`px-10 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-3 mx-auto`}
              >
                <span>{currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
