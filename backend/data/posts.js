// Single source of truth for backend - matches frontend data exactly
export const mockPosts = [
  {
    id: '1',
    type: 'text',
    content: 'BREAKING: Scientists Discover Cure for All Diseases! A revolutionary new treatment has been found that can cure any illness in just 24 hours. The breakthrough was announced by a team of researchers who claim their method works on everything from the common cold to cancer.',
    author: {
      name: 'Health News Today',
      handle: 'healthnewstoday',
      profilePic: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=H',
      verified: false
    },
    timestamp: '2h',
    engagement: {
      likes: 1247,
      shares: 89,
      comments: 156
    },
    metadata: {
      label: 'fake',
      redFlags: ['Uses "BREAKING" in all caps', 'Claims impossible cure', 'No peer review mentioned', 'Sensational language'],
      greenFlags: [],
      evidence: 'No credible medical journal has published this research. The website has no medical credentials.',
      sourceUrl: 'https://healthnewstoday.com'
    }
  },
  {
    id: '2',
    type: 'text',
    content: 'Tomorrow will be partly cloudy with a high of 72°F and a low of 58°F. There is a 20% chance of rain in the afternoon. Stay safe and have a great day!',
    author: {
      name: 'National Weather Service',
      handle: 'nws',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=N',
      verified: true
    },
    timestamp: '4h',
    engagement: {
      likes: 234,
      shares: 45,
      comments: 12
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: ['Verified account', 'Official domain', 'Balanced language', 'Factual claims'],
      evidence: 'Official government weather service with verified meteorological data.',
      sourceUrl: 'https://weather.gov'
    }
  },
  {
    id: '3',
    type: 'image',
    content: 'How to fry an egg! Step 1: Heat pan. Step 2: Crack pan. Step 3: Pouk egg. Step 4: Egg. Step 5: Fry egg.',
    imageUrl: '/images/ai_fry_egg_post.png',
    author: {
      name: 'Jaffar Naikoo',
      handle: 'cursed_ai',
      profilePic: 'https://via.placeholder.com/48/FFB347/FFFFFF?text=J',
      verified: false
    },
    timestamp: '3d',
    engagement: {
      likes: 214,
      shares: 57,
      comments: 121
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Nonsensical step instructions ("Crack pan", "Pouk egg")',
        'AI-generated cartoonish visuals',
        'Posted by a meme/AI content page, not a credible source',
        'No educational or verifiable source for cooking instructions'
      ],
      greenFlags: [
        'Clearly intended as humor, not misinformation'
      ],
      evidence: 'The image style and incoherent captions are consistent with AI-generated meme content. The post offers no real cooking instruction and originates from an entertainment page.',
      sourceUrl: 'https://facebook.com/CursedAI'
    }
  },
  {
    id: '4',
    type: 'text',
    content: 'New study shows that adults who exercise for at least 150 minutes per week have a 30% lower risk of cardiovascular disease. The research was published in the Journal of Medicine and involved over 10,000 participants.',
    author: {
      name: 'Medical Research Today',
      handle: 'medresearch',
      profilePic: 'https://via.placeholder.com/48/95E1D3/FFFFFF?text=M',
      verified: true
    },
    timestamp: '6h',
    engagement: {
      likes: 456,
      shares: 78,
      comments: 23
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: ['Verified account', 'Factual claims', 'Peer reviewed', 'Balanced language'],
      evidence: 'Published in peer-reviewed medical journal with proper methodology and sample size.',
      sourceUrl: 'https://medicalresearchtoday.com'
    }
  },
  {
    id: '5',
    type: 'text',
    content: 'URGENT: Your bank account will be closed in 24 hours! Click here immediately to verify your account or it will be permanently closed. This is your final warning!',
    author: {
      name: 'Bank Security Alert',
      handle: 'banksecurity',
      profilePic: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=B',
      verified: false
    },
    timestamp: '30m',
    engagement: {
      likes: 12,
      shares: 3,
      comments: 8
    },
    metadata: {
      label: 'fake',
      redFlags: ['Creates false urgency', 'Asks for immediate action', 'Suspicious domain', 'No bank would send this via social media'],
      evidence: 'This is a classic phishing attempt. Real banks never send urgent messages via social media.',
      sourceUrl: 'https://banksecurityalert.com'
    }
  },
  {
    id: '6',
    type: 'text',
    content: 'The Dow Jones Industrial Average closed at 35,000 points today, marking a new record high for the index. Analysts attribute the gains to strong corporate earnings and positive economic indicators.',
    author: {
      name: 'Financial Times',
      handle: 'financialtimes',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=F',
      verified: true
    },
    timestamp: '3h',
    engagement: {
      likes: 678,
      shares: 123,
      comments: 45
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: ['Verified account', 'Factual claims', 'Credible source', 'Balanced language'],
      evidence: 'Reported by multiple credible financial news sources with verifiable market data.',
      sourceUrl: 'https://ft.com'
    }
  },
  {
    id: '7',
    type: 'image',
    content: 'This girl painted a portrait of her late father, but no one cared 😢',
    imageUrl: '/images/storm_girl_ai.png',
    author: {
      name: 'Inspiring Moments',
      handle: 'inspiringmomentsdaily',
      profilePic: '/images/inspiringmoments_profile.png',
      verified: false
    },
    timestamp: '5d',
    engagement: {
      likes: 31500,
      shares: 821,
      comments: 5300
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Emotionally manipulative caption',
        'AI-generated photo with unrealistic details',
        'No verifiable source, date, or identity provided',
        'Overly viral engagement pattern common to fake feel-good posts'
      ],
      greenFlags: [],
      evidence: 'Reverse image search and AI artifact detection reveal synthetic details. The image and caption combination are part of a known trend of AI-generated emotional bait posts with no real story.',
      sourceUrl: 'https://facebook.com/InspiringMoments'
    }
  },
  {
    id: '8',
    type: 'text',
    content: 'The city council voted 7-2 to approve $2.5 million in funding for a new community park in the downtown area. Construction is expected to begin next spring and will include playground equipment, walking trails, and a community center.',
    author: {
      name: 'Local News Daily',
      handle: 'localnews',
      profilePic: 'https://via.placeholder.com/48/95E1D3/FFFFFF?text=L',
      verified: true
    },
    timestamp: '8h',
    engagement: {
      likes: 189,
      shares: 45,
      comments: 23
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: ['Verified account', 'Factual claims', 'Local news source', 'Balanced language'],
      evidence: 'Reported by local newspaper with verifiable city council meeting records.',
      sourceUrl: 'https://localnewsdaily.com'
    }
  },
  {
    id: '9',
    type: 'text',
    content: 'SHOCKING: This common food is actually poison! New research reveals that a food you eat every day is slowly killing you. The government has been hiding this for years!',
    author: {
      name: 'Health Alerts',
      handle: 'healthalerts',
      profilePic: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=H',
      verified: false
    },
    timestamp: '1d',
    engagement: {
      likes: 567,
      shares: 234,
      comments: 89
    },
    metadata: {
      label: 'fake',
      redFlags: ['Uses "SHOCKING" in caps', 'Makes vague claims', 'Conspiracy language', 'No specific food mentioned'],
      greenFlags: [],
      evidence: 'No credible health organization has issued such warnings. The website has no medical credentials.',
      sourceUrl: 'https://healthalerts.org'
    }
  },
  {
    id: '10',
    type: 'text',
    content: 'Clinical trials of the new vaccine show 95% effectiveness in preventing severe illness. The FDA has approved it for emergency use and distribution is expected to begin next month.',
    author: {
      name: 'Reuters',
      handle: 'reuters',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=R',
      verified: true
    },
    timestamp: '12h',
    engagement: {
      likes: 1234,
      shares: 456,
      comments: 123
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: ['Verified account', 'Factual claims', 'Credible news source', 'Balanced language'],
      evidence: 'Reported by Reuters, a highly credible news agency, with verifiable FDA approval data.',
      sourceUrl: 'https://reuters.com'
    }
  },
  {
    id: '11',
    type: 'image',
    content: 'BREAKING: "Generative AI Tutors" are now helping families learn faster than ever before! New studies show that children using AI companions score 95% higher on creativity tests. Parents call it "the future of education."',
    imageUrl: '/images/family_ai.png',
    author: {
      name: 'Future Insight Daily',
      handle: 'futureinsight',
      profilePic: 'https://via.placeholder.com/48/95E1D3/FFFFFF?text=F',
      verified: false
    },
    timestamp: '1d',
    engagement: {
      likes: 1764,
      shares: 402,
      comments: 318
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Overly positive claims with no cited study or source',
        'Buzzwords like "Generative AI Tutors" and "95% higher" without methodology',
        'Hyper-realistic AI-generated image with digital glow effects',
        'No credible educational institution or research body referenced'
      ],
      greenFlags: [
        'Topic aligns with real emerging technology themes (AI education tools)'
      ],
      evidence: 'No research institution has published findings matching these claims. The image contains common AI art artifacts and unrealistic lighting. The post uses exaggerated statistics to increase engagement.',
      sourceUrl: 'https://futureinsightdaily.com/articles/ai-family-learning'
    }
  },
  {
    id: '12',
    type: 'image',
    content: 'Viral influencer "Alyssa Mae" EXPOSED for using AI to generate her photos 😱 — fans say they feel betrayed after learning none of her pictures are real!',
    imageUrl: '/images/influencer_ai.png',
    author: {
      name: 'PopBuzz Network',
      handle: 'popbuzzfeedz',
      profilePic: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=P',
      verified: false
    },
    timestamp: '6h',
    engagement: {
      likes: 12500,
      shares: 1540,
      comments: 4390
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Clickbait title with "EXPOSED" in all caps',
        'Sensational emotional framing ("betrayed fans")',
        'No actual verification of the influencer\'s identity',
        'Engagement farming using outrage and shock'
      ],
      greenFlags: [
        'Addresses a real trend (AI-generated influencer imagery)'
      ],
      evidence: 'The account and influencer name cannot be verified outside social media posts. The image shows typical AI portrait features like smooth lighting and mismatched background blur. No credible source reported this "exposé."',
      sourceUrl: 'https://popbuzzfeedz.com/ai-influencer-exposed'
    }
  },
  {
    id: '13',
    type: 'image',
    content: 'This influencer\'s transformation will SHOCK you! She claims AI helped her "unlock her true beauty" — experts call it digital deception.',
    imageUrl: '/images/influencer_ai1.png',
    author: {
      name: 'Daily Trends Online',
      handle: 'dailytrends',
      profilePic: 'https://via.placeholder.com/48/FFB347/FFFFFF?text=D',
      verified: false
    },
    timestamp: '2d',
    engagement: {
      likes: 8700,
      shares: 1012,
      comments: 2224
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Clickbait phrasing ("will SHOCK you!")',
        'Uses AI portrait with unrealistic facial symmetry and lighting',
        'Ambiguous claim attributed to "experts" without citations',
        'Intentionally vague content to boost engagement'
      ],
      greenFlags: [],
      evidence: 'No named experts or sources back the claim. Reverse image search reveals synthetic portrait origins. The exaggerated headline is optimized for virality rather than truth.',
      sourceUrl: 'https://dailytrends.com/ai-transformation-shock'
    }
  },
  {
    id: '14',
    type: 'image',
    content: 'Zendaya\'s "AI Twin" takes over the internet — fans can\'t tell who\'s real anymore 🤯',
    imageUrl: '/images/zendaya.jpg',
    author: {
      name: 'CelebRadar',
      handle: 'celebradarnews',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=C',
      verified: false
    },
    timestamp: '1d',
    engagement: {
      likes: 58900,
      shares: 6530,
      comments: 12200
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Clickbait framing with celebrity name and "AI Twin" narrative',
        'No verifiable quote or statement from Zendaya or her team',
        'Exploits celebrity likeness to farm engagement',
        'Uses emoji and hyperbolic tone to attract clicks'
      ],
      greenFlags: [
        'References a real public figure (making it more believable)'
      ],
      evidence: 'No reputable entertainment outlet has published this claim. The image and caption follow a known engagement-bait format common on Facebook and TikTok "news" pages.',
      sourceUrl: 'https://celebradar.com/zendaya-ai-twin'
    }
  },
  {
    id: '15',
    type: 'image',
    content: '"Leading doctor reveals the #1 WORST carb you are eating." Click to see which "toxic" carb you must avoid to burn belly fat fast!',
    imageUrl: '/images/doctor_clickabit.png',
    author: {
      name: 'Health Insider Tips',
      handle: 'healthinsidertips',
      profilePic: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=H',
      verified: false
    },
    timestamp: '7h',
    engagement: {
      likes: 4800,
      shares: 1390,
      comments: 2120
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Anonymous "leading doctor" with no name or credentials',
        'Overgeneralized claim ("#1 worst carb")',
        'Weight-loss buzzwords and fear language',
        'Click-through funnel (promises reveal after click)'
      ],
      greenFlags: [],
      evidence: 'No peer-reviewed source cited; phrasing and design match common diet-clickbait ads. Medical advice framed as absolute without context or references.',
      sourceUrl: 'https://healthinsidertips.example/number1-carb'
    }
  }
];

// Utility functions
export const getRandomPosts = (count = 10) => {
  const shuffled = [...mockPosts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get post by ID
export const getPostById = (id) => {
  return mockPosts.find(post => post.id === id);
};

// Get all posts
export const getAllPosts = () => {
  return mockPosts;
};

// Get posts by label
export const getPostsByLabel = (label) => {
  return mockPosts.filter(post => post.metadata.label === label);
};

// Get posts with red flags
export const getPostsWithRedFlags = () => {
  return mockPosts.filter(post => post.metadata.redFlags && post.metadata.redFlags.length > 0);
};

// Get posts with green flags
export const getPostsWithGreenFlags = () => {
  return mockPosts.filter(post => post.metadata.greenFlags && post.metadata.greenFlags.length > 0);
};