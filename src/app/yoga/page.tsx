'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Sun, Moon, Wind, Flame, Star, Heart, 
  Play, CheckCircle, ChevronRight, Brain, Sparkles
} from 'lucide-react';

const yogaContent = {
  breathwork: [
    { id: 'box', name: 'Box Breathing', icon: '📦', duration: '5 min', level: 'All Ages',
      description: 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat.',
      benefits: ['Calms the nervous system', 'Improves focus', 'Reduces anxiety'],
      steps: ['Sit comfortably with spine straight', 'Breathe in through nose: 1-2-3-4', 'Hold: 1-2-3-4', 'Breathe out through mouth: 1-2-3-4', 'Hold empty: 1-2-3-4', 'Repeat 4-8 times'],
      spiritual: 'This technique was used by Navy SEALs and ancient monks. It connects the right and left sides of your brain.',
      affirmation: 'I am calm. I am centered. I control my breath, I control my mind.' },
    { id: 'lion', name: 'Lion\'s Breath', icon: '🦁', duration: '3 min', level: 'All Ages',
      description: 'Breathe in through nose, then exhale forcefully with tongue out.',
      benefits: ['Releases tension', 'Energizes the body', 'Strengthens throat muscles'],
      steps: ['Kneel or sit comfortably', 'Breathe in deep through nose', 'Open mouth wide, stick tongue out', 'Exhale forcefully making a "HA" sound', 'Repeat 5-8 times'],
      spiritual: 'Lion\'s Breath releases the "king/crown" energy. It frees you from fear and builds courage.',
      affirmation: 'I release what does not serve me. I am brave and bold.' },
    { id: 'alternate', name: 'Alternate Nostril', icon: '🫁', duration: '7 min', level: 'Ages 8+',
      description: 'Close one nostril, breathe through the other, alternate.',
      benefits: ['Balances left/right brain', 'Reduces stress', 'Improves concentration'],
      steps: ['Sit comfortably', 'Use right thumb to close right nostril', 'Breathe in through left', 'Close left with ring finger', 'Breathe out through right', 'Breathe in through right', 'Close right, breathe out through left', 'That is one round. Do 5-8 rounds.'],
      spiritual: 'This ancient practice balances the masculine (sun) and feminine (moon) energies in your body.',
      affirmation: 'I am balanced. I am whole. Both sides of me work together.' },
    { id: ' energizing', name: 'Energizing Breath', icon: '⚡', duration: '2 min', level: 'All Ages',
      description: 'Quick rhythmic breaths to wake up your body and brain.',
      benefits: ['Boosts energy instantly', 'Increases alertness', 'Gets blood to the brain'],
      steps: ['Sit tall', 'Breathe quickly through nose: sniff-sniff-sniff', 'Do this for 10 seconds', 'Rest 10 seconds', 'Repeat 3-5 times'],
      spiritual: 'This breath mobilizes prana (life force) throughout your body. Use before tests or sports.',
      affirmation: 'I am energized. My power is unlimited. I am ready to shine.' },
  ],
  meditation: [
    { id: 'calm', name: 'Calm Mind Meditation', icon: '🧘', duration: '5 min', level: 'All Ages',
      description: 'Simple guided meditation to find stillness and peace.',
      benefits: ['Reduces anxiety', 'Creates mental clarity', 'Teaches presence'],
      steps: ['Lie down or sit comfortably', 'Close eyes gently', 'Breathe slowly and deeply', 'Notice your body from head to toe', 'If thoughts come, let them float by like clouds', 'Keep returning to your breath', 'Slowly open your eyes when ready'],
      script: 'Imagine you are a mountain. Strong, steady, unmoving. Thoughts come like weather—rain, sun, wind—but you remain. You are the mountain. You are home.' },
    { id: 'body-scan', name: 'Body Scan Journey', icon: '✨', duration: '10 min', level: 'All Ages',
      description: 'Travel through your body, releasing tension everywhere.',
      benefits: ['Releases physical tension', 'Increases body awareness', 'Helps with sleep'],
      steps: ['Lie down flat', 'Close eyes, breathe deeply', 'Bring attention to your toes: wiggle them, relax them', 'Move to feet: feel them, release them', 'Move to legs: let them melt into the floor', 'Continue up through torso, arms, neck, face', 'Finally, rest in complete relaxation'],
      script: 'With each breath, you send warm light to every part of your body. Light in your toes... warming, relaxing... light in your feet... flowing up through your legs...' },
    { id: 'visualization', name: 'Eagle Vision', icon: '🦅', duration: '7 min', level: 'Ages 6+',
      description: 'Visualize yourself as an eagle soaring high above everything.',
      benefits: ['Builds confidence', 'Expands perspective', 'Connects to inner strength'],
      steps: ['Sit or stand tall', 'Close your eyes', 'Take 3 deep breaths', 'Imagine you are an eagle', 'Feel your wings—wide, powerful', 'You rise higher and higher', 'From up here, you see everything', 'Nothing can touch you', 'You are free, you are powerful'],
      script: 'You spread your wings. The wind catches you. You rise above the clouds, above every problem, above every worry. Down below, everything that seemed big is now small. You are the eagle. You see everything clearly.' },
    { id: 'loving-kindness', name: 'Love Flow', icon: '💗', duration: '8 min', level: 'All Ages',
      description: 'Fill your heart with love, then send it to everyone you know.',
      benefits: ['Opens the heart', 'Builds compassion', 'Strengthens relationships'],
      steps: ['Sit comfortably with hand on heart', 'Breathe and feel your heartbeat', 'Think of someone you love deeply', 'Feel the warmth in your chest', 'Now say in your mind: "May I be happy"', '"May I be healthy", "May I be loved"', 'Now think of someone else you love', 'Send them the same wishes', 'Expand to everyone: family, friends, all people'],
      script: 'Love starts in your heart like a warm light. It grows bigger and bigger. First it fills you completely. Then it flows out to everyone in the world.' },
  ],
  yoga: [
    { id: 'sun-salutation', name: 'Sun Salutation', icon: '🌅', duration: '12 min', level: 'All Ages',
      description: 'A flowing sequence that wakes up your whole body.',
      benefits: ['Full body stretch', 'Builds heat', 'Energizes the body'],
      poses: [
        { name: 'Mountain Pose', desc: 'Stand tall, feet together, hands at heart', benefit: 'Grounds you' },
        { name: 'Upward Reach', desc: 'Arms up, reach for the sky, arch back slightly', benefit: 'Stretches spine' },
        { name: 'Forward Fold', desc: 'Bend forward, touch toes or shins', benefit: 'Stretches hamstrings' },
        { name: 'Half Lift', desc: 'Flat back, hands on thighs, look forward', benefit: 'Builds core' },
        { name: 'Plank', desc: 'Push-up position, body in straight line', benefit: 'Strengthens arms' },
        { name: 'Four-Limbed Staff', desc: 'Lower to floor, hover or rest knees down', benefit: 'Strengthens arms' },
        { name: 'Upward Dog', desc: 'Lift chest, straighten arms, look up', benefit: 'Opens chest' },
        { name: 'Downward Dog', desc: 'Hips up, heels down, body like triangle', benefit: 'Full stretch' },
      ],
      childFriendly: 'Make animal sounds in each pose! Roar in Forward Fold, hiss in Down Dog!' },
    { id: 'warrior', name: 'Warrior Flow', icon: '💪', duration: '10 min', level: 'Ages 5+',
      description: 'Build strength and confidence with warrior poses.',
      benefits: ['Builds leg strength', 'Increases focus', 'Builds confidence'],
      poses: [
        { name: 'Warrior I', desc: 'One foot forward, back foot angled, arms up, look up', benefit: 'Strength and focus' },
        { name: 'Warrior II', desc: 'Same stance, arms out to sides, look over front hand', benefit: 'Endurance and balance' },
        { name: 'Warrior III', desc: 'Balance on one leg, body and back leg parallel to floor', benefit: 'Balance and core' },
        { name: 'Tree Pose', desc: 'Stand on one foot, other foot on inner thigh, arms up', benefit: 'Balance and calm' },
      ],
      affirmation: 'I am strong. I am fearless. I am a warrior.' },
    { id: 'balance', name: 'Balance Challenge', icon: '🌳', duration: '8 min', level: 'Ages 4+',
      description: 'Master balance poses and train your focus.',
      benefits: ['Improves balance', 'Builds concentration', 'Strengthens ankles'],
      poses: [
        { name: 'Tree Pose', desc: 'Stand on one foot, arms up or at heart', benefit: 'Focus and calm' },
        { name: 'Eagle Pose', desc: 'Wrap one leg around the other, wrap arms, sink low', benefit: 'Balance and coordination' },
        { name: 'Airplane', desc: 'Stand on one leg, arms out, body and other leg parallel to floor', benefit: 'Balance and strength' },
        { name: 'Dancer Pose', desc: 'Stand on one leg, hold back foot, lean forward', benefit: 'Balance and flexibility' },
      ],
      childFriendly: 'Hold each pose until you hear a drum beat! See who can hold the longest!' },
    { id: 'sleepy', name: 'Sleepy Time Yoga', icon: '🌙', duration: '10 min', level: 'All Ages',
      description: 'Calming poses to prepare your body for deep sleep.',
      benefits: ['Relaxes the body', 'Prepares for sleep', 'Reduces bedtime anxiety'],
      poses: [
        { name: 'Child\'s Pose', desc: 'Kneel, sit back on heels, forehead on floor, arms forward', benefit: 'Calms the mind' },
        { name: 'Supine Twist', desc: 'Lie on back, hug knees to chest, drop to one side', benefit: 'Releases back tension' },
        { name: 'Legs Up Wall', desc: 'Lie on back, legs up against wall', benefit: 'Reduces stress' },
        { name: 'Happy Baby', desc: 'Lie on back, grab feet, rock gently', benefit: 'Opens hips, calms mind' },
        { name: 'Savasana', desc: 'Lie flat, arms at sides, palms up, completely still', benefit: 'Full relaxation' },
      ],
      childFriendly: 'In Savasana, imagine you are a pancake being cooked—flip over when ready!' },
  ],
};

export default function YogaPage() {
  const [activeTab, setActiveTab] = useState<'breathwork' | 'meditation' | 'yoga'>('breathwork');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const markComplete = (id: string) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  const items = yogaContent[activeTab];

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      <header className="sticky top-0 z-50 bg-[#0D0D1A]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/phoenix" className="p-2 rounded-lg hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C896] to-[#00D4FF] flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Yoga & Meditation</h1>
              <p className="text-xs text-[#B8B8D0]">Body • Breath • Mind • Spirit</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#00C896]">Body & Breath</span> for Peak Performance
          </h1>
          <p className="text-[#B8B8D0] max-w-2xl mx-auto text-lg">
            Ancient practices for strength, flexibility, calm, and spiritual connection. 
            For all ages. No equipment needed. Just you and your breath.
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-2 p-1 bg-[#16162A] rounded-xl max-w-lg mx-auto">
          {[
            { id: 'breathwork', label: 'Breathwork', icon: Wind },
            { id: 'meditation', label: 'Meditation', icon: Brain },
            { id: 'yoga', label: 'Yoga', icon: Sun },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id ? 'bg-gradient-to-r from-[#00C896] to-[#00D4FF] text-[#0D0D1A]' : 'text-[#B8B8D0] hover:text-white'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[#16162A] border border-white/5 hover:border-[#00C896]/30 transition-all cursor-pointer"
              onClick={() => setSelectedItem(item)}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#00C896]/20 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#B8B8D0]">
                    <span>{item.duration}</span>
                    <span>•</span>
                    <span>{item.level}</span>
                  </div>
                </div>
                {completed.includes(item.id) && <CheckCircle className="w-6 h-6 text-[#00C896]" />}
              </div>
              <p className="text-sm text-[#B8B8D0] mb-4">{item.description}</p>
              <div className="flex gap-2">
                {item.benefits?.slice(0, 2).map((b: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5">{b}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-[#16162A] rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-gradient-to-br from-[#00C896]/20 to-transparent sticky top-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#00C896]/30 flex items-center justify-center text-3xl">
                  {selectedItem.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                  <p className="text-[#B8B8D0]">{selectedItem.duration} • {selectedItem.level}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 rounded-lg bg-white/10">×</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold mb-2">About</h3>
                <p className="text-[#B8B8D0]">{selectedItem.description}</p>
              </div>

              {selectedItem.steps && (
                <div>
                  <h3 className="font-bold mb-2">How to Practice</h3>
                  <div className="space-y-2">
                    {selectedItem.steps.map((step: string, i: number) => (
                      <div key={i} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#00C896]/20 text-[#00C896] text-sm flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <span className="text-sm text-[#B8B8D0]">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.poses && (
                <div>
                  <h3 className="font-bold mb-2">Poses</h3>
                  <div className="space-y-3">
                    {selectedItem.poses.map((pose: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5">
                        <h4 className="font-bold">{pose.name}</h4>
                        <p className="text-sm text-[#B8B8D0]">{pose.desc}</p>
                        <span className="text-xs text-[#00C896]">{pose.benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.script && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#7B2D8E]/20 to-transparent border border-[#7B2D8E]/30">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B866D6]" />
                    Guided Script
                  </h3>
                  <p className="text-sm italic text-[#B8B8D0]">{selectedItem.script}</p>
                </div>
              )}

              {selectedItem.spiritual && (
                <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#FFD700]" />
                    Spiritual Connection
                  </h3>
                  <p className="text-sm text-[#B8B8D0]">{selectedItem.spiritual}</p>
                </div>
              )}

              {selectedItem.affirmation && (
                <div className="p-4 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-center">
                  <h3 className="font-bold mb-2">Your Affirmation</h3>
                  <p className="text-lg italic">"{selectedItem.affirmation}"</p>
                </div>
              )}

              {selectedItem.childFriendly && (
                <div className="p-4 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FF6B35]" />
                    Kids' Version
                  </h3>
                  <p className="text-sm text-[#B8B8D0]">{selectedItem.childFriendly}</p>
                </div>
              )}

              <button onClick={() => markComplete(selectedItem.id)}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                  completed.includes(selectedItem.id) ? 'bg-[#00C896] text-[#0D0D1A]' : 'bg-[#00C896]/20 text-[#00C896]'
                }`}>
                <CheckCircle className="w-5 h-5" />
                {completed.includes(selectedItem.id) ? 'Completed!' : 'Mark as Done'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
