const LocalAIModel = require('./src/local-ai-model');
const { trainModel } = require('./src/train-model');

async function testLocalAI() {
  console.log('🧪 Testing Local AI Model...\n');
  
  // Train the model first
  console.log('📚 Training model...');
  await trainModel();
  
  // Create a new instance for testing
  const model = new LocalAIModel();
  
  // Test various inputs
  const testCases = [
    'hello',
    'how are you',
    'tell me a joke',
    'i need advice',
    'what can you do',
    'i\'m feeling sad',
    'give me a creative idea',
    'thank you',
    'bye',
    'what\'s the weather like',
    'do you like music',
    'i have a problem',
    'i\'m proud of myself',
    'what\'s your name',
    'are you real'
  ];
  
  console.log('\n🎯 Testing Responses:\n');
  
  for (const testInput of testCases) {
    try {
      const response = await model.generateResponse(testInput, 'test-user');
      console.log(`Input: "${testInput}"`);
      console.log(`Response: "${response}"`);
      console.log('---');
      
      // Add a small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error testing "${testInput}":`, error.message);
    }
  }
  
  // Test conversation context
  console.log('\n💬 Testing Conversation Context:\n');
  
  const conversation = [
    'hello',
    'i\'m feeling a bit down today',
    'work has been really stressful',
    'i don\'t know what to do',
    'thank you for listening'
  ];
  
  for (const message of conversation) {
    const response = await model.generateResponse(message, 'conversation-user');
    console.log(`User: "${message}"`);
    console.log(`Bot: "${response}"`);
    console.log('---');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Get model statistics
  const stats = model.getStats();
  console.log('\n📊 Final Model Statistics:');
  console.log(`- Response Patterns: ${stats.patterns}`);
  console.log(`- Knowledge Entries: ${stats.knowledgeEntries}`);
  console.log(`- Trained Documents: ${stats.trainedDocuments}`);
  console.log(`- Active Conversations: ${stats.activeConversations}`);
  
  console.log('\n✅ Local AI Model testing completed!');
}

// Run the test
testLocalAI().catch(console.error); 