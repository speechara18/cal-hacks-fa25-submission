import { Post } from './schema';

// Basic feature extraction for Layer 0 heuristics
export function extractBasicFeatures(post: Post) {
  const text = post.content;
  
  // Basic text analysis
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const capsRatio = text.length > 0 ? capsCount / text.length : 0;
  
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  
  // Pattern detection
  const hasUrgentLanguage = /(URGENT|BREAKING|ALERT|WARNING|EMERGENCY|CRISIS)/i.test(text);
  const hasClickbait = /(You won't believe|This will shock|One weird trick|Doctors hate|This changes everything)/i.test(text);
  const hasEmotionalManipulation = /(shocking|amazing|incredible|unbelievable)/i.test(text);
  const hasConspiracyLanguage = /(they don't want you to know|hidden truth|cover-up|conspiracy|wake up)/i.test(text);
  
  // URL analysis
  const urlCount = (text.match(/https?:\/\/[^\s]+/g) || []).length;
  const shortenerCount = (text.match(/bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|short\.link/g) || []).length;
  
  return {
    capsRatio,
    emojiCount,
    exclamationCount,
    questionCount,
    wordCount,
    hasUrgentLanguage,
    hasClickbait,
    hasEmotionalManipulation,
    hasConspiracyLanguage,
    urlCount,
    shortenerCount,
  };
}

// Detect red flags based on extracted features
export function detectRedFlags(post: Post): string[] {
  const features = extractBasicFeatures(post);
  const flags: string[] = [];
  
  // Caps ratio check
  if (features.capsRatio > 0.3) {
    flags.push('High caps ratio');
  }
  
  // Emoji count check
  if (features.emojiCount > 5) {
    flags.push('Too many emojis');
  }
  
  // Exclamation count check
  if (features.exclamationCount > 3) {
    flags.push('Excessive exclamations');
  }
  
  // Pattern-based flags
  if (features.hasUrgentLanguage) {
    flags.push('Urgent language');
  }
  
  if (features.hasClickbait) {
    flags.push('Clickbait headline');
  }
  
  if (features.hasEmotionalManipulation) {
    flags.push('Emotional manipulation');
  }
  
  if (features.hasConspiracyLanguage) {
    flags.push('Conspiracy language');
  }
  
  // URL shortener check
  if (features.shortenerCount > 0) {
    flags.push('URL shortener detected');
  }
  
  // Bot-like behavior (high emoji, low word count)
  if (features.emojiCount > 10 || (features.wordCount < 10 && features.emojiCount > 2)) {
    flags.push('Bot-like behavior');
  }
  
  return flags;
}

// Detect green flags (trustworthy indicators)
export function detectGreenFlags(post: Post): string[] {
  const features = extractBasicFeatures(post);
  const flags: string[] = [];
  
  // Verified account
  if (post.author.verified) {
    flags.push('Verified account');
  }
  
  // Balanced language
  if (features.capsRatio < 0.1 && features.emojiCount < 3) {
    flags.push('Balanced language');
  }
  
  // Factual language indicators
  if (post.content.toLowerCase().includes('according to') || 
      post.content.toLowerCase().includes('source:') ||
      post.content.toLowerCase().includes('study shows')) {
    flags.push('Factual claims');
  }
  
  // No URL shorteners
  if (features.shortenerCount === 0 && features.urlCount > 0) {
    flags.push('Direct links');
  }
  
  // Official domains (basic check)
  if (post.metadata.sourceUrl && 
      (post.metadata.sourceUrl.includes('.gov') || 
       post.metadata.sourceUrl.includes('.edu') || 
       post.metadata.sourceUrl.includes('.org'))) {
    flags.push('Official domain');
  }
  
  return flags;
}

// Calculate a simple risk score (0-1)
export function calculateRiskScore(post: Post): number {
  const features = extractBasicFeatures(post);
  let score = 0;
  
  // Caps ratio contribution (0-0.2)
  score += Math.min(features.capsRatio * 0.5, 0.2);
  
  // Emoji count contribution (0-0.15)
  score += Math.min(features.emojiCount * 0.015, 0.15);
  
  // Exclamation count contribution (0-0.1)
  score += Math.min(features.exclamationCount * 0.03, 0.1);
  
  // Pattern-based contributions
  if (features.hasUrgentLanguage) score += 0.15;
  if (features.hasClickbait) score += 0.15;
  if (features.hasEmotionalManipulation) score += 0.1;
  if (features.hasConspiracyLanguage) score += 0.1;
  if (features.shortenerCount > 0) score += 0.1;
  
  // Account verification bonus (reduces risk)
  if (post.author.verified) score -= 0.2;
  
  return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
}

// Get risk level from score
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score < 0.3) return 'low';
  if (score < 0.7) return 'medium';
  return 'high';
}
