import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/connectionDB.js";
import authrouter from "./router/auth.router.js";
import userRouter from "./router/User.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database then start server
(async () => {
  try {
    await connectDB();
    console.log('Database connection established, starting server...');

    // CORS configuration
    app.use(cors({
      origin: true,
      credentials: true
    }));

    app.use(express.json());

    // Routes
    app.use("/api/auth", authrouter);
    app.use("/api/user", userRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database, server not started.', err);
  }
})();