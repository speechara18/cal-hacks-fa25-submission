import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Post } from './PostCard';

interface FacebookPostCardProps {
  post: Post;
  onTap: (post: Post) => void;
  onAuthorTap?: (post: Post) => void;
  onProfilePicTap?: (post: Post) => void;
  onAuthorNameTap?: (post: Post) => void;
  onContentTap?: (post: Post) => void;
  onImageTap?: (post: Post) => void;
  onEngagementTap?: (post: Post, type: 'like' | 'share' | 'comment') => void;
}

export function FacebookPostCard({ 
  post, 
  onTap, 
  onAuthorTap, 
  onProfilePicTap,
  onAuthorNameTap,
  onContentTap, 
  onImageTap, 
  onEngagementTap 
}: FacebookPostCardProps) {
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
      {/* Header with profile info - Facebook style */}
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
                <IconSymbol name="house.fill" size={16} color="#1877F2" />
              )}
            </TouchableOpacity>
            <ThemedText style={styles.timestamp}>{formatTimestamp(post.timestamp)}</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <IconSymbol name="ellipsis" size={20} color="#65676B" />
        </TouchableOpacity>
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
            <Image 
              source={{ uri: `http://localhost:3001${post.imageUrl}` }} 
              style={styles.postImage}
              accessibilityLabel="Post image"
              onLoad={() => console.log('✅ Facebook Image loaded successfully:', `http://localhost:3001${post.imageUrl}`)}
              onError={(error) => console.log('❌ Facebook Image failed to load:', `http://localhost:3001${post.imageUrl}`, error.nativeEvent)}
              onLoadStart={() => console.log('🔄 Facebook Image loading started:', `http://localhost:3001${post.imageUrl}`)}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Engagement summary */}
      <View style={styles.engagementSummary}>
        <View style={styles.engagementLeft}>
          <View style={styles.likeSummary}>
            <IconSymbol name="heart.fill" size={16} color="#1877F2" />
            <ThemedText style={styles.engagementText}>
              {formatEngagement(post.engagement.likes)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.engagementRight}>
          <TouchableOpacity 
            onPress={() => onEngagementTap?.(post, 'comment') || onTap(post)}
            accessibilityLabel={`View comments for post by ${post.author.name}`}
            accessibilityRole="button"
          >
            <ThemedText style={styles.commentsLink}>
              {post.engagement.comments} comments
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onEngagementTap?.(post, 'share') || onTap(post)}
            accessibilityLabel={`View shares for post by ${post.author.name}`}
            accessibilityRole="button"
          >
            <ThemedText style={styles.sharesLink}>
              {post.engagement.shares} shares
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Engagement actions - Facebook style */}
      <View style={styles.engagementActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEngagementTap?.(post, 'like') || onTap(post)}
          accessibilityLabel={`Like post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="heart" size={20} color="#65676B" />
          <ThemedText style={styles.actionText}>Like</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEngagementTap?.(post, 'comment') || onTap(post)}
          accessibilityLabel={`Comment on post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="bubble.right" size={20} color="#65676B" />
          <ThemedText style={styles.actionText}>Comment</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEngagementTap?.(post, 'share') || onTap(post)}
          accessibilityLabel={`Share post by ${post.author.name}`}
          accessibilityRole="button"
        >
          <IconSymbol name="paperplane" size={20} color="#65676B" />
          <ThemedText style={styles.actionText}>Share</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DADDE1',
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  timestamp: {
    fontSize: 13,
    color: '#65676B',
  },
  moreButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postText: {
    fontSize: 15,
    color: '#1C1E21',
    lineHeight: 22,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#E1E8ED',
  },
  engagementSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#DADDE1',
  },
  engagementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 13,
    color: '#65676B',
    fontWeight: '500',
  },
  engagementRight: {
    flexDirection: 'row',
    gap: 16,
  },
  commentsLink: {
    fontSize: 13,
    color: '#65676B',
  },
  sharesLink: {
    fontSize: 13,
    color: '#65676B',
  },
  engagementActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#DADDE1',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
    color: '#65676B',
    fontWeight: '500',
  },
});
