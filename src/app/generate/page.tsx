'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Zap, RotateCcw } from 'lucide-react';

interface LessonPlan {
  title: string;
  whatIsThis: string;
  howItWorks: string;
  whyItMatters: string;
  vocabulary: { word: string; definition: string }[];
  tryThisTogether: string;
  askYourChild: string[];
  subject: string;
  ageGroup: string;
}

interface Challenge {
  mission: string;
  timeNeeded: string;
  whatToDo: string;
  bonusQuestion: string;
}

type Step = 'input' | 'loading' | 'lesson';

const generateLesson = (item: string, ageGroup: string): { lesson: LessonPlan; challenge: Challenge } => {
  const ageLabel = ageGroup === 'all' ? 'All Ages' : `Ages ${ageGroup}`;
  const itemLower = item.toLowerCase();
  
  let subject = 'STEM';
  let lessonData: Partial<LessonPlan> = {};
  let challengeData: Partial<Challenge> = {};
  
  if (itemLower.includes('mcdonald') || itemLower.includes('burger') || itemLower.includes('fries') || itemLower.includes('wendy') || itemLower.includes('taco') || itemLower.includes('chick-fil')) {
    subject = 'Business';
    lessonData = {
      whatIsThis: `This is ${item} — and it's really a science experiment. Every item tastes exactly the same, every time. That's not an accident. It's chemistry.`,
      howItWorks: `They measure every ingredient down to the gram. Same temperature, same time, same result — thousands of times a day.`,
      whyItMatters: `The same science is used in medicine and space food. Understanding this helps you see patterns everywhere.`,
    };
    challengeData = { mission: 'Find 3 more examples of standardization', timeNeeded: '10 min', whatToDo: 'Walk around and find 3 things that use the same "copy everywhere" strategy. Write or draw what you found.', bonusQuestion: 'Why do companies want everything to be exactly the same?' };
  }
  else if (itemLower.includes('febreze') || itemLower.includes('glade') || itemLower.includes('spray') || itemLower.includes('perfume') || itemLower.includes('candle')) {
    subject = 'Chemistry';
    lessonData = {
      whatIsThis: `This is a chemistry trick. It doesn't actually remove smells — it hooks onto odor molecules and masks them with perfume. Like an invisible army fighting smell molecules!`,
      howItWorks: `Every smell is tiny molecules floating in the air. This product grabs those molecules and neutralizes them, then releases a fresh scent.`,
      whyItMatters: `The same chemistry is used in medicine and air purification on space stations.`,
    };
    challengeData = { mission: 'Smell detective', timeNeeded: '10 min', whatToDo: 'Find 3 different smells in your home. Describe each one using only words — no "it smells like ___."', bonusQuestion: 'Why do some smells stick to clothes while others fade quickly?' };
  }
  else if (itemLower.includes('phone') || itemLower.includes('iphone') || itemLower.includes('smartphone') || itemLower.includes('android') || itemLower.includes('tablet')) {
    subject = 'Technology';
    lessonData = {
      whatIsThis: `This is the most powerful tool in human history — in your pocket. It has more computing power than the computers that sent astronauts to the moon.`,
      howItWorks: `Inside are billions of tiny switches called transistors. When you touch the screen, you're completing electrical circuits at lightning speed.`,
      whyItMatters: `Understanding how technology works gives you power over it. The people who built your phone aren't smarter than you — they just learned these concepts.`,
    };
    challengeData = { mission: 'Go tech-free', timeNeeded: '1 hour', whatToDo: 'Put your phone down for 1 hour and do something else. Notice every time you want to check it.', bonusQuestion: 'What would happen in a world without smartphones?' };
  }
  else if (itemLower.includes('leaf') || itemLower.includes('tree') || itemLower.includes('plant') || itemLower.includes('flower') || itemLower.includes('grass')) {
    subject = 'Biology';
    lessonData = {
      whatIsThis: `This leaf is like a tiny solar panel — one of the most incredible machines nature ever built. Plants eat light. They're solar-powered food factories.`,
      howItWorks: `Leaves have chlorophyll (the green stuff). When sunlight hits, it captures energy and mixes it with water and air. Result: sugar for the plant, oxygen for us!`,
      whyItMatters: `Trees are the lungs of our planet. Every breath you take — thank a plant somewhere.`,
    };
    challengeData = { mission: 'Adopt a tree', timeNeeded: '30 min', whatToDo: 'Find a tree and visit it 3 times this week. Each time, draw or describe what you observe.', bonusQuestion: 'Why do leaves change color in fall?' };
  }
  else if (itemLower.includes('money') || itemLower.includes('dollar') || itemLower.includes('bill') || itemLower.includes('coin') || itemLower.includes('cash')) {
    subject = 'Economics';
    lessonData = {
      whatIsThis: `This paper is valuable because we ALL agree it's valuable. That's called currency. Before money, people traded directly — "I'll give you 3 goats for that cow." But what if you had a cow and wanted a haircut? Money solves that.`,
      howItWorks: `The government says this paper equals a certain value. You trust the government. I trust the government. We both accept it. Here's a twist: most money today isn't paper — it's numbers on a screen.`,
      whyItMatters: `Understanding money means understanding power. Who prints it? Who decides its value? These questions help you navigate a world where money affects everything.`,
    };
    challengeData = { mission: 'Track money for a day', timeNeeded: '24 hours', whatToDo: 'Write down everything you see money being used for today. Add it up. What did you learn?', bonusQuestion: 'Why does the government decide what money looks like?' };
  }
  else if (itemLower.includes('water') || itemLower.includes('bottle') || itemLower.includes('cup')) {
    subject = 'Science';
    lessonData = {
      whatIsThis: `Water is the most amazing substance on Earth. Your body is about 60% water. You can survive 30 days without food but only 3 days without water.`,
      howItWorks: `Water is H2O — two hydrogen atoms, one oxygen. What makes it special is cohesion — water sticks to itself. That's why water forms droplets and climbs up plants.`,
      whyItMatters: `Water is life. It regulates your body temperature, moves nutrients through you, and keeps your cells working.`,
    };
    challengeData = { mission: 'Water droplet experiment', timeNeeded: '15 min', whatToDo: 'Put a drop of water on a coin. Count how many drops fit before it overflows. This shows surface tension!', bonusQuestion: 'Why is water so important for life?' };
  }
  else if (itemLower.includes('car') || itemLower.includes('truck') || itemLower.includes('bus') || itemLower.includes('bike')) {
    subject = 'Engineering';
    lessonData = {
      whatIsThis: `This is a machine that converts energy into motion. Most cars burn fuel to create controlled explosions that push pistons, which turn wheels.`,
      howItWorks: `Fuel + spark = explosion. The explosion pushes a piston. The piston turns a crankshaft. The crankshaft turns wheels. Meanwhile, brakes use friction to slow down.`,
      whyItMatters: `Understanding machines helps you fix them, improve them, and invent new ones.`,
    };
    challengeData = { mission: 'Count the machines', timeNeeded: '20 min', whatToDo: 'Count how many vehicles pass by in 10 minutes. Try to identify the energy source for each.', bonusQuestion: 'What would life be like without vehicles?' };
  }
  else if (itemLower.includes('shoe') || itemLower.includes('sneaker') || itemLower.includes('boot')) {
    subject = 'Design';
    lessonData = {
      whatIsThis: `Shoes are engineering marvels. They protect your feet, cushion your joints, and help you move. The average person walks 150,000 miles in their lifetime — shoes make that possible.`,
      howItWorks: `Soles cushion impact. Arch support distributes weight. Laces hold them on. Different shoes are designed for different activities.`,
      whyItMatters: `Shoes tell stories about cultures and history. Today, shoes are fashion, function, and identity all wrapped together.`,
    };
    challengeData = { mission: 'Shoe investigation', timeNeeded: '15 min', whatToDo: 'Look closely at a pair of shoes. Draw the sole. What patterns do you see? Why might they be shaped that way?', bonusQuestion: 'What would happen if we walked everywhere barefoot?' };
  }
  else if (itemLower.includes('fridge') || itemLower.includes('refrigerator') || itemLower.includes('microwave') || itemLower.includes('oven') || itemLower.includes('washer') || itemLower.includes('dryer')) {
    subject = 'Physics';
    lessonData = {
      whatIsThis: `This machine does work you used to have to do by hand. It uses scientific principles to make life easier.`,
      howItWorks: itemLower.includes('fridge') ? `Refrigerators move heat from inside to outside using a special fluid that evaporates and condenses in a loop. It's like a heat taxi.` : `This appliance converts electrical energy into heat or motion to do useful work.`,
      whyItMatters: `These machines changed how humans live. They gave us more free time, safer food, and enabled cities to grow.`,
    };
    challengeData = { mission: 'Energy detective', timeNeeded: '20 min', whatToDo: 'List all the machines in your home. Try to figure out what each one does. Which use the most electricity?', bonusQuestion: 'How did people keep food cold before refrigerators?' };
  }
  else if (itemLower.includes('tv') || itemLower.includes('television') || itemLower.includes('screen') || itemLower.includes('monitor') || itemLower.includes('computer')) {
    subject = 'Technology';
    lessonData = {
      whatIsThis: `Screens are windows made of light. They create pictures using millions of tiny dots called pixels. Each pixel can show different colors.`,
      howItWorks: `Your screen has thousands of pixels in a grid. Each pixel has 3 parts: red, green, and blue. By changing their brightness, the screen creates any color imaginable.`,
      whyItMatters: `Screens are how we see information from far away. Understanding how they work helps you see technology as something you can create, not just consume.`,
    };
    challengeData = { mission: 'Pixel explorer', timeNeeded: '10 min', whatToDo: 'Hold your phone close to your eyes. Do you see tiny squares of color? Those are pixels! Draw what you see.', bonusQuestion: 'What was life like before screens?' };
  }
  else if (itemLower.includes('ball') || itemLower.includes('basketball') || itemLower.includes('football') || itemLower.includes('soccer')) {
    subject = 'Physics';
    lessonData = {
      whatIsThis: `A ball is a tool for storing and transferring energy. When you throw it, you're giving it kinetic energy. When it bounces, that energy converts between motion and deformation.`,
      howItWorks: `Balls are made from different materials for different purposes. Basketballs bounce because they're full of air — the air compresses and springs back.`,
      whyItMatters: `Balls have been used for play, ritual, and sport for thousands of years. They're one of the simplest tools that teach us about physics.`,
    };
    challengeData = { mission: 'Bounce test', timeNeeded: '15 min', whatToDo: 'Find 3 different balls. Drop each from the same height. Which bounces highest? Try to figure out why.', bonusQuestion: 'What would happen if balls had no air inside?' };
  }
  else if (itemLower.includes('book') || itemLower.includes('magazine') || itemLower.includes('newspaper')) {
    subject = 'History';
    lessonData = {
      whatIsThis: `Books are time machines. They let ideas travel across thousands of years. A book written 500 years ago can teach you something today.`,
      howItWorks: `Books put symbols (letters) in a specific order so your brain can decode them into meaning. The same symbols arranged differently create completely different ideas.`,
      whyItMatters: `Before books, knowledge died with people. Books let ideas outlive their creators.`,
    };
    challengeData = { mission: 'Book archaeology', timeNeeded: '20 min', whatToDo: 'Find an old book or look up a historical document online. How is it different from books today?', bonusQuestion: 'What would happen if all books disappeared?' };
  }
  else if (itemLower.includes('clock') || itemLower.includes('watch') || itemLower.includes('time')) {
    subject = 'Math';
    lessonData = {
      whatIsThis: `Clocks are machines that measure time. Here's the thing — time is a human invention. The universe doesn't have "hours" or "minutes." We made those up.`,
      howItWorks: `Analog clocks use gears or vibrations to divide time into equal parts. Digital clocks count electrical pulses. Both answer: "how long has it been since something started?"`,
      whyItMatters: `Time is the most fair thing in the universe — everyone gets the same amount. Understanding time helps you plan and appreciate every moment.`,
    };
    challengeData = { mission: 'Time awareness', timeNeeded: '30 min', whatToDo: 'Guess how long 1 minute is without looking at a clock. Close your eyes and open them when you think a minute passed.', bonusQuestion: 'How did people tell time before clocks?' };
  }
  else if (itemLower.includes('stair') || itemLower.includes('elevator') || itemLower.includes('escalator') || itemLower.includes('ladder')) {
    subject = 'Engineering';
    lessonData = {
      whatIsThis: `Stairs are one of humanity's oldest inventions. Before stairs, buildings were limited by how high a person could climb. Stairs let us build up instead of out.`,
      howItWorks: `Each step is a comfortable height for human legs. Going up converts your energy into height. Going down converts it back. An elevator uses cables to do the same thing mechanically.`,
      whyItMatters: `Stairs are exercise hiding in plain sight. Taking stairs instead of elevators is one of the simplest ways to stay healthy.`,
    };
    challengeData = { mission: 'Stair challenge', timeNeeded: '1 day', whatToDo: 'Take the stairs instead of elevators all day. Count how many flights you climb. How do you feel?', bonusQuestion: 'What if there were no stairs in buildings?' };
  }
  else if (itemLower.includes('pizza') || itemLower.includes('bread') || itemLower.includes('rice') || itemLower.includes('egg') || itemLower.includes('food')) {
    subject = 'Science';
    lessonData = {
      whatIsThis: `Food is fuel with a story. Everything you eat was once alive and now becomes part of you. That's not gross — it's one of the most elegant systems in nature.`,
      howItWorks: `Your body breaks down food into tiny pieces that enter your blood and travel to every cell. Cells use that energy to do everything from thinking to running.`,
      whyItMatters: `Food connects us to nature and to each other. Family recipes and shared meals are how humans pass down traditions.`,
    };
    challengeData = { mission: 'Food journey', timeNeeded: '20 min', whatToDo: `Pick one food item and trace it backward: Where did it come from? What was combined? How did it get to you?`, bonusQuestion: 'What if we only ate one type of food?' };
  }
  else {
    lessonData = {
      whatIsThis: `This ${item} has more science, history, and stories than you might think. Every object was invented by someone, made somewhere, and connects to bigger ideas.`,
      howItWorks: `Take a close look. What is it made of? How was it made? Who made it? When you ask questions like this, you activate curiosity — the engine of learning.`,
      whyItMatters: `Everything in your world has a story. The skill of seeing the extraordinary in the ordinary? That's what smart people do.`,
    };
    challengeData = { mission: 'Find the science', timeNeeded: '15 min', whatToDo: `What makes ${item} work? Create a simple experiment showing this with things you have at home.`, bonusQuestion: 'What would life be like without this object?' };
  }
  
  const vocabKey = ageGroup === '3-5' ? '3-5' : ageGroup === '6-8' ? '6-8' : ageGroup === '9-12' ? '9-12' : ageGroup === '13+' ? '13+' : 'all';
  
  const vocab: Record<string, { word: string; definition: string }[]> = {
    '3-5': [
      { word: 'Science', definition: 'How things work' },
      { word: 'Energy', definition: 'The power to make things happen' },
      { word: ' inventor', definition: 'Someone who creates new things' },
    ],
    '6-8': [
      { word: 'Molecule', definition: 'The tiniest piece of any substance' },
      { word: 'Energy', definition: 'The power to do work' },
      { word: 'System', definition: 'Parts working together' },
    ],
    '9-12': [
      { word: 'Supply chain', definition: 'How things get from source to you' },
      { word: 'Innovation', definition: 'Using creativity to make something new' },
      { word: 'Standardization', definition: 'Making everything the same every time' },
    ],
    '13+': [
      { word: 'Supply chain', definition: 'The network producing and distributing a product' },
      { word: 'Margins', definition: 'The difference between cost and selling price' },
      { word: 'Scalability', definition: 'Ability to grow without losing efficiency' },
    ],
    'all': [
      { word: 'Energy', definition: 'The power to make things happen' },
      { word: 'System', definition: 'Parts working together' },
      { word: 'Innovation', definition: 'Using creativity to make something better' },
    ],
  };
  
  const activities: Record<string, string[]> = {
    '3-5': [`Look at ${item} together. Ask: "What does this feel like? What color is it?"`],
    '6-8': [`Draw a picture of how ${item} works — even if you have to guess!`],
    '9-12': [`Write a short story from the perspective of ${item}. What would it see?`],
    '13+': [`Analyze ${item}: What problem does it solve? Who pays for it? How does it make money?`],
    'all': [`Set a timer for 5 minutes. Find ${item === 'a leaf' ? '3 different leaves' : '3 similar items'} and compare them.`],
  };
  
  const questions: Record<string, string[]> = {
    '3-5': ['What does this remind you of?', 'If this could talk, what would it say?'],
    '6-8': ['How does this help people?', 'What would happen if this didn\'t exist?'],
    '9-12': ['What would life be like without this?', 'How might this be improved?'],
    '13+': ['What economic or social factors influenced this?', 'How might this evolve in 10 years?'],
    'all': ['What would life be like without this?', 'How might this be improved?'],
  };
  
  const lesson: LessonPlan = {
    title: item,
    whatIsThis: lessonData.whatIsThis || '',
    howItWorks: lessonData.howItWorks || '',
    whyItMatters: lessonData.whyItMatters || '',
    vocabulary: vocab[vocabKey] || vocab['all'],
    tryThisTogether: activities[vocabKey]?.[0] || activities['all'][0],
    askYourChild: questions[vocabKey] || questions['all'],
    subject,
    ageGroup: ageLabel,
  };
  
  const challenge: Challenge = {
    mission: challengeData.mission || 'Explore more',
    timeNeeded: challengeData.timeNeeded || '10 min',
    whatToDo: challengeData.whatToDo || `Keep exploring ${item}. What else can you discover?`,
    bonusQuestion: challengeData.bonusQuestion || 'What questions do you still have?',
  };
  
  return { lesson, challenge };
};

export default function GeneratePage() {
  const [step, setStep] = useState<Step>('input');
  const [mode, setMode] = useState<'lesson' | 'challenge'>('lesson');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [item, setItem] = useState('');
  const [ageGroup, setAgeGroup] = useState('9-12');
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
        const filename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setItem(filename);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!item.trim()) return;
    setStep('loading');
    setMode('lesson');
    await new Promise(r => setTimeout(r, 1200));
    const { lesson, challenge } = generateLesson(item, ageGroup);
    setLessonPlan(lesson);
    setChallenge(challenge);
    setStep('lesson');
  };

  const handleTryAnother = () => {
    setStep('input');
    setPhotoPreview(null);
    setItem('');
    setLessonPlan(null);
    setChallenge(null);
    setMode('lesson');
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white flex flex-col">
      {/* Minimal header */}
      <header className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white/80">TeachYoung</span>
        </div>
        {step === 'lesson' && (
          <button onClick={handleTryAnother} className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            New
          </button>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-5">

        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-5"
          >
            {/* Headline */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight">Turn anything into a lesson</h1>
              <p className="text-white/40 text-xs">Snap a photo or type anything. Get an instant lesson.</p>
            </div>

            {/* Photo/Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.03] flex flex-col items-center justify-center cursor-pointer active:scale-98 transition-all hover:border-[#FF6B35]/30"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-white/30 mb-2" />
                  <p className="text-sm text-white/50">Tap to take photo</p>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </div>

            {/* Text input — the main interaction */}
            <div className="space-y-2">
              <input 
                type="text" 
                value={item}
                onChange={e => setItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && item.trim() && handleGenerate()}
                placeholder="McDonald's, leaf, washing machine..."
                className="w-full p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF6B35]/40 transition-colors"
              />
              
              {/* Age selector — compact pill row */}
              <div className="flex gap-1.5 justify-center">
                {[
                  { value: '3-5', label: '3–5' },
                  { value: '6-8', label: '6–8' },
                  { value: '9-12', label: '9–12' },
                  { value: '13+', label: '13+' },
                ].map(age => (
                  <button
                    key={age.value}
                    onClick={() => setAgeGroup(age.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      ageGroup === age.value 
                        ? 'bg-[#FF6B35] text-white' 
                        : 'bg-white/[0.05] text-white/40 hover:text-white/60'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button 
              onClick={handleGenerate}
              disabled={!item.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Sparkles className="w-4 h-4" />
              Generate Lesson
            </button>
          </motion.div>
        )}

        {/* LOADING STEP */}
        {step === 'loading' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border-2 border-[#FFD700] border-t-transparent"
              />
            </div>
            <p className="text-base font-medium text-white/70">Creating lesson...</p>
          </motion.div>
        )}

        {/* LESSON STEP */}
        {step === 'lesson' && lessonPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm pb-24"
          >
            {/* Mode toggle */}
            <div className="flex gap-1.5 mb-5 p-1 bg-white/[0.05] rounded-xl">
              <button
                onClick={() => setMode('lesson')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === 'lesson' ? 'bg-white/10 text-white' : 'text-white/40'
                }`}
              >
                Lesson
              </button>
              <button
                onClick={() => setMode('challenge')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  mode === 'challenge' ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A]' : 'text-white/40'
                }`}
              >
                <Zap className="w-3 h-3" />
                Challenge
              </button>
            </div>

            {/* LESSON VIEW */}
            {mode === 'lesson' && (
              <>
                <div className="text-center mb-4">
                  <span className="text-[10px] text-[#00C896] font-medium uppercase tracking-wider">{lessonPlan.subject}</span>
                  <h1 className="text-xl font-bold mt-0.5 capitalize">{lessonPlan.title}</h1>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wide mb-1">What is this</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{lessonPlan.whatIsThis}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#FFD700] uppercase tracking-wide mb-1">How it works</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{lessonPlan.howItWorks}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#B866D6] uppercase tracking-wide mb-1">Why it matters</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{lessonPlan.whyItMatters}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#00D4FF] uppercase tracking-wide mb-2">Vocabulary</h2>
                    <div className="space-y-1">
                      {lessonPlan.vocabulary.map((v, i) => (
                        <p key={i} className="text-xs text-white/60">
                          <span className="text-white/80 font-medium">{v.word}</span> — {v.definition}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00C896]/8 border border-[#00C896]/15">
                    <h2 className="text-[11px] font-bold text-[#00C896] uppercase tracking-wide mb-1">Try this together</h2>
                    <p className="text-sm text-white/70">{lessonPlan.tryThisTogether}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04]">
                    <h2 className="text-[11px] font-bold text-[#FFD700] uppercase tracking-wide mb-2">Ask your child</h2>
                    <div className="space-y-1">
                      {lessonPlan.askYourChild.map((q, i) => (
                        <p key={i} className="text-sm text-white/70">• {q}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CHALLENGE VIEW */}
            {mode === 'challenge' && challenge && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD700] flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">5-Minute Challenge</p>
                  <h2 className="text-lg font-bold mt-1">{challenge.mission}</h2>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04]">
                  <p className="text-[11px] text-white/40 uppercase tracking-wide mb-1">⏱ Time</p>
                  <p className="text-sm text-white/70">{challenge.timeNeeded}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04]">
                  <p className="text-[11px] text-white/40 uppercase tracking-wide mb-1">🎯 What to do</p>
                  <p className="text-sm text-white/70 leading-relaxed">{challenge.whatToDo}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#B866D6]/8 border border-[#B866D6]/15">
                  <p className="text-[11px] text-[#B866D6] font-bold uppercase tracking-wide mb-1">💎 Bonus</p>
                  <p className="text-sm text-white/70">{challenge.bonusQuestion}</p>
                </div>
              </motion.div>
            )}

            {/* Fixed bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0D0D1A] via-[#0D0D1A] to-transparent">
              <div className="w-full max-w-sm mx-auto flex gap-2">
                <button 
                  onClick={handleTryAnother}
                  className="flex-1 py-3 rounded-xl bg-white/8 text-white/70 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Another
                </button>
                {mode === 'lesson' ? (
                  <button 
                    onClick={() => setMode('challenge')}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    5-Min Challenge
                  </button>
                ) : (
                  <button 
                    onClick={() => setMode('lesson')}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFD700] text-[#0D0D1A] text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Back to Lesson
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
