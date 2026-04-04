'use client'

import Link from 'next/link'

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3">📚 Lessons</h1>
          <p className="text-gray-600 text-lg">Choose your grade to start learning</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[
            {
              grade: 'honor',
              label: 'Honor',
              age: 'Ages 7-9',
              color: 'purple',
              desc: 'Reading, Math, Science, Art & more for early learners',
              icon: '🌟',
              subjects: ['Reading', 'Math', 'Science', 'Art', 'Music'],
            },
            {
              grade: 'noble',
              label: 'Noble',
              age: 'Ages 9-12',
              color: 'orange',
              desc: 'Advanced lessons, typing, inventors & video journals',
              icon: '⚡',
              subjects: ['Reading', 'Math', 'Science', 'Typing', 'Inventions'],
            },
          ].map(({ grade, label, age, desc, icon, subjects, color }) => (
            <Link key={grade} href={`/lessons/${grade}`}>
              <div className={`bg-white rounded-3xl p-8 shadow-lg border-2 border-${color}-100 hover:border-${color}-300 hover:shadow-xl transition-all cursor-pointer group hover:scale-105`}>
                <div className="text-6xl mb-4">{icon}</div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className={`text-2xl font-black text-${color}-600`}>{label}</h2>
                  <span className="text-sm text-gray-400 font-medium">{age}</span>
                </div>
                <p className="text-gray-600 mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map(s => (
                    <span key={s} className={`px-3 py-1 rounded-full text-sm font-semibold bg-${color}-50 text-${color}-600`}>{s}</span>
                  ))}
                </div>
                <div className={`mt-6 text-center py-3 rounded-xl font-bold text-${color}-600 group-hover:bg-${color}-50 transition-all`}>
                  Start Learning →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/dashboard" className="text-gray-500 hover:text-purple-600 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
