import { Router } from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { z } from 'zod';

const schema = z.object({
  room: z.string().min(1),
  identity: z.string().min(1),
  name: z.string().optional(),
  canPublish: z.boolean().optional().default(true),
  canSubscribe: z.boolean().optional().default(true),
});

export const tokenRouter = Router();

tokenRouter.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { room, identity, name, canPublish, canSubscribe } = parsed.data;

  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;
  const at = new AccessToken(apiKey, apiSecret, { identity, name, ttl: 60 * 15 }); // 15 min

  at.addGrant({
    room,
    roomJoin: true,
    canPublish,
    canSubscribe,
    // add: canPublishData, canUpdateOwnMetadata, etc. if needed
  });

  const jwt = await at.toJwt();
  return res.json({ token: jwt, url: process.env.LIVEKIT_URL });
});
