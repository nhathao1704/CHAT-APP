import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/connectionDB.js";
import authrouter from "./router/auth.router.js";
import userRouter from "./router/User.router.js";
import friendRouter from "./router/friend.router.js";
import conversationrouter from "./router/conversation.router.js";
import messagerouter from "./router/message.router.js";

import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    console.log("Database connected");

    // 🔥 Middlewares
    app.use(
      cors({
        origin: true,
        credentials: true,
      })
    );

    app.use(express.json());

    app.use("/api/auth", authrouter);
    app.use("/api/user", userRouter);
    app.use("/api/friend", friendRouter);
    app.use("/api/conversation", conversationrouter);
    app.use("/api/message", messagerouter);


    const server = http.createServer(app);

    //  Setup Socket.io
    const io = new Server(server, {
      cors: {
        origin: true,
        methods: ["GET", "POST"],
      },
    });

    //  Socket Logic
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Join room theo conversationId
      socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log("Joined room:", conversationId);
      });

      // Gửi tin nhắn realtime
      socket.on("sendMessage", async (data) => {
        try {
          const { conversationId, senderId, content } = data;

          if (!conversationId || !senderId || !content) return;

          // Lưu vào DB
          const newMessage = await Message.create({
            conversation: conversationId,
            sender: senderId,
            content,
          });

          //  Update lastMessage trong conversation
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
          });

          // 3️ Emit lại cho tất cả trong room
          io.to(conversationId).emit("receiveMessage", newMessage);

        } catch (error) {
          console.error("Send message error:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });


    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to database", err);
  }
})();