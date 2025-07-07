const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🧪 Starting Simple WhatsApp Test...');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'test-bot-' + Date.now() // Force new session
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  console.log('\n📱 ===== QR CODE =====');
  qrcode.generate(qr, { small: true });
  console.log('📱 ===== SCAN THIS =====\n');
});

client.on('authenticated', () => {
  console.log('🔐 Authenticated!');
});

client.on('ready', () => {
  console.log('✅ Ready! Send a message now...');
});

client.on('message', (msg) => {
  console.log('🔔 GOT MESSAGE:', msg.body);
  msg.reply('Test reply!').then(() => {
    console.log('✅ Replied!');
  });
});

client.initialize(); 