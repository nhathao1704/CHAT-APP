const ChatItem = ({ name, avatar, active, onClick }) => {
   return (
    <div
      className={`chat-item ${active ? "active" : ""}`}
      onClick={onClick}

    >
      <img
        src={avatar || "https://i.pravatar.cc/40"}
        alt={name || "avatar"}
        className="chat-avatar"
      />
      <span>{name}</span>
    </div>
  );
};

export default ChatItem;