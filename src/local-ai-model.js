const fs = require('fs');
const path = require('path');

class LocalAIModel {
  constructor() {
    this.knowledgeBase = new Map();
    this.responsePatterns = new Map();
    this.conversationContext = new Map();
    this.modelPath = path.join(__dirname, '..', 'models', 'local-ai-model.json');
    
    this.loadModel();
    this.initializeKnowledgeBase();
  }

  // Initialize the knowledge base with predefined responses
  initializeKnowledgeBase() {
    // General conversation patterns
    this.addResponsePattern('greeting', [
      'hello', 'hi', 'hey', 'sup', 'whats up', 'good morning', 'good afternoon', 'good evening', 'yo', 'niaje'
    ], [
      "Hey there! I'm Tevin's digital sidekick 🤖✨ What can I do for you today?",
      "Hiya! �� Just so you know—I'm not Tevin, but I've got the tools and vibes to help you out!",
      "Hello, friend! 💬 You're not talking to Tevin right now, but I'm here to keep things flowing!",
      "Hey hey! Tevin's not on the line, but I've got your back—what do you need? 👊",
      "Yo! This isn't Tevin, but I'm here in their place—locked in and ready for a great convo! 🚀"
    ]);

    this.addResponsePattern('farewell', [
      'bye', 'goodbye', 'see you', 'later', 'take care', 'good night'
    ], [
      "See you later! 👋 Take care! And hey—if you ever need to reach Tevin directly, just hit up his private number!",
      "Goodbye! It was great chatting with you! 😊 If you'd like to speak with Tevin personally, feel free to contact him on his private line!",
      "Later! Don't forget to stay awesome! ✨ And if you wanna reach the one and only Tevin, you can catch him on his private number!",
      "Take care! Looking forward to our next chat! And remember, if you ever need to talk to Tevin himself, his private number's the way to go!",
      "Goodbye! Have a wonderful day ahead! 🌟 Oh—and if you wanna connect with Tevin directly, just reach out on his private number!"
    ]);

    this.addResponsePattern('thanks', [
      'thank you', 'thanks', 'appreciate it', 'grateful'
    ], [
      "You're very welcome! 😊",
      "Anytime! Happy to help! ✨",
      "No problem at all! That's what I'm here for!",
      "You're welcome! It's my pleasure! 🌟",
      "Glad I could help! 😄"
    ]);

    this.addResponsePattern('how_are_you', [
      'how are you', 'how do you do', 'are you ok', 'how is it going'
    ], [
      "I'm doing great! Thanks for asking! 😊 How about you?",
      "I'm functioning perfectly! How are you doing? ✨",
      "All systems operational! How's your day going?",
      "I'm excellent! How are you feeling today? 🌟",
      "I'm doing well! Thanks for checking in! 😄"
    ]);

    // Knowledge-based responses
    this.addKnowledgeEntry('weather', [
      'weather', 'temperature', 'rain', 'sunny', 'cold', 'hot'
    ], [
      "I can't check real-time weather, but I hope it's nice where you are! ☀️",
      "Weather is always changing, just like our conversations! 🌤️",
      "Whether it's sunny or rainy, every day is a good day for chatting! 🌈"
    ]);

    this.addKnowledgeEntry('time', [
      'time', 'what time', 'hour', 'clock', 'schedule'
    ], [
      "I don't have access to real-time clocks, but I'm here whenever you need me! ⏰",
      "Time flies when you're having fun chatting! 🕐",
      "Every moment is a good time for a great conversation! ⏱️"
    ]);

    this.addKnowledgeEntry('jokes', [
      'joke', 'funny', 'humor', 'laugh', 'comedy'
    ], [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why don't eggs tell jokes? They'd crack each other up! 🥚",
      "What do you call a bear with no teeth? A gummy bear! 🐻",
      "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾"
    ]);

    this.addKnowledgeEntry('advice', [
      'advice', 'help', 'suggestion', 'recommend', 'what should i do'
    ], [
      "Sometimes the best way to solve a problem is to take a step back and breathe. You've got this! 🌬️✨",
      "Remember, every expert was once a beginner. Don't be afraid to start small! 🌱📈",
      "The best conversations happen when you listen more than you speak. Your friends will appreciate it! 👂❤️",
      "If you're feeling overwhelmed, make a list. Breaking things down makes them feel more manageable! 📝✅",
      "Don't compare your chapter 1 to someone else's chapter 20. Everyone's story is different! 📖🌟"
    ]);

    // Creative responses
    this.addKnowledgeEntry('creativity', [
      'creative', 'idea', 'inspiration', 'art', 'design', 'imagine'
    ], [
      "🎨 *Creative Spark!* Write a story where your favorite food comes to life and goes on an adventure! 🍕✨",
      "🎨 *Creative Spark!* Design a new planet with its own unique ecosystem and inhabitants! 🌍👽",
      "🎨 *Creative Spark!* Create a superhero whose power is based on your biggest fear! 🦸‍♂️💪",
      "🎨 *Creative Spark!* Invent a new holiday and describe how people would celebrate it! 🎉📅",
      "🎨 *Creative Spark!* Design a time machine that can only travel to random moments in history! ⏰🚀"
    ]);

    // Emotional support
    this.addKnowledgeEntry('sadness', [
      'sad', 'depressed', 'down', 'unhappy', 'miserable', 'blue'
    ], [
      "I'm sorry you're feeling sad. It's okay to feel this way, and I'm here to listen. What's going on? 💙",
      "Sadness is a natural emotion, and it's okay to not be okay. What's on your mind? 🤗",
      "I'm here for you during this difficult time. Would you like to talk about what's bothering you? 💖",
      "It's okay to feel down sometimes. Remember that this feeling won't last forever. What can I do to help? 🌟"
    ]);

    this.addKnowledgeEntry('happiness', [
      'happy', 'joy', 'excited', 'thrilled', 'elated', 'great'
    ], [
      "That's wonderful! I'm so glad you're feeling happy! What's making you feel this way? 😊✨",
      "Happiness is such a beautiful feeling! What's bringing you joy today? 🌟",
      "That's fantastic! Excitement is contagious! What are you excited about? 🎉",
      "I love seeing you happy! What's the highlight of your day so far? 😄"
    ]);

    // Technology and AI
    this.addKnowledgeEntry('ai_tech', [
      'ai', 'artificial intelligence', 'robot', 'machine', 'technology', 'smart'
    ], [
      "I'm an AI designed to be a friendly chat companion! I'm here to help, entertain, and just be a good friend! 🤖💙",
      "AI is fascinating! I work by processing your messages and finding the best way to respond! 🧠✨",
      "Technology is amazing, isn't it? I'm here to chat and learn from our conversations! 💻",
      "I'm a digital friend created to chat and help out! While I'm not human, I'm definitely real in the sense that I'm here to have genuine conversations with you! ��💙"
    ]);

    // Contact info
    this.addKnowledgeEntry('contact_info', [
      'contact', 'phone', 'number', 'whatsapp', 'mobile', 'instagram', 'how can i reach', 'how do i contact', 'tevin number', 'tevin whatsapp', 'tevin instagram', 'reach tevin', 'get in touch with tevin', 'call tevin', 'text tevin', 'message tevin', 'owner number', 'owner contact', 'bot owner', 'admin number', 'admin contact', 'who owns you', 'who is your owner', 'who made you', 'who created you', 'who is tevin', 'tevin contact', 'tevin info', 'tevin details'
    ], [
      "Here's Tevin's contact info!\n\n📱 Mobile/WhatsApp: +254762005479\n📸 Instagram: itts_tevin",
      "You can reach Tevin at:\n- WhatsApp: +254762005479\n- Instagram: itts_tevin",
      "Tevin's contact details:\nWhatsApp: +254762005479\nInstagram: itts_tevin",
      "If you want to get in touch with Tevin (my creator), here's how:\nWhatsApp: +254762005479\nInstagram: itts_tevin"
    ]);

    // Questions about the bot
    this.addKnowledgeEntry('bot_info', [
      'what can you do', 'who are you', 'what\'s your name', 'are you real', 'how do you work'
    ], [
      "I can chat, tell jokes, give advice, share creative ideas, and just be a friendly companion! What would you like to do? 😊",
      "I'm NeshBot, your friendly AI companion! I'm here to chat, entertain, and help out however I can! 🤖✨",
      "I'm NeshBot! Nice to meet you! 😊",
      "I'm a digital friend created to chat and help out! While I'm not human, I'm definitely real in the sense that I'm here to have genuine conversations with you! 🤖💙"
    ]);
  }

  // Add response patterns for different conversation types
  addResponsePattern(category, triggers, responses) {
    this.responsePatterns.set(category, {
      triggers: triggers.map(t => t.toLowerCase()),
      responses: responses
    });
  }

  // Add knowledge entries for specific topics
  addKnowledgeEntry(topic, keywords, responses) {
    this.knowledgeBase.set(topic, {
      keywords: keywords.map(k => k.toLowerCase()),
      responses: responses
    });
  }

  // Load trained model from file
  loadModel() {
    try {
      if (fs.existsSync(this.modelPath)) {
        const modelData = JSON.parse(fs.readFileSync(this.modelPath, 'utf8'));
        console.log('✅ Local AI model loaded successfully');
      } else {
        console.log('📝 No existing model found, starting fresh');
      }
    } catch (error) {
      console.log('⚠️ Error loading model, starting fresh:', error.message);
    }
  }

  // Save trained model to file
  saveModel() {
    try {
      const modelData = {
        timestamp: new Date().toISOString(),
        patterns: this.responsePatterns.size,
        knowledgeEntries: this.knowledgeBase.size
      };
      
      // Ensure models directory exists
      const modelsDir = path.dirname(this.modelPath);
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }
      
      fs.writeFileSync(this.modelPath, JSON.stringify(modelData, null, 2));
      console.log('💾 Model saved successfully');
    } catch (error) {
      console.error('❌ Error saving model:', error);
    }
  }

  // Train the model with conversation data
  train(conversations) {
    // For this simple version, we'll just save the model
    // In a more advanced version, you could build a more sophisticated training system
    this.saveModel();
  }

  // Simple word tokenization
  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  // Calculate simple similarity between two texts
  calculateSimilarity(text1, text2) {
    const words1 = new Set(this.tokenize(text1));
    const words2 = new Set(this.tokenize(text2));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  // Generate response based on input
  async generateResponse(input, userId = 'default') {
    const userInput = input.toLowerCase().trim();
    
    // Get conversation context for this user
    const context = this.conversationContext.get(userId) || [];
    
    // Check for pattern matches first
    const patternResponse = this.checkPatternMatches(userInput);
    if (patternResponse) {
      this.updateContext(userId, input, patternResponse);
      return patternResponse;
    }

    // Check knowledge base
    const knowledgeResponse = this.checkKnowledgeBase(userInput);
    if (knowledgeResponse) {
      this.updateContext(userId, input, knowledgeResponse);
      return knowledgeResponse;
    }

    // Generate contextual response
    const contextualResponse = this.generateContextualResponse(userInput, context);
    this.updateContext(userId, input, contextualResponse);
    return contextualResponse;
  }

  // Check if input matches any predefined patterns
  checkPatternMatches(input) {
    for (const [category, pattern] of this.responsePatterns) {
      for (const trigger of pattern.triggers) {
        if (input.includes(trigger)) {
          const responses = pattern.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    return null;
  }

  // Check knowledge base for relevant responses
  checkKnowledgeBase(input) {
    for (const [topic, data] of this.knowledgeBase) {
      for (const keyword of data.keywords) {
        if (input.includes(keyword)) {
          const responses = data.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    return null;
  }

  // Generate contextual response based on conversation history
  generateContextualResponse(input, context) {
    const responses = [
      "That's interesting! Tell me more about that! 🤔",
      "I see what you mean. What are your thoughts on that? 💭",
      "That's a great point! How does that make you feel? 😊",
      "Interesting perspective! What led you to think that way? 🧠",
      "I'm curious about that! Can you elaborate a bit more? 🔍",
      "That sounds fascinating! What's your experience with that? ✨",
      "I'd love to hear more about that! What's your take? 🎯",
      "That's a good question! What do you think about it? 🤷‍♂️",
      "Interesting! How do you usually approach that? 💡",
      "That's worth exploring! What's your opinion on that? 🌟"
    ];

    // If we have context, try to be more specific
    if (context.length > 0) {
      const lastResponse = context[context.length - 1].response;
      if (lastResponse.includes('Tell me more')) {
        return "I'm really getting to know you better! What else would you like to share? 😊";
      }
      if (lastResponse.includes('How do you feel')) {
        return "Your feelings matter! What's on your mind right now? 💖";
      }
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Update conversation context
  updateContext(userId, input, response) {
    if (!this.conversationContext.has(userId)) {
      this.conversationContext.set(userId, []);
    }
    
    const context = this.conversationContext.get(userId);
    context.push({ input, response, timestamp: Date.now() });
    
    // Keep only last 5 messages for context
    if (context.length > 5) {
      context.shift();
    }
    
    this.conversationContext.set(userId, context);
  }

  // Get model statistics
  getStats() {
    return {
      patterns: this.responsePatterns.size,
      knowledgeEntries: this.knowledgeBase.size,
      trainedDocuments: 0, // Not applicable for this simple version
      activeConversations: this.conversationContext.size
    };
  }
}

module.exports = LocalAIModel; 