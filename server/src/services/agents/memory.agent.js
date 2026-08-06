const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const Document = require('../../models/Document');
const LegalDraft = require('../../models/LegalDraft');

const memoryAgent = {
  getUserContext: async (userId, conversationId = null, documentId = null) => {
    try {
      let conversationHistory = [];
      if (conversationId) {
        conversationHistory = await Message.find({ conversationId })
          .sort({ createdAt: 1 })
          .limit(15)
          .lean();
      }

      let activeDocument = null;
      if (documentId) {
        activeDocument = await Document.findById(documentId).lean();
      }

      let recentDrafts = await LegalDraft.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      return {
        conversationHistory,
        activeDocument,
        recentDrafts,
      };
    } catch (err) {
      console.warn('[MemoryAgent Warning]', err.message);
      return { conversationHistory: [], activeDocument: null, recentDrafts: [] };
    }
  },
};

module.exports = { memoryAgent };
