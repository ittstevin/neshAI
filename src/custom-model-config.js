// Custom Model Configuration for NeshBot
// Add your custom model settings here

const CUSTOM_MODEL_CONFIGS = {
  // Example configurations for different model types
  
  // For conversation models (like DialoGPT, BlenderBot)
  'conversation': {
    promptTemplate: "You are NeshBot, a friendly AI assistant. User: {message} Assistant:",
    maxLength: 200,
    temperature: 0.7,
    doSample: true,
    topP: 0.9
  },
  
  // For text generation models (like GPT-2)
  'text-generation': {
    promptTemplate: "NeshBot: {message}",
    maxLength: 150,
    temperature: 0.8,
    doSample: true,
    topK: 50
  },
  
  // For instruction-following models (like FLAN-T5)
  'instruction': {
    promptTemplate: "Instruction: Respond as NeshBot, a friendly AI assistant. Input: {message}",
    maxLength: 200,
    temperature: 0.6,
    doSample: true
  },
  
  // For question-answering models
  'qa': {
    promptTemplate: "Question: {message} Answer:",
    maxLength: 100,
    temperature: 0.5,
    doSample: false
  }
};

// Function to get model configuration
function getModelConfig(modelName) {
  // You can add specific configurations for your models here
  const modelConfigs = {
    // Add your custom model configurations here
    // 'your_username/your_model_name': 'conversation',
    // 'ittstevin/my-chatbot': 'conversation',
  };
  
  return CUSTOM_MODEL_CONFIGS[modelConfigs[modelName]] || CUSTOM_MODEL_CONFIGS['conversation'];
}

// Function to format prompt for your model
function formatPromptForModel(modelName, userMessage) {
  const config = getModelConfig(modelName);
  return config.promptTemplate.replace('{message}', userMessage);
}

// Function to get parameters for your model
function getModelParameters(modelName) {
  const config = getModelConfig(modelName);
  return {
    max_length: config.maxLength,
    temperature: config.temperature,
    do_sample: config.doSample,
    top_p: config.topP,
    top_k: config.topK
  };
}

module.exports = {
  getModelConfig,
  formatPromptForModel,
  getModelParameters,
  CUSTOM_MODEL_CONFIGS
}; 