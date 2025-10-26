// Main server file - merged with index.ts functionality
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { initializeVoiceWebSocket } from './routes/voice-ws-handler.js';
//import { AccessToken } from 'livekit-server-sdk';
//import { analyzeUserResponse } from './services/llama-service.js';
//import analyzeRoutes from './routes/analyze.js';
import postsRoutes from './routes/posts.js';
import { createServer } from 'http';

// Import mock posts
import { mockPosts } from './data/posts.js';

// Zod schemas (moved from contracts.ts)
const PostSchema = z.object({
  post_id: z.string(),
  profile: z.object({
    name: z.string(),
    handle: z.string(),
    profile_picture_desc: z.string().optional(),
    account_type: z.enum(['person','organization','advertiser']).optional(),
    followers_count: z.number().optional(),
    account_age_days: z.number().optional(),
  }),
  content: z.object({
    text: z.string().optional(),
    media_desc: z.string().optional(),
    links: z.array(z.object({ display_url: z.string(), https: z.boolean() })).optional()
  }),
  red_flags: z.array(z.string()).default([]),
  green_flags: z.array(z.string()).default([]),
  labels: z.object({
    risk_level: z.enum(['low','medium','high']),
    veracity: z.enum(['verified','unverified','misleading']),
    veracity_confidence_0_1: z.number()
  }),
  explanations: z.object({ tl_dr: z.string().optional() }).optional(),
});

const CoachReq = z.object({
  postId: z.string(),
  userClickedFlag: z.string()
});

const CoachRes = z.object({ question: z.string() });

const AdjudicateReq = z.object({
  postId: z.string(),
  transcript: z.string().min(1)
});

const AdjudicateRes = z.object({
  labels: z.object({
    risk_level: z.enum(['low','medium','high']),
    veracity: z.enum(['verified','unverified','misleading']),
    veracity_confidence_0_1: z.number()
  }),
  signals: z.object({
    toxicity: z.object({ score_0_1: z.number().optional() }).optional(),
    manipulation: z.object({ score_0_1: z.number().optional(), categories: z.array(z.string()).optional() }).optional(),
    credibility: z.object({ score_0_1: z.number().optional() }).optional()
  }),
  explanations: z.object({ tl_dr: z.string() })
});

const app = express();
const PORT = process.env.PORT || 3002;

// Load and validate seed data
// Transform mockPosts to match PostSchema
const posts = mockPosts.map(p => ({
    post_id: p.id,
    profile: {
      name: p.author.name,
      handle: p.author.handle,
      account_type: 'person',
      followers_count: Math.floor(Math.random() * 10000),
    },
    content: {
      text: p.content,
      links: p.metadata.sourceUrl ? [{ display_url: p.metadata.sourceUrl, https: true }] : []
    },
    red_flags: p.metadata.redFlags || [],
    green_flags: p.metadata.greenFlags || [],
    labels: {
      risk_level: p.metadata.label === 'fake' ? 'high' : 'low',
      veracity: p.metadata.label === 'fake' ? 'misleading' : 'verified',
      veracity_confidence_0_1: p.metadata.label === 'fake' ? 0.9 : 0.1
    },
    explanations: {
      tl_dr: p.metadata.evidence
    }
  }));
  
  console.log(`✅ Loaded ${posts.length} mock posts`);

console.log('🔧 Starting server setup...');
console.log('📍 Port:', PORT);

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:19006')
  .split(',')
  .filter(Boolean);

// Add FRONTEND_URL if it exists
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

console.log('✅ Middleware configured');

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    service: 'social-media-hackathon-backend'
  });
});

// Info endpoint
app.get('/info', (req, res) => {
  res.json({
    node_version: process.version,
    env: process.env.NODE_ENV || 'development',
    livekit_configured: !!(process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
    livekit_url: process.env.LIVEKIT_URL || 'not configured',
  });
});

// LiveKit token endpoint
const tokenRequestSchema = z.object({
  room: z.string().min(1, 'Room name is required'),
  identity: z.string().min(1, 'Identity is required'),
  name: z.string().optional(),
  canPublish: z.boolean().optional().default(true),
  canSubscribe: z.boolean().optional().default(true),
});

app.post('/api/token', async (req, res) => {
  try {
    // Validate request body
    const parsed = tokenRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: 'Invalid request',
        details: parsed.error.flatten() 
      });
    }

    const { room, identity, name, canPublish, canSubscribe } = parsed.data;

    // Check environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      console.error('[TOKEN] Missing LiveKit credentials in environment');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'LiveKit credentials not configured'
      });
    }

    // Create access token
    const at = new AccessToken(apiKey, apiSecret, { 
      identity, 
      name: name || identity,
      ttl: 60 * 15  // 15 minutes
    });

    // Add grants
    at.addGrant({
      room,
      roomJoin: true,
      canPublish,
      canSubscribe,
      canPublishData: true,  // For sending metadata/events
      canUpdateOwnMetadata: true,
    });

    const token = await at.toJwt();

    console.log(`[TOKEN] Generated token for ${identity} in room ${room}`);

    return res.json({ 
      token, 
      url: livekitUrl,
      room,
      identity
    });

  } catch (error) {
    console.error('[TOKEN] Error generating token:', error);
    return res.status(500).json({ 
      error: 'Failed to generate token',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Social Media Analysis Endpoints
// GET /api/posts — serves seeded fake posts so FE can render the feed
app.get('/api/posts', (req, res) => {
  console.log(`[POSTS] Serving ${posts.length} posts`);
  res.json(posts);
});

// POST /api/coach — returns a short, context-aware coaching question
app.post('/api/coach', (req, res) => {
  try {
    const parsed = CoachReq.safeParse(req.body);
    if (!parsed.success) {
      console.log('[COACH] Invalid request:', parsed.error.flatten());
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: parsed.error.flatten() 
      });
    }
    
    const { userClickedFlag } = parsed.data;
    const question = `What makes "${userClickedFlag}" suspicious here? Consider source, intent, and evidence.`;
    
    console.log(`[COACH] Generated question for flag: ${userClickedFlag}`);
    return res.json(CoachRes.parse({ question }));
  } catch (error) {
    console.error('[COACH] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/adjudicate — runs Llama + Qwen analysis (stub for now)
app.post('/api/adjudicate', async (req, res) => {
  try {
    const parsed = AdjudicateReq.safeParse(req.body);
    if (!parsed.success) {
      console.log('[ADJUDICATE] Invalid request:', parsed.error.flatten());
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: parsed.error.flatten() 
      });
    }
    
    const { postId, transcript } = parsed.data;
    console.log(`[ADJUDICATE] Processing post ${postId} with transcript: ${transcript.substring(0, 50)}...`);
    
    // TODO: replace with real Llama + Qwen calls
    const stub = {
      labels: { 
        risk_level: 'medium', 
        veracity: 'unverified', 
        veracity_confidence_0_1: 0.55 
      },
      signals: { 
        manipulation: { 
          score_0_1: 0.72, 
          categories: ['clickbait','spammy_cta'] 
        }, 
        credibility: { score_0_1: 0.35 } 
      },
      explanations: { 
        tl_dr: 'Urgent language + shortened link; no credible source given.' 
      }
    };
    
    console.log('[ADJUDICATE] Returning stub analysis');
    return res.json(AdjudicateRes.parse(stub));
  } catch (error) {
    console.error('[ADJUDICATE] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// app.use('/api', analyzeRoutes);
app.use('/api', postsRoutes);

console.log('✅ Routes configured');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

const server = createServer(app);
initializeVoiceWebSocket(server, posts);

// Start server
server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket on ws://localhost:${PORT}/ws/voice`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📱 Posts feed: http://localhost:${PORT}/api/posts`);
    console.log('='.repeat(60));
  }).on('error', (err) => {
    console.error('❌ Server error:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    }
  });