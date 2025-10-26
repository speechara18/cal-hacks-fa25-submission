import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { InstagramPostCard, Post } from './InstagramPostCard';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

interface InstagramFeedScreenProps {
  posts: Post[];
  onPostTap?: (post: Post) => void;
}

export function InstagramFeedScreen({ posts, onPostTap }: InstagramFeedScreenProps) {
  const handlePostTap = (post: Post) => {
    onPostTap?.(post);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <InstagramPostCard
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
        accessibilityLabel="Instagram-style social media feed"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  feedContainer: {
    paddingBottom: 20,
  },
});
