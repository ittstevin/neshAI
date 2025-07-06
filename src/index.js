const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Start the Express server
require('./server');

// Hugging Face configuration
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

// Bot configuration
const BOT_CONFIG = {
  name: process.env.BOT_NAME || "Nesh's lil auto-bot",
  owner: process.env.BOT_OWNER || "Nesh",
  welcomeMessage: process.env.WELCOME_MESSAGE || "Hey there 👋 Thanks for reaching out! I'm Nesh's lil auto-bot 😎",
  entertainmentOptions: [
    "🎵 Tell me a joke",
    "🎮 Play a word game",
    "🧠 Ask me anything (AI-powered)",
    "📚 Share a fun fact",
    "🎭 Tell me a story"
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
  
  if (isFirstMessage || userMessage.includes('hello') || userMessage.includes('hi')) {
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
  
  // AI-powered responses
  if (userMessage.includes('ai') || userMessage.includes('chatgpt') || userMessage.includes('smart')) {
    await sendAIResponse(message);
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
    "📚 A wise old owl lived in a tree. When animals had problems, they'd ask for advice. The owl would always say, 'Listen with your heart, not just your ears.' 🦉"
  ];
  
  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  await message.reply(randomStory);
}

async function sendAIResponse(message) {
  if (!HUGGINGFACE_API_KEY) {
    await message.reply("Sorry! AI features aren't configured yet. Please add your Hugging Face API key to use this feature! 🔧");
    return;
  }
  
  try {
    const userMessage = message.body;
    
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
    let aiResponse = data[0]?.generated_text || "I'm not sure how to respond to that! 😅";
    
    // Clean up the response
    if (aiResponse.length > 200) {
      aiResponse = aiResponse.substring(0, 200) + '...';
    }
    
    await message.reply(`🧠 ${aiResponse}`);
    
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    await message.reply("Sorry! I'm having trouble connecting to my brain right now. Maybe try one of the other options? 😅");
  }
}

async function sendDefaultResponse(message) {
  const defaultText = `I'm not sure what you mean, but I'm here to help! 😊\n\nHere are some things I can do:\n\n${BOT_CONFIG.entertainmentOptions.join('\n')}`;
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