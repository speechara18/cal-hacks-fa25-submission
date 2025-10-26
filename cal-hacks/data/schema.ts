import { z } from 'zod';

// Simple schema that matches your existing Post interface
export const PostSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image']),
  content: z.string(),
  imageUrl: z.string().optional(),
  author: z.object({
    name: z.string(),
    handle: z.string(),
    profilePic: z.string(),
    verified: z.boolean().optional(),
  }),
  timestamp: z.string(),
  engagement: z.object({
    likes: z.number(),
    shares: z.number(),
    comments: z.number(),
  }),
  metadata: z.object({
    label: z.enum(['real', 'fake', 'opinion', 'sponsored']),
    redFlags: z.array(z.string()).optional(),
    greenFlags: z.array(z.string()).optional(),
    evidence: z.string().optional(),
    sourceUrl: z.string().optional(),
  }),
});

// This gives you TypeScript types automatically
export type Post = z.infer<typeof PostSchema>;

// Simple validation function
export function validatePost(post: unknown) {
  return PostSchema.safeParse(post);
}

// Validation function that returns boolean
export function isValidPost(post: unknown): post is Post {
  return PostSchema.safeParse(post).success;
}

// Get validation errors
export function getValidationErrors(post: unknown): string[] {
  const result = PostSchema.safeParse(post);
  if (result.success) return [];
  
  return result.error.errors.map(err => 
    `${err.path.join('.')}: ${err.message}`
  );
}
