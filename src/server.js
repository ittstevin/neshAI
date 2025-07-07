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
    description: 'A WhatsApp bot with Local AI-powered responses',
    status: 'running',
    features: [
      'WhatsApp integration',
      'Local AI-powered responses (No API needed)',
      'Entertainment options',
      'Jokes, stories, and fun facts',
      'Pattern matching and knowledge base',
      'Conversation context awareness'
    ]
  });
});

// Bot status endpoint
app.get('/status', (req, res) => {
  res.json({
    botName: process.env.BOT_NAME || "Nesh's lil auto-bot",
    owner: process.env.BOT_OWNER || "Nesh",
    aiEnabled: true, // Local AI is always enabled
    aiType: "Local AI Model",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// QR Code endpoint with multiple formats
app.get('/qr', async (req, res) => {
  try {
    // Get QR code data from the main bot process
    const qrData = global.currentQRCode;
    
    if (!qrData) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>NeshBot - Not Ready</title>
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
            .status {
              color: #dc3545;
              font-weight: bold;
              margin: 20px 0;
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
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🤖 NeshBot</h1>
            <div class="status">⏳ Bot is starting up...</div>
            <p>Please wait a moment and refresh the page.</p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Page</button>
          </div>
        </body>
        </html>
      `);
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
    
    // Generate QR code as PNG data URL
    const qrPng = await QRCode.toDataURL(qrData, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400,
      margin: 2
    });
    
    // Send HTML page with multiple QR code formats
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
            max-width: 600px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          .qr-section {
            margin: 20px 0;
            padding: 20px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
          }
          .qr-code {
            margin: 20px 0;
          }
          .qr-code img {
            max-width: 100%;
            height: auto;
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
          .btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            text-decoration: none;
            display: inline-block;
          }
          .btn:hover {
            background: #0056b3;
          }
          .btn-secondary {
            background: #6c757d;
          }
          .btn-secondary:hover {
            background: #545b62;
          }
          .tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          .tab {
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid #ddd;
            background: #f8f9fa;
            margin: 0 5px;
            border-radius: 5px 5px 0 0;
          }
          .tab.active {
            background: white;
            border-bottom: 2px solid #007bff;
          }
          .tab-content {
            display: none;
          }
          .tab-content.active {
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 NeshBot QR Code</h1>
          
          <div class="tabs">
            <div class="tab active" onclick="showTab('svg')">SVG Version</div>
            <div class="tab" onclick="showTab('png')">PNG Version</div>
            <div class="tab" onclick="showTab('text')">Text Version</div>
          </div>
          
          <div id="svg-tab" class="tab-content active">
            <div class="qr-section">
              <h3>📱 SVG QR Code (Best for web)</h3>
              <div class="qr-code">
                ${qrSvg}
              </div>
            </div>
          </div>
          
          <div id="png-tab" class="tab-content">
            <div class="qr-section">
              <h3>🖼️ PNG QR Code (Best for mobile)</h3>
              <div class="qr-code">
                <img src="${qrPng}" alt="QR Code" />
              </div>
            </div>
          </div>
          
          <div id="text-tab" class="tab-content">
            <div class="qr-section">
              <h3>📄 Text QR Code (Copy to terminal)</h3>
              <div class="qr-code" style="font-family: monospace; font-size: 8px; line-height: 1;">
                ${await QRCode.toString(qrData, { type: 'terminal', small: true })}
              </div>
            </div>
          </div>
          
          <div class="instructions">
            <strong>📱 How to connect:</strong>
            <ol>
              <li>Open WhatsApp on your phone</li>
              <li>Go to Settings → Linked Devices</li>
              <li>Tap "Link a Device"</li>
              <li>Scan any of the QR codes above</li>
              <li><strong>Try different formats if one doesn't work!</strong></li>
            </ol>
          </div>
          
          <div class="status">✅ QR Code is active and ready to scan!</div>
          
          <div style="margin-top: 20px;">
            <button class="btn" onclick="location.reload()">🔄 Refresh Page</button>
            <a href="/qr/download" class="btn btn-secondary">📥 Download PNG</a>
          </div>
        </div>
        
        <script>
          function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
              tab.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
              tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
          }
          
          // Auto-refresh every 30 seconds
          setTimeout(() => {
            location.reload();
          }, 30000);
        </script>
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

// Download QR code as PNG
app.get('/qr/download', async (req, res) => {
  try {
    const qrData = global.currentQRCode;
    
    if (!qrData) {
      return res.status(404).json({ error: 'QR code not available' });
    }
    
    const qrBuffer = await QRCode.toBuffer(qrData, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400,
      margin: 2
    });
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="neshbot-qr.png"');
    res.send(qrBuffer);
    
  } catch (error) {
    console.error('Error downloading QR code:', error);
    res.status(500).json({ error: 'Failed to download QR code' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app; 