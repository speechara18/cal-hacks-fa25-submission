// cal-hacks/api/posts.ts
// WORKING VERSION WITH EXPO-AV + PCM16 16kHz for OpenAI

import { Post } from '../components/PostCard';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// ============================================================================
// PostsAPI - Fetch posts from backend
// ============================================================================
export class PostsAPI {
  private static baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

  static async getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
    try {
      console.log(`📡 Fetching posts from backend: ${this.baseUrl}/posts`);
      const response = await fetch(`${this.baseUrl}/posts?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const posts = Array.isArray(data) ? data : (data.posts || []);
      console.log(`✅ Received ${posts.length} posts from backend`);
      return posts;
    } catch (error) {
      console.error('❌ Error fetching posts from backend:', error);
      throw error;
    }
  }

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
      console.log(`✅ Received post ${id} from backend`);
      return post;
    } catch (error) {
      console.error(`❌ Error fetching post ${id} from backend:`, error);
      throw error;
    }
  }
}

// ============================================================================
// VoiceBotAPI - Voice recording with expo-av + WebSocket
// ============================================================================
export class VoiceBotAPI {
  private ws: WebSocket | null = null;
  private static wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001';
  private recording: Audio.Recording | null = null;
  private isRecording: boolean = false;
  private recordingInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Start voice session - connects to backend WebSocket
   */
  async startVoiceSession(postId: string, postData?: any): Promise<{
    sessionId: string;
    status: string;
  }> {
    try {
      console.log('[VoiceBotAPI] 🎤 Starting voice session for post:', postId);

      // Request microphone permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      console.log('[VoiceBotAPI] ✅ Microphone permissions granted');

      // Connect to backend WebSocket
      const wsUrl = `${VoiceBotAPI.wsUrl}/ws/voice?postId=${postId}`;
      console.log('[VoiceBotAPI] 🔌 Connecting to:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        if (!this.ws) return reject(new Error('WebSocket not initialized'));

        this.ws.onopen = () => {
          console.log('[VoiceBotAPI] ✅ WebSocket connected');
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('[VoiceBotAPI] ❌ WebSocket error:', error);
          reject(new Error('WebSocket connection failed'));
        };

        setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);
      });

      // Set up message handling
      this.setupMessageHandling();

      // Start recording
      await this.startAudioRecording();

      return {
        sessionId: `session-${postId}-${Date.now()}`,
        status: 'connected',
      };
    } catch (error) {
      console.error('[VoiceBotAPI] ❌ Error starting session:', error);
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Set up WebSocket message handling
   */
  private setupMessageHandling(): void {
    if (!this.ws) return;

    this.ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[VoiceBotAPI] 📩 Received:', message.type);

        switch (message.type) {
          case 'response.audio.delta':
            await this.playAudioChunk(message.delta);
            break;

          case 'conversation.item.input_audio_transcription.completed':
            console.log('[VoiceBotAPI] 📝 Transcript:', message.transcript);
            break;

          case 'response.text.delta':
            console.log('[VoiceBotAPI] 💬 AI:', message.delta);
            break;

          case 'error':
            console.error('[VoiceBotAPI] ❌ Error:', message.error);
            break;
        }
      } catch (error) {
        console.error('[VoiceBotAPI] ❌ Message error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('[VoiceBotAPI] 🔌 WebSocket closed');
    };
  }

  /**
   * Start audio recording - PCM16 16kHz for OpenAI
   */
  private async startAudioRecording(): Promise<void> {
    try {
      console.log('[VoiceBotAPI] 🎙️ Starting recording...');

      this.recording = new Audio.Recording();
      
      await this.recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000, // 16kHz for OpenAI
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000, // 16kHz for OpenAI
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });

      await this.recording.startAsync();
      this.isRecording = true;

      console.log('[VoiceBotAPI] ✅ Recording started (PCM16 16kHz)');

      // Send audio chunks every 1 second
      this.recordingInterval = setInterval(async () => {
        await this.sendAudioChunk();
      }, 1000);

    } catch (error) {
      console.error('[VoiceBotAPI] ❌ Recording error:', error);
      throw error;
    }
  }

  /**
   * Send audio chunk to backend
   */
  private async sendAudioChunk(): Promise<void> {
    if (!this.recording || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      const status = await this.recording.getStatusAsync();
      
      if (status.isRecording && status.durationMillis > 0) {
        // Stop to get the file
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        
        if (uri) {
          // Read as base64
          const base64Audio = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
          });

          // Send to backend
          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
          }));

          console.log('[VoiceBotAPI] 📤 Sent audio chunk');
        }

        // Restart recording for next chunk
        this.recording = new Audio.Recording();
        await this.recording.prepareToRecordAsync({
          android: {
            extension: '.wav',
            outputFormat: Audio.AndroidOutputFormat.DEFAULT,
            audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/wav',
            bitsPerSecond: 128000,
          },
        });
        await this.recording.startAsync();
      }
    } catch (error) {
      console.error('[VoiceBotAPI] ❌ Send chunk error:', error);
    }
  }

  /**
   * Play audio chunk from backend using data URI
   */
  private async playAudioChunk(base64Audio: string): Promise<void> {
    try {
      // Create data URI (no file needed)
      const dataUri = `data:audio/wav;base64,${base64Audio}`;

      const { sound } = await Audio.Sound.createAsync(
        { uri: dataUri },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      console.log('[VoiceBotAPI] 🔊 Playing response');
    } catch (error) {
      console.error('[VoiceBotAPI] ❌ Play error:', error);
    }
  }

  /**
   * End voice session
   */
  async endVoiceSession(): Promise<void> {
    console.log('[VoiceBotAPI] 🛑 Ending session');
    await this.cleanup();
  }

  /**
   * Cleanup all resources
   */
  private async cleanup(): Promise<void> {
    this.isRecording = false;

    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }

    if (this.recording) {
      try {
        const status = await this.recording.getStatusAsync();
        if (status.isRecording) {
          await this.recording.stopAndUnloadAsync();
        }
      } catch (error) {
        console.error('[VoiceBotAPI] ❌ Cleanup recording error:', error);
      }
      this.recording = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    console.log('[VoiceBotAPI] ✅ Cleanup complete');
  }

  /**
   * Get connection status
   */
  getStatus(): string {
    if (!this.ws) return 'idle';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'idle';
      default:
        return 'idle';
    }
  }
}