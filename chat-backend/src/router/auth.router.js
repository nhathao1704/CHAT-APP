import express from "express";
import { registerUser, LoginUser } from "../controllers/auth.controllers.js";

const authrouter = express.Router();
authrouter.post("/register", registerUser);
authrouter.post("/login", LoginUser);
export default authrouter;
