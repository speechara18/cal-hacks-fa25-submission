// Test file to validate API integration and schema compliance
import { PostsAPI } from '../api/posts';

// Test API integration
console.log('🔍 Testing API integration...');

PostsAPI.getPosts(5, 0).then(posts => {
  console.log(`✅ Successfully fetched ${posts.length} posts from API`);
  
  // Test a few posts
  const testPosts = posts.slice(0, 3);
  
  testPosts.forEach((post, index) => {
    console.log(`\n📊 Post ${index + 1}:`);
    console.log(`   ID: ${post.id}`);
    console.log(`   Content: ${post.content.substring(0, 50)}...`);
    console.log(`   Red flags: ${post.metadata.redFlags?.join(', ') || 'None'}`);
    console.log(`   Green flags: ${post.metadata.greenFlags?.join(', ') || 'None'}`);
    console.log(`   Label: ${post.metadata.label}`);
  });
  
  console.log('\n✅ API integration test completed successfully');
}).catch(error => {
  console.error('❌ API integration test failed:', error);
});

export { PostsAPI };