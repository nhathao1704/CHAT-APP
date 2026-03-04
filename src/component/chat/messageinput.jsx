import { useState } from "react";
import { FiSend } from "react-icons/fi";
import socket from "../../socket"; // file socket.js của bạn

const MessageInput = ({ conversationId, userId }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;

    socket.emit("sendMessage", {
      conversationId,
      senderId: userId,
      content: message,
    });

    setMessage(""); // clear input
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>
        <FiSend />
      </button>
    </div>
  );
};

export default MessageInput;