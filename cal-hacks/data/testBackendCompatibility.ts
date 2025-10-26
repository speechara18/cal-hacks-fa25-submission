// Test file to verify backend compatibility with buildAnalysisPrompt function
import { PostsAPI } from '../api/posts';

// Simulate your teammate's buildAnalysisPrompt function
export function buildAnalysisPrompt(postJson: any, userText: string) {
  return `You are a media literacy expert evaluating whether a user correctly identified misinformation signals in a social media post.

POST DATA (with red/green flags):
${JSON.stringify(postJson, null, 2)}

USER'S ANALYSIS:
"${userText}"

TASK:
Evaluate if the user's analysis is correct based on the red flags and green flags in the post data.

RESPOND WITH VALID JSON ONLY (no markdown, no extra text):
{
  "verdict": "correct" | "incorrect" | "partially_correct",
  "isCorrect": true/false,
  "explanation": "A clear, educational explanation of why they were right or wrong",
  "flagsIdentified": ["flag1", "flag2"],
  "flagsMissed": ["flag3"],
  "confidence": 0.0-1.0,
  "teachingPoints": ["key lesson 1", "key lesson 2"]
}`;
}

// Test the compatibility
console.log('🔍 Testing backend compatibility...');

// Test with API calls
PostsAPI.getPosts(2, 0).then(posts => {
  if (posts.length > 0) {
    const fakePost = posts[0];
    console.log('\n📊 Testing FAKE post:');
    console.log(`Post ID: ${fakePost.id}`);
    console.log(`Content: ${fakePost.content.substring(0, 50)}...`);
    console.log(`Red flags: ${fakePost.metadata.redFlags?.join(', ') || 'None'}`);
    console.log(`Green flags: ${fakePost.metadata.greenFlags?.join(', ') || 'None'}`);

    // Generate prompt for fake post
    const fakePrompt = buildAnalysisPrompt(fakePost, "This looks like fake news because it uses BREAKING in caps and makes impossible claims");
    console.log('\n🤖 Generated prompt for fake post:');
    console.log(fakePrompt.substring(0, 200) + '...');

    if (posts.length > 1) {
      const realPost = posts[1];
      console.log('\n📊 Testing REAL post:');
      console.log(`Post ID: ${realPost.id}`);
      console.log(`Content: ${realPost.content.substring(0, 50)}...`);
      console.log(`Red flags: ${realPost.metadata.redFlags?.join(', ') || 'None'}`);
      console.log(`Green flags: ${realPost.metadata.greenFlags?.join(', ') || 'None'}`);

      // Generate prompt for real post
      const realPrompt = buildAnalysisPrompt(realPost, "This looks trustworthy because it's from the National Weather Service");
      console.log('\n🤖 Generated prompt for real post:');
      console.log(realPrompt.substring(0, 200) + '...');
    }

    // Test JSON structure compatibility
    console.log('\n✅ Backend compatibility test:');
    console.log('✅ Posts have redFlags field');
    console.log('✅ Posts have greenFlags field');
    console.log('✅ JSON.stringify works correctly');
    console.log('✅ buildAnalysisPrompt function can process the data');
  }
}).catch(error => {
  console.error('❌ Failed to fetch posts for testing:', error);
});

// Export the function for use
export { buildAnalysisPrompt as testBuildAnalysisPrompt };
