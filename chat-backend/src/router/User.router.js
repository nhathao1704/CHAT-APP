import express from "express";
import { getAllUsers , updateUserProfile, getUserprofile,chooseAvatar, changePassword, searchUser } from "../controllers/User.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

    userRouter.get("/allusers/:id", authMiddleware, getAllUsers);
    userRouter.put("/update-profile", authMiddleware, updateUserProfile);
    userRouter.get("/profile", authMiddleware, getUserprofile);
    userRouter.put("/choose-avatar", authMiddleware, chooseAvatar);
    userRouter.put("/change-password", authMiddleware, changePassword);
    // sử dụng GET để tìm kiếm, query param ?keyword=
    userRouter.get("/search", authMiddleware, searchUser);
    
export default userRouter;