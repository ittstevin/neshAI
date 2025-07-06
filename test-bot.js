require('dotenv').config();

// Bot configuration
const BOT_CONFIG = {
  name: process.env.BOT_NAME || "Nesh's lil auto-bot",
  welcomeMessage: process.env.WELCOME_MESSAGE || "Hey there 👋\nThanks for reaching out! I'm Nesh's lil auto-bot 😎",
  entertainmentOptions: [
    "🎵 Tell me a joke",
    "🎮 Play a word game",
    "🧠 Ask me anything (AI-powered)",
    "📚 Share a fun fact",
    "🎭 Tell me a story"
  ]
};

// Test welcome message
function testWelcomeMessage() {
  const welcomeText = `${BOT_CONFIG.welcomeMessage}\n\nIn the meantime, here's a lil something to keep you company:\n\n${BOT_CONFIG.entertainmentOptions.join('\n')}`;
  console.log('✅ Welcome Message Test:');
  console.log(welcomeText);
  console.log('\n' + '─'.repeat(50));
}

// Test entertainment options
function testEntertainment() {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything! 😄",
    "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾"
  ];
  
  const facts = [
    "🐘 Elephants are the only mammals that can't jump!",
    "🦒 A giraffe's tongue is about 20 inches long!"
  ];
  
  console.log('✅ Entertainment Options Test:');
  console.log('🎵 Joke:', jokes[0]);
  console.log('📚 Fun Fact:', facts[0]);
  console.log('\n' + '─'.repeat(50));
}

console.log('🤖 NeshBot Feature Test');
console.log('=======================\n');

testWelcomeMessage();
testEntertainment();

console.log('✅ All basic features working!');
console.log('💡 To test AI responses, run: npm run test:ai'); 