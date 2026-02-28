import MessageItem from "./messageitem";

const MessageList = () => {
  return (
    <div className="chat-messages">
      <MessageItem text="Hello 👋" type="left" />
      <MessageItem text="Hi there 😄" type="right" />
      <MessageItem text="How is your project going?" type="left" />
      <MessageItem text="Pretty good actually 🚀" type="right" />
    </div>
  );
};

export default MessageList;