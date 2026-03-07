import { useEffect, useState } from "react";
import MessageItem from "./messageitem";
import { getMessages } from "../../api/messageapi";
import socket from "../../socket/socket";

const MessageList = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);

  // 🔥 Lấy userId trực tiếp
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.error("Load messages error:", error);
      }
    };

    fetchMessages();
    socket.emit("joinConversation", conversationId);

  }, [conversationId]);

  useEffect(() => {
    const handleReceive = (newMessage) => {
      if (newMessage.conversation.toString() === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [conversationId]);

    return (
      <div className="chat-messages">
        {messages.map((msg) => {
          const senderId = msg.sender?._id?.toString();
          const isOwnMessage = senderId === currentUserId;

          return (
            <MessageItem
              key={msg._id}
              text={msg.content}
              type={isOwnMessage ? "right" : "left"}
            />
          );
        })}
      </div>
    );
};

export default MessageList;