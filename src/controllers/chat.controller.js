const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const chatService = require('../services/chat.service');

const send = asyncHandler(async (req, res) => {
  const conversationId = req.body.conversationId || req.body.conversation_id || null;
  const chat = await chatService.sendMessage(req.user, req.body.message, req.body.provider, conversationId);
  success(res, 'AI response generated', { chat }, 201);
});

const history = asyncHandler(async (req, res) => {
  const conversationId = req.query.conversationId || req.query.conversation_id || null;
  const chats = await chatService.history(req.user.id, conversationId);
  success(res, 'Chat history fetched', { chats });
});

module.exports = { send, history };
