import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { PostsAPI } from '@/api/posts';
import { Post } from '@/components/PostCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!id) {
      setError('No post ID provided');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postData = await PostsAPI.getPostById(id);
        if (postData) {
          setPost(postData);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Loading post...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !post) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.errorText}>{error || 'Post not found'}</ThemedText>
          <ThemedText style={styles.errorSubtext} onPress={handleBack}>
            Tap to go back
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconSymbol 
          name="chevron.left" 
          size={24} 
          color={Colors[colorScheme ?? 'light'].text}
          onPress={handleBack}
          style={styles.backButton}
        />
        <ThemedText style={styles.headerTitle}>Post Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Author Info */}
        <View style={styles.authorSection}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <ThemedText style={styles.authorInitial}>
                {post.author.name.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.authorDetails}>
              <View style={styles.authorNameRow}>
                <ThemedText style={styles.authorName}>{post.author.name}</ThemedText>
                {post.author.verified && (
                  <IconSymbol name="checkmark.seal.fill" size={16} color={Colors[colorScheme ?? 'light'].tint} />
                )}
              </View>
              <ThemedText style={styles.authorHandle}>@{post.author.handle}</ThemedText>
              <ThemedText style={styles.timestamp}>{post.timestamp}</ThemedText>
            </View>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.contentSection}>
          <ThemedText style={styles.postContent}>{post.content}</ThemedText>
          
          {post.imageUrl && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: `http://localhost:3001${post.imageUrl}` }} 
                style={styles.postImage}
                accessibilityLabel="Post image"
                onLoad={() => console.log('✅ Detail Image loaded successfully:', `http://localhost:3001${post.imageUrl}`)}
                onError={(error) => console.log('❌ Detail Image failed to load:', `http://localhost:3001${post.imageUrl}`, error.nativeEvent)}
                onLoadStart={() => console.log('🔄 Detail Image loading started:', `http://localhost:3001${post.imageUrl}`)}
              />
            </View>
          )}
        </View>

        {/* Engagement Stats */}
        <View style={styles.engagementSection}>
          <View style={styles.engagementItem}>
            <IconSymbol name="heart" size={20} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.engagementText}>{post.engagement.likes}</ThemedText>
          </View>
          <View style={styles.engagementItem}>
            <IconSymbol name="arrow.2.squarepath" size={20} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.engagementText}>{post.engagement.shares}</ThemedText>
          </View>
          <View style={styles.engagementItem}>
            <IconSymbol name="bubble.left" size={20} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.engagementText}>{post.engagement.comments}</ThemedText>
          </View>
        </View>

        {/* Metadata Section */}
        <View style={styles.metadataSection}>
          <ThemedText style={styles.sectionTitle}>Analysis</ThemedText>
          
          {/* Label */}
          <View style={styles.labelContainer}>
            <ThemedText style={[
              styles.label, 
              { color: post.metadata.label === 'fake' ? '#FF6B6B' : '#4ECDC4' }
            ]}>
              {post.metadata.label === 'fake' ? '⚠️ Misinformation' : '✅ Verified'}
            </ThemedText>
          </View>

          {/* Red Flags */}
          {post.metadata.redFlags && post.metadata.redFlags.length > 0 && (
            <View style={styles.flagsContainer}>
              <ThemedText style={styles.flagsTitle}>🚩 Red Flags:</ThemedText>
              {post.metadata.redFlags.map((flag, index) => (
                <ThemedText key={index} style={styles.flagItem}>• {flag}</ThemedText>
              ))}
            </View>
          )}

          {/* Green Flags */}
          {post.metadata.greenFlags && post.metadata.greenFlags.length > 0 && (
            <View style={styles.flagsContainer}>
              <ThemedText style={styles.flagsTitle}>✅ Green Flags:</ThemedText>
              {post.metadata.greenFlags.map((flag, index) => (
                <ThemedText key={index} style={styles.flagItem}>• {flag}</ThemedText>
              ))}
            </View>
          )}

          {/* Evidence */}
          {post.metadata.evidence && (
            <View style={styles.evidenceContainer}>
              <ThemedText style={styles.evidenceTitle}>🔍 Evidence:</ThemedText>
              <ThemedText style={styles.evidenceText}>{post.metadata.evidence}</ThemedText>
            </View>
          )}

          {/* Source URL */}
          {post.metadata.sourceUrl && (
            <View style={styles.sourceContainer}>
              <ThemedText style={styles.sourceTitle}>🔗 Source:</ThemedText>
              <ThemedText style={styles.sourceUrl}>{post.metadata.sourceUrl}</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  authorSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  authorHandle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  contentSection: {
    padding: 16,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    fontSize: 14,
    opacity: 0.7,
  },
  engagementSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  engagementText: {
    marginLeft: 6,
    fontSize: 14,
  },
  metadataSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  flagsContainer: {
    marginBottom: 16,
  },
  flagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  flagItem: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 4,
  },
  evidenceContainer: {
    marginBottom: 16,
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  evidenceText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sourceContainer: {
    marginBottom: 16,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sourceUrl: {
    fontSize: 14,
    color: '#007AFF',
  },
});
