import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { PostCard, Post } from './PostCard';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

interface FeedScreenProps {
  posts: Post[];
  onPostTap?: (post: Post) => void;
}

export function FeedScreen({ posts, onPostTap }: FeedScreenProps) {
  const handlePostTap = (post: Post) => {
    onPostTap?.(post);
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
