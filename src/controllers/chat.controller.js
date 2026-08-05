const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const chatService = require('../services/chat.service');

const send = asyncHandler(async (req, res) => {
  const chat = await chatService.sendMessage(req.user, req.body.message, req.body.provider);
  success(res, 'AI response generated', { chat }, 201);
});

const history = asyncHandler(async (req, res) => {
  success(res, 'Chat history fetched', { chats: await chatService.history(req.user.id) });
});

module.exports = { send, history };
