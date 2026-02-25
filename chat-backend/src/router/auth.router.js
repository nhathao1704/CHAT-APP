import express from "express";
import { registerUser, LoginUser } from "../controllers/auth.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const authrouter = express.Router();
authrouter.post("/register", registerUser);
authrouter.post("/login", LoginUser);
export default authrouter;
