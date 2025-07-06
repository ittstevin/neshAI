const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'NeshBot is running! 🤖',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NeshBot! 🤖',
    description: 'A WhatsApp bot with AI-powered responses',
    status: 'running',
    features: [
      'WhatsApp integration',
      'AI-powered responses (Hugging Face)',
      'Entertainment options',
      'Jokes, stories, and fun facts'
    ]
  });
});

// Bot status endpoint
app.get('/status', (req, res) => {
  res.json({
    botName: process.env.BOT_NAME || "Nesh's lil auto-bot",
    owner: process.env.BOT_OWNER || "Nesh",
    aiEnabled: !!process.env.HUGGINGFACE_API_KEY,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app; 