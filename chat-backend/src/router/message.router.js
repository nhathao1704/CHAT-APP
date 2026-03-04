
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controllers.js";

const messagerouter = express.Router();

messagerouter.get("/:conversationId", authMiddleware, getMessages);

export default messagerouter;