import Groq from 'groq-sdk';
import { buildAnalysisPrompt } from '../utils/prompts.js';

// Don't instantiate here - do it inside the function instead
let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

export async function analyzeUserResponse(postJson, userText) {
  try {
    console.log('🤖 Calling Groq/Llama...');
    
    const groq = getGroqClient(); // Get client here, after dotenv has loaded
    
    const prompt = buildAnalysisPrompt(postJson, userText);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a media literacy expert. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });
    
    const responseText = completion.choices[0].message.content;
    const result = JSON.parse(responseText);
    
    console.log('✅ Groq response received');
    return result;
  } catch (error) {
    console.error('❌ Groq API error:', error.message);
    throw new Error(`Groq API failed: ${error.message}`);
  }
}