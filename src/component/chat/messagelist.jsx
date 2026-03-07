import { useEffect, useState, useRef } from "react";
import MessageItem from "./messageitem";
import { getMessages } from "../../api/messageapi";
import socket from "../../socket/socket";
import "../../styles/index.css"

const MessageList = ({ conversationId }) => {

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // 🔥 scroll khi có message mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      <div ref={messagesEndRef} />

    </div>
  );
};

export default MessageList;