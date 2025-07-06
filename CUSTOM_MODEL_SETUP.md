# 🎯 Custom Model Setup Guide

## **🚀 Using Your Custom Hugging Face Model**

### **Step 1: Get Your Model Details**
From your Hugging Face model page, you need:
- **Username**: Your Hugging Face username
- **Model Name**: The name you gave your model
- **Model Type**: What kind of model it is (conversation, text-generation, etc.)

### **Step 2: Configure Your Model**
Edit `src/custom-model-config.js` and add your model:

```javascript
const modelConfigs = {
  'your_username/your_model_name': 'conversation', // or 'text-generation', 'instruction', 'qa'
  // Example:
  // 'ittstevin/my-chatbot': 'conversation',
};
```

### **Step 3: Set Environment Variables**
In Railway dashboard, add:
```
AI_MODEL=your_username/your_model_name
HUGGINGFACE_API_KEY=your_api_key_here
FULL_AI_MODE=true
```

### **Step 4: Test Your Model**
Send a message to your bot and see how it responds!

## **🔧 Model Type Configuration**

### **For Conversation Models** (like DialoGPT, BlenderBot)
```javascript
'conversation': {
  promptTemplate: "You are NeshBot, a friendly AI assistant. User: {message} Assistant:",
  maxLength: 200,
  temperature: 0.7,
  doSample: true,
  topP: 0.9
}
```

### **For Text Generation Models** (like GPT-2)
```javascript
'text-generation': {
  promptTemplate: "NeshBot: {message}",
  maxLength: 150,
  temperature: 0.8,
  doSample: true,
  topK: 50
}
```

### **For Instruction Models** (like FLAN-T5)
```javascript
'instruction': {
  promptTemplate: "Instruction: Respond as NeshBot, a friendly AI assistant. Input: {message}",
  maxLength: 200,
  temperature: 0.6,
  doSample: true
}
```

### **For Question-Answering Models**
```javascript
'qa': {
  promptTemplate: "Question: {message} Answer:",
  maxLength: 100,
  temperature: 0.5,
  doSample: false
}
```

## **🎯 Quick Setup Example**

If your model is `ittstevin/my-chatbot`:

1. **Edit the config file:**
```javascript
const modelConfigs = {
  'ittstevin/my-chatbot': 'conversation',
};
```

2. **Set Railway variables:**
```
AI_MODEL=ittstevin/my-chatbot
HUGGINGFACE_API_KEY=hf_your_key_here
FULL_AI_MODE=true
```

3. **Test it!** Send a message to your bot

## **🔍 Troubleshooting**

### **If Model Doesn't Respond:**
- Check your model name is correct
- Verify your API key has access to the model
- Try a different model type configuration

### **If Responses are Poor:**
- Adjust temperature (0.1-1.0)
- Change max_length
- Try different prompt templates

### **If Model is Slow:**
- Reduce max_length
- Set doSample to false
- Use a smaller model

## **💡 Tips for Custom Models**

1. **Start Simple**: Use the 'conversation' type first
2. **Test Prompts**: Try different prompt templates
3. **Monitor Performance**: Watch response quality and speed
4. **Iterate**: Adjust parameters based on results
5. **Backup**: Keep entertainment features as fallback

---

**Share your model details and I'll help you configure it perfectly!** 🚀 