import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FeedScreen } from '@/components/FeedScreen';
import { InstagramFeedScreen } from '@/components/InstagramFeedScreen';
import { FacebookFeedScreen } from '@/components/FacebookFeedScreen';
import { PlatformSelector, PlatformMode } from '@/components/PlatformSelector';
import { APITestScreen } from '@/components/APITestScreen';
import { VoiceBotOverlay } from '@/components/VoiceBotOverlay';
import { PostsAPI } from '@/api/posts';
import { filterPostsByMode } from '@/utils/dataFilters';

export default function HomeScreen() {
  const [showAPITest, setShowAPITest] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<PlatformMode>('twitter');

  // Voice bot states
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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
    // Show voice overlay instead of navigating immediately
    console.log('🔍 Post tapped:', post.id);
    setSelectedPost(post);
    setShowVoiceOverlay(true);
    setIsUserSpeaking(true); // Show "listening" state
    setIsVoiceActive(true); // Start pulsing animation
  };

  const handleStartVoiceCoach = () => {
    // Start the voice coach session
    console.log('🎤 Starting voice coach for post:', selectedPost?.id);
    setIsBotSpeaking(true); // Switch to bot speaking mode
    setIsUserSpeaking(false);
    
    // Simulate bot speaking for 3 seconds, then return to listening
    setTimeout(() => {
      setIsBotSpeaking(false);
      setIsUserSpeaking(true);
    }, 3000);
  };

  const handleCloseVoiceOverlay = () => {
    setShowVoiceOverlay(false);
    setIsBotSpeaking(false);
    setIsUserSpeaking(false);
    setIsVoiceActive(false);
    setSelectedPost(null);
  };

  if (showAPITest) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setShowAPITest(false)}
        >
          <Text style={styles.backButtonText}>← Back to Feed</Text>
        </TouchableOpacity>
        <APITestScreen />
      </View>
    );
  }

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
      <TouchableOpacity 
        style={styles.testButton} 
        onPress={() => setShowAPITest(true)}
      >
        <Text style={styles.testButtonText}>🧪 Test API Integration</Text>
      </TouchableOpacity>
      
      <PlatformSelector 
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
      
      {renderFeed()}
      
      {/* Voice Bot Overlay */}
      {showVoiceOverlay && (
        <VoiceBotOverlay 
          isBotSpeaking={isBotSpeaking}
          isUserSpeaking={isUserSpeaking}
          isActive={isVoiceActive}
          size={80}
          onStart={handleStartVoiceCoach}
          onClose={handleCloseVoiceOverlay}
          post={selectedPost}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

