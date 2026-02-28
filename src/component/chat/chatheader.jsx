const ChatHeader = ({ name }) => {
   return (
    <div className="chat-header">
      <div className="chat-header-info">
        <img
          src="https://i.pravatar.c"
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