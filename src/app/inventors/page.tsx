'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Rocket, Wifi, Phone, Car, Clock } from 'lucide-react';

const inventors = [
  {
    name: 'George Washington Carver',
    years: '1864-1943',
    category: 'Agriculture',
    emoji: '🌱',
    color: 'from-amber-600 to-amber-800',
    inventions: [
      'Over 300 products from peanuts (including dyes, plastics, fuel)',
      'Crop rotation techniques that saved Southern agriculture',
      'Mobile classroom to teach farmers about soil improvement',
    ],
    bio: 'Born into slavery, Carver became one of the most prominent scientists and inventors of his time. He was the first African American to have a national park named after him.',
    quote: 'When I was young, I abandoned the idea of trying to teach people anything. I realized it was better to let them learn from me.',
  },
  {
    name: 'Madam C.J. Walker',
    years: '1867-1919',
    category: 'Beauty & Business',
    emoji: '💄',
    color: 'from-pink-600 to-pink-800',
    inventions: [
      'Professional hair care line for African American women',
      'Scalp healing treatments and conditioning formulas',
      'Manufacturing and distribution business system',
    ],
    bio: 'Born Sarah Breedlove, she created products specifically for Black women\'s hair care and became the first female self-made millionaire in America. She used her wealth to support civil rights causes.',
    quote: 'I had to make my own living and my own success. I got a start by giving myself a chance.',
  },
  {
    name: 'Garrett Augustus Morgan',
    years: '1877-1963',
    category: 'Safety',
    emoji: '🚦',
    color: 'from-blue-600 to-blue-800',
    inventions: [
      'Traffic signal system (patented 1923)',
      'Gas mask used by fire departments nationwide',
      'Sewage machine that saved lives during tunnel construction',
    ],
    bio: 'Morgan invented the three-position traffic signal that we still use today. He also created a safety hood/gas mask that protected firefighters from smoke and toxic fumes.',
    quote: 'I have been an inventor for 40 years and it has brought me both success and happiness.',
  },
  {
    name: 'Dr. Charles Richard Drew',
    years: '1904-1951',
    category: 'Medicine',
    emoji: '🩸',
    color: 'from-red-600 to-red-800',
    inventions: [
      'Blood plasma storage and transportation methods',
      'Mobile blood collection system for WWII',
      'Blood bank system that saved millions of lives',
    ],
    bio: 'Dr. Drew pioneered the development of large-scale blood banks and mobile blood donation programs. His work made it possible to store blood for transfusions and helped save countless lives during WWII.',
    quote: 'I feel that the story of the development of blood banks should be told, but in such a way that we not lose the human touch.',
  },
  {
    name: 'Granville T. Woods',
    years: '1856-1910',
    category: 'Transportation',
    emoji: '🚂',
    color: 'from-slate-600 to-slate-800',
    inventions: [
      '"Air Brakes" for trains (patented 1892)',
      'Synchronized multiplex telegraph for trains',
      'Electric railway trolley system improvements',
    ],
    bio: 'Known as "the Black Edison," Woods was called the greatest Black inventor by Thomas Edison himself. He held over 60 patents and invented crucial safety devices for trains.',
    quote: 'The successful man is the one who had the chance and took it.',
  },
  {
    name: 'Lewis Howard Latimer',
    years: '1848-1928',
    category: 'Light & Telephone',
    emoji: '💡',
    color: 'from-yellow-600 to-amber-800',
    inventions: [
      'Improved carbon filament for light bulbs (held longer)',
      'Process for making carbon filaments for light bulbs',
      'Designed telephone booth improvements',
    ],
    bio: 'Latimer was one of Alexander Graham Bell\'s colleagues and contributed to the invention of the telephone. He made the light bulb practical by creating a longer-lasting filament.',
    quote: 'I have the satisfaction of knowing that my inventions have been useful to my fellow men.',
  },
  {
    name: 'Dr. Daniel Hale Williams',
    years: '1856-1934',
    category: 'Medicine',
    emoji: '❤️',
    color: 'from-rose-600 to-rose-800',
    inventions: [
      'First successful heart surgery (1893)',
      'Founded Provident Hospital in Chicago',
      'Pioneered antiseptic techniques in surgery',
    ],
    bio: 'Dr. Williams performed one of the first successful heart surgeries in history. He also founded one of the first Black-owned hospitals in America, which also served as a training facility for Black nurses and doctors.',
    quote: 'I have accomplished something which will live after me.',
  },
  {
    name: 'Jan Ernst Matzeliger',
    years: '1852-1889',
    category: 'Manufacturing',
    emoji: '👞',
    color: 'from-orange-600 to-orange-800',
    inventions: [
      'Automated shoe-lasting machine',
      'Reduced shoe prices by half',
      'Revolutionized mass production of shoes',
    ],
    bio: 'Matzeiger\'s machine could produce 150-200 pairs of shoes per day - work that previously took 10 people an entire day. His invention made shoes affordable for millions of Americans.',
    quote: 'I came to this country with nothing but my hands and my trade. Now I am an American inventor.',
  },
  {
    name: 'Patricia Era Bath',
    years: '1942-2019',
    category: 'Medicine',
    emoji: '👁️',
    color: 'from-teal-600 to-teal-800',
    inventions: [
      'Laserphaco probe for cataract treatment',
      'First Black woman to receive a medical patent',
      'Community ophthalmology system for underserved areas',
    ],
    bio: 'Dr. Bath invented a device that revolutionized cataract surgery and restored sight to millions who would have otherwise gone blind. She was also a pioneer in telemedicine and international surgery.',
    quote: 'I have had the extraordinary privilege of participating in the Age of Laser, Space Age, and Computer Age. I have observed that the most significant discoveries of our age are the result of human imagination.',
  },
  {
    name: 'Percy Julian',
    years: '1899-1975',
    category: 'Chemistry',
    emoji: '⚗️',
    color: 'from-emerald-600 to-emerald-800',
    inventions: [
      'Cortisone production from plant sterols',
      'Affordable treatment for rheumatoid arthritis',
      'Fire extinguishing foam for military aircraft',
    ],
    bio: 'Julian was a pioneering chemist who synthesized cortisone, making it affordable for arthritis treatment. He also invented Aerozote, a fire-extinguishing foam used on military aircraft during WWII.',
    quote: 'The greatest weapon of the oppressor is the mind of the oppressed.',
  },
  {
    name: 'Elijah McCoy',
    years: '1844-1929',
    category: 'Engineering',
    emoji: '⚙️',
    color: 'from-zinc-600 to-zinc-800',
    inventions: [
      'Automatic lubricator for steam engines',
      'Over 50 patents for various machinery',
      ' lawn sprinkler system improvements',
    ],
    bio: 'McCoy invented a revolutionary lubricating system that kept machinery running smoothly. His invention was so reliable that people started asking for "the real McCoy" - which became an idiom meaning the genuine article.',
    quote: 'My different patents are my children. I love them all equally.',
  },
  {
    name: ' Norbert Rillieux',
    years: '1806-1894',
    category: 'Food Processing',
    emoji: '🍬',
    color: 'from-violet-600 to-violet-800',
    inventions: [
      'Multiple-effect vacuum evaporator for sugar processing',
      'Eliminated dangerous working conditions in sugar refineries',
      'Process still used in food and chemical industries today',
    ],
    bio: 'Rillieux created a system that revolutionized sugar processing and made it much safer. His evaporation process is still used today in producing everything from condensed milk to soap.',
    quote: 'Simplicity is the hallmark of true genius.',
  },
];

const categories = [
  { name: 'All', emoji: '🌟', color: 'bg-slate-700' },
  { name: 'Medicine', emoji: '🩺', color: 'bg-red-500/30' },
  { name: 'Engineering', emoji: '⚙️', color: 'bg-slate-500/30' },
  { name: 'Agriculture', emoji: '🌱', color: 'bg-green-500/30' },
  { name: 'Transportation', emoji: '🚂', color: 'bg-amber-500/30' },
  { name: 'Chemistry', emoji: '⚗️', color: 'bg-emerald-500/30' },
];

export default function InventorsPage() {
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
            <div className="w-14 h-14 rounded-xl bg-amber-600 flex items-center justify-center">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Black Inventors</h1>
              <p className="text-slate-400">People who changed the world</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-900/30 to-slate-800/50 rounded-xl border border-amber-700/30 p-6 mb-8"
        >
          <p className="text-slate-300 leading-relaxed">
            These brilliant inventors faced enormous obstacles but never stopped creating, 
            innovating, and pushing humanity forward. Their inventions changed how we live, 
            travel, heal, and work. <strong className="text-white">Study them. Learn from them. Be inspired.</strong>
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`${cat.color} border border-slate-600/50 px-3 py-1.5 rounded-full text-sm text-slate-300 hover:border-slate-500 transition flex items-center gap-1.5`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Inventors Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {inventors.map((inventor, index) => (
            <motion.div
              key={inventor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${inventor.color} p-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{inventor.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{inventor.name}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {inventor.years}
                      </p>
                    </div>
                  </div>
                  <span className="bg-white/20 px-2 py-1 rounded text-white/80 text-xs">
                    {inventor.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">{inventor.bio}</p>

                <div>
                  <h4 className="text-white font-semibold text-sm mb-2">Key Inventions:</h4>
                  <ul className="space-y-1">
                    {inventor.inventions.map((inv, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        {inv}
                      </li>
                    ))}
                  </ul>
                </div>

                <blockquote className="border-l-2 border-amber-500/50 pl-3 italic">
                  <p className="text-slate-300 text-sm">"{inventor.quote}"</p>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More to Explore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4">More Inventors to Research</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              { name: 'Benjamin Banneker', field: 'Astronomy, Math' },
              { name: 'Fred Jones', field: 'Refrigeration' },
              { name: 'Otto Boynton', field: 'Eye Testing' },
              { name: 'Mary Beatrice Davidson', field: 'Kitchen Items' },
              { name: 'Alexander Miles', field: 'Elevators' },
              { name: 'William B. Purvis', field: 'Electric Cars' },
              { name: 'David Crosthwait', field: 'HVAC Systems' },
              { name: 'Jessica Jones', field: 'Greeting Cards' },
              { name: 'John B. Johnson', field: 'Hair Products' },
            ].map((person) => (
              <div key={person.name} className="text-slate-300">
                <span className="text-white">{person.name}</span>
                <span className="text-slate-400"> — {person.field}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
