// cal-hacks/api/posts.ts
// WORKING VERSION WITH EXPO-AV + PCM16 16kHz for OpenAI

import { Post } from '../components/PostCard';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

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
   * Start voice session - connects to backend WebSocket with Instagram-specific handling
   */
  async startVoiceSession(postId: string, postData?: any): Promise<{
    sessionId: string;
    status: string;
  }> {
    try {
      console.log('[VoiceBotAPI] 🎤 Starting voice session for post:', postId);
      console.log('[VoiceBotAPI] 🔧 Environment check:');
      console.log('[VoiceBotAPI] 🔧 EXPO_PUBLIC_WS_URL:', process.env.EXPO_PUBLIC_WS_URL);
      console.log('[VoiceBotAPI] 🔧 Using WS URL:', VoiceBotAPI.wsUrl);

      // Request microphone permissions with retry logic
      let permissionStatus = await Audio.requestPermissionsAsync();
      if (permissionStatus.status !== 'granted') {
        console.log('[VoiceBotAPI] ⚠️ First permission request denied, retrying...');
        // Wait a bit and try again (sometimes needed for Instagram mode)
        await new Promise(resolve => setTimeout(resolve, 1000));
        permissionStatus = await Audio.requestPermissionsAsync();
        
        if (permissionStatus.status !== 'granted') {
          throw new Error('Microphone permission not granted. Please enable microphone access in settings.');
        }
      }

      // Set audio mode for recording with Instagram-specific settings
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true, // Duck other audio when recording
      });

      console.log('[VoiceBotAPI] ✅ Microphone permissions granted');

      // Check if backend is running first
      const backendUrl = VoiceBotAPI.wsUrl.replace('ws://', 'http://').replace('ws:', 'http:');
      try {
        console.log('[VoiceBotAPI] 🔍 Checking backend health at:', backendUrl);
        const healthResponse = await fetch(`${backendUrl}/health`, { 
          method: 'GET'
        });
        console.log('[VoiceBotAPI] ✅ Backend health check passed:', healthResponse.status);
      } catch (healthError) {
        console.warn('[VoiceBotAPI] ⚠️ Backend health check failed, but continuing:', healthError);
      }

      // Connect to backend WebSocket
      const wsUrl = `${VoiceBotAPI.wsUrl}/ws/voice?postId=${postId}`;
      console.log('[VoiceBotAPI] 🔌 Connecting to:', wsUrl);
      console.log('[VoiceBotAPI] 🔌 Base WS URL:', VoiceBotAPI.wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      // Wait for connection with better error handling
      await new Promise<void>((resolve, reject) => {
        if (!this.ws) return reject(new Error('WebSocket not initialized'));

        this.ws.onopen = () => {
          console.log('[VoiceBotAPI] ✅ WebSocket connected successfully');
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('[VoiceBotAPI] ❌ WebSocket connection error:', error);
          console.error('[VoiceBotAPI] ❌ WebSocket URL was:', wsUrl);
          reject(new Error(`WebSocket connection failed. Make sure backend is running on port 3001. URL: ${wsUrl}`));
        };

        this.ws.onclose = (event) => {
          console.log('[VoiceBotAPI] 🔌 WebSocket closed:', event.code, event.reason);
          if (event.code !== 1000) { // Not a normal closure
            reject(new Error(`WebSocket closed unexpectedly: ${event.code} - ${event.reason}`));
          }
        };

        setTimeout(() => {
          reject(new Error(`WebSocket connection timeout after 10 seconds. URL: ${wsUrl}`));
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
        // Check if the data is binary (ArrayBuffer) or text
        let messageData;
        
        if (event.data instanceof ArrayBuffer) {
          // Handle binary audio data
          console.log('[VoiceBotAPI] 🔊 Received binary audio data');
          await this.playAudioChunk(event.data);
          return;
        } else if (typeof event.data === 'string') {
          // Try to parse as JSON
          try {
            messageData = JSON.parse(event.data);
          } catch {
            // If it's not JSON, it might be base64 audio
            console.log('[VoiceBotAPI] 🔊 Received non-JSON data, treating as audio');
            await this.playAudioChunk(event.data);
            return;
          }
        } else {
          console.log('[VoiceBotAPI] ❓ Unknown message type:', typeof event.data);
          return;
        }

        console.log('[VoiceBotAPI] 📩 Received JSON message:', messageData.type);

        switch (messageData.type) {
          case 'response.audio.delta':
            await this.playAudioChunk(messageData.delta);
            break;

          case 'conversation.item.input_audio_transcription.completed':
            console.log('[VoiceBotAPI] 📝 Transcript:', messageData.transcript);
            break;

          case 'response.text.delta':
            console.log('[VoiceBotAPI] 💬 AI:', messageData.delta);
            break;

          case 'error':
            console.error('[VoiceBotAPI] ❌ Error:', messageData.error);
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
   * Start audio recording - Continuous streaming approach
   */
  private async startAudioRecording(): Promise<void> {
    try {
      console.log('[VoiceBotAPI] 🎙️ Starting continuous recording...');

      // Clean up any existing recording first
      if (this.recording) {
        try {
          const status = await this.recording.getStatusAsync();
          if (status.isRecording) {
            await this.recording.stopAndUnloadAsync();
          }
        } catch (error) {
          console.log('[VoiceBotAPI] ⚠️ Cleanup existing recording:', error);
        }
        this.recording = null;
      }

      // Also ensure no other recording is active globally
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
        });
        
        // Small delay to ensure cleanup completes
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log('[VoiceBotAPI] ⚠️ Audio mode setup:', error);
      }

      this.recording = new Audio.Recording();
      
      await this.recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 24000, // 24kHz for OpenAI Realtime API
          numberOfChannels: 1,
          bitRate: 384000, // 384 kbps for 24kHz PCM16
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 24000, // 24kHz for OpenAI Realtime API
          numberOfChannels: 1,
          bitRate: 384000, // 384 kbps for 24kHz PCM16
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 384000, // 384 kbps for 24kHz PCM16
        },
      });

      await this.recording.startAsync();
      this.isRecording = true;

      console.log('[VoiceBotAPI] ✅ Continuous recording started (PCM16 24kHz)');

      // Send audio chunks every 2 seconds to avoid overwhelming OpenAI
      this.recordingInterval = setInterval(async () => {
        await this.sendAudioChunk();
      }, 2000);

    } catch (error) {
      console.error('[VoiceBotAPI] ❌ Recording error:', error);
      throw error;
    }
  }

  /**
   * Send audio chunk to backend - Rolling chunk approach to prevent accumulation
   */
  private async sendAudioChunk(): Promise<void> {
    if (!this.recording || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      const status = await this.recording.getStatusAsync();
      
      if (status.isRecording && status.durationMillis > 0) {
        // Get the current recording URI without stopping
        const uri = this.recording.getURI();
        
        if (uri) {
          // Read the audio file
          const base64Audio = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
          });

          // Send raw audio data (not JSON)
          if (base64Audio && base64Audio.length > 0) {
            // Convert base64 to ArrayBuffer for raw PCM data
            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            // Strip WAV header (first 44 bytes) to get pure PCM data
            const pcmData = bytes.slice(44);
            
            // Debug: Log WAV header info
            if (bytes.length >= 44) {
              const header = bytes.slice(0, 44);
              const sampleRate = (header[24] | (header[25] << 8) | (header[26] << 16) | (header[27] << 24));
              const channels = header[22] | (header[23] << 8);
              const bitsPerSample = header[34] | (header[35] << 8);
              console.log(`[VoiceBotAPI] 🔍 WAV Header: ${sampleRate}Hz, ${channels}ch, ${bitsPerSample}bit`);
            }
            
            // Send raw PCM data (no WAV headers) as OpenAI expects
            if (pcmData.length > 0 && pcmData.length < 500000) { // Increased limit for 24kHz
              // Send raw PCM data (no WAV headers)
              this.ws.send(pcmData);
              console.log(`[VoiceBotAPI] 📤 Sent PCM chunk (${pcmData.length} bytes PCM, stripped ${bytes.length - pcmData.length} byte WAV header)`);
            } else if (pcmData.length >= 500000) {
              console.log(`[VoiceBotAPI] ⚠️ Skipping large audio chunk (${pcmData.length} bytes) to avoid overwhelming OpenAI`);
            }
          }
        }
      }
    } catch (error) {
      console.error('[VoiceBotAPI] ❌ Send chunk error:', error);
    }
  }

  /**
   * Play audio chunk from backend - handles multiple data types
   */
  private async playAudioChunk(audioData: string | ArrayBuffer): Promise<void> {
    try {
      let pcmData: Uint8Array;

      if (audioData instanceof ArrayBuffer) {
        // Convert ArrayBuffer to Uint8Array
        pcmData = new Uint8Array(audioData);
      } else if (typeof audioData === 'string') {
        // Convert base64 string to Uint8Array
        const binaryString = atob(audioData);
        pcmData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          pcmData[i] = binaryString.charCodeAt(i);
        }
      } else {
        console.error('[VoiceBotAPI] ❌ Unknown audio data type:', typeof audioData);
        return;
      }

      // Create WAV header for playback
      const wavData = this.createWavFile(pcmData);
      const base64 = btoa(String.fromCharCode(...wavData));
      const dataUri = `data:audio/wav;base64,${base64}`;

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
   * Create WAV file from PCM data
   */
  private createWavFile(pcmData: Uint8Array): Uint8Array {
    const sampleRate = 16000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = pcmData.length;
    const fileSize = 36 + dataSize;

    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF header
    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, fileSize, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"

    // fmt chunk
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true); // chunk size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, dataSize, true);

    // Combine header and PCM data
    const wavFile = new Uint8Array(44 + dataSize);
    wavFile.set(new Uint8Array(header), 0);
    wavFile.set(pcmData, 44);

    return wavFile;
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