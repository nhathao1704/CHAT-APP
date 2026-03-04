import Conversation from "../models/Conversation.js";
const createConversation = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Missing receiverId" });
    }

    // Kiểm tra đã có conversation chưa
    const existing = await Conversation.findOne({
      isGroup: false,
      members: { $all: [userId, receiverId] },
    });

    if (existing) {
      return res.json(existing);
    }

    // Nếu chưa có thì tạo mới
    const newConversation = await Conversation.create({
      members: [userId, receiverId],
      isGroup: false,
    });

    res.status(201).json(newConversation);

  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ message: error.message });
  }
};
const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members", "username avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(conversations);

  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: error.message });
  }
};
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
      .populate("members", "username avatar");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export{createConversation,getConversationById,getConversations}