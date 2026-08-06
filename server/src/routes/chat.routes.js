const express = require('express');
const router = express.Router();
const {
  startConversation,
  sendMessage,
  getConversations,
  getMessages,
  deleteConversation,
} = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { chatSchema, conversationSchema } = require('../validation/schemas');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.post('/start', validate(conversationSchema), startConversation);
router.post('/message', aiRateLimiter, validate(chatSchema), sendMessage);
router.get('/history', getConversations);
router.get('/:conversationId', getMessages);
router.delete('/:conversationId', deleteConversation);

module.exports = router;
