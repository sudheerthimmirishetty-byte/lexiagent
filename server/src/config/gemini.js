let GoogleGenAI = null;
try {
  GoogleGenAI = require('@google/genai').GoogleGenAI;
} catch (e) {
  try {
    GoogleGenAI = require('@google/generative-ai').GoogleGenerativeAI;
  } catch (e2) {}
}

const env = require('./env');

let aiClient = null;

if (env.GEMINI_API_KEY && GoogleGenAI) {
  try {
    aiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    console.log('[AI Service] Gemini API initialized successfully via Google GenAI SDK.');
  } catch (err) {
    try {
      aiClient = new GoogleGenAI(env.GEMINI_API_KEY);
      console.log('[AI Service] Gemini API initialized via GoogleGenerativeAI SDK fallback.');
    } catch (e3) {
      console.warn(`[AI Service Warning] Failed to initialize Gemini SDK: ${err.message}`);
    }
  }
} else {
  console.warn('[AI Service Warning] GEMINI_API_KEY is missing or SDK loading. Smart fallback engine will be active.');
}

const getAiClient = () => aiClient;

module.exports = {
  getAiClient,
};
