// /api/posts endpoints
import express from 'express';
import { mockPosts } from '../data/posts.js';

const router = express.Router();

// Get all posts
router.get('/posts', (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    
    const posts = mockPosts.slice(startIndex, endIndex);
    
    res.json({
      posts,
      total: mockPosts.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch posts',
      details: error.message
    });
  }
});

// Get individual post by ID
router.get('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📥 Fetching post with ID: ${id}`);
    
    const post = mockPosts.find(p => p.id === id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
    }
    
    console.log(`✅ Found post: ${post.author.name} - ${post.content.substring(0, 50)}...`);
    
    res.json(post);
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    res.status(500).json({ 
      error: 'Failed to fetch post',
      details: error.message
    });
  }
});

export default router;
