
import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};