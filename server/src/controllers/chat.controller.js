const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Document = require('../models/Document');
const { orchestratorAgent } = require('../services/agents/orchestrator.agent');
const { logActivity } = require('../utils/activityLogger');

const memoryConversations = new Map();
const memoryMessages = new Map(); // key: convId, value: array of messages
const isDbConnected = () => mongoose.connection.readyState === 1;

const startConversation = async (req, res, next) => {
  try {
    const { title, documentId } = req.body;
    const userId = req.user._id || req.user.id;
    let conv;

    if (isDbConnected()) {
      try {
        conv = await Conversation.create({
          userId,
          title: title || 'New Legal Consultation',
          documentId: documentId || null,
        });
      } catch (e) {
        const fakeId = 'conv_' + Date.now();
        conv = {
          _id: fakeId,
          userId,
          title: title || 'New Legal Consultation',
          documentId: documentId || null,
          lastMessage: '',
          createdAt: new Date(),
        };
        memoryConversations.set(fakeId, conv);
      }
    } else {
      const fakeId = 'conv_' + Date.now();
      conv = {
        _id: fakeId,
        userId,
        title: title || 'New Legal Consultation',
        documentId: documentId || null,
        lastMessage: '',
        createdAt: new Date(),
      };
      memoryConversations.set(fakeId, conv);
    }

    res.status(201).json({ success: true, conversation: conv });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message, documentId } = req.body;
    const userId = req.user._id || req.user.id;

    let convId = conversationId;
    let conv = null;

    if (convId) {
      if (isDbConnected()) {
        try { conv = await Conversation.findById(convId); } catch (e) { conv = memoryConversations.get(convId); }
      } else {
        conv = memoryConversations.get(convId);
      }
    }

    if (!conv) {
      convId = 'conv_' + Date.now();
      conv = {
        _id: convId,
        userId,
        title: message.substring(0, 30) + '...',
        documentId: documentId || null,
        lastMessage: message,
        createdAt: new Date(),
      };
      if (isDbConnected()) {
        try {
          const created = await Conversation.create({
            userId,
            title: message.substring(0, 30) + '...',
            documentId: documentId || null,
          });
          convId = created._id;
          conv = created;
        } catch (e) {
          memoryConversations.set(convId, conv);
        }
      } else {
        memoryConversations.set(convId, conv);
      }
    }

    // Extract document context if provided
    let documentText = '';
    let targetDocId = documentId || (conv ? conv.documentId : null);
    if (targetDocId) {
      if (isDbConnected()) {
        try {
          const doc = await Document.findById(targetDocId);
          if (doc) documentText = doc.extractedText || '';
        } catch (e) {}
      }
    }

    // Load past messages
    let history = [];
    if (isDbConnected()) {
      try {
        history = await Message.find({ conversationId: convId }).sort({ createdAt: 1 }).limit(10).lean();
      } catch (e) {
        history = memoryMessages.get(convId) || [];
      }
    } else {
      history = memoryMessages.get(convId) || [];
    }

    // Store user message
    const userMsgRecord = {
      _id: 'msg_u_' + Date.now(),
      conversationId: convId,
      userId,
      sender: 'user',
      message,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await Message.create({
          conversationId: convId,
          userId,
          sender: 'user',
          message,
        });
      } catch (e) {}
    }

    let convMsgs = memoryMessages.get(convId) || [];
    convMsgs.push(userMsgRecord);
    memoryMessages.set(convId, convMsgs);

    // Invoke Multi-Agent System via Orchestrator
    const agentResponse = await orchestratorAgent({
      userPrompt: message,
      documentText,
      conversationHistory: history,
    });

    let formattedAiReply = '';
    if (typeof agentResponse.agentOutput?.response === 'string') {
      formattedAiReply = agentResponse.agentOutput.response;
    } else if (agentResponse.agentOutput?.type === 'draft') {
      formattedAiReply = agentResponse.agentOutput.generatedDraft;
    } else {
      formattedAiReply = JSON.stringify(agentResponse.agentOutput?.data || agentResponse.agentOutput, null, 2);
    }

    // Save AI response message
    const aiMsgRecord = {
      _id: 'msg_a_' + Date.now(),
      conversationId: convId,
      userId,
      sender: 'agent',
      message: formattedAiReply,
      aiResponse: agentResponse,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await Message.create({
          conversationId: convId,
          userId,
          sender: 'agent',
          message: formattedAiReply,
          aiResponse: agentResponse,
          tokensUsed: 150,
        });

        if (conv.save) {
          conv.lastMessage = message;
          await conv.save();
        }
      } catch (e) {}
    }

    convMsgs.push(aiMsgRecord);
    memoryMessages.set(convId, convMsgs);

    await logActivity(userId, `Sent chat message in conversation: ${convId}`, 'chat');

    res.json({
      success: true,
      conversationId: convId,
      userMessage: message,
      aiResponse: formattedAiReply,
      fullResult: agentResponse,
      messageRecord: aiMsgRecord,
    });
  } catch (err) {
    next(err);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let conversations = [];

    if (isDbConnected()) {
      try {
        conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
      } catch (e) {
        conversations = Array.from(memoryConversations.values()).filter((c) => String(c.userId) === String(userId));
      }
    } else {
      conversations = Array.from(memoryConversations.values()).filter((c) => String(c.userId) === String(userId));
    }

    res.json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    let messages = [];

    if (isDbConnected()) {
      try {
        messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
      } catch (e) {
        messages = memoryMessages.get(conversationId) || [];
      }
    } else {
      messages = memoryMessages.get(conversationId) || [];
    }

    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      try {
        await Conversation.deleteOne({ _id: conversationId, userId });
        await Message.deleteMany({ conversationId });
      } catch (e) {
        memoryConversations.delete(conversationId);
        memoryMessages.delete(conversationId);
      }
    } else {
      memoryConversations.delete(conversationId);
      memoryMessages.delete(conversationId);
    }

    res.json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startConversation,
  sendMessage,
  getConversations,
  getMessages,
  deleteConversation,
};
