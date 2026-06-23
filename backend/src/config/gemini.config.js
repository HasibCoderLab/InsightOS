import { GoogleGenerativeAI } from '@google/generative-ai';
import env from './env.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: env.AI_MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      maxOutputTokens: 1024,
    }
  });
};
