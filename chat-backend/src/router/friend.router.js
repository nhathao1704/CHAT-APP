import { sendFriendRequest, rejectFriendRequest, accessRequest, getFriend, getFriendRequests } from "../controllers/friend.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const friendRouter = express.Router();
friendRouter.post("/send", authMiddleware, sendFriendRequest);
// use accessRequest handler for accepting
friendRouter.post("/accept", authMiddleware, accessRequest);
friendRouter.post("/reject", authMiddleware, rejectFriendRequest);
friendRouter.get("/", authMiddleware, getFriend);
// list incoming friend requests
friendRouter.get("/requests", authMiddleware, getFriendRequests);
export default friendRouter;
