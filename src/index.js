const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Start the Express server
require('./server');

// AI API configurations
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

// Alternative free AI APIs
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const AI21_API_KEY = process.env.AI21_API_KEY;

// Bot mode configuration
const FULL_AI_MODE = process.env.FULL_AI_MODE === 'true';
const AI_MODEL = process.env.AI_MODEL || 'facebook/blenderbot-400M-distill';

// Bot configuration
const BOT_CONFIG = {
  name: process.env.BOT_NAME || "Nesh's lil auto-bot",
  owner: process.env.BOT_OWNER || "Nesh",
  welcomeMessage: process.env.WELCOME_MESSAGE || "Hey there 👋 Nesh is off doing human things, so you've got me — the cooler, smarter version 😏. Whatcha need?",
  entertainmentOptions: [
    "🎵 Tell me a joke",
    "🎮 Play a word game", 
    "🧠 Ask me anything (AI-powered)",
    "📚 Share a fun fact",
    "🎭 Tell me a story",
    "🎯 Play trivia",
    "🎨 Get creative ideas",
    "💡 Random advice"
  ],
  fallbackMessage: "I'd blame Nesh for not teaching me that one 😂... Could you rephrase it for me? Or try one of these:",
  greetings: [
    'hello', 'hi', 'hey', 'sup', 'whats up', 'what\'s up', 'yo', 'greetings', 'good morning', 
    'good afternoon', 'good evening', 'morning', 'afternoon', 'evening', 'hiya', 'howdy',
    'salutations', 'wassup', 'what\'s good', 'whats good', 'hi there', 'hello there',
    'good day', 'goodnight', 'good night', 'hey there', 'hi there', 'sup there',
    'what\'s happening', 'whats happening', 'what\'s going on', 'whats going on'
  ]
};

// Initialize WhatsApp client with better options
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ],
    timeout: 60000
  }
});

// Store QR code data globally
global.currentQRCode = null;

// Generate QR code for WhatsApp Web
client.on('qr', async (qr) => {
  console.log('QR RECEIVED', qr);
  
  // Store QR code data
  global.currentQRCode = qr;
  
  // Generate terminal QR code
  qrcode.generate(qr, { small: true });
  
  // Generate QR code image for local development
  try {
    const qrImagePath = path.join(__dirname, '..', 'whatsapp-qr.png');
    await QRCode.toFile(qrImagePath, qr, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400,
      margin: 2
    });
    
    console.log('\n📱 QR Code saved as: whatsapp-qr.png');
    console.log('📂 Full path:', qrImagePath);
    console.log('🔗 You can also open this file in your browser to scan!');
    
  } catch (error) {
    console.error('Error generating QR image:', error);
  }
  
  console.log('\n🌐 QR Code also available at: http://localhost:3000/qr');
  console.log('🚂 When deployed to Railway, visit: https://your-app.railway.app/qr');
});

client.on('ready', () => {
  console.log('Client is ready!');
  console.log(`🤖 ${BOT_CONFIG.name} is now online!`);
  global.currentQRCode = null; // Clear QR code when connected
});

// Handle incoming messages
client.on('message', async (message) => {
  if (message.from === 'status@broadcast') return; // Ignore status updates
  
  console.log(`📨 New message from ${message.from}: ${message.body}`);
  
  try {
    await handleMessage(message);
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply('Sorry, something went wrong! 😅');
  }
});

async function handleMessage(message) {
  const userMessage = message.body.toLowerCase().trim();
  
  // Check if this is a first-time conversation
  const chat = await message.getChat();
  const isFirstMessage = !chat.lastMessage || chat.lastMessage.fromMe;
  
  // Check for various greetings
  const isGreeting = BOT_CONFIG.greetings.some(greeting => 
    userMessage.includes(greeting)
  );
  
  if (isFirstMessage || isGreeting) {
    await sendWelcomeMessage(message);
    return;
  }
  
  // Handle entertainment options
  if (userMessage.includes('joke') || userMessage.includes('tell me a joke')) {
    await sendJoke(message);
    return;
  }
  
  if (userMessage.includes('word game') || userMessage.includes('play')) {
    await startWordGame(message);
    return;
  }
  
  if (userMessage.includes('fun fact') || userMessage.includes('fact')) {
    await sendFunFact(message);
    return;
  }
  
  if (userMessage.includes('story') || userMessage.includes('tell me a story')) {
    await sendStory(message);
    return;
  }
  
  if (userMessage.includes('trivia') || userMessage.includes('quiz')) {
    await sendTrivia(message);
    return;
  }
  
  if (userMessage.includes('creative') || userMessage.includes('idea') || userMessage.includes('inspiration')) {
    await sendCreativeIdeas(message);
    return;
  }
  
  if (userMessage.includes('advice') || userMessage.includes('help me') || userMessage.includes('suggestion')) {
    await sendRandomAdvice(message);
    return;
  }
  
  // Bot control commands
  if (userMessage.includes('switch to ai mode') || userMessage.includes('enable full ai')) {
    await message.reply('🤖 Switching to Full AI mode! I\'ll now try to respond to everything with AI first. Set FULL_AI_MODE=true in Railway to make this permanent!');
    return;
  }
  
  if (userMessage.includes('switch to normal mode') || userMessage.includes('disable full ai')) {
    await message.reply('🎮 Switching to Normal mode! I\'ll use entertainment features first, then AI as backup. Set FULL_AI_MODE=false in Railway to make this permanent!');
    return;
  }
  
  // AI-powered responses
  if (userMessage.includes('ai') || userMessage.includes('chatgpt') || userMessage.includes('smart')) {
    await sendAIResponse(message);
    return;
  }
  
  // Full AI mode: Try AI first for everything
  if (FULL_AI_MODE) {
    const aiResponse = await tryAIResponse(message);
    if (aiResponse) {
      await message.reply(aiResponse);
      return;
    }
    // If AI fails, fall back to entertainment
    await sendDefaultResponse(message);
    return;
  }
  
  // Regular mode: Try AI for unknown requests, then fallback
  const aiResponse = await tryAIResponse(message);
  if (aiResponse) {
    await message.reply(aiResponse);
    return;
  }
  
  // Default response with options
  await sendDefaultResponse(message);
}

async function sendWelcomeMessage(message) {
  const welcomeText = `${BOT_CONFIG.welcomeMessage}\n\nIn the meantime, here's a lil something to keep you company:\n\n${BOT_CONFIG.entertainmentOptions.join('\n')}`;
  
  await message.reply(welcomeText);
}

async function sendJoke(message) {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything! 😄",
    "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
    "What do you call a fake noodle? An impasta! 🍝",
    "Why don't eggs tell jokes? They'd crack each other up! 🥚",
    "What do you call a bear with no teeth? A gummy bear! 🐻"
  ];
  
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  await message.reply(randomJoke);
}

async function startWordGame(message) {
  const games = [
    "🎮 Let's play Word Association! I'll say a word, you say the first thing that comes to mind. Ready? Here's your word: *Sunshine* ☀️",
    "🎮 Let's play Rhyme Time! Give me a word and I'll try to rhyme with it! 🎵",
    "🎮 Let's play Word Categories! Name as many animals as you can in 30 seconds! 🐾"
  ];
  
  const randomGame = games[Math.floor(Math.random() * games.length)];
  await message.reply(randomGame);
}

async function sendFunFact(message) {
  const facts = [
    "🐘 Elephants are the only mammals that can't jump!",
    "🦒 A giraffe's tongue is about 20 inches long!",
    "🐧 Penguins can jump as high as 6 feet out of water!",
    "🦋 Butterflies taste with their feet!",
    "🐙 An octopus has three hearts!"
  ];
  
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  await message.reply(randomFact);
}

async function sendStory(message) {
  const stories = [
    "📚 Once upon a time, there was a little robot who wanted to make friends. Every day, it would try to smile, but its metal face couldn't move. One day, a child taught it that friendship isn't about smiles - it's about being there when someone needs you. 🤖❤️",
    "📚 There was a tiny star that felt too small to shine. But when it looked around, it realized that even the smallest light can brighten someone's darkest night. ⭐",
    "📚 A wise old owl lived in a tree. When animals had problems, they'd ask for advice. The owl would always say, 'Listen with your heart, not just your ears.' 🦉",
    "📚 In a digital forest, there lived a curious AI who loved to learn. It discovered that the best knowledge comes from asking questions and listening to others. 🧠🌳",
    "📚 A pixel artist created a beautiful world, but it was lonely. So they invited others to add their own colors, and together they painted the most amazing masterpiece. 🎨✨"
  ];
  
  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  await message.reply(randomStory);
}

async function sendTrivia(message) {
  const triviaQuestions = [
    "🎯 *Trivia Time!* What's the only mammal that can't jump? (Answer: Elephant! 🐘)",
    "🎯 *Trivia Time!* How many hearts does an octopus have? (Answer: Three! 🐙)",
    "🎯 *Trivia Time!* What's the fastest land animal? (Answer: Cheetah! 🐆)",
    "🎯 *Trivia Time!* How many bones are in the human body? (Answer: 206! 💀)",
    "🎯 *Trivia Time!* What's the largest planet in our solar system? (Answer: Jupiter! 🪐)",
    "🎯 *Trivia Time!* How many sides does a snowflake have? (Answer: Six! ❄️)",
    "🎯 *Trivia Time!* What's the smallest country in the world? (Answer: Vatican City! 🏛️)",
    "🎯 *Trivia Time!* How many muscles does it take to smile? (Answer: 17! 😊)"
  ];
  
  const randomTrivia = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
  await message.reply(randomTrivia);
}

async function sendCreativeIdeas(message) {
  const creativeIdeas = [
    "🎨 *Creative Spark!* Write a story where your favorite food comes to life and goes on an adventure! 🍕✨",
    "🎨 *Creative Spark!* Design a new planet with its own unique ecosystem and inhabitants! 🌍👽",
    "🎨 *Creative Spark!* Create a superhero whose power is based on your biggest fear! 🦸‍♂️💪",
    "🎨 *Creative Spark!* Invent a new holiday and describe how people would celebrate it! 🎉📅",
    "🎨 *Creative Spark!* Design a time machine that can only travel to random moments in history! ⏰🚀",
    "🎨 *Creative Spark!* Create a recipe for a magical potion that grants one wish! 🧪✨",
    "🎨 *Creative Spark!* Design a house that can transform into any vehicle! 🏠🚗",
    "🎨 *Creative Spark!* Invent a new language with only 5 words that can express any emotion! 🗣️💭"
  ];
  
  const randomIdea = creativeIdeas[Math.floor(Math.random() * creativeIdeas.length)];
  await message.reply(randomIdea);
}

async function sendRandomAdvice(message) {
  const advice = [
    "💡 *Random Wisdom:* Sometimes the best way to solve a problem is to take a step back and breathe. You've got this! 🌬️✨",
    "💡 *Random Wisdom:* Remember, every expert was once a beginner. Don't be afraid to start small! 🌱📈",
    "💡 *Random Wisdom:* The best conversations happen when you listen more than you speak. Your friends will appreciate it! 👂❤️",
    "💡 *Random Wisdom:* If you're feeling overwhelmed, make a list. Breaking things down makes them feel more manageable! 📝✅",
    "💡 *Random Wisdom:* Don't compare your chapter 1 to someone else's chapter 20. Everyone's story is different! 📖🌟",
    "💡 *Random Wisdom:* Sometimes the best advice is to trust your gut. You know yourself better than anyone! 🫀✨",
    "💡 *Random Wisdom:* Take breaks when you need them. Rest is not a sign of weakness, it's a sign of wisdom! 😴💪",
    "💡 *Random Wisdom:* Be kind to yourself. You're doing better than you think! 🤗💖"
  ];
  
  const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
  await message.reply(randomAdvice);
}

async function tryAIResponse(message) {
  const userMessage = message.body;
  
  // Try Hugging Face with configurable model
  if (HUGGINGFACE_API_KEY) {
    try {
      const modelUrl = `https://api-inference.huggingface.co/models/${AI_MODEL}`;
      
      // Prepare context for better responses
      const context = FULL_AI_MODE 
        ? `You are NeshBot, a friendly and helpful AI assistant. Be conversational, engaging, and helpful. Keep responses concise but friendly. User message: ${userMessage}`
        : userMessage;
      
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: context,
          parameters: {
            max_length: FULL_AI_MODE ? 200 : 150,
            temperature: 0.7,
            do_sample: true
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        let aiResponse = data[0]?.generated_text || null;
        
        if (aiResponse) {
          // Clean up the response
          aiResponse = aiResponse.replace(/^[^a-zA-Z]*/, ''); // Remove leading non-letters
          if (aiResponse.length > (FULL_AI_MODE ? 400 : 300)) {
            aiResponse = aiResponse.substring(0, FULL_AI_MODE ? 400 : 300) + '...';
          }
          return `${FULL_AI_MODE ? '🤖' : '🧠'} ${aiResponse}`;
        }
      }
    } catch (error) {
      console.error('Hugging Face API Error:', error);
    }
  }
  
  // Try OpenAI if available
  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful, friendly AI assistant. Keep responses concise and engaging.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content;
        
        if (aiResponse) {
          return `🤖 ${aiResponse}`;
        }
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
    }
  }
  
  // Try Cohere if available
  if (COHERE_API_KEY) {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: userMessage,
          max_tokens: 150,
          temperature: 0.7
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.generations?.[0]?.text;
        
        if (aiResponse) {
          return `💭 ${aiResponse.trim()}`;
        }
      }
    } catch (error) {
      console.error('Cohere API Error:', error);
    }
  }
  
  return null; // Fall back to default response
}

async function sendAIResponse(message) {
  const aiResponse = await tryAIResponse(message);
  if (aiResponse) {
    await message.reply(aiResponse);
  } else {
    await message.reply("Sorry! I'm having trouble connecting to my brain right now. Maybe try one of the other options? 😅");
  }
}

async function sendDefaultResponse(message) {
  const defaultText = `${BOT_CONFIG.fallbackMessage}\n\n${BOT_CONFIG.entertainmentOptions.join('\n')}`;
  await message.reply(defaultText);
}

// Error handling
client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('Client was disconnected:', reason);
});

// Start the client
client.initialize();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down bot...');
  client.destroy();
  process.exit(0);
});