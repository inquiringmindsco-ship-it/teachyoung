// TeachYoung PHOENIX Design System
// Afrofuturist Excellence for Black Children

export const theme = {
  colors: {
    // Core palette
    primary: '#FF6B35',      // African Orange - energy, creativity
    secondary: '#1A1A2E',    // Royal Navy - depth, excellence
    background: '#0D0D1A',   // Deep Space - focus, depth
    surface: '#16162A',      // Elevated Surface
    
    // Accents
    gold: '#FFD700',         // African Gold - royalty, achievement
    emerald: '#00C896',      // Emerald - growth, healing, Africa
    violet: '#7B2D8E',       // Royal Purple - spirituality, royalty
    cyan: '#00D4FF',         // Bright Cyan - energy, tech
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8D0',
    textMuted: '#6B6B80',
    
    // Semantic
    success: '#00C896',
    warning: '#FFB800',
    error: '#FF4757',
    
    // Gradients
    gradient: {
      primary: 'linear-gradient(135deg, #FF6B35 0%, #FF8B5C 100%)',
      gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      phoenix: 'linear-gradient(135deg, #FF6B35 0%, #7B2D8E 50%, #1A1A2E 100%)',
      emerald: 'linear-gradient(135deg, #00C896 0%, #00E6A8 100%)',
      cosmic: 'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 100%)',
    }
  },
  
  fonts: {
    heading: 'Space Grotesk, sans-serif',
    body: 'Inter, sans-serif',
    accent: 'Libre Baskerville, serif',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    glow: {
      gold: '0 0 20px rgba(255, 215, 0, 0.3)',
      orange: '0 0 20px rgba(255, 107, 53, 0.3)',
      emerald: '0 0 20px rgba(0, 200, 150, 0.3)',
    }
  },
  
  animations: {
    fadeIn: 'fadeIn 0.5s ease-out',
    slideUp: 'slideUp 0.5s ease-out',
    pulse: 'pulse 2s ease-in-out infinite',
    float: 'float 3s ease-in-out infinite',
    glow: 'glow 2s ease-in-out infinite',
    celebrate: 'celebrate 0.6s ease-out',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
}

// Mudra definitions
export const mudras = [
  {
    id: 'gyan',
    name: 'Gyan Mudra',
    sanskrit: 'ज्ञान mudra',
    meaning: 'Mudra of Wisdom',
    superpower: 'Focus & Wisdom',
    position: 'Touch the tip of your index finger to the tip of your thumb',
    benefits: ['Enhances concentration', 'Activates the brain', 'Improves memory', 'Calms the mind'],
    when: 'During homework and learning',
    how: 'Sit comfortably, form the mudra, close your eyes, breathe deeply',
    video: '/videos/gyan-mudra.mp4',
    affirmation: 'I am smart. I can focus. Knowledge flows to me easily.',
    color: '#FFD700',
    icon: '🧠',
    spiritual: 'This mudra connects you to the wisdom of your ancestors. Your ancestors were scholars, healers, and teachers. That wisdom lives in you.',
  },
  {
    id: 'dhyana',
    name: 'Dhyana Mudra',
    sanskrit: 'ध्यान mudra',
    meaning: 'Mudra of Meditation',
    superpower: 'Deep Calm',
    position: 'Touch the tip of your middle finger to the tip of your thumb',
    benefits: ['Reduces stress', 'Calms anxiety', 'Prepares for sleep', 'Centers your mind'],
    when: 'Before tests, when feeling anxious, before bed',
    how: 'Sit in a comfortable position, form the mudra, breathe slowly, think peaceful thoughts',
    video: '/videos/dhyana-mudra.mp4',
    affirmation: 'I am calm. I am centered. Peace flows through me.',
    color: '#7B2D8E',
    icon: '🧘',
    spiritual: 'This mudra opens a channel to your inner wisdom. In the silence, your true self speaks. You are always connected to something greater.',
  },
  {
    id: 'prana',
    name: 'Prana Mudra',
    sanskrit: 'प्राण mudra',
    meaning: 'Mudra of Life Force',
    superpower: 'Energy Boost',
    position: 'Touch the tip of your thumb to the tip of your ring finger',
    benefits: ['Increases energy', 'Fights tiredness', 'Boosts confidence', 'Activates vitality'],
    when: 'Morning, when feeling tired, before sports or activities',
    how: 'Wake up your hands first (rub palms together), form the mudra, take 5 deep breaths',
    video: '/videos/prana-mudra.mp4',
    affirmation: 'I am full of energy! I am ready to take on the day! My power is unlimited!',
    color: '#FF6B35',
    icon: '⚡',
    spiritual: 'Prana is the life force that flows through all living things. You carry this ancient energy from your ancestors. Feel it flow through you now.',
  },
  {
    id: 'apana',
    name: 'Apana Mudra',
    sanskrit: 'अपान mudra',
    meaning: 'Mudra of Grounding',
    superpower: 'Stay Grounded',
    position: 'Touch the tip of your thumb to the tip of your pinky finger',
    benefits: ['Reduces nervousness', 'Grounds your energy', 'Helps with focus', 'Releases negative thoughts'],
    when: 'When you feel scattered, before presentations, when things get chaotic',
    how: 'Feel your feet on the ground, form the mudra, imagine tree roots growing from you into the earth',
    video: '/videos/apana-mudra.mp4',
    affirmation: 'I am rooted like a tree. Nothing can shake me. I stand firm.',
    color: '#00C896',
    icon: '🌳',
    spiritual: 'You come from a long line of strong people. Your roots go deep into the earth and stretch back through generations. You are never alone.',
  },
  {
    id: 'varun',
    name: 'Varun Mudra',
    sanskrit: 'वरुण mudra',
    meaning: 'Mudra of Creativity',
    superpower: 'Creative Flow',
    position: 'Touch the tip of your thumb to the tip of your ring finger (lightly)',
    benefits: ['Opens creative channels', 'Helps with artistic expression', 'Enhances imagination', 'Flow state activation'],
    when: 'Before art, music, writing, creative projects',
    how: 'Keep your hand relaxed, form the mudra gently, let creative thoughts flow',
    video: '/videos/varun-mudra.mp4',
    affirmation: 'My creativity has no limits. I see beauty everywhere. I create masterpieces.',
    color: '#00D4FF',
    icon: '🎨',
    spiritual: 'Creativity is a gift from the divine. Throughout history, Black artists have created beauty that moved the world. That creative spirit is in your hands.',
  },
  {
    id: 'surya',
    name: 'Surya Mudra',
    sanskrit: 'सूर्य mudra',
    meaning: 'Mudra of the Sun',
    superpower: 'Confidence Power',
    position: 'Clasp all your fingers together (like holding a flash of light)',
    benefits: ['Boosts self-confidence', 'Increases courage', 'Brings warmth and joy', 'Strengthens willpower'],
    when: 'Before tests, when you need courage, when speaking up',
    how: 'Cup your hands as if holding a glowing ball of light, feel warmth in your palms, smile',
    video: '/videos/surya-mudra.mp4',
    affirmation: 'I am confident. I am brave. I speak my truth. I am powerful.',
    color: '#FFD700',
    icon: '☀️',
    spiritual: 'The sun rises every day without fail. You have that same strength inside you. No matter what happened yesterday, today you rise.',
  },
]

// Outdoor Adventures
export const adventures = [
  {
    id: 'cloud-gazing',
    title: 'Cloud Kingdom Quest',
    subtitle: 'Discover the Shapes in the Sky',
    week: 1,
    icon: '☁️',
    color: '#B8D4E8',
    mission: 'Observe clouds for 15 minutes and discover their secret shapes',
    materials: ['Notebook or journal', 'Pencil', 'Comfortable spot outside'],
    duration: '20-30 minutes',
    videoGuide: '/videos/cloud-gazing.mp4',
    printable: '/printables/cloud-journal.pdf',
    steps: [
      { title: 'Find Your Spot', description: 'Choose a comfortable place where you can see a lot of sky. Lay on your back or sit in a chair.' },
      { title: 'Breathe & Notice', description: 'Take 3 deep breaths. Look up at the clouds. Do not try to find shapes yet—just watch.' },
      { title: 'Cloud Types', description: 'Notice the colors: white, gray, dark. White clouds = happy clouds. Dark clouds = rain clouds.' },
      { title: 'Shape Hunt', description: 'Now find 5 cloud shapes. A rabbit? A dragon? Your grandmother\'s face? Your imagination is your guide.' },
      { title: 'Draw & Write', description: 'Sketch your favorite cloud shapes in your journal. Write a story about one of them.' },
    ],
    science: 'Clouds form when water vapor (invisible water in the air) cools down and turns into tiny water droplets. These droplets clump together and float in the sky!',
    reflection: 'How did watching clouds make you feel? What shapes did you find? What story did your cloud want to tell?',
    xp: 100,
  },
  {
    id: 'tree-mapping',
    title: 'Tree Keepers Mission',
    subtitle: 'Become Friends with the Trees',
    week: 2,
    icon: '🌳',
    color: '#00C896',
    mission: 'Find and identify 5 different trees in your neighborhood or yard',
    materials: ['Tree guide (or phone for photos)', 'Notebook', 'Crayons or pencils', 'White paper for bark rubbing'],
    duration: '30-45 minutes',
    videoGuide: '/videos/tree-mapping.mp4',
    printable: '/printables/tree identification-sheet.pdf',
    steps: [
      { title: 'The Eyes Have It', description: 'Look up. Trees are everywhere! Before you touch anything, use your eyes to observe.' },
      { title: 'Touch & Feel', description: 'Gently touch the bark. Is it rough or smooth? Bumpy or flat? Each tree has its own texture.' },
      { title: 'Bark Rubbing', description: 'Place paper on the bark and rub with crayon. You just made a tree fingerprint!' },
      { title: 'Leaf Detective', description: 'Collect leaves from different trees. Compare: Are they big or small? Round or pointy? Smooth or jagged?' },
      { title: 'Name That Tree', description: 'Use your guide or phone to identify your trees. Give each one a name like "Old Grandfather Oak."' },
    ],
    science: 'Trees are the largest living things in many environments. They make the oxygen we breathe, clean our air, and provide homes for animals. Some trees can live for thousands of years!',
    reflection: 'Which tree did you like most? If you could be a tree, which one would you be and why?',
    xp: 150,
  },
  {
    id: 'water-cycle-hunt',
    title: 'Water Detective Agency',
    subtitle: 'Find the Water Cycle in Action',
    week: 3,
    icon: '💧',
    color: '#00D4FF',
    mission: 'Find evidence of the water cycle happening right now in your world',
    materials: ['Magnifying glass (optional)', 'Journal', 'Pencil', 'Camera or phone (optional)'],
    duration: '25-35 minutes',
    videoGuide: '/videos/water-cycle.mp4',
    printable: '/printables/water-cycle-detective.pdf',
    steps: [
      { title: 'Evaporation Check', description: 'Is there water evaporating somewhere? Look for puddles getting smaller, wet ground drying, or water in containers.' },
      { title: 'Condensation Search', description: 'Where is water condensing? Check for dew on grass, fog on mirrors, or water droplets on cold drinks.' },
      { title: 'Precipitation Patrol', description: 'Is it raining? Has it rained recently? Look for puddles, wet surfaces, or water dripping from leaves.' },
      { title: 'Collection Hunt', description: 'Where is water collecting? Lakes, ponds, buckets, drains, puddles, bottles—all count!' },
      { title: 'Document Your Evidence', description: 'Take photos or draw what you found. Label each discovery as evaporation, condensation, or precipitation.' },
    ],
    science: 'The water cycle is Earth\'s recycling system. Water on the ground heats up from the sun, becomes invisible vapor, rises up, forms clouds, then falls back as rain or snow. It has been cycling for billions of years!',
    reflection: 'Where in nature did you see the most water cycle action? How does knowing about the water cycle help you overstood weather?',
    xp: 125,
  },
  {
    id: 'bird-watch',
    title: 'Feathered Friends Safari',
    subtitle: 'Become an Ornithologist',
    week: 4,
    icon: '🐦',
    color: '#7B2D8E',
    mission: 'Identify 5 different birds and learn their songs',
    materials: ['Binoculars (or just your eyes)', 'Bird guide or app', 'Notebook', 'Pencil', 'Peanuts or seeds (optional)'],
    duration: '30-45 minutes',
    videoGuide: '/videos/bird-watching.mp4',
    printable: '/printables/bird-watcher-field-guide.pdf',
    steps: [
      { title: 'Find a Perch', description: 'Sit quietly in one spot for 5 minutes. Birds are curious—once you are still, they might come to you!' },
      { title: 'Look at the Details', description: 'Notice: How big is the bird? What colors? Does it have a crest? What shape is its beak?' },
      { title: 'Listen Up', description: 'Close your eyes. How many different bird sounds can you hear? Try to match sounds to birds.' },
      { title: 'Sketch & Describe', description: 'Draw or describe each bird you see. Write down where you saw it (tree, ground, roof, fence).' },
      { title: 'Name Your Birds', description: 'Use your guide to identify each bird. Cardinals, sparrows, blue jays—can you name them?' },
    ],
    science: 'Birds evolved from dinosaurs millions of years ago! They have hollow bones to help them fly and feathers for warmth and flight. Some birds migrate thousands of miles each year.',
    reflection: 'Which bird was your favorite? Did you hear any birds singing? What do you think they were saying?',
    xp: 150,
  },
  {
    id: 'night-sky',
    title: 'Star Walkers Journey',
    subtitle: 'Connect with the Cosmos',
    week: 5,
    icon: '⭐',
    color: '#FFD700',
    mission: 'Discover 3 constellations and learn the stories the stars tell',
    materials: ['Clear night sky', 'Blanket to lie on', 'Flashlight with red light (protects night vision)', 'Star guide'],
    duration: '30-45 minutes',
    videoGuide: '/videos/night-sky.mp4',
    printable: '/printables/constellation-finder.pdf',
    steps: [
      { title: 'Dark Adaptation', description: 'Turn off all lights. Wait 10 minutes for your eyes to adjust. The stars will appear brighter!' },
      { title: 'Find Polaris (North Star)', description: 'Find the Big Dipper. Follow the two stars at the end of its "cup" upward. The first bright star is Polaris—true north!' },
      { title: 'Trace the Dipper', description: 'The Big Dipper is not a constellation itself—it is part of Ursa Major (Big Bear). Trace its handle and bowl.' },
      { title: 'Orion the Hunter', description: 'Look for three stars in a row (Orion\'s belt). Four stars make his body. This constellation is visible worldwide.' },
      { title: 'Tell a Star Story', description: 'Ancient people made up stories about the stars. Create your own constellation and story!' },
    ],
    science: 'Stars are enormous balls of hot gas, just like our sun. They look tiny because they are incredibly far away. Some stars you see at night died thousands of years ago—their light is just reaching you now!',
    reflection: 'If you made a constellation, what would it look like? What story would it tell? How does knowing stars are suns make you feel about the universe?',
    xp: 175,
  },
  {
    id: 'soil-exploration',
    title: 'Earth Scientists Expedition',
    subtitle: 'Dig Into the Secrets of Soil',
    week: 6,
    icon: '🌍',
    color: '#8B4513',
    mission: 'Dig into soil and discover the hidden world beneath your feet',
    materials: ['Small shovel or trowel', 'Magnifying glass', 'Container for specimens', 'Journal', 'Pencil'],
    duration: '35-45 minutes',
    videoGuide: '/videos/soil-exploration.mp4',
    printable: '/printables/soil-scientist-lab.pdf',
    steps: [
      { title: 'Choose Your Spot', description: 'Pick two different locations: one dry and sunny, one shady and moist. What might be different?' },
      { title: 'Dig Carefully', description: 'Dig a small hole about 6 inches deep. Look at the soil layers: topsoil, subsoil, and what lies beneath.' },
      { title: 'Sort and Observe', description: 'Use your magnifying glass to examine the soil. Can you find bits of leaves, tiny rocks, or insects?' },
      { title: 'The Earthworm Count', description: 'Earthworms are helpers! Count how many you find. More worms = healthier soil.' },
      { title: 'Record Your Findings', description: 'Draw what you found in each location. Compare: Which spot had more life? More colors? Different textures?' },
    ],
    science: 'One teaspoon of healthy soil contains more living organisms than there are people on Earth! Bacteria, fungi, insects, and worms all work together to create the dirt that grows our food.',
    reflection: 'What surprised you most about soil? How does soil help the food you eat grow? What can you do to protect healthy soil?',
    xp: 125,
  },
  {
    id: 'wind-detective',
    title: 'Invisible Force Investigation',
    subtitle: 'The Wind Cannot Be Seen But It Can Be Felt',
    week: 7,
    icon: '🌬️',
    color: '#E8E8E8',
    mission: 'Discover the invisible wind and learn to measure it with your super senses',
    materials: ['Scissors', 'Tape', 'String', 'Paper', 'Notebook', 'Leaves or paper scraps (optional)'],
    duration: '25-35 minutes',
    videoGuide: '/videos/wind-detective.mp4',
    printable: '/printables/wind-observation-log.pdf',
    steps: [
      { title: 'Make a Wind Catcher', description: 'Cut a spiral from paper or tie strips to a stick. This will show you which way the wind blows.' },
      { title: 'The Beaufort Scale', description: 'Learn to estimate wind speed: 0 = smoke rises straight, 5 = small branches move, 10 = whole trees sway.' },
      { title: 'Direction Hunt', description: 'Use your wind catcher to find: Which direction is the wind coming from? Where does it go?' },
      { title: 'Speed Test', description: 'Time how long it takes a leaf or paper to travel 10 feet. Faster = stronger wind.' },
      { title: 'Map Your Findings', description: 'Draw a picture showing wind direction and strength. Is wind the same everywhere? Near buildings? Open areas?' },
    ],
    science: 'Wind is air in motion! The sun heats the Earth unevenly, causing hot air to rise and cool air to rush in. This creates wind. On a bigger scale, this is how hurricanes form!',
    reflection: 'Where did you feel the strongest wind? How do people use wind energy today? If you could capture wind energy, what would you power?',
    xp: 100,
  },
  {
    id: 'color-hunt',
    title: 'Rainbow Hunters Mission',
    subtitle: 'Find the Colors of Nature',
    week: 8,
    icon: '🌈',
    color: '#FF6B35',
    mission: 'Create your own natural color palette by finding nature\'s rainbow',
    materials: ['White paper or cardboard', 'Tape or glue', 'Magnifying glass', 'Collection bag', 'Notebook'],
    duration: '30-40 minutes',
    videoGuide: '/videos/color-hunt.mp4',
    printable: '/printables/natural-color-collector.pdf',
    steps: [
      { title: 'The Rainbow Challenge', description: 'Find natural items for each color of the rainbow: RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET.' },
      { title: 'Nature\'s Paint Box', description: 'Look closely: Berries, flowers, leaves, rocks, bark—all can be different colors. Think outside the box!' },
      { title: 'Document Everything', description: 'Draw or photograph each item you find. Write where you found it and what it is.' },
      { title: 'Create Your Palette', description: 'Arrange your collected items on paper to show nature\'s rainbow. Glue or tape them down.' },
      { title: 'Color Science', description: 'Why are things different colors? Talk about how plants make their own colors and how animals use color for camouflage or attracting mates.' },
    ],
    science: 'Colors in nature come from different sources! Plants make colors through photosynthesis (green from chlorophyll). Animals get colors from food or make them biologically. Some colors warn predators: "I am poisonous!"',
    reflection: 'Which color was hardest to find? Easiest? Did you find any unexpected colors? What would you create with natural dyes?',
    xp: 125,
  },
]

// Peak Performance exercises
export const peakExercises = {
  breathing: [
    { id: 'box-breath', name: 'Box Breathing', duration: '2 min', icon: '📦', description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.', benefits: ['Calms the nervous system', 'Improves focus', 'Reduces stress'] },
    { id: 'lion-breath', name: 'Lion\'s Breath', duration: '1 min', icon: '🦁', description: 'Breathe in through nose, then exhale forcefully through mouth with tongue out and arms wide.', benefits: ['Releases tension', 'Energizes the body', 'Clears the mind'] },
    { id: 'energy-breath', name: 'Energizing Breath', duration: '1 min', icon: '⚡', description: 'Quick breaths in and out through nose for 10 seconds, then rest. Repeat 3 times.', benefits: ['Boosts energy', 'Increases alertness', 'Wakes up the brain'] },
  ],
  focus: [
    { id: 'staring-game', name: 'The Staring Game', duration: '3 min', icon: '👀', description: 'Stare at a single point without moving your eyes. See how long you can hold focus.', benefits: ['Trains concentration', 'Strengthens eye muscles', 'Improves attention span'] },
    { id: 'sound-hunt', name: 'Sound Hunt', duration: '5 min', icon: '👂', description: 'Close your eyes and count all the different sounds you hear. Try to identify 10+ sounds.', benefits: ['Sharpens auditory focus', 'Builds awareness', 'Calms the mind'] },
    { id: 'one-thing', name: 'One Thing Focus', duration: '5 min', icon: '🎯', description: 'Pick one object. Study every detail. Color, shape, texture, reflections, shadows.', benefits: ['Develops observation skills', 'Teaches patience', 'Trains detailed attention'] },
  ],
  movement: [
    { id: 'tiger-stretch', name: 'Tiger Stretches', duration: '3 min', icon: '🐯', description: 'Stretch like different animals: arch your back like a cat, crawl like a lizard, hop like a frog.', benefits: ['Wakes up the body', 'Improves body awareness', 'Makes learning fun'] },
    { id: 'brain-jacks', name: 'Brain Jacks', duration: '5 min', icon: '🧠', description: 'Jumping jacks but with a twist: when you clap overhead, name something in a category (animal, color, country).', benefits: ['Gets blood to the brain', 'Combines physical and mental', 'Energizes for learning'] },
    { id: 'dance-breaks', name: 'Dance Breaks', duration: '3 min', icon: '💃', description: 'Put on music and dance freely. When the music stops, freeze. Resume when music plays.', benefits: ['Burns excess energy', 'Creates dopamine for learning', 'Makes study sessions fun'] },
  ],
}

// Nutrition for Superheroes
export const nutritionTips = [
  { name: 'Brain Power Berries', foods: ['Blueberries', 'Blackberries', 'Grapes', 'Cherries'], color: 'purple', benefit: 'Protect brain cells and improve memory', emoji: '🫐' },
  { name: 'Sunshine Seeds', foods: ['Pumpkin seeds', 'Sunflower seeds', 'Chia seeds', 'Flax seeds'], color: 'orange', benefit: 'Omega-3s for brain health and focus', emoji: '🎃' },
  { name: 'Super Proteins', foods: ['Nuts', 'Eggs', 'Fish', 'Beans'], color: 'brown', benefit: 'Build brain cells and keep you full', emoji: '🥚' },
  { name: 'Green Giants', foods: ['Spinach', 'Broccoli', 'Kale', 'Avocado'], color: 'green', benefit: 'Iron for learning and vegetables for vitamins', emoji: '🥬' },
  { name: 'Golden Grains', foods: ['Oatmeal', 'Whole wheat bread', 'Brown rice', 'Quinoa'], color: 'yellow', benefit: ' Steady energy for focused learning', emoji: '🌾' },
  { name: 'Hydration Heroes', foods: ['Water', 'Coconut water', 'Herbal tea', 'Infused water'], color: 'blue', benefit: 'Keep your brain hydrated for peak performance', emoji: '💧' },
]

// Parent Bridge Prompts
export const bridgePrompts = [
  { week: 1, category: 'courage', question: 'Tell me about a time this week when something felt scary but you did it anyway. What gave you courage?', reflection: 'courage', emoji: '🦁' },
  { week: 2, category: 'creativity', question: 'If you could invent anything in the world, what would it be and why? Describe it in detail.', reflection: 'creativity', emoji: '💡' },
  { week: 3, category: 'heritage', question: 'What is something special about your family or your history that makes you proud?', reflection: 'heritage', emoji: '🌳' },
  { week: 4, category: 'purpose', question: 'If you could help any person or group of people in the world, who would it be and how would you help them?', reflection: 'purpose', emoji: '⭐' },
  { week: 5, category: 'strength', question: 'What is something you are really good at? How did you become good at it?', reflection: 'strength', emoji: '💪' },
  { week: 6, category: 'community', question: 'Who in your life has helped you the most? What did they do for you?', reflection: 'community', emoji: '🤝' },
  { week: 7, category: 'dreams', question: 'What do you want to be when you grow up? What would a typical day look like for you?', reflection: 'dreams', emoji: '🌟' },
  { week: 8, category: 'gratitude', question: 'What are three things that happened this week that you are grateful for? Why?', reflection: 'gratitude', emoji: '🙏' },
]

// Achievement definitions
export const achievements = [
  { id: 'first-mudra', name: 'Mudra Initiate', description: 'Practiced your first hand mudra', icon: '🙏', xp: 50, requirement: { type: 'mudras', count: 1 } },
  { id: 'all-mudras', name: 'Mudra Master', description: 'Practiced all 6 hand mudras', icon: '🏆', xp: 300, requirement: { type: 'mudras', count: 6 } },
  { id: 'first-adventure', name: 'Explorer', description: 'Completed your first outdoor adventure', icon: '🗺️', xp: 100, requirement: { type: 'adventures', count: 1 } },
  { id: 'adventure-5', name: 'Adventurer', description: 'Completed 5 outdoor adventures', icon: '🌍', xp: 250, requirement: { type: 'adventures', count: 5 } },
  { id: 'adventure-all', name: 'World Explorer', description: 'Completed all 8 outdoor adventures', icon: '🚀', xp: 500, requirement: { type: 'adventures', count: 8 } },
  { id: 'focus-champion', name: 'Focus Champion', description: 'Completed 10 focus exercises', icon: '🧠', xp: 200, requirement: { type: 'focus', count: 10 } },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: '🔥', xp: 175, requirement: { type: 'streak', count: 7 } },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintained a 30-day learning streak', icon: '👑', xp: 750, requirement: { type: 'streak', count: 30 } },
  { id: 'reading-champion', name: 'Reading Champion', description: 'Completed 10 reading activities', icon: '📚', xp: 200, requirement: { type: 'reading', count: 10 } },
  { id: 'science-star', name: 'Science Star', description: 'Completed 5 science activities', icon: '🔬', xp: 200, requirement: { type: 'science', count: 5 } },
]
