import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createConversation,
  getConversations,
  getConversationById
} from "../controllers/conversation.controllers.js";

const conversationrouter = express.Router();

conversationrouter.post("/", authMiddleware, createConversation);
conversationrouter.get("/", authMiddleware, getConversations);
conversationrouter.get("/:id", authMiddleware, getConversationById);

export default conversationrouter;