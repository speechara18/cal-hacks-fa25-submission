// cal-hacks/components/InstagramFeedScreen.tsx
// Instagram-specific feed with voice coach integration

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { InstagramPostCard } from './InstagramPostCard';
import { Post } from './PostCard';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { VoiceBotAPI } from '@/api/posts';

interface InstagramFeedScreenProps {
  posts: Post[];
  onPostTap?: (post: Post) => void;
}

export function InstagramFeedScreen({ posts, onPostTap }: InstagramFeedScreenProps) {
  const [voiceBotAPI] = useState(() => new VoiceBotAPI());
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'connecting' | 'connected' | 'listening' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const handlePostTap = (post: Post) => {
    console.log('🎯 InstagramFeedScreen.handlePostTap called');
    console.log('🎯 Post ID:', post.id);
    
    // Directly start voice coach without Alert dialog
    startVoiceCoach(post);
  };

  const startVoiceCoach = async (post: Post) => {
    try {
      console.log('🎤 Starting voice coach for post:', post.id);
      
      setCurrentPost(post);
      setIsVoiceActive(true);
      setVoiceStatus('connecting');
      setErrorMessage(null);

      // Start the voice session
      const result = await voiceBotAPI.startVoiceSession(post.id, post);
      
      console.log('✅ Voice session started:', result);
      setVoiceStatus('connected');

      // After 1 second, show listening state
      setTimeout(() => {
        setVoiceStatus('listening');
      }, 1000);

    } catch (error) {
      console.error('❌ Failed to start voice session:', error);
      setVoiceStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect');
      
      // Show error in modal instead of Alert
      setTimeout(() => {
        setIsVoiceActive(false);
      }, 3000);
    }
  };

  const endVoiceCoach = async () => {
    console.log('🛑 Ending voice session');
    await voiceBotAPI.endVoiceSession();
    setIsVoiceActive(false);
    setCurrentPost(null);
    setVoiceStatus('connecting');
    setErrorMessage(null);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <InstagramPostCard
      post={item}
      onTap={handlePostTap}
    />
  );

  const getStatusMessage = () => {
    switch (voiceStatus) {
      case 'connecting':
        return 'Connecting to voice coach...';
      case 'connected':
        return 'Connected! Starting microphone...';
      case 'listening':
        return "I'm listening. Tell me what you think about this post.";
      case 'error':
        return errorMessage || 'Connection error';
      default:
        return 'Ready';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
        accessibilityLabel="Social media feed"
      />

      {/* Voice Coach Modal */}
      <Modal
        visible={isVoiceActive}
        animationType="slide"
        transparent={true}
        onRequestClose={endVoiceCoach}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>🤖 AI Voice Coach</ThemedText>
            </View>

            {/* Status */}
            <View style={styles.statusContainer}>
              {voiceStatus === 'connecting' || voiceStatus === 'error' ? (
                <ActivityIndicator size="large" color="#007AFF" />
              ) : (
                <View style={[
                  styles.micIcon,
                  voiceStatus === 'listening' && styles.micIconActive
                ]}>
                  <ThemedText style={styles.micIconText}>
                    {voiceStatus === 'listening' ? '🎤' : '✅'}
                  </ThemedText>
                </View>
              )}
              
              <ThemedText style={[
                styles.statusText,
                voiceStatus === 'error' && styles.errorText
              ]}>
                {getStatusMessage()}
              </ThemedText>
            </View>

            {/* Post Preview */}
            {currentPost && (
              <View style={styles.postPreview}>
                <ThemedText style={styles.postPreviewLabel}>
                  Analyzing Post:
                </ThemedText>
                <ThemedText style={styles.postPreviewAuthor}>
                  {currentPost.author.name} (@{currentPost.author.handle})
                </ThemedText>
                <ThemedText style={styles.postPreviewText} numberOfLines={3}>
                  {currentPost.content}
                </ThemedText>
                
                {currentPost.metadata.redFlags && currentPost.metadata.redFlags.length > 0 && (
                  <View style={styles.redFlagsContainer}>
                    {currentPost.metadata.redFlags.slice(0, 3).map((flag, index) => (
                      <View key={index} style={styles.redFlagBadge}>
                        <ThemedText style={styles.redFlagText}>🚩 {flag}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Instructions */}
            {voiceStatus === 'listening' && (
              <View style={styles.instructionsContainer}>
                <ThemedText style={styles.instructionsText}>
                  💡 Speak naturally. The AI will have a conversation with you about media literacy.
                </ThemedText>
              </View>
            )}

            {/* Close Button */}
            <View style={styles.buttonContainer}>
              <ThemedText 
                style={styles.closeButton}
                onPress={endVoiceCoach}
              >
                End Conversation
              </ThemedText>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  feedContainer: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '70%',
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF3B30',
  },
  micIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIconActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  micIconText: {
    fontSize: 40,
  },
  postPreview: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  postPreviewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  postPreviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  postPreviewText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  redFlagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  redFlagBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  redFlagText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  instructionsText: {
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 16,
    borderRadius: 12,
  },
});