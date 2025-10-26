import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

/**
 * Initialize WebSocket server for voice analysis
 * @param {http.Server} server - HTTP server instance
 * @param {Array} posts - Array of post data
 */
export function initializeVoiceWebSocket(server, posts) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws/voice' 
  });
  
  console.log('🔌 Voice WebSocket initialized at /ws/voice');

  wss.on('connection', async (ws, req) => {
    const clientId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
    console.log(`[WS] Client connected: ${clientId}`);
    
    // Parse postId from URL
    const url = new URL(req.url, 'http://localhost');
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      console.error(`[WS] No postId provided`);
      ws.send(JSON.stringify({ type: 'error', error: { message: 'postId required in URL' } }));
      ws.close(1008);
      return;
    }
    
    // Load post data
    const post = posts.find(p => p.post_id === postId);
    if (!post) {
      console.error(`[WS] Invalid postId: ${postId}`);
      ws.send(JSON.stringify({ type: 'error', error: { message: 'Invalid postId' } }));
      ws.close(1008);
      return;
    }
    
    console.log(`[WS] Analyzing post ${postId}: "${post.content.text?.substring(0, 50)}..."`);
    
    // Build instructions with post context
    const instructions = buildInstructions(post);
    
    let openaiWs = null;
    
    try {
        // Connect directly to OpenAI Realtime API WebSocket
        const model = 'gpt-4o-realtime-preview-2024-10-01';
        const url = `wss://api.openai.com/v1/realtime?model=${model}`;
        
        openaiWs = new WebSocket(url, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        });
        
        // Wait for connection to open
        await new Promise((resolve, reject) => {
          openaiWs.once('open', resolve);
          openaiWs.once('error', reject);
        });
    
      console.log(`[WS] Connected to OpenAI for ${clientId}`);
      
      // Configure session
      openaiWs.send(JSON.stringify({
        type: 'session.update',
        session: {
          instructions: instructions,
          voice: 'alloy',
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: {
            model: 'whisper-1'
          },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500
          }
        }
      }));
      
      console.log(`[WS] Sent session configuration`);
    
      // Relay client -> OpenAI
      ws.on('message', (data) => {
        try {
          const message = data.toString();
          const parsed = JSON.parse(message);
          console.log(`[WS] Client -> OpenAI: ${parsed.type}`);
          openaiWs.send(message);
        } catch (err) {
          console.error(`[WS] Error relaying:`, err);
        }
      });
    
      // Relay OpenAI -> client
      openaiWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          console.log(`[WS] OpenAI -> Client: ${parsed.type}`);
          
          if (ws.readyState === ws.OPEN) {
            ws.send(data);
          }
        } catch (err) {
          console.error(`[WS] Error relaying:`, err);
        }
      });
    
      // Handle closes and errors
      openaiWs.on('close', () => {
        console.log(`[WS] OpenAI closed for ${clientId}`);
        if (ws.readyState === ws.OPEN) ws.close();
      });
    
      openaiWs.on('error', (err) => {
        console.error(`[WS] OpenAI error:`, err);
        if (ws.readyState === ws.OPEN) ws.close(1011);
      });
    
      ws.on('close', () => {
        console.log(`[WS] Client ${clientId} disconnected`);
        if (openaiWs) openaiWs.close();
      });
    
      ws.on('error', (err) => {
        console.error(`[WS] Client error:`, err);
        if (openaiWs) openaiWs.close();
      });
    
    } catch (err) {
      console.error(`[WS] Failed to connect to OpenAI:`, err);
      ws.send(JSON.stringify({ type: 'error', error: { message: 'Failed to connect to OpenAI' } }));
      ws.close(1011);
    }
  });

  return wss;
}

/**
 * Build OpenAI instructions with post context
 */
function buildInstructions(post) {
  return `You are a Socratic media literacy coach. Your goal is to guide the user to identify misinformation through questions and encouragement.

POST DATA (Complete Analysis):
${JSON.stringify(post, null, 2)}

CONTEXT:
- This post has been pre-analyzed with red flags (signs of misinformation) and green flags (signs of credibility)
- The user does NOT know these flags yet
- Your job is to guide them to discover these signals themselves through Socratic questioning

YOUR ROLE:
1. Start by asking: "What do you think about this post? Is it credible or misleading, and why?"
2. Listen carefully to their response
3. Ask probing Socratic questions based on what they say:
   - If they mention a red flag, encourage: "Good eye! What else concerns you?"
   - If they miss obvious red flags, guide: "What do you notice about the headline/source/claims?"
4. Keep responses concise (1-2 sentences per turn)
5. Be supportive and educational, not judgmental
6. After 2-3 exchanges, provide final analysis:
   - What they correctly identified
   - What they missed
   - Key learning points from the red/green flags

Remember: Guide them to discover the truth through questions, don't just tell them the answer.`;
}