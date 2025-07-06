// Alternative WhatsApp Bot Setup
// This file provides different methods to connect WhatsApp

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Method 1: Simple QR Code Display
function setupSimpleQR() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    }
  });

  client.on('qr', (qr) => {
    console.log('=== WHATSAPP QR CODE ===');
    console.log('Scan this QR code with your phone:');
    qrcode.generate(qr, { small: false });
    console.log('=== END QR CODE ===');
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp connected successfully!');
  });

  client.on('message', (message) => {
    console.log(`📨 Message from ${message.from}: ${message.body}`);
    message.reply('Hello! This is NeshBot responding.');
  });

  client.initialize();
}

// Method 2: Manual Session Setup
function setupManualSession() {
  console.log(`
=== MANUAL SESSION SETUP ===
If QR code scanning doesn't work, try this:

1. Open WhatsApp Web in your browser: https://web.whatsapp.com
2. Scan the QR code there first
3. Then run this bot - it should use the same session

Alternative steps:
1. Clear WhatsApp Web data in browser
2. Log out of all WhatsApp Web sessions
3. Try scanning again

If still having issues:
- Try using a different phone
- Make sure WhatsApp is updated
- Check your internet connection
- Try scanning from a different device
================================
  `);
}

// Method 3: Browser-based QR Code
function setupBrowserQR() {
  const express = require('express');
  const QRCode = require('qrcode');
  
  const app = express();
  const PORT = 3001; // Different port to avoid conflicts
  
  let qrData = null;
  
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    }
  });

  client.on('qr', async (qr) => {
    qrData = qr;
    console.log('QR Code available at: http://localhost:3001/qr');
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp connected!');
    qrData = null;
  });

  app.get('/qr', async (req, res) => {
    if (!qrData) {
      return res.send('QR code not available. Bot might be connected.');
    }
    
    try {
      const qrSvg = await QRCode.toString(qrData, {
        type: 'svg',
        width: 400
      });
      
      res.send(`
        <html>
          <head><title>WhatsApp QR Code</title></head>
          <body style="text-align: center; font-family: Arial;">
            <h1>📱 WhatsApp QR Code</h1>
            <div>${qrSvg}</div>
            <p>Scan this QR code with WhatsApp</p>
            <button onclick="location.reload()">Refresh</button>
          </body>
        </html>
      `);
    } catch (error) {
      res.send('Error generating QR code');
    }
  });

  app.listen(PORT, () => {
    console.log(`QR Code server running on http://localhost:${PORT}`);
  });

  client.initialize();
}

// Export methods
module.exports = {
  setupSimpleQR,
  setupManualSession,
  setupBrowserQR
};

// If run directly, show options
if (require.main === module) {
  console.log(`
=== WHATSAPP BOT SETUP OPTIONS ===

Choose a method:

1. Simple QR Code (Terminal)
   Run: node -e "require('./src/alternative-setup.js').setupSimpleQR()"

2. Manual Session Setup (Instructions)
   Run: node -e "require('./src/alternative-setup.js').setupManualSession()"

3. Browser QR Code (Web Interface)
   Run: node -e "require('./src/alternative-setup.js').setupBrowserQR()"

4. Main Bot (Current Implementation)
   Run: npm start

================================
  `);
} 