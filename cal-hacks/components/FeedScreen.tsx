import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { PostCard, Post } from './PostCard';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

interface FeedScreenProps {
  posts: Post[];
  onPostTap?: (post: Post) => void;
}

export function FeedScreen({ posts, onPostTap }: FeedScreenProps) {
  const handlePostTap = (post: Post) => {
    // This is where the voice bot modal would open
    Alert.alert(
      'Voice Coach',
      `Opening voice coach for post by ${post.author.name}...\n\nThis would start a LiveKit room and Vapi session.`,
      [
        {
          text: 'Start Voice Coach',
          onPress: () => {
            onPostTap?.(post);
            // Here you'd open the voice bot modal
            console.log('Opening voice coach for post:', post.id);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onTap={handlePostTap}
    />
  );

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
});
