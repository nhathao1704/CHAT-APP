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
import callrouter from "./router/call.router.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import Call from "./models/call.js";

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

    // ROUTES
    app.use("/api/auth", authrouter);
    app.use("/api/user", userRouter);
    app.use("/api/friend", friendRouter);
    app.use("/api/conversation", conversationrouter);
    app.use("/api/message", messagerouter);
    app.use("/api/call", callrouter);

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
         origin: true,
        credentials: true,
      },
    });
    // USER ONLINE MAP
    const onlineUsers = new Map(); // userId -> socketId

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // REGISTER USER
      socket.on("register", (userId) => {
        onlineUsers.set(userId.toString(), socket.id);
        console.log("User registered:", userId);
      });

      // JOIN CONVERSATION ROOM
      socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log("Joined room:", conversationId);
      });

      // SEND MESSAGE
      socket.on("sendMessage", async (data) => {
        try {
          const { conversationId, senderId, content } = data;

          if (!conversationId || !senderId || !content) return;

          const newMessage = await Message.create({
            conversation: conversationId,
            sender: senderId,
            content,
          });

          const populatedMessage = await newMessage.populate(
            "sender",
            "username avatar"
          );

          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
          });

          io.to(conversationId).emit("receiveMessage", populatedMessage);

        } catch (error) {
          console.error("Send message error:", error);
        }
      });

      // ======================
      // AUDIO CALL
      // ======================

      // CALL USER
      socket.on("callUser", async (data) => {
        try {
          const { conversationId, callerId, receiverId, type, callerInfo ,offer} = data;

          const newCall = await Call.create({
            conversation: conversationId,
            caller: callerId,
            receiver: receiverId,
            type: type || "audio",
            status: "ringing",
          });

          // Populate caller info for the receiver
          const receiverSocket = onlineUsers.get(receiverId);
          const callerSocket = onlineUsers.get(callerId);

          // Emit callId cho caller để có thể endCall sau này
          if (callerSocket) {
            io.to(callerSocket).emit("callCreated", {
              callId: newCall._id,
              conversationId: conversationId
            });
          }

          if (receiverSocket) {
            io.to(receiverSocket).emit("incoming-call", {
              callId: newCall._id,
              callerId: callerId,
              callerInfo: callerInfo,
              conversationId: conversationId,
              type: type || "audio",
              offer: offer
            });
          } else {
            newCall.status = "missed";
            await newCall.save();
          }

        } catch (error) {
          console.error("Call error:", error);
        }
      });

      // ACCEPT CALL
      socket.on("acceptCall", async ({ callId }) => {
        try {

          const call = await Call.findById(callId);

          if (!call) return;

          call.status = "accepted";
          call.startedAt = new Date();

          await call.save();

          const callerSocket = onlineUsers.get(call.caller.toString());
          const receiverSocket = onlineUsers.get(call.receiver.toString());

          // Gửi cho caller chỉ answer (nếu có) để thiết lập WebRTC
          if (callerSocket) io.to(callerSocket).emit("callAccepted", { callId: call._id });
          // Gười cho receiver biết cuộc gọi đã được chấp nhận
          if (receiverSocket) io.to(receiverSocket).emit("callAccepted", { callId: call._id });

        } catch (error) {
          console.error("Accept call error:", error);
        }
      });

      // ANSWER CALL (for WebRTC)
      socket.on("answer-call", (data) => {
        const { answer, to } = data;
        const receiverSocket = onlineUsers.get(to);
        
        if (receiverSocket) {
          io.to(receiverSocket).emit("callAccepted", { answer });
        }
      });

      // ICE CANDIDATE
      socket.on("iceCandidate", (data) => {
        const { candidate, to } = data;
        const receiverSocket = onlineUsers.get(to);
        
        if (receiverSocket) {
          io.to(receiverSocket).emit("iceCandidate", { candidate });
        }
      });

      // REJECT CALL
      socket.on("rejectCall", async ({ callId }) => {
        try {

          const call = await Call.findById(callId);

          if (!call) return;

          call.status = "rejected";
          call.endedAt = new Date();

          await call.save();

          const callerSocket = onlineUsers.get(call.caller.toString());
          const receiverSocket = onlineUsers.get(call.receiver.toString());

          if (callerSocket) io.to(callerSocket).emit("callRejected", call);
          if (receiverSocket) io.to(receiverSocket).emit("callRejected", call);

        } catch (error) {
          console.error("Reject call error:", error);
        }
      });

      // END CALL
      socket.on("endCall", async ({ callId }) => {
        try {
          console.log("endCall received with callId:", callId);

          const call = await Call.findById(callId);

          if (!call) {
            console.log("Call not found:", callId);
            return;
          }

          call.status = "ended";
          call.endedAt = new Date();

          if (call.startedAt) {
            call.duration = Math.floor(
              (call.endedAt - call.startedAt) / 1000
            );
          }

          await call.save();

          const callerSocket = onlineUsers.get(call.caller.toString());
          const receiverSocket = onlineUsers.get(call.receiver.toString());

          console.log("Emitting callEnded - callerSocket:", callerSocket, "receiverSocket:", receiverSocket);

          if (callerSocket) io.to(callerSocket).emit("callEnded", { callId: call._id });
          if (receiverSocket)io.to(receiverSocket).emit("callEnded", { callId: call._id });
         ;

        } catch (error) {
          console.error("End call error:", error);
        }
      });

      // DISCONNECT
      socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }

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