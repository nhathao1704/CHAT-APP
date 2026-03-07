import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  startCall,
  acceptCall,
  rejectCall,
  endCall,
  markMissedCall,
  getCallHistory,
} from "../controllers/call.controllers.js";

const callrouter = express.Router();

callrouter.post("/start", authMiddleware, startCall);
callrouter.put("/accept/:callId", authMiddleware, acceptCall);
callrouter.put("/reject/:callId", authMiddleware, rejectCall);
callrouter.put("/end/:callId", authMiddleware, endCall);
callrouter.put("/missed/:callId", authMiddleware, markMissedCall);
callrouter.get("/history/:conversationId", authMiddleware, getCallHistory);

export default callrouter;