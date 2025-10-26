import { Post } from '@/components/PostCard';

export type PlatformMode = 'twitter' | 'instagram' | 'facebook';

/**
 * Filter posts based on the selected platform mode
 */
export function filterPostsByMode(posts: Post[], mode: PlatformMode): Post[] {
  switch (mode) {
    case 'instagram':
      // Instagram mode only shows posts with images
      return posts.filter(post => post.type === 'image' && post.imageUrl);
    case 'twitter':
    case 'facebook':
    default:
      // Twitter and Facebook show all posts
      return posts;
  }
}

/**
 * Get posts that are suitable for Instagram mode (have images)
 */
export function getInstagramPosts(posts: Post[]): Post[] {
  return posts.filter(post => post.type === 'image' && post.imageUrl);
}

/**
 * Get posts that are suitable for Twitter mode (all posts)
 */
export function getTwitterPosts(posts: Post[]): Post[] {
  return posts;
}

/**
 * Get posts that are suitable for Facebook mode (all posts)
 */
export function getFacebookPosts(posts: Post[]): Post[] {
  return posts;
}

/**
 * Check if there are enough posts for Instagram mode
 */
export function hasEnoughInstagramPosts(posts: Post[], minCount: number = 3): boolean {
  return getInstagramPosts(posts).length >= minCount;
}
