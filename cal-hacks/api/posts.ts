// Backend-ready API structure for posts
// This can be easily replaced with actual API calls

import { Post } from '../components/PostCard';

// Mock API endpoints that can be replaced with real backend calls
export class PostsAPI {
  private static baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Get posts for the feed
  static async getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
    try {
      console.log(`📡 Fetching posts from backend: ${this.baseUrl}/posts`);
      const response = await fetch(`${this.baseUrl}/posts?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Received ${data.length} posts from backend`);
      return data;
    } catch (error) {
      console.error('❌ Error fetching posts from backend:', error);
      throw error; // Don't fallback, let the component handle the error
    }
  }

  // Get a specific post by ID
  static async getPostById(id: string): Promise<Post | null> {
    try {
      console.log(`📡 Fetching post ${id} from backend: ${this.baseUrl}/posts/${id}`);
      const response = await fetch(`${this.baseUrl}/posts/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`❌ Post ${id} not found on backend`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const post = await response.json();
      console.log(`✅ Received post ${id} from backend: ${post.author.name}`);
      return post;
    } catch (error) {
      console.error(`❌ Error fetching post ${id} from backend:`, error);
      throw error; // Don't fallback, let the component handle the error
    }
  }

  // Submit user interaction (for analytics)
  static async logInteraction(postId: string, action: 'view' | 'tap' | 'voice_start' | 'voice_end'): Promise<void> {
    try {
      // In a real app, this would be:
      // await fetch(`${this.baseUrl}/interactions`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ postId, action, timestamp: new Date().toISOString() })
      // });
      
      console.log(`Logged interaction: ${action} for post ${postId}`);
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }

  // Get voice bot context for a post
  static async getVoiceBotContext(postId: string): Promise<{
    post: Post;
    redFlags: string[];
    evidence: string;
    sourceUrl: string;
  } | null> {
    try {
      const post = await this.getPostById(postId);
      if (!post) return null;

      return {
        post,
        redFlags: post.metadata.redFlags || [],
        evidence: post.metadata.evidence || '',
        sourceUrl: post.metadata.sourceUrl || ''
      };
    } catch (error) {
      console.error('Error getting voice bot context:', error);
      return null;
    }
  }
}

// Voice bot integration helpers
export class VoiceBotAPI {
  private static baseUrl = process.env.EXPO_PUBLIC_VOICE_API_URL || 'http://localhost:3001/api';

  // Start a voice session
  static async startSession(postId: string): Promise<{
    sessionId: string;
    roomUrl: string;
    token: string;
  }> {
    try {
      // In a real app, this would integrate with LiveKit and Vapi
      // const response = await fetch(`${this.baseUrl}/voice/start`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ postId })
      // });
      // return await response.json();
      
      // Mock response
      return {
        sessionId: `session_${postId}_${Date.now()}`,
        roomUrl: 'wss://mock-livekit-url.com',
        token: 'mock-token'
      };
    } catch (error) {
      console.error('Error starting voice session:', error);
      throw error;
    }
  }

  // End a voice session
  static async endSession(sessionId: string): Promise<void> {
    try {
      // In a real app, this would be:
      // await fetch(`${this.baseUrl}/voice/end`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ sessionId })
      // });
      
      console.log(`Ended voice session: ${sessionId}`);
    } catch (error) {
      console.error('Error ending voice session:', error);
    }
  }
}
