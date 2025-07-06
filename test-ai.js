const fetch = require('node-fetch');
require('dotenv').config();

// Hugging Face configuration
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

async function testAIResponse(userMessage) {
  if (!HUGGINGFACE_API_KEY) {
    console.log("❌ Hugging Face API key not found!");
    console.log("Please add your HUGGINGFACE_API_KEY to the .env file");
    return;
  }
  
  try {
    console.log(`\n🧠 Testing AI response for: "${userMessage}"`);
    
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: userMessage
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const aiResponse = data[0]?.generated_text || "I'm not sure how to respond to that! 😅";
    
    console.log(`✅ AI Response: ${aiResponse}`);
    
  } catch (error) {
    console.error('❌ Hugging Face API Error:', error.message);
  }
}

console.log('🤖 Testing NeshBot AI Responses (Hugging Face)');
console.log('==============================================');

// Test a simple message
testAIResponse("Hello! How are you?"); 