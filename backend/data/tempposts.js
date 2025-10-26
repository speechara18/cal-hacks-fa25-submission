// Additional posts with real images for better realism
export const tempPosts = [
  {
    id: '16',
    type: 'image',
    content: 'Ending polio still possible, health officials say, as funding cut by 30%. Despite major funding reductions, health experts report that polio eradication efforts can continue in key countries. Essential vaccination campaigns will persist, though lower-risk areas face reduced support.',
    imageUrl: '/images/polio_article.png',
    author: {
      name: 'Jennifer Rigby',
      handle: 'reuters_health',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=R',
      verified: true
    },
    timestamp: '3h',
    engagement: {
      likes: 854,
      shares: 192,
      comments: 64
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: [
        'Published by reputable news agency (Reuters)',
        'Cites named health officials and verifiable data',
        'Provides nuanced and factual reporting',
        'Includes timestamp, author, and photo credit'
      ],
      evidence: 'Reuters is a globally recognized news organization with established editorial standards. The article provides verifiable quotes, author attribution, and an image with a licensed credit.',
      sourceUrl: 'https://www.reuters.com/business/healthcare-pharmaceuticals/ending-polio-still-possible-health-officials-say-funding-cut-30-2025-10-22/'
    }
  },
  {
    id: '17',
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
        'Nonsensical step instructions (“Crack pan”, “Pouk egg”)',
        'AI-generated cartoonish visuals',
        'Posted by a meme/AI content page, not a credible source',
        'No educational or verifiable source for cooking instructions'
      ],
      greenFlags: [
        'Clearly intended as humor, not misinformation'
      ],
      evidence: 'The image style and incoherent captions are consistent with AI-generated meme content. The post offers no real cooking instruction and originates from an entertainment page.',
      sourceUrl: 'https://facebook.com/CursedAI' // or omit if not needed
    }
  },
  {
    id: '18',
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
      sourceUrl: 'https://facebook.com/InspiringMoments' // optional placeholder
    }
  },
  {
    id: '19',
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
        'Buzzwords like “Generative AI Tutors” and “95% higher” without methodology',
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
    id: '20',
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
        'Clickbait title with “EXPOSED” in all caps',
        'Sensational emotional framing (“betrayed fans”)',
        'No actual verification of the influencer’s identity',
        'Engagement farming using outrage and shock'
      ],
      greenFlags: [
        'Addresses a real trend (AI-generated influencer imagery)'
      ],
      evidence: 'The account and influencer name cannot be verified outside social media posts. The image shows typical AI portrait features like smooth lighting and mismatched background blur. No credible source reported this “exposé.”',
      sourceUrl: 'https://popbuzzfeedz.com/ai-influencer-exposed'
    }
  },
  {
    id: '21',
    type: 'image',
    content: 'This influencer's transformation will SHOCK you! She claims AI helped her "unlock her true beauty" — experts call it digital deception.',
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
        'Clickbait phrasing (“will SHOCK you!”)',
        'Uses AI portrait with unrealistic facial symmetry and lighting',
        'Ambiguous claim attributed to “experts” without citations',
        'Intentionally vague content to boost engagement'
      ],
      greenFlags: [],
      evidence: 'No named experts or sources back the claim. Reverse image search reveals synthetic portrait origins. The exaggerated headline is optimized for virality rather than truth.',
      sourceUrl: 'https://dailytrends.com/ai-transformation-shock'
    }
  },
  {
    id: '22',
    type: 'image',
    content: 'Zendaya's "AI Twin" takes over the internet — fans can't tell who's real anymore 🤯',
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
        'Clickbait framing with celebrity name and “AI Twin” narrative',
        'No verifiable quote or statement from Zendaya or her team',
        'Exploits celebrity likeness to farm engagement',
        'Uses emoji and hyperbolic tone to attract clicks'
      ],
      greenFlags: [
        'References a real public figure (making it more believable)'
      ],
      evidence: 'No reputable entertainment outlet has published this claim. The image and caption follow a known engagement-bait format common on Facebook and TikTok “news” pages.',
      sourceUrl: 'https://celebradar.com/zendaya-ai-twin'
    }
  },
  {
    id: '23',
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
        'Anonymous “leading doctor” with no name or credentials',
        'Overgeneralized claim (“#1 worst carb”)',
        'Weight-loss buzzwords and fear language',
        'Click-through funnel (promises reveal after click)'
      ],
      greenFlags: [],
      evidence: 'No peer-reviewed source cited; phrasing and design match common diet-clickbait ads. Medical advice framed as absolute without context or references.',
      sourceUrl: 'https://healthinsidertips.example/number1-carb'
    }
  },
  {
    id: '24',
    type: 'image',
    content: 'BREAKING: "Coolest Dog Alive" becomes first French bulldog to land a brand deal worth $2M 😎 #InfluencerPup',
    imageUrl: '/images/dog_photo_ai.png',
    author: {
      name: 'Pup Central',
      handle: 'pupcentral',
      profilePic: 'https://via.placeholder.com/48/95E1D3/FFFFFF?text=P',
      verified: false
    },
    timestamp: '3d',
    engagement: {
      likes: 16200,
      shares: 2100,
      comments: 3900
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'Absurd financial claim with no source',
        'AI-generated pet photo (unrealistic lighting/textures)',
        'Engagement-bait hashtags and exaggerated headline'
      ],
      greenFlags: [
        'Likely intended as humor/meme content'
      ],
      evidence: 'No press release or brand confirmation; reverse image search points to synthetic origin. Caption uses classic virality hooks rather than verifiable information.',
      sourceUrl: 'https://pupcentral.example/coolest-dog-alive'
    }
  },
  {
    id: '25',
    type: 'image',
    content: '"I WILL HAM BE BE BACK!" — this "inspirational" military comic is going viral for all the wrong reasons 🇺🇸',
    imageUrl: '/images/military_ai.png',
    author: {
      name: 'Patriot Moments',
      handle: 'patriotmoments',
      profilePic: 'https://via.placeholder.com/48/FFB347/FFFFFF?text=P',
      verified: false
    },
    timestamp: '4d',
    engagement: {
      likes: 9200,
      shares: 1780,
      comments: 3420
    },
    metadata: {
      label: 'fake',
      redFlags: [
        'AI-generated comic with gibberish text (“I will ham be be back”)',
        'Mimics emotional patriot content to attract engagement',
        'No identifiable artist or source credit',
        'Visually incoherent elements typical of AI art (text distortion, inconsistent faces)'
      ],
      greenFlags: [
        'Appears to mimic nostalgic patriotic art style'
      ],
      evidence: 'Image shows multiple AI artifacts such as warped lettering and anatomical inconsistencies. Post uses sentimental framing (“inspirational”) but provides no context or authorship.',
      sourceUrl: 'https://facebook.com/patriotmoments'
    }
  },
  {
    id: '26',
    type: 'image',
    content: 'Jamaica braces as rapidly intensifying Hurricane Melissa creeps toward island. Melissa expected to make landfall as Category 4 hurricane, bringing floods and landslides across the Caribbean.',
    imageUrl: '/images/jamaica_reuters.png',
    author: {
      name: 'Maria Cardona & Zahra Burton',
      handle: 'reuters_news',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=R',
      verified: true
    },
    timestamp: '8m',
    engagement: {
      likes: 1210,
      shares: 203,
      comments: 142
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: [
        'Published by reputable outlet (Reuters)',
        'Bylined journalists with timestamp',
        'Specific hurricane name and meteorological data',
        'Includes quotes from official weather agencies'
      ],
      evidence: 'Reuters article verified through official site. Provides sourced meteorological data and context for evacuation advisories.',
      sourceUrl: 'https://www.reuters.com/business/environment/tropical-storm-melissa-hurricane-jamaica-2025-10-25/'
    }
  },
  {
    id: '27',
    type: 'image',
    content: 'Picasso portrait of muse Dora Maar, long hidden from view, sells for $37 million. The rediscovered "Bust of a Woman in a Flowery Hat" was auctioned in Paris after eight decades.',
    imageUrl: '/images/picasso_article.png',
    author: {
      name: 'The Associated Press',
      handle: 'npr_art',
      profilePic: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=A',
      verified: true
    },
    timestamp: '1d',
    engagement: {
      likes: 2320,
      shares: 318,
      comments: 271
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: [
        'Published by NPR, citing The Associated Press',
        'Includes author attribution and timestamp',
        'Contains factual sale figures and auction details',
        'Cites identifiable individuals (Agnes Sevestre-Barbe, Dora Maar)'
      ],
      evidence: 'Cross-verified through NPR and Associated Press official releases. Provides detailed factual reporting on the art sale.',
      sourceUrl: 'https://www.npr.org/2025/10/25/picasso-portrait-dora-maar-sells-37-million'
    }
  },
  {
    id: '28',
    type: 'image',
    content: 'Vibes from last night's show 🎶✨ Loved every moment with this incredible band.',
    imageUrl: '/images/real_insta1.jpg',
    author: {
      name: 'Simone Harper',
      handle: 'simoneharpermusic',
      profilePic: 'https://via.placeholder.com/48/95E1D3/FFFFFF?text=S',
      verified: true
    },
    timestamp: '1d',
    engagement: {
      likes: 4100,
      shares: 142,
      comments: 390
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: [
        'Authentic photo from identifiable event',
        'Natural lighting and composition',
        'No sensational or misleading caption',
        'Consistent engagement for a verified artist account'
      ],
      evidence: 'Image appears candid and verifiable from real social profiles. No AI artifacts or exaggerated claims present.',
      sourceUrl: 'https://instagram.com/simoneharpermusic'
    }
  },
  {
    id: '29',
    type: 'image',
    content: 'Still can't believe it 💍❤️',
    imageUrl: '/images/real_insta2.jpg',
    author: {
      name: 'Ava Morgan',
      handle: 'avamorgan',
      profilePic: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=A',
      verified: true
    },
    timestamp: '3d',
    engagement: {
      likes: 18600,
      shares: 210,
      comments: 1200
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: [
        'Authentic user-generated post',
        'Emotionally personal tone typical of lifestyle accounts',
        'No marketing or misinformation intent',
        'Consistent lighting and natural hand detail'
      ],
      evidence: 'Appears consistent with authentic engagement posts; image quality and metadata match normal camera usage rather than AI.',
      sourceUrl: 'https://instagram.com/avamorgan'
    }
  },
  {
    id: '30',
    type: 'image',
    content: 'Made a new friend today 🦒💛',
    imageUrl: '/images/real_insta3.jpg',
    author: {
      name: 'KimKardashian',
      handle: 'kimK',
      profilePic: 'https://via.placeholder.com/48/FFB347/FFFFFF?text=K',
      verified: false
    },
    timestamp: '5d',
    engagement: {
      likes: 9800,
      shares: 145,
      comments: 678
    },
    metadata: {
      label: 'real',
      redFlags: [],
      greenFlags: [
        'Unedited outdoor lighting',
        'Casual pose and candid expressions',
        'No commercial or fabricated elements',
        'Verifiable environment (zoo/enclosure visible)'
      ],
      evidence: 'Photo lacks AI hallmarks (blended textures, warped anatomy). Caption aligns with normal user sharing patterns.',
      sourceUrl: 'https://instagram.com/leahandkara'
    }
  }
];