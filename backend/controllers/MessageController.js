const MessageModel  = require("../models/messageModel.js");
const { get_logger } = require("../utils/logger.js");

// Get Logger
const logger = get_logger();

const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    logger.info("/api/message: Message sent successfully")
    res.status(200).json(result);
  } catch (error) {
    logger.error("/api/message: Internal Error")
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    logger.info("/api/message: Messages retrieved successfully")
    res.status(200).json(result);
  } catch (error) {
    logger.error("/api/message: Internal Error")
    res.status(500).json(error);
  }
};

module.exports = {
  addMessage,
  getMessages
}