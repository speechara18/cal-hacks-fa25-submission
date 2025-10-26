import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Post } from './PostCard';

interface InstagramPostCardProps {
  post: Post;
  onTap: (post: Post) => void;
  onAuthorTap?: (post: Post) => void;
  onProfilePicTap?: (post: Post) => void;
  onAuthorNameTap?: (post: Post) => void;
  onContentTap?: (post: Post) => void;
  onImageTap?: (post: Post) => void;
  onEngagementTap?: (post: Post, type: 'like' | 'share' | 'comment') => void;
}

export function InstagramPostCard({ 
  post, 
  onTap, 
  onAuthorTap, 
  onProfilePicTap,
  onAuthorNameTap,
  onContentTap, 
  onImageTap, 
  onEngagementTap 
}: InstagramPostCardProps) {
  const formatEngagement = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header with profile info - Instagram style */}
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
                <IconSymbol name="house.fill" size={14} color="#1DA1F2" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <IconSymbol name="ellipsis" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Main image - Instagram style */}
      {post.type === 'image' && post.imageUrl && (
        <TouchableOpacity 
          onPress={() => onImageTap?.(post) || onTap(post)}
          accessibilityLabel="Post image"
          accessibilityRole="button"
        >
          <Image 
            source={{ uri: `http://localhost:3001${post.imageUrl}` }} 
            style={styles.postImage}
            accessibilityLabel="Post image"
            onLoad={() => console.log('✅ Instagram Image loaded successfully:', `http://localhost:3001${post.imageUrl}`)}
            onError={(error) => console.log('❌ Instagram Image failed to load:', `http://localhost:3001${post.imageUrl}`, error.nativeEvent)}
            onLoadStart={() => console.log('🔄 Instagram Image loading started:', `http://localhost:3001${post.imageUrl}`)}
          />
        </TouchableOpacity>
      )}

      {/* Engagement actions - Instagram style */}
      <View style={styles.engagementActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEngagementTap?.(post, 'like') || onTap(post)}
          accessibilityLabel={`Like post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="heart" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEngagementTap?.(post, 'comment') || onTap(post)}
          accessibilityLabel={`Comment on post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="bubble.right" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEngagementTap?.(post, 'share') || onTap(post)}
          accessibilityLabel={`Share post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="paperplane" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Likes count */}
      <View style={styles.likesContainer}>
        <ThemedText style={styles.likesText}>
          {formatEngagement(post.engagement.likes)} likes
        </ThemedText>
      </View>

      {/* Content caption */}
      <View style={styles.captionContainer}>
        <TouchableOpacity 
          onPress={() => onContentTap?.(post) || onTap(post)}
          accessibilityLabel="Post content"
          accessibilityRole="button"
        >
          <ThemedText style={styles.captionText}>
            <ThemedText style={styles.authorNameInline}>{post.author.name}</ThemedText>
            {' '}{post.content}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Comments section */}
      <View style={styles.commentsContainer}>
        <TouchableOpacity 
          onPress={() => onEngagementTap?.(post, 'comment') || onTap(post)}
          accessibilityLabel={`View comments for post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <ThemedText style={styles.commentsText}>
            View all {post.engagement.comments} comments
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Timestamp */}
      <View style={styles.timestampContainer}>
        <ThemedText style={styles.timestamp}>{formatTimestamp(post.timestamp)}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  authorNameInline: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  moreButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E1E8ED',
  },
  engagementActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  likesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  likesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  captionText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  commentsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  commentsText: {
    fontSize: 14,
    color: '#8E8E8E',
  },
  timestampContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E8E',
    textTransform: 'uppercase',
  },
});
