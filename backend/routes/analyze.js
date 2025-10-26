// /api/analyze-response endpoint - to be implemented
import express from 'express';
import { analyzeUserResponse } from '../services/llama-service.js';

const router = express.Router();

router.post('/analyze-response', async (req, res) => {
  try {
    const { postJson, userText } = req.body;

    // Validation
    if (!postJson) {
      return res.status(400).json({
        error: 'Missing required field: postJson'
      });
    }

    if (!userText || userText.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required field: userText'
      });
    }

    console.log('📥 Received analysis request');
    console.log('   Post ID:', postJson.id || 'unknown');
    console.log('   User text length:', userText.length);

    // Call Groq/Llama
    const result = await analyzeUserResponse(postJson, userText);

    // Return response
    res.json({
      ...result,
      model: 'llama-3.3-70b-versatile',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in analyze-response:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to analyze response'
    });
  }
});

export default router;
