import express from "express";
import { getAllUsers , updateUserProfile, changeAvatar, getUserprofile,chooseAvatar } from "../controllers/User.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

    userRouter.get("/allusers/:id", authMiddleware, getAllUsers);
    userRouter.put("/update-profile", authMiddleware, updateUserProfile);
    userRouter.put("/change-avatar", authMiddleware, changeAvatar);
    userRouter.get("/profile", authMiddleware, getUserprofile);
    userRouter.put("/choose-avatar", authMiddleware, chooseAvatar)
    
export default userRouter;