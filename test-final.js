import WebSocket from 'ws';

console.log('🧪 Testing WebSocket with postId=1...\n');

const ws = new WebSocket('ws://localhost:3001/ws/voice?postId=1');

ws.on('open', () => {
  console.log('✅ Connected to WebSocket!');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log(`📨 Received: ${msg.type}`);
  
  if (msg.type === 'session.created') {
    console.log('✅ Session created!');
  }
  
  if (msg.type === 'session.updated') {
    console.log('✅ Session configured with post context!');
  }
  
  if (msg.type === 'error') {
    console.error('❌ Error:', msg.error);
  }
});

ws.on('error', (err) => {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', () => {
  console.log('🔌 Connection closed\n');
  process.exit(0);
});

// Close after 5 seconds
setTimeout(() => {
  console.log('\n⏱️  Test complete - closing connection');
  ws.close();
}, 5000);