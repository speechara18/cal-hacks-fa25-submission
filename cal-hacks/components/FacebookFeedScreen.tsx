import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FacebookPostCard, Post } from './FacebookPostCard';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

interface FacebookFeedScreenProps {
  posts: Post[];
  onPostTap?: (post: Post) => void;
}

export function FacebookFeedScreen({ posts, onPostTap }: FacebookFeedScreenProps) {
  const handlePostTap = (post: Post) => {
    onPostTap?.(post);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <FacebookPostCard
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
        accessibilityLabel="Facebook-style social media feed"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  feedContainer: {
    paddingBottom: 20,
  },
});
