import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FeedScreen } from '@/components/FeedScreen';
import { InstagramFeedScreen } from '@/components/InstagramFeedScreen';
import { FacebookFeedScreen } from '@/components/FacebookFeedScreen';
import { PlatformSelector, PlatformMode } from '@/components/PlatformSelector';
import { PostsAPI } from '@/api/posts';
import { filterPostsByMode } from '@/utils/dataFilters';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<PlatformMode>('twitter');

  // Load posts from API on component mount
  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await PostsAPI.getPosts(10, 0);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  const handlePostTap = (post: any) => {
    // Navigate to post detail screen
    console.log('🔍 Post tapped:', post.id);
    console.log('🔍 Post data:', JSON.stringify(post, null, 2));
    console.log('🔍 Navigating to:', `/post/${post.id}`);
    
    try {
      router.push(`/post/${post.id}`);
      console.log('✅ Navigation called successfully');
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading posts...</Text>
      </View>
    );
  }

  // Filter posts based on selected mode
  const filteredPosts = filterPostsByMode(posts, selectedMode);

  // Render the appropriate feed based on selected mode
  const renderFeed = () => {
    switch (selectedMode) {
      case 'instagram':
        return <InstagramFeedScreen posts={filteredPosts} onPostTap={handlePostTap} />;
      case 'facebook':
        return <FacebookFeedScreen posts={filteredPosts} onPostTap={handlePostTap} />;
      case 'twitter':
      default:
        return <FeedScreen posts={filteredPosts} onPostTap={handlePostTap} />;
    }
  };

  return (
    <View style={styles.container}>
      <PlatformSelector 
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
      
      {renderFeed()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

