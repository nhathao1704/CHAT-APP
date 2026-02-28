const MessageItem = ({ text, type }) => {
  return (
    <div className={`message ${type}`}>
      {text}
    </div>
  );
};

export default MessageItem;