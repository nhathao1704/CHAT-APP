import Call from "../models/call.js";
import Conversation from "../models/Conversation.js";

/*
    1. Start Call
*/
export const startCall = async (req, res) => {
  try {
    const { conversationId, receiverId, type } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const newCall = await Call.create({
      conversation: conversationId,
      caller: req.user.id,
      receiver: receiverId,
      type: type || "audio",
      status: "ringing",
    });

    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
    2. Accept Call
*/
export const acceptCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "accepted";
    call.startedAt = new Date();
    await call.save();

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
    3. Reject Call
*/
export const rejectCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "rejected";
    call.endedAt = new Date();
    await call.save();

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
    4. End Call
*/
export const endCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "ended";
    call.endedAt = new Date();

    if (call.startedAt) {
      call.duration = Math.floor(
        (call.endedAt - call.startedAt) / 1000
      );
    }

    await call.save();

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
    5. Missed Call
*/
export const markMissedCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "missed";
    call.endedAt = new Date();
    await call.save();

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
    6. Get Call History (by conversation)
*/
export const getCallHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const calls = await Call.find({ conversation: conversationId })
      .populate("caller", "name avatar")
      .populate("receiver", "name avatar")
      .sort({ createdAt: -1 });

    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};