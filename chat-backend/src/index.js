import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/connectionDB.js";
import authrouter from "./router/auth.router.js";
import userRouter from "./router/User.router.js";
import friendRouter from "./router/friend.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    console.log("Database connected");
    app.use(
      cors({
        origin: true,
        credentials: true,
      })
    );
    app.use(express.json());
    // Routes
    app.use("/api/auth", authrouter);
    app.use("/api/user", userRouter);
    app.use("api/friend",friendRouter);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database", err);
  }
})();