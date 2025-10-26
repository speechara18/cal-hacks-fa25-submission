import { z } from 'zod';

export const PostSchema = z.object({
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
export type PostT = z.infer<typeof PostSchema>;

export const CoachReq = z.object({
  postId: z.string(),
  userClickedFlag: z.string()
});
export const CoachRes = z.object({ question: z.string() });

export const AdjudicateReq = z.object({
  postId: z.string(),
  transcript: z.string().min(1)
});
export const AdjudicateRes = z.object({
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
