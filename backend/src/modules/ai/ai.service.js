import aiRepository from './ai.repository.js';
import promptBuilder from './prompt.builder.js';
import { getGeminiModel } from '../../config/gemini.config.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Service for AI operations
 */
const aiService = {
  /**
   * Chat with the AI
   * @param {string} userId 
   * @param {string} prompt 
   * @param {string} [conversationId] 
   * @returns {Promise<object>}
   */
  async chat(userId, prompt, conversationId) {
    let conversation;

    // Step 1: Get or create conversation
    if (conversationId) {
      conversation = await aiRepository.findConversationById(conversationId, userId);
      if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
      }
      // Append user message to existing conversation
      await aiRepository.appendMessages(conversation._id, [
        { role: 'user', content: prompt }
      ]);
      conversation = await aiRepository.findConversationById(conversationId, userId);
    } else {
      conversation = await aiRepository.createConversation(userId, prompt);
    }

    // Step 2: Build context
    const systemPrompt = promptBuilder.buildSystemPrompt();
    const businessContext = await promptBuilder.buildBusinessContext(userId);
    const chatHistory = promptBuilder.buildChatHistory(conversation.messages);

    // Step 3: Build full prompt for this turn
    const fullUserMessage = `
${businessContext}

User Question: ${prompt}
`;

    // Step 4: Call Gemini
    try {
      const model = getGeminiModel();
      const chatSession = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I am ready to analyze your business data.' }]
          },
          ...chatHistory
        ]
      });

      const result = await chatSession.sendMessage(fullUserMessage);
      const answer = result.response.text();

      if (!answer) {
        throw new ApiError(500, 'AI returned empty response');
      }

      // Step 5: Save model response to DB (user message already saved in createConversation)
      await aiRepository.appendMessages(conversation._id, [
        { role: 'model', content: answer }
      ]);

      // Step 6: Return
      return {
        answer,
        conversationId: conversation._id,
        tokensUsed: result.response.usageMetadata?.totalTokenCount
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle specific Gemini errors
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('api_key_invalid') || errorMsg.includes('invalid api key')) {
        throw new ApiError(500, 'AI service configuration error');
      }
      if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
        throw new ApiError(429, 'AI service busy, try again later');
      }

      throw new ApiError(500, 'An error occurred while communicating with the AI service');
    }
  },

  /**
   * Get all conversations for a user
   * @param {string} userId 
   * @returns {Promise<object[]>}
   */
  async getConversations(userId) {
    return aiRepository.findAllConversations(userId);
  },

  /**
   * Get a conversation by ID
   * @param {string} userId 
   * @param {string} conversationId 
   * @returns {Promise<object>}
   */
  async getConversationById(userId, conversationId) {
    const conversation = await aiRepository.findConversationById(conversationId, userId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }
    return conversation;
  },

  /**
   * Delete a conversation
   * @param {string} userId 
   * @param {string} conversationId 
   * @returns {Promise<void>}
   */
  async deleteConversation(userId, conversationId) {
    const deleted = await aiRepository.deleteConversation(conversationId, userId);
    if (!deleted) {
      throw new ApiError(404, 'Conversation not found');
    }
  }
};

export default aiService;
