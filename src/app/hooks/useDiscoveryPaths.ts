// Curated discovery paths for popular topics
// Key = canonical topic name (lowercase)
// When user explores a key topic, related topics are suggested
// Each topic has: displayName, related: string[], angle: why this connection matters

export const DISCOVERY_PATHS: Record<string, {
  displayName: string;
  related: string[];
  angle: string;
  actually: string;
}> = {
  'why is the sky blue': {
    displayName: 'The Sky',
    related: ['why is a sunset orange and red', 'why is the ocean blue', 'how do rainbows form', 'why is the moon sometimes orange'],
    angle: 'Same light, different story',
    actually: 'The sky isn\'t actually blue — your brain is just filling in the blanks.',
  },
  'why do we dream': {
    displayName: 'Dreams',
    related: ['why do we sleep', 'what is REM sleep', 'why do we yawn', 'why do we forget our dreams'],
    angle: 'The brain never really rests',
    actually: 'Dreams might be your brain\'s way of defragmenting itself — like a computer running disk cleanup while you sleep.',
  },
  'how do elevators work': {
    displayName: 'Elevators',
    related: ['how do pulleys work', 'what is counterweight', 'why do elevators have a maximum capacity', 'how do cable cars work'],
    angle: 'It\'s basically a room on a string',
    actually: 'Elevators don\'t always fall — they fall at exactly the speed that feels safe to your body. The brakes are terrifyingly aggressive.',
  },
  'how do mirrors work': {
    displayName: 'Mirrors',
    related: ['why do mirrors flip left and right but not up and down', 'what is reflection', 'why does water reflect light', 'how do one-way mirrors work'],
    angle: 'Nothing reversed — just light',
    actually: 'Mirrors don\'t actually flip left and right. They flip front to back. You\'re the one doing the confusing work.',
  },
  'what is a barcode': {
    displayName: 'Barcodes',
    related: ['how do QR codes work', 'what is binary code', 'why do grocery stores scan codes so fast', 'how do self-checkout machines read items'],
    angle: 'Pattern = price',
    actually: 'Barcodes were invented to end the era of每个商品必须手动输入价签. One second per item became one cent per item.',
  },
  'why do fire hydrants have caps': {
    displayName: 'Fire Hydrants',
    related: ['how does fire engine water pressure work', 'why do hydrants have different colored caps', 'how do firefighters connect to hydrants', 'why are hydrants yellow in some cities'],
    angle: 'Pressure is everything',
    actually: 'The caps hold back 600+ PSI of pressurized water. Open one wrong and you\'re cutting a hole in a building with a water blade.',
  },
  'why do we have eyebrows': {
    displayName: 'Eyebrows',
    related: ['why do we have eyelashes', 'why does eyebrow hair grow differently', 'how do eyebrows affect expressions', 'why do we arch our eyebrows when surprised'],
    angle: 'Not decorative — functional',
    actually: 'Eyebrows are drainage channels. They redirect sweat and rain away from your eyes so you can still see while running.',
  },
  'why do cats always land on their feet': {
    displayName: 'Cat Reflexes',
    related: ['how does the vestibular system work', 'why do cats purr', 'how do squirrels survive falls from any height', 'what is the righting reflex'],
    angle: 'Built-in gyroscope',
    actually: 'Cats have a righting reflex that kicks in at just 3 inches of fall. They can survive drops from skyscrapers by spreading their body like a parachute.',
  },
  'why does the moon look bigger on the horizon': {
    displayName: 'The Moon Illusion',
    related: ['why does the moon change shape', 'why is the moon brighter some nights', 'what is a harvest moon', 'why does the moon look white'],
    angle: 'Your brain is the trick, not the sky',
    actually: 'The moon is EXACTLY the same size at the horizon as overhead. Your brain just thinks things on the horizon are farther away, so it scales them up.',
  },
  'how do zippers work': {
    displayName: 'Zippers',
    related: ['why do zippers sometimes get stuck', 'who invented the zipper', 'what is the difference between zippers and zipper ties', 'how do zipper pulls work'],
    angle: 'Interlocking geometry',
    actually: 'A zipper is just two rows of interlocking teeth that a tiny wedge (the slider) forces together or apart. That\'s the whole invention.',
  },
  'why do we yawn': {
    displayName: 'Yawning',
    related: ['why is yawning contagious', 'why do we yawn when tired', 'does yawning cool the brain', 'why do fetuses yawn'],
    angle: 'Brain temperature control',
    actually: 'Yawning isn\'t about being tired — it\'s a brain cooling mechanism. Cold air cools the blood in your sinuses, which cools your brain.',
  },
  'why does honey never spoil': {
    displayName: 'Honey',
    related: ['why is honey different colors', 'how do bees make honey', 'what is royal jelly', 'why is honeycomb hexagonal'],
    angle: 'Chemistry as preservative',
    actually: 'Honey is 80% sugar and 20% water. Sugar and acidity (pH 3-4) make it抗菌. Sealed honey found in 3,000-year-old tombs was still edible.',
  },
  'how do submarines dive and surface': {
    displayName: 'Submarines',
    related: ['what is ballast tank', 'how does a鱼雷 work', 'why are submarines round', 'how deep can submarines go'],
    angle: 'Buoyancy engineering',
    actually: 'Submarines dive by flooding tanks with water (getting heavier). Surface by blowing water out with compressed air. That\'s the whole trick.',
  },
  'why do we get deja vu': {
    displayName: 'Deja Vu',
    related: ['what is the tip of the tongue phenomenon', 'why do we dream about future events', 'how does memory work', 'what is a premonition'],
    angle: 'Timing mismatch in the brain',
    actually: 'Deja vu is your brain mis-filing a new experience as an old memory. The present feels like the past because two parts of your brain are slightly out of sync.',
  },
  'why do mosquitoes bite some people more': {
    displayName: 'Mosquito Bites',
    related: ['why do mosquito bites itch', 'why do mosquitoes buzz in your ear', 'does the full moon affect mosquito behavior', 'why is mosquito saliva itchy'],
    angle: 'You\'re basically a food source',
    actually: 'Mosquitoes can detect CO2 from 75 feet away. They also love type O blood and people who produce certain skin chemicals. You\'re basically a flying buffet.',
  },
  'how do satellites stay in orbit': {
    displayName: 'Satellites',
    related: ['why don\'t satellites fall down', 'how fast do satellites travel', 'what is geosynchronous orbit', 'how do satellites not collide'],
    angle: 'Falling forever',
    actually: 'Satellites are literally falling around the Earth. They move so fast sideways that falling equals orbiting. Stop them and they plummet.',
  },
  'why do we have blood types': {
    displayName: 'Blood Types',
    related: ['what happens if you receive wrong blood type', 'why is O negative the universal donor', 'can two parents with A and B blood have an O baby', 'what is Rh factor'],
    angle: 'Evolutionary mismatch',
    actually: 'Blood types are markers from your ancestors\' battles with diseases. Type A got plague resistance. Type B got cholera. Type O? Malaria.',
  },
};

// Topics that should use curated paths (fuzzy matched)
export const CURATED_TOPICS = Object.keys(DISCOVERY_PATHS);

export function getDiscoveryPath(topic: string): typeof DISCOVERY_PATHS[string] | null {
  const lower = topic.toLowerCase().trim();
  // Exact or close match
  for (const key of CURATED_TOPICS) {
    if (lower.includes(key) || key.includes(lower)) {
      return DISCOVERY_PATHS[key];
    }
  }
  return null;
}

export function getCuratedRelated(topic: string): string[] | null {
  const path = getDiscoveryPath(topic);
  return path ? path.related : null;
}

export function getCuratedActually(topic: string): string | null {
  const path = getDiscoveryPath(topic);
  return path ? path.actually : null;
}
