const ChatItem = ({ name, active }) => {
   return (
    <div className={`chat-item ${active ? "active" : ""}`}>
      <img
        src="https://i.pravatar.cc/40"
        alt="avatar"
        className="chat-avatar"
      />
      <span>{name}</span>
    </div>
  );
};

export default ChatItem;