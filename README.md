# NeshBot 🤖

A smart WhatsApp bot with AI-powered responses that keeps your friends entertained while you're away!

## Features ✨

- **🤖 Auto-replies**: Responds to messages when you're not available
- **🧠 AI-powered**: Uses Hugging Face models for smart conversations (FREE!)
- **🎵 Entertainment**: Jokes, stories, fun facts, and word games
- **🚀 Railway Ready**: Easy deployment to Railway
- **📱 WhatsApp Integration**: Uses WhatsApp Web API

## Quick Start 🚀

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd neshbot
npm install
```

### 2. Environment Setup

Copy the environment example and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Hugging Face Configuration
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Bot Configuration
BOT_NAME=Nesh's lil auto-bot
BOT_OWNER=Nesh

# Server Configuration (for Railway)
PORT=3000

# Optional: Custom welcome message
WELCOME_MESSAGE=Hey there 👋\nThanks for reaching out! I'm Nesh's lil auto-bot 😎
```

### 3. Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with "read" permissions
5. Add it to your `.env` file as `HUGGINGFACE_API_KEY`

### 4. Run Locally

```bash
npm start
```

The bot will generate a QR code. Scan it with WhatsApp to connect!



## Bot Features 🎯

### Welcome Message
When someone messages you for the first time, they get:
```
Hey there 👋
Thanks for reaching out! I'm Nesh's lil auto-bot 😎

In the meantime, here's a lil something to keep you company:

🎵 Tell me a joke
🎮 Play a word game
🧠 Ask me anything (AI-powered)
📚 Share a fun fact
🎭 Tell me a story
```

### Entertainment Options

- **🎵 Jokes**: Random funny jokes
- **🎮 Word Games**: Word association, rhyming, categories
- **🧠 AI Chat**: Smart responses using OpenAI GPT
- **📚 Fun Facts**: Interesting facts about animals and nature
- **🎭 Stories**: Short inspirational stories

### AI-Powered Responses
When users mention "AI", "ChatGPT", or "smart", the bot uses Hugging Face's free AI models to generate contextual responses.

## Deployment to Railway 🚂

### 1. Prepare for Deployment

Make sure your code is committed to a Git repository.

### 2. Deploy to Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your neshbot repository
6. Railway will automatically detect the Node.js app

### 3. Configure Environment Variables

In your Railway project dashboard:

1. Go to the "Variables" tab
2. Add all the environment variables from your `.env` file:
       - `HUGGINGFACE_API_KEY`
   - `BOT_NAME`
   - `BOT_OWNER`
   - `PORT` (Railway sets this automatically)
   - `WELCOME_MESSAGE`

### 4. Deploy

Railway will automatically deploy your bot. The deployment logs will show the QR code for WhatsApp connection.

## How It Works 🔧

1. **WhatsApp Connection**: Uses `whatsapp-web.js` to connect to WhatsApp Web
2. **Message Handling**: Listens for incoming messages and responds automatically
3. **AI Integration**: Uses Hugging Face API for smart responses (FREE!)
4. **Entertainment**: Provides various entertainment options
5. **Health Monitoring**: Express server for Railway health checks

## File Structure 📁

```
neshbot/
├── src/
│   ├── index.js      # Main bot logic
│   └── server.js     # Express server for Railway
├── package.json      # Dependencies and scripts
├── railway.json      # Railway deployment config
├── env.example       # Environment variables template
└── README.md         # This file
```

## Troubleshooting 🔧

### QR Code Issues
- Make sure you're using the latest version of WhatsApp
- Try refreshing the QR code if it expires
- Ensure your phone has a stable internet connection

### Hugging Face API Issues
- Verify your API key is correct
- Check your Hugging Face account has sufficient quota
- Ensure the API key has the necessary permissions

### Railway Deployment Issues
- Check the deployment logs in Railway dashboard
- Verify all environment variables are set
- Ensure the `railway.json` configuration is correct

## Contributing 🤝

Feel free to contribute to this project! Some ideas:
- Add more entertainment options
- Improve AI responses
- Add message scheduling
- Create a web dashboard

## License 📄

MIT License - feel free to use this bot for your own projects!

---

**Made with ❤️ by Nesh**