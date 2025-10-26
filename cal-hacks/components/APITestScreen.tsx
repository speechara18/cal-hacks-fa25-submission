// Test component to verify API integration
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PostsAPI } from '../api/posts';

export function APITestScreen() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGetAllPosts = async () => {
    setLoading(true);
    addLog('Testing getPosts()...');
    try {
      const result = await PostsAPI.getPosts(5);
      setPosts(result);
      addLog(`✅ Successfully fetched ${result.length} posts`);
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testGetPostById = async (id: string) => {
    setLoading(true);
    addLog(`Testing getPostById(${id})...`);
    try {
      const result = await PostsAPI.getPostById(id);
      if (result) {
        setSelectedPost(result);
        addLog(`✅ Successfully fetched post ${id}: ${result.author.name}`);
      } else {
        addLog(`❌ Post ${id} not found`);
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Integration Test</Text>
      
      <TouchableOpacity style={styles.button} onPress={testGetAllPosts}>
        <Text style={styles.buttonText}>Test Get All Posts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => testGetPostById('1')}>
        <Text style={styles.buttonText}>Test Get Post 1</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => testGetPostById('999')}>
        <Text style={styles.buttonText}>Test Get Non-existent Post</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Loading...</Text>}

      {posts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posts ({posts.length})</Text>
          {posts.map(post => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.postItem}
              onPress={() => testGetPostById(post.id)}
            >
              <Text style={styles.postText}>{post.author.name}: {post.content.substring(0, 50)}...</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedPost && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Post</Text>
          <Text style={styles.postText}>ID: {selectedPost.id}</Text>
          <Text style={styles.postText}>Author: {selectedPost.author.name}</Text>
          <Text style={styles.postText}>Content: {selectedPost.content}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logs</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postText: {
    fontSize: 14,
    marginBottom: 5,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});
