import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

export interface Post {
  id: string;
  type: 'text' | 'image';
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    handle: string;
    profilePic: string;
    verified?: boolean;
  };
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  // Hidden metadata for voice bot
  metadata: {
    label: 'real' | 'fake' | 'opinion' | 'sponsored';
    redFlags?: string[];
    evidence?: string;
    sourceUrl?: string;
  };
}

interface PostCardProps {
  post: Post;
  onTap: (post: Post) => void;
  onAuthorTap?: (post: Post) => void;
  onProfilePicTap?: (post: Post) => void;
  onAuthorNameTap?: (post: Post) => void;
  onContentTap?: (post: Post) => void;
  onImageTap?: (post: Post) => void;
  onEngagementTap?: (post: Post, type: 'like' | 'share' | 'comment') => void;
}

export function PostCard({ 
  post, 
  onTap, 
  onAuthorTap, 
  onProfilePicTap,
  onAuthorNameTap,
  onContentTap, 
  onImageTap, 
  onEngagementTap 
}: PostCardProps) {
  const formatEngagement = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimestamp = (timestamp: string) => {
    // For now, just return the timestamp as-is
    // In a real app, you'd parse and format this
    return timestamp;
  };

  return (
    <View style={styles.container}>
      {/* Header with profile info */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            onPress={() => {
              if (onProfilePicTap) {
                onProfilePicTap(post);
              } else if (onAuthorTap) {
                onAuthorTap(post);
              } else {
                onTap(post);
              }
            }}
            accessibilityLabel={`View ${post.author.name}'s profile picture`}
            accessibilityRole="button"
          >
            <Image 
              source={{ uri: post.author.profilePic }} 
              style={styles.profilePic}
              accessibilityLabel={`${post.author.name}'s profile picture`}
            />
          </TouchableOpacity>
          <View style={styles.authorInfo}>
            <TouchableOpacity 
              style={styles.authorNameContainer}
              onPress={() => {
                if (onAuthorNameTap) {
                  onAuthorNameTap(post);
                } else if (onAuthorTap) {
                  onAuthorTap(post);
                } else {
                  onTap(post);
                }
              }}
              accessibilityLabel={`View ${post.author.name}'s profile`}
              accessibilityRole="button"
            >
              <ThemedText style={styles.authorName}>{post.author.name}</ThemedText>
              {post.author.verified && (
                <IconSymbol name="house.fill" size={16} color="#1DA1F2" />
              )}
            </TouchableOpacity>
            <ThemedText style={styles.authorHandle}>@{post.author.handle}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.timestamp}>{formatTimestamp(post.timestamp)}</ThemedText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={() => onContentTap?.(post) || onTap(post)}
          accessibilityLabel="Post content"
          accessibilityRole="button"
        >
          <ThemedText style={styles.postText} numberOfLines={0}>
            {post.content}
          </ThemedText>
        </TouchableOpacity>
        
        {post.type === 'image' && post.imageUrl && (
          <TouchableOpacity 
            onPress={() => onImageTap?.(post) || onTap(post)}
            accessibilityLabel="Post image"
            accessibilityRole="button"
          >
            {(() => {
              const fullImageUrl = `http://localhost:3001${post.imageUrl}`;
              console.log('🖼️  PostCard - Constructing image URL:', {
                postId: post.id,
                originalUrl: post.imageUrl,
                fullUrl: fullImageUrl,
                postType: post.type
              });
              return (
                <Image 
                  source={{ uri: fullImageUrl }} 
                  style={styles.postImage}
                  accessibilityLabel="Post image"
                  onLoad={() => console.log('✅ Image loaded successfully:', fullImageUrl)}
                  onError={(error) => console.log('❌ Image failed to load:', fullImageUrl, error.nativeEvent)}
                  onLoadStart={() => console.log('🔄 Image loading started:', fullImageUrl)}
                />
              );
            })()}
          </TouchableOpacity>
        )}
      </View>

      {/* Engagement metrics */}
      <View style={styles.engagement}>
        <TouchableOpacity 
          style={styles.engagementItem}
          onPress={() => onEngagementTap?.(post, 'like') || onTap(post)}
          accessibilityLabel={`Like post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="house.fill" size={20} color="#666666" />
          <ThemedText style={styles.engagementText}>{formatEngagement(post.engagement.likes)}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.engagementItem}
          onPress={() => onEngagementTap?.(post, 'share') || onTap(post)}
          accessibilityLabel={`Share post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="paperplane.fill" size={20} color="#666666" />
          <ThemedText style={styles.engagementText}>{formatEngagement(post.engagement.shares)}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.engagementItem}
          onPress={() => onEngagementTap?.(post, 'comment') || onTap(post)}
          accessibilityLabel={`Comment on post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="chevron.right" size={20} color="#666666" />
          <ThemedText style={styles.engagementText}>{formatEngagement(post.engagement.comments)}</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E1E8ED',
  },
  authorInfo: {
    flex: 1,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  authorHandle: {
    fontSize: 14,
    color: '#657786',
  },
  timestamp: {
    fontSize: 14,
    color: '#657786',
  },
  content: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#E1E8ED',
  },
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F7F9FA',
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  engagementText: {
    fontSize: 14,
    color: '#657786',
    fontWeight: '500',
  },
});

