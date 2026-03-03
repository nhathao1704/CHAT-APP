import {sendFriendRequest,rejectFriendRequest,accessRequest,getFriend} from "../controllers/friend.controller"
import express from "express"
import authMiddleware from "../middlewares/auth.middleware";

const friendRouter = express.Router();
    friendRouter.post("/send", authMiddleware, sendFriendRequest);
    friendRouter.post("/accept", authMiddleware, acceptFriendRequest);
    friendRouter.post("/reject", authMiddleware, rejectFriendRequest);
    friendRouter.get("/", authMiddleware, getFriends);
export default friendRouter;
