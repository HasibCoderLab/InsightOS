import AIConversation from './ai.model.js';

/**
 * Repository for AI Conversation data access
 */
const aiRepository = {
  /**
   * Create a new conversation
   * @param {string} userId 
   * @param {string} firstMessage 
   * @returns {Promise<object>}
   */
  async createConversation(userId, firstMessage) {
    let title = firstMessage.substring(0, 50);
    if (firstMessage.length > 50) {
      title += '...';
    }

    const conversation = new AIConversation({
      userId,
      title,
      messages: [
        {
          role: 'user',
          content: firstMessage,
        },
      ],
    });
    await conversation.save();
    return conversation;
  },

  /**
   * Find a conversation by ID and user
   * @param {string} conversationId 
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async findConversationById(conversationId, userId) {
    return AIConversation.findOne({ _id: conversationId, userId });
  },

  /**
   * Find all conversations for a user
   * @param {string} userId 
   * @returns {Promise<object[]>}
   */
  async findAllConversations(userId) {
    return AIConversation.find({ userId })
      .select('_id title createdAt updatedAt')
      .sort({ updatedAt: -1 });
  },

  /**
   * Append messages to a conversation
   * @param {string} conversationId 
   * @param {Array<{role: string, content: string}>} messagesArray 
   * @returns {Promise<void>}
   */
  async appendMessages(conversationId, messagesArray) {
    const messages = messagesArray.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(),
    }));
    return AIConversation.findByIdAndUpdate(
      conversationId,
      { $push: { messages: { $each: messages } } },
      { new: true }
    );
  },

  /**
   * Delete a conversation
   * @param {string} conversationId 
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async deleteConversation(conversationId, userId) {
    return AIConversation.findOneAndDelete({ _id: conversationId, userId });
  },
};

export default aiRepository;
