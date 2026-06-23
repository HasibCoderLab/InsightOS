import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import aiService from './ai.service.js';

/**
 * Controller for AI operations
 */
const aiController = {
  /**
   * Chat with AI
   */
  chat: asyncHandler(async (req, res) => {
    const { prompt, conversationId } = req.body;
    const { user } = req;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json(new ApiResponse(400, null, 'Prompt is required'));
    }

    if (prompt.length > 500) {
      return res.status(400).json(new ApiResponse(400, null, 'Prompt must be under 500 characters'));
    }

    const result = await aiService.chat(user.userId, prompt, conversationId);
    res.status(200).json(new ApiResponse(200, result, 'Chat completed successfully'));
  }),

  /**
   * Get all conversations
   */
  getConversations: asyncHandler(async (req, res) => {
    const { user } = req;
    const conversations = await aiService.getConversations(user.userId);
    res.status(200).json(new ApiResponse(200, conversations, 'Conversations retrieved successfully'));
  }),

  /**
   * Get a single conversation
   */
  getConversationById: asyncHandler(async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const conversation = await aiService.getConversationById(user.userId, id);
    res.status(200).json(new ApiResponse(200, conversation, 'Conversation retrieved successfully'));
  }),

  /**
   * Delete a conversation
   */
  deleteConversation: asyncHandler(async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    await aiService.deleteConversation(user.userId, id);
    res.status(200).json(new ApiResponse(200, null, 'Conversation deleted successfully'));
  }),
};

export default aiController;
