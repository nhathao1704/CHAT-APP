const ChatHeader = ({ name, avatar }) => {
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
          <div className="chat-header-status">Online</div>
        </div>
      </div>
    </div>)
};

export default ChatHeader;