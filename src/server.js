const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
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

// QR Code endpoint
app.get('/qr', async (req, res) => {
  try {
    // Get QR code data from the main bot process
    const qrData = global.currentQRCode;
    
    if (!qrData) {
      return res.status(404).json({
        error: 'QR code not available',
        message: 'Bot is either connected or not yet initialized'
      });
    }
    
    // Generate QR code as SVG
    const qrSvg = await QRCode.toString(qrData, {
      type: 'svg',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400,
      margin: 2
    });
    
    // Send HTML page with QR code
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>NeshBot QR Code</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 500px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          .qr-code {
            margin: 20px 0;
          }
          .instructions {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: left;
          }
          .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
          }
          .status {
            color: #28a745;
            font-weight: bold;
            margin-top: 15px;
          }
          .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
          }
          .refresh-btn:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 NeshBot QR Code</h1>
          <div class="qr-code">
            ${qrSvg}
          </div>
          <div class="instructions">
            <strong>📱 How to connect:</strong>
            <ol>
              <li>Open WhatsApp on your phone</li>
              <li>Go to Settings → Linked Devices</li>
              <li>Tap "Link a Device"</li>
              <li>Scan this QR code</li>
            </ol>
          </div>
          <div class="status">✅ QR Code is active and ready to scan!</div>
          <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Page</button>
        </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      error: 'Failed to generate QR code',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app; 