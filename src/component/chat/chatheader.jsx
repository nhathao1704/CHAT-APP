import { FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ name, avatar, friend }) => {

  const navigate = useNavigate();

const handleCall = () => {
  navigate("/callpage", {
    state: { friend }
  });
};

  return (
    <div className="chat-header">

      <div className="chat-header-info">
        <img
          src={avatar || "https://i.pravatar.cc/40"}
          alt="avatar"
          className="chat-header-avatar"
        />

        <div>
          <div className="chat-header-name">{name}</div>
        </div>
      </div>

      <div className="chat-header-actions">

        <button
          className="call-btn"
          onClick={handleCall}
        >
          <FaPhone />
        </button>

      </div>

    </div>
  );
};

export default ChatHeader;