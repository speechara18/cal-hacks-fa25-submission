// Prompt templates for LLM calls - to be implemented
export function buildAnalysisPrompt(postJson, userText) {
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
