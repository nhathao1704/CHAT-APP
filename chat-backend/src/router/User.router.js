import express from "express";
import { getAllUsers , updateUserProfile, changeAvatar, getUserprofile } from "../controllers/User.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

    userRouter.get("/allusers/:id", authMiddleware, getAllUsers);
    userRouter.put("/update-profile", authMiddleware, updateUserProfile);
    userRouter.put("/change-avatar", authMiddleware, changeAvatar);
    userRouter.get("/profile", authMiddleware, getUserprofile);
    
export default userRouter;