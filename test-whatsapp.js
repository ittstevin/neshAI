const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🧪 Starting WhatsApp Web.js Test...');

// Simple client configuration
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

// QR Code generation
client.on('qr', (qr) => {
  console.log('📱 QR Code received!');
  qrcode.generate(qr, { small: true });
  console.log('🔗 Scan this QR code with WhatsApp');
});

// Authentication events
client.on('authenticated', () => {
  console.log('🔐 Client is authenticated!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

// Ready event
client.on('ready', () => {
  console.log('✅ Client is ready!');
  console.log('🤖 Bot is online and listening for messages...');
  console.log('📝 Send a message to test the connection');
});

// Message event - simplified
client.on('message', (message) => {
  console.log('🔔 MESSAGE RECEIVED!');
  console.log('📨 From:', message.from);
  console.log('💬 Message:', message.body);
  console.log('📅 Time:', new Date().toLocaleString());
  
  // Simple echo response
  message.reply(`Echo: ${message.body}`).then(() => {
    console.log('✅ Reply sent successfully!');
  }).catch((error) => {
    console.error('❌ Error sending reply:', error);
  });
});

// Disconnect event
client.on('disconnected', (reason) => {
  console.log('🔌 Client disconnected:', reason);
});

// Error handling
client.on('error', (error) => {
  console.error('❌ Client error:', error);
});

// Initialize the client
console.log('🚀 Initializing WhatsApp client...');
client.initialize();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  client.destroy();
  process.exit(0);
}); 