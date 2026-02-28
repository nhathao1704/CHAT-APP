import { FiSend } from "react-icons/fi";

const MessageInput = () => {
  return (
    <div className="chat-input">
      <input type="text" placeholder="Type a message..." />
      <button>
        <FiSend />
      </button>
    </div>
  );
};

export default MessageInput;